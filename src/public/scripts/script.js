const mainAudio = document.getElementById('mainAudio');
const secondaryAudio = document.getElementById('secondaryAudio');

let isStopped = true;

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

        this.io.on('play_sound', sound => {
            console.log('play_sound', sound);
            document.getElementById('currentTrackName').innerText = sound.replace('.ogg', '');
            mainAudio.setAttribute('src', '/public/sounds/' + encodeURI(sound));
            mainAudio.play();
            isStopped = false;
        });
        this.io.on('pause', this.onSoundPause);
        this.io.on('stop', () => {
            mainAudio.pause();
            isStopped = true;
            document.getElementById('currentTrackName').innerText = '...';
            console.log('stop');
        });
        this.io.on('block_change', hexaColor => {
            console.log('block_change', hexaColor);
            $("#juke-color").css('background', hexaColor);
        });
    }

    onSoundPause() {
        console.log('pause');
        mainAudio.pause();
        secondaryAudio.setAttribute('src', '/public/sounds/vinylstop.ogg');
        secondaryAudio.play().then(() => {
            secondaryAudio.onended = () => {
                console.log('vinyl stopped');
                setTimeout(() => {
                    secondaryAudio.setAttribute('src', '/public/sounds/cheer.ogg');
                    secondaryAudio.play().then(() => {
                        secondaryAudio.onended = () => {
                            console.log('cheers end');
                            if(!isStopped) mainAudio.play();
                        }
                    })
                }, 500);
            }
        })
    }
}