
//Mit json datei ersetzen, wenn wir wissen wie
var globalJson = '{'+
                        '"Stangen": 5,'+
                        '"KugelnProStange": 10,'+
                        '"KugelRadius": 50,'+
                        '"KugelSpacing": 5,'+
                        '"StangenSpacing": 5,'+
                        '"RahmenThickness":10,'+ 
                        '"StangenThickness":2,'+
                        '"StangenColor":"#000000"'+
                  '}';

class Kugel
{   constructor(pos,id)
    {
        this.id = id;
        this.settings = JSON.parse(globalJson);
        this.flippedRight = true;
        this.pos = pos;
    }

    draw(X,Y)
    {
        var radius = this.settings["KugelRadius"];
        var spacing = this.settings["KugelSpacing"];
        var posY = Y - (radius/2);
        var posX = X + (this.pos * (spacing + radius));
        var kugelColor = "#FF0000";

        var kugel = document.createElement("div");
        
        kugel.id = this.id;
        kugel.style = "" +
        "background-color:" + kugelColor + "; " + 
        "z-index: 1; " +
        "position: absolute; " +
        "width:" + radius + "px; " +
        "height:" + radius + "px; " +
        "top:" + posY + "px; " +
        "left:" + posX + "px; "+
        "border-radius:" + radius + "px; ";
        console.log(this.id);
        kugel.addEventListener('click',function()
        {
            moveKugel(this.id);
        });

        document.body.appendChild(kugel);

    }
}

class Stange
{
    constructor(pos)
    {

        this.settings = JSON.parse(globalJson);
        this.kugelnProStange = this.settings['KugelnProStange'];

        this.pos = pos;                 //Die Position im Array
        this.wert = Math.pow(10,pos)    // Die erste Stange bildet die 1er stellen, 
                                        // also 10^0, die zweite Stange die 10er Stellen also  10^1. etc..
        
        this.kugeln = new Array();      
        for(var i = this.kugelnProStange; i >= 0; i--)
        {
            this.kugeln[i] = new Kugel(i,""+pos+"-"+i);
        }
    }

    //"gesammtWert()" gibt den Gesammtwert der Stange zurück, das heißt den Wert aller 
    //Kugeln die nach rechts geschoben worden sind.
    get  gesammtWert()
    {
        var wert = 0;
        for(var i = 0; i < this.kugelnProStange; i++)
        {
            if(this.kugeln[i].flippedRight)
            {
                wert = wert + this.wert;
            }
        }
        return wert;
    }

    draw(X,Y)
    {
        var kugelRadius = this.settings["KugelRadius"];
        var kugelSpacing = this.settings["KugelSpacing"];
        var stangenSpacing = this.settings["StangenSpacing"];
        var rahmenThickness = this.settings["RahmenThickness"];
        var stangenThickness = this.settings["StangenThickness"];
        var stangenColor = this.settings["StangenColor"];
        var stangenLength = 2 * (this.kugelnProStange * (kugelRadius + kugelSpacing));
        var posY = Y + this.pos * (stangenSpacing + kugelRadius);
        var posX = rahmenThickness + X;
        var stange = document.createElement("div");
        //Problematisch beim Warten des Codes, eventuell bessere Lösung überlegen.
        stange.style = "" +
                    "background-color:" + stangenColor + "; " + 
                    "z-index: 0; " +
                    "position: absolute; " +
                    "width:" + stangenLength + "px; " +
                    "height:" + stangenThickness + "px; " +
                    "top:" + posY + "px; " +
                    "left:" + posX + "px; ";
        document.body.appendChild(stange);

        //Kugeln drawn
        for(var i = 0; i < this.kugelnProStange; i++)
        {
            this.kugeln[i].draw(posX,posY);
        }

    }
}

class Abakus
{
    constructor()
    {
        //json parsen
        this.settings = JSON.parse(globalJson);

        this.anzahlStangen = this.settings['Stangen'];
        this.stangen = new Array();
        this.value = 0;
        for(var i = this.anzahlStangen -1; i >=0; i--)
        {
            this.stangen[i] = new Stange(i);
        }
    }

    //"gesammtWert()" gibt den Gesammtwert des Abakus zurück, das heißt den Wert aller 
    //Gesammtwerte der Stangen.
    get gesammtWert()
    {
        var wert = 0;
        for(var i = 0; i < this.anzahlStangen; i++)
        {
            wert =  wert + this.stangen[i].gesammtWert;
        }
        return  wert;
    }

    draw(X,Y)
    {
        //Stangen drawen
        for(var i = 0; i < this.anzahlStangen; i++)
        {
            this.stangen[i].draw(X,Y);
        }

        //Rahmen drawen
    }

}

function moveKugel(x)
{
    var kugel = document.getElementById(x);
    console.log(kugel.id);
}

function main()
{
    var abakus = new Abakus();
    abakus.draw(200,200);
    console.log(abakus.gesammtWert);
}
