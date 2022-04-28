class AudioControl {

    constructor () {
        this.words = "";
        this.recognition;
        this.init();
    }

    init() {
        const canvas = document.querySelector("button");

        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        const recognition = new window.SpeechRecognition();
        recognition.intermResults = true;
        let that = this;

        recognition.onstart = function() {
            console.log("Speech recognition has started")
        }

        recognition.onresult = function(e) {
            console.log("Speech recognition has ended");
            that.words = e.results[0][0].transcript;
        }

        this.recognition = recognition
    }

    getResult() {
        return this.words;
    }
}