
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
{   constructor(pos,id,wert,stange, farbe)
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
        this.kugelColor = farbe;
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
        //this.kugelColor = "#FF0000";
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
    constructor(pos,wert, farbe)
    {
        
        this.settings = JSON.parse(globalJson);
        this.kugelnProStange = this.settings['KugelnProStange'];

        this.pos = pos;                 
        this.wert = wert;               
                                          
        this.kugeln = new Array();      
        for(var i = this.kugelnProStange; i >= 0; i--)
        {
            this.kugeln[i] = new Kugel(i,""+pos+"-"+i,this.wert,this, farbe);
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
        var farbe = "#FF0000";	//Damit Kugeln in jedem Fall eine Farbe haben
        this.settings = JSON.parse(globalJson);

        this.anzahlKugelnProStange = this.settings['KugelnProStange'];
        this.anzahlStangen = this.settings['Stangen'];
        this.stangen = new Array();
        this.value = 0;
        for(var i = this.anzahlStangen -1; i >=0; i--)
        {
        	switch (i)
        	{
        		case 0:
        			farbe = "#FF0000";
        			break;
        		case 1:
        			farbe = "#FF8000";
        			break;
        		case 2:
        			farbe = "#D7DF01";
        			break;
        		case 3:
        			farbe = "#088A08";
        			break;
        		case 4:
        			farbe = "#0000FF";
        			break;
        	}
            this.stangen[i] = new Stange(i,Math.pow(10,counter), farbe);
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
    	//Abakus Rahmen drawen
    	var linkerRahmen = document.createElement("div");
        
    	linkerRahmen.style = "" +
        "background-color: #7401DF; " + 
        "z-index: 1; " +
        "position: absolute; " +
        "width:" + 50 + "px; " +
        "height:" + 300 + "px; " +
        "top:" + (Y-35) + "px; " +
        "left:" + (X) + "px; "+
        "border-radius:" + 30 + "px; ";
    	document.body.appendChild(linkerRahmen);
    	
    	
    	var rechterRahmen = document.createElement("div");
    	rechterRahmen.style = "" +
        "background-color: #7401DF; " + 
        "z-index: 2; " +
        "position: absolute; " +
        "width:" + 50 + "px; " +
        "height:" + 300 + "px; " +
        "top:" + (Y-35) + "px; " +
        "left:" + (2*this.settings['KugelnProStange'] * (this.settings["KugelRadius"] + this.settings["KugelSpacing"]) + X) + "px; "+
        "border-radius:" + 30 + "px; ";
    	document.body.appendChild(rechterRahmen);
    	
    	
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
    var kugel = abakus.kugel(HTMLkugel.id);
    var anzeige = document.getElementById("wertAnzeige");
    
	if ((kugel.id).substring(2,3) === "0" && kugel.flippedRight === false)
	{
		var col = parseInt((kugel.id).substring(0,1));
		HTMLkugel.addEventListener("transitionend", function(){
			back(col);
		});
	}
	 kugel.flip();
	 
    anzeige.innerText = abakus.gesammtWert;
    console.log(kugel.wert);
}


function back(col)
{
	var anzeige = document.getElementById("wertAnzeige");
	var HTMLkugel = document.getElementById(col + "-9");
	
	var kugel = abakus.kugel(HTMLkugel.id);
	
	if (kugel.flippedRight)
	{
	    kugel.flip();
	}
	
	if ((col-1) >= 0) {
		var HTMLkugel2 = document.getElementById((col-1) + "-9");
		var kugel2 = abakus.kugel(HTMLkugel2.id);
		if (kugel2.flippedRight === false)
		{
		    kugel2.flip();
		}
		/*else if (kugel2.flippedRight)
		{
			for (var i = 8; i >= 0; i--) {
				if (abakus.kugel(document.getElementById((col-1) + "-" + i).id).flippedRight === false) {
					console.log(i);
					abakus.kugel(document.getElementById((col-1) + "-" + i).id).flip();
					i = -1;
				}
			}
		}*/
	}
	
	anzeige.innerText = abakus.gesammtWert;
}

function main()
{
    abakus.create(150,200);
}
