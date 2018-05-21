
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
                {
                    this.stange.kugeln[i].flip();
                }     
            }

        }
        else   //Kugel nach links bewegen.
        {
 
            this.posX = this.X + (this.pos * (this.spacing + this.radius));
            for(var i = this.pos - 1; i >= 0; i--)
            {
                if(this.stange.kugeln[i].flippedRight)
                    this.stange.kugeln[i].flip();
            }
        }


        document.getElementById("wertAnzeige").innerText = abakus.gesammtWert;
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
        //console.log(this.id);

        if(this.pos === 0)
        {
            kugel.addEventListener("transitionend", function(){overFlow(this);});
        }

        kugel.addEventListener('click',function()
        {
            
            if(ongoingTransitions === 0)
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
            this.kugeln[i] = new Kugel(i,"id"+pos+"-"+i,this.wert,this, farbe);
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

ongoingTransitions = 0;
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
        
        document.body.addEventListener("transitionstart", function()
        {
            ongoingTransitions++;
            document.getElementById("send").disabled = true;

        })

        document.body.addEventListener("transitionend", function()
        {
            ongoingTransitions--;
            document.getElementById("send").disabled = false;
        })
        
        document.body.appendChild(rechterRahmen);
    	
    	
        //Stangen drawen
        for(var i = 0; i < this.anzahlStangen; i++)
        {
            this.stangen[i].create(X,Y);
        }

        //Wertfeld erzeugen
        var text = document.createElement("p");
        text.id = "wertAnzeige";
        text.style = "" +
        "position: absolute; " +
        "top: " + (Y + 300) + "px;" +
        "left: " + X + "px";
        text.innerText = this.gesammtWert;
        document.body.appendChild(text);
        
        //Eingabefeld erzeugen
        var textBox = document.createElement("input");
        textBox.type = "text";
        textBox.id = "wertEingabe";
        textBox.style = "" +
        "position: absolute; " +
        "top: " + (Y + 315) + "px;" +
        "left: " + (X + 45) + "px";
    	
        textBox.addEventListener("keyup",function()
        {
        	var currentValue = parseInt(document.getElementById("wertAnzeige").innerText);
            var input = document.getElementById("wertEingabe").value;
            input = parseInt(input.replace(/\s/g,''));
            if (currentValue + input < 0 || currentValue + input > 99999) 
            {
            	document.getElementById("send").disabled = true;
            	document.getElementById("errorMessage").innerHTML = "Der aktuelle Wert des Abakus' darf durch die Addition der "
            											+"eingegebenen Zahl nicht über 99999 oder unter 0 fallen.";
			}
            else 
            {
            	document.getElementById("send").disabled = false;
            	document.getElementById("errorMessage").innerHTML = "";
            }
        })
        document.body.appendChild(textBox);
        
        //Für die Fehlermeldung bei ungültiger Eingabe
        var errorMessage = document.createElement("p");
        errorMessage.id = "errorMessage"
    	errorMessage.style = "" +
        "position: absolute; " +
        "top: " + (Y + 325) + "px;" +
        "left: " + X + "px";
    	 document.body.appendChild(errorMessage);
    	 
        //Button erzeugen
        var button = document.createElement("input");
        button.type = "submit";
        button.value = "rechne";
        button.id = "send";
        button.style = "" +
        "position: absolute; " +
        "top: " + (Y + 315) + "px;" +
        "left: " + (X + 220) + "px";
        button.addEventListener('click',function()
        {        
            var input = document.getElementById("wertEingabe").value;
            input = parseInt(input.replace(/\s/g,''));
            var counter = (""+input).length;

            /*Für jede stelle x mal flippen*/ 
            
            if (input > 0)
            {
            	for(let i = abakus.anzahlStangen; i > abakus.anzahlStangen - (""+input).length -1; i--)
                {
                    var currentStange = abakus.stangen[i];
                    var currentZahl = (""+input)[counter];
                    console.log(currentZahl);	
                    counter--;
                       
                    for(let j = 0; j < currentZahl; j++)
                    {
                        /*Flippe immer die letzte nicht geflippte zahl */
                        for(let x = abakus.anzahlKugelnProStange - 1; x >= 0; x--)
                        {
                            if(!currentStange.kugeln[x].flippedRight)
                            {
                                currentStange.kugeln[x].flip();
                                x = -1;
                            }
                        }
                    }
                }
			}
            if (input < 0) {
            	//Minus Minus Minus .-.
			}
        });
        document.body.appendChild(button);

    }

}

var abakus = new Abakus();

function overFlow(kugel)
{

    var settings = JSON.parse(globalJson);
    var kugelnProStange = abakus.anzahlKugelnProStange;
    var stangenAnzahl = abakus.stangenAnzahl;
    var _kugel = abakus.kugel(kugel.id);

    if(!_kugel.flippedRight)
        return
   

    if(_kugel.flippedRight)
    {
        _kugel.stange.kugeln[kugelnProStange - 1].flip();
    }

    if(_kugel.stange.pos == 0)
        return


    var naechsteStange = abakus.stangen[_kugel.stange.pos - 1];
    
    for(let i = kugelnProStange -1; i >= 0; i--)
    {
        if(!naechsteStange.kugeln[i].flippedRight)
        {
            naechsteStange.kugeln[i].flip();
            i = -1;
        }
    }
}

function moveKugel(x)
{
	var HTMLkugel = document.getElementById(x);
    var kugel = abakus.kugel(HTMLkugel.id);
    var anzeige = document.getElementById("wertAnzeige");
	kugel.flip();	 
}

function main()
{
    abakus.create(150,200);
}
