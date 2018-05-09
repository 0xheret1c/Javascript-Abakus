class Kugel
{
    constructor(posX)
    {
        this.flippedRight = false;
        this.posX = posX;
    }
}

class Stange
{
    constructor(posY)
    {
        this.settings = JSON.parse("settings.json");
        this.kugelnProStange = settings["KugelnProStange"];
        this.posY = posY;
        this.wert = Math.pow(10,posY)   // Die erste Stange bildet die 1er stellen, 
                                        // also 10^0, die zweite Stange die 10er Stellen also  10^1. etc..
        
        this.kugeln = new Array();      
        for(var i = 0; i < this.kugelnProStange; i++)
        {
            this.kugeln[i] = new Kugel(this.wert,i);
        }
    }

    //"value()" gibt den Gesammtwert der Stange zurück, das heißt den Wert aller 
    //Kugeln die nach rechts geschoben worden sind.
    get value()
    {
        var value = 0;
        for(var i = 0; i < this.kugelnProStange; i++)
        {
            if(this.kugeln[i].flippedRight)
            {
                value = value + this.wert;
            }
        }
        return value;
    }
}

class Abakus
{
    constructor()
    {
        this.settings = JSON.parse("settings.json");
        this.anzahlStangen = settings["Stangen"];
        this.stangen = new Array();
        this.value = 0;
        for(var i = 0; i < this.anzahlStangen; i++)
        {
            this.stangen[i] = new Stange(i);
        }
    }

    //"value()" gibt den Gesammtwert des Abakus zurück, das heißt den Wert aller 
    //Gesammtwerte der Stangen.
    get value()
    {
        var value = 0;
        for(var i = 0; i < this.anzahlStangen; i++)
        {
            value = value + stangen[i].value;
        }
        return value;
    }

    drawAbakus()
    {

    }
}