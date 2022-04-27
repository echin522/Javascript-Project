class AudioControl {

    constructor () {
        this.result = "";
        this.init();
    }

    init() {
        const canvas = document.querySelector("button");

        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        const recognition = new window.SpeechRecognition();
        recognition.intermResults = true;
        let that = this;

        recognition.onstart = function() {
            console.log("Now listening to audio")
        }

        recognition.onresult = function(e) {
            let result = e.results[0][0].transcript;
            console.log(result);
            that.getResult();
            document.querySelector("#punchphrase").innerHTML = result.split(" ")[0];
            var confidence = e.results[0][0].confidence;
        }

        // Output the users words once they've finished screaming
        recognition.addEventListener('result', (e) => {
            console.log("Speech recognition has ended");
        });
        recognition.start()
    }

    getResult() {
        console.log("it worked poggers")
    }
}