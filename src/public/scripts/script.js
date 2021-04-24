const mainAudio = document.getElementById('mainAudio');
const secondaryAudio = document.getElementById('secondaryAudio');

const colors = [
    '#ffffff', '#f3bb12', '#ba2bd9',
    '#5fc2f6', '#f3ec30', '#80ea40',
    '#f3ec30', '#dd8cec', '#525252',
    '#c6c6c6', '#1da0b0', '#573b9f',
    '#dd8cec', '#dd8cec', '#dd8cec',
    '#2564cc', '#6e4d29', '#2d752b',
    '#c92e2a', '#000000'
]

class PartyBlock {

    username;
    io;

    constructor(username) {
        this.username = username;
    }

    init() {
        this.io = io();
        this.io.emit('new_user', this.username);

        $("#slider").slider({
            value: 100
        });
        $("#slider").on("slidechange", (_, ui) => {
            mainAudio.volume = ui.value / 100;
            secondaryAudio.volume = ui.value / 100;
        });

        this.io.on('play_sound', this.onSoundPlay);
        this.io.on('pause', this.onSoundPause);
        this.io.on('stop', this.onSoundStop);

        let i = 0;
        setInterval(() => {
            if (i >= colors.length) i = 0;
            $("#juke-color").css('background', colors[i]);
            i++;
        }, 500)
    }

    onSoundPause() {
        console.log('pause');
        mainAudio.pause();
        secondaryAudio.setAttribute('src', '/public/sounds/vinylstop.ogg');
        secondaryAudio.play().then(() => {
            secondaryAudio.onended = () => {
                console.log('vinyl stopped');
                secondaryAudio.setAttribute('src', '/public/sounds/cheer.ogg');
                secondaryAudio.play().then(() => {
                    secondaryAudio.onended = () => {
                        console.log('cheers end');
                        mainAudio.play();
                    }
                })
            }
        })
    }

    onSoundPlay(sound) {
        console.log('play ' + sound);
        mainAudio.setAttribute('src', '/public/sounds/' + sound);
        mainAudio.play();
    }

    onSoundStop() {
        console.log('stop');
        mainAudio.pause();
    }
}