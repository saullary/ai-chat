import { mapGetters, mapState } from "vuex";
import Recorder from "js-audio-recorder";

let recorder;
function getBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function () {
      const base64 = reader.result;
      resolve(base64);
    };
  });
}

export default {
  data() {
    return {
      inRecord: false,
      recSeconds: 0,
      maxSec: 8,
      isPlay: false,
      detecting: false,
    };
  },
  computed: {
    ...mapGetters(["indexItem"]),
    ...mapState({
      indexList: (s) => s.indexList,
      sysLang: (s) => s.sysLang,
    }),
    recSecFix() {
      return this.recSeconds.toFixed(1);
    },
  },
  methods: {
    onMyChat() {
      if (!this.$q.screen.xs || this.indexList.length == 1) {
        this.$setState({
          indexId: this.indexList[0].id,
        });
      } else {
        this.$bus.emit("toggleMenu");
      }
    },
    async detectVoice() {
      try {
        this.detecting = true;
        const data = await this.txDetect();
        this.inputVal = data;
        this.detectRes = data;
      } catch (error) {
        console.log(error);
      }
      this.detecting = false;
    },
    async bdDetect() {
      const form = new FormData();
      form.append("file", recorder.getPCMBlob());
      const { data } = await this.$http.post("$mp/third/baidu/recognize", form);
      return data.result[0];
    },
    async txDetect() {
      const blob = recorder.getWAVBlob();
      const base64 = await getBase64(blob);
      const isZh = this.sysLang == "zh";
      const { data } = await this.$http.post(
        "$mp/third/tx/tmt/SpeechTranslate",
        {
          Source: isZh ? "zh" : "en",
          Target: isZh ? "en" : "zh",
          Data: base64.replace("data:audio/wav;base64,", ""),
        }
      );
      return data.SourceText;
    },
    onRecord() {
      if (!this.inRecord) this.startRecord();
      else this.stopRecord();
    },
    async startRecord() {
      this.inRecord = true;
      this.recSeconds = 0;
      this.detectRes = "";
      try {
        if (this.isPlay) recorder.pausePlay();
        await Recorder.getPermission();
        recorder = new Recorder();
        await recorder.start();
        this.recTiming = setInterval(() => {
          this.recSeconds += 0.2;
          if (this.recSeconds >= this.maxSec) this.stopRecord();
        }, 200);
        recorder.onplay = () => {
          this.isPlay = true;
        };
        recorder.onpauseplay = () => {
          this.isPlay = false;
        };
        recorder.onplayend = () => {
          this.isPlay = false;
        };
      } catch (error) {
        this.$alert(error.message);
        this.inRecord = false;
      }
    },
    stopRecord() {
      if (!this.inRecord) return;
      this.inRecord = false;
      clearInterval(this.recTiming);
      recorder.stop();
      if (this.showVoiceTip) {
        this.detectVoice();
      }
    },
    clickInput() {
      if (this.inRecord) this.stopRecord();
    },
    onBtmTip() {
      if (this.showVoiceTip) {
        if (this.isPlay) recorder.pausePlay();
        else {
          recorder.play();
          if (!this.inputVal) this.inputVal = this.detectRes || "";
        }
      }
    },
  },
};
