export default class Sounds {
    static readonly APPROACHING  = new Sounds('305 - Approaching Nirvana.ogg');
    static readonly APPROACHING_ALBUM = new Sounds('1993 (Album Version) - Approaching Nirvana.ogg');
    static readonly LETS_BE_FRIENDS  = new Sounds('[Electro] - Lets Be Friends - FTW [Monstercat Release].ogg');
    static readonly NEW_GAME  = new Sounds('[Electro] - Nitro Fun - New Game [Monstercat Release].ogg');
    static readonly ECLIPSE  = new Sounds('[Electro] - Noisestorm - Eclipse [Monstercat Free Download].ogg');
    static readonly ROCKTRONIK  = new Sounds('[Electro] - Pegboard Nerds - Rocktronik [Monstercat FREE Release].ogg');
    static readonly SUGAR_RUSH  = new Sounds('[Electro] - PIXL - Sugar Rush [Monstercat EP Release].ogg');
    static readonly REACH  = new Sounds('[Future Bass] - Grant Bowtie - Reach [Monstercat Release].ogg');
    static readonly RAZOR_SHARP  = new Sounds('[Glitch Hop   110BPM] - Pegboard Nerds & Tristam - Razor Sharp [Monstercat Release].ogg');
    static readonly A_SKILLZ_VS_BEAT_VANDALS  = new Sounds('A Skillz vs Beat Vandals - Beat don\'t stop.ogg');
    static readonly CHEER  = new Sounds('cheer.ogg', false);
    static readonly GITHUB  = new Sounds('DCDJ - Github.ogg');
    static readonly TAKING_MY_TIME  = new Sounds('E-Dubble - Taking My Time (No Copyright + Download).ogg');
    static readonly EXIGE  = new Sounds('Exige - 2014 Launchpad Mashup.ogg');
    static readonly MAKE_A_CAKE  = new Sounds('Make a Cake  - A Minecraft Parody of Katy Perrys\' Wide Awake (Music Video).ogg');
    static readonly FREAK_ME_OUT  = new Sounds('Outmode -  Freak Me Out (Original Mix).ogg');
    static readonly IN_TIME  = new Sounds('PeaceTreaty - In Time feat. Anabel Englund (Exige Remix).ogg');
    static readonly FIRESTARTER  = new Sounds('Rob Gasser - Firestarter [Glitch Hop].ogg');
    static readonly THE_EXIT  = new Sounds('Rob Gasser - The Exit.ogg');
    static readonly SPLINTER  = new Sounds('Savant - Splinter.ogg');
    static readonly THE_ARCADE_2013  = new Sounds('The Arcade 2013 - Savant.ogg');
    static readonly THE_STANDOFF  = new Sounds('The Standoff - Song written for The Hive\'s Mini Game  Block Party.ogg');
    static readonly PIXEL_PARTY  = new Sounds('Vexento - Pixel Party.ogg');
    static readonly THIRSTY  = new Sounds('Vexento - Thirsty.ogg');
    static readonly YOU_CAN_PLAY  = new Sounds('Vinter in Hollywood - You can Play (official).ogg');
    static readonly VINYL_STOP  = new Sounds('vinylstop.ogg', false);
    static readonly KILL_ALL_DAY  = new Sounds('♫  Kill All Day  REMIX by Elyssius - Minecraft Original Song.ogg');

    private constructor(private readonly fileName: string, public readonly isMusic = true) {}

    public getFileName(){
        return this.fileName;
    }

    public static getSoundFromName(name: string): Sounds {
        const properties = Object.getOwnPropertyNames(this).filter(prop => prop === prop.toUpperCase());
        return <Sounds>this[properties.find(prop => prop.toLowerCase() === name.toLowerCase()) as keyof typeof Sounds];
    }
}