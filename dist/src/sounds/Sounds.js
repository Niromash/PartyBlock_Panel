"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sounds {
    constructor(fileName, isMusic = true) {
        this.fileName = fileName;
        this.isMusic = isMusic;
    }
    getFileName() {
        return this.fileName;
    }
    static getSoundFromName(name) {
        const properties = Object.getOwnPropertyNames(this).filter(prop => prop === prop.toUpperCase());
        return this[properties.find(prop => prop.toLowerCase() === name.toLowerCase())];
    }
}
exports.default = Sounds;
Sounds.APPROACHING = new Sounds('305 - Approaching Nirvana.ogg');
Sounds.APPROACHING_ALBUM = new Sounds('1993 (Album Version) - Approaching Nirvana.ogg');
Sounds.LETS_BE_FRIENDS = new Sounds('[Electro] - Lets Be Friends - FTW [Monstercat Release].ogg');
Sounds.NEW_GAME = new Sounds('[Electro] - Nitro Fun - New Game [Monstercat Release].ogg');
Sounds.ECLIPSE = new Sounds('[Electro] - Noisestorm - Eclipse [Monstercat Free Download].ogg');
Sounds.ROCKTRONIK = new Sounds('[Electro] - Pegboard Nerds - Rocktronik [Monstercat FREE Release].ogg');
Sounds.SUGAR_RUSH = new Sounds('[Electro] - PIXL - Sugar Rush [Monstercat EP Release].ogg');
Sounds.REACH = new Sounds('[Future Bass] - Grant Bowtie - Reach [Monstercat Release].ogg');
Sounds.RAZOR_SHARP = new Sounds('[Glitch Hop   110BPM] - Pegboard Nerds & Tristam - Razor Sharp [Monstercat Release].ogg');
Sounds.A_SKILLZ_VS_BEAT_VANDALS = new Sounds('A Skillz vs Beat Vandals - Beat don\'t stop.ogg');
Sounds.CHEER = new Sounds('cheer.ogg', false);
Sounds.GITHUB = new Sounds('DCDJ - Github.ogg');
Sounds.TAKING_MY_TIME = new Sounds('E-Dubble - Taking My Time (No Copyright + Download).ogg');
Sounds.EXIGE = new Sounds('Exige - 2014 Launchpad Mashup.ogg');
Sounds.MAKE_A_CAKE = new Sounds('Make a Cake  - A Minecraft Parody of Katy Perrys\' Wide Awake (Music Video).ogg');
Sounds.FREAK_ME_OUT = new Sounds('Outmode -  Freak Me Out (Original Mix).ogg');
Sounds.IN_TIME = new Sounds('PeaceTreaty - In Time feat. Anabel Englund (Exige Remix).ogg');
Sounds.FIRESTARTER = new Sounds('Rob Gasser - Firestarter [Glitch Hop].ogg');
Sounds.THE_EXIT = new Sounds('Rob Gasser - The Exit.ogg');
Sounds.SPLINTER = new Sounds('Savant - Splinter.ogg');
Sounds.THE_ARCADE_2013 = new Sounds('The Arcade 2013 - Savant.ogg');
Sounds.THE_STANDOFF = new Sounds('The Standoff - Song written for The Hive\'s Mini Game  Block Party.ogg');
Sounds.PIXEL_PARTY = new Sounds('Vexento - Pixel Party.ogg');
Sounds.THIRSTY = new Sounds('Vexento - Thirsty.ogg');
Sounds.YOU_CAN_PLAY = new Sounds('Vinter in Hollywood - You can Play (official).ogg');
Sounds.VINYL_STOP = new Sounds('vinylstop.ogg', false);
Sounds.KILL_ALL_DAY = new Sounds('♫  Kill All Day  REMIX by Elyssius - Minecraft Original Song.ogg');
