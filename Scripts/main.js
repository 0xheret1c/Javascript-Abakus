
//Mit json datei ersetzen, wenn wir wissen wie
var globalJson = '{'+
                        '"Stangen": 5,'+
                        '"KugelnProStange": 10,'+
                        '"KugelRadius": 50,'+
                        '"KugelSpacing": 5,'+
                        '"StangenSpacing": 5,'+
                        '"RahmenThickness":10,'+ 
                        '"StangenThickness":2,'+
                        '"TransitionSpeed": 1,'+
                        '"StangenColor":"#000000"'+
                  '}';



class Kugel
{   constructor(pos,id,wert,stange)
    {
        this.stange = stange;
        this.wert = wert;
        this.id = id;
        this.settings = JSON.parse(globalJson);
        this.flippedRight = false;
        this.pos = pos;     //position in array
        this.posX = undefined; // X posigion on abakus
        this.X = undefined; //X position on page
        this.Y = undefined; //Y position on page
        this.spacing = this.settings["KugelSpacing"];
        this.radius = this.settings["KugelRadius"];
        this.spacing = this.settings["KugelSpacing"];
        this.tSpeed = this.settings["TransitionSpeed"];
        this.kugelnProStange = this.settings["KugelnProStange"];
        this.posY = undefined;
        this.posX = undefined;
        this.kugelColor = "#FF0000";
    }

    flip()
    {

        this.flippedRight = !this.flippedRight;
        if(this.flippedRight)   //Kugel nach rechts bewegen.
        {
            this.posX = this.X + ((this.pos + this.kugelnProStange) * (this.spacing + this.radius));
            for(var i = this.pos + 1; i < this.kugelnProStange; i++)
            {
                if(!this.stange.kugeln[i].flippedRight)
                    this.stange.kugeln[i].flip();
            }

        }
        else                    //Kugel nach links bewegen.
        {
            this.posX = this.X + (this.pos * (this.spacing + this.radius));
            for(var i = this.pos - 1; i >= 0; i--)
            {
                if(this.stange.kugeln[i].flippedRight)
                    this.stange.kugeln[i].flip();
            }
        }
        this.draw();
    }

    draw()
    {       
        var kugel = document.getElementById(this.id); 
        kugel.style = "" +
        "background-color:" + this.kugelColor + "; " + 
        "z-index: 1; " +
        "position: absolute; " +
        "width:" + this.radius + "px; " +
        "height:" + this.radius + "px; " +
        "top:" + this.posY + "px; " +
        "left:" + this.posX + "px; "+
        "transition-duration:" + this.tSpeed + "s; " +
        "border-radius:" + this.radius + "px; ";
    }

    create(X,Y)
    {

        this.posY = Y - (this.radius/2);
        this.posX = X + (this.pos * (this.spacing + this.radius));
        this.kugelColor = "#FF0000";
        this.X = X;
        this.Y = Y;
        var kugel = document.createElement("div");
        
        kugel.id = this.id;
        kugel.style = "" +
        "background-color:" + this.kugelColor + "; " + 
        "z-index: 1; " +
        "position: absolute; " +
        "width:" + this.radius + "px; " +
        "height:" + this.radius + "px; " +
        "top:" + this.posY + "px; " +
        "left:" + this.posX + "px; "+
        "border-radius:" + this.radius + "px; ";
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
    constructor(pos,wert)
    {
        
        this.settings = JSON.parse(globalJson);
        this.kugelnProStange = this.settings['KugelnProStange'];

        this.pos = pos;                 
        this.wert = wert;               
                                          
        this.kugeln = new Array();      
        for(var i = this.kugelnProStange; i >= 0; i--)
        {
            this.kugeln[i] = new Kugel(i,""+pos+"-"+i,this.wert,this);
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

    create(X,Y)
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
            this.kugeln[i].create(posX,posY);
        }

    }
}

class Abakus
{
    constructor(x,y)
    {
        //json parsen
        var counter = 0;
        this.settings = JSON.parse(globalJson);

        this.anzahlKugelnProStange = this.settings['KugelnProStange'];
        this.anzahlStangen = this.settings['Stangen'];
        this.stangen = new Array();
        this.value = 0;
        for(var i = this.anzahlStangen -1; i >=0; i--)
        {
            this.stangen[i] = new Stange(i,Math.pow(10,counter));
            counter++;
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

    stange(pos)
    {
        return stangen[pos];
    }

    kugel(id)
    {
        for(var i = 0; i < this.anzahlStangen; i++)
        {
            var currentStange = this.stangen[i];
            for(var j = 0; j < this.anzahlKugelnProStange; j++)
            {
                if(currentStange.kugeln[j].id === id)
                {
                    return currentStange.kugeln[j];
                }            
            }
        }
        return undefined;
    }

    create(X,Y)
    {
        //Stangen drawen
        for(var i = 0; i < this.anzahlStangen; i++)
        {
            this.stangen[i].create(X,Y);
        }

        var text = document.createElement("p")
        text.id = "wertAnzeige";
        text.innerText = this.gesammtWert;
        document.body.appendChild(text);


        //Rahmen drawenfah
        var sockel = document.createElement("div");
        var leftBar = document.createElement("div");
        var rightBar = document.createElement("div");

    }

}

var abakus = new Abakus();

function moveKugel(x)
{
    var HTMLkugel = document.getElementById(x);
    var anzeige = document.getElementById("wertAnzeige");
    var kugel = abakus.kugel(HTMLkugel.id);
    kugel.flip();
    anzeige.innerText = abakus.gesammtWert;

    console.log(kugel.wert);
}

function main()
{
    abakus.create(200,200);   
}
