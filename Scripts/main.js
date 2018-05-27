
 // Die Anzahl der zurzeit ausgefuehrten Transtitions. 
 // Wird beim Start einer Transition erhoet, und beim Stop verringert.
var ongoingTransitions = 0;
var globalJson = '{'+                           
                        '"Stangen": 5,'+                // Anzahl der Stangen
                        '"KugelnProStange": 10,'+       
                        '"KugelRadius": 50,'+       
                        '"KugelSpacing": 5,'+           // Abstand zwischen den Kugeln auf der Stange
                        '"StangenSpacing": 5,'+         // Abstand der Stangen zueinander
                        '"RahmenThickness":10,'+        // Breite das Rahmens
                        '"StangenThickness":2,'+        // Breite der Stangen
                        '"TransitionSpeed": 1,'+        // Geschwindigkeit der Animationen
                        '"StangenColor":"#000000"'+
                  '}';


 


/*Klasse fuer die Kugeln*/ 
class Kugel
{   
    constructor(pos,id,wert,stange, farbe)
    {
        this.stange = stange;       // Referenz auf die Stange, auf der die Kugel sitzt, fuer einfacheres handling.
        this.wert = wert;           // Wert der Kugel. bsp. 10^1, 10^2 etc.
        this.id = id;               // ID der Kugel gleich der ID des HTML-Divs. Koennte auch direkt mit Referenz auf das HTML-Element ersetzt werden.
        this.settings = JSON.parse(globalJson);     // Die Settings...
        this.flippedRight = false;      // Haelt track ob die Kugel nach Rechts verschoben wurde.
        this.pos = pos;     //  Eigene position im Kugel-Array der Stange.
        this.posX = undefined;      // X Position bezueglich des Abakus.
        this.posY = undefined;      // Y "
        this.X = undefined; //X Position nicht bezüglich zum Abakus, sondern der ganzen Page.
        this.Y = undefined; //Y "

        /*Die Settings in variablen uebernehmen, fuer die Uebersicht.*/
        this.spacing = this.settings["KugelSpacing"];
        this.radius = this.settings["KugelRadius"];
        this.spacing = this.settings["KugelSpacing"];
        this.tSpeed = this.settings["TransitionSpeed"];
        this.kugelnProStange = this.settings["KugelnProStange"];
        this.kugelColor = farbe;        // Farbe der Kugel
    }



    /**
     * flip() schiebt die Kugel nach Rechts bzw. nach links abhaengig von
     * flippedRight, und passt flippedRight an. Um die Kugel zu verschieben 
     * wird die X Position angepasst.
     */
    flip()
    {
            // Da wir die Kugel jetzt bewegen, findet eine Transition statt.
            ongoingTransitions++;

            if(!this.flippedRight)   //Kugel nach rechts bewegen.
            {
                /*
                * Die Position der Kugel ergibt sich aus der eigenen Position im Array multipliziert mit dem Platz
                * den die Kugel benoetigt (Radius + Spacing). Addiert man vorher die Position im Array mit der Anzahl 
                * aller Kugeln auf der Stange, verschiebt sich die Kugel auf ihren gegenueberliegenden Platz.
                * */
                this.posX = this.X + ((this.pos + this.kugelnProStange) * (this.spacing + this.radius));       
                
              
                // Alle Kugeln mit verschieben, die nicht schon Rechts sind.
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
                /* Diesmal von vorne nach hinten durch das Array gehen, 
                 * damit sich die Kugeln in richtiger Reihenfolge bewegen. */
                for(var i = this.pos - 1; i >= 0; i--)
                {
                    if(this.stange.kugeln[i].flippedRight)
                        this.stange.kugeln[i].flip();
                }
            }
            
            // flippedRight anpassen, da die Kugel nun geflippt ist.  
            this.flippedRight = !this.flippedRight;
            // Die Wert-Anzeige anpassen, da sich durch das verschieben der Wert aendert.
            document.getElementById("wertAnzeige").innerText = abakus.gesammtWert;  
            //  Die obere Wert-Anzeige anpassen.
            document.getElementById("wertAnzeigeOnTop").innerText = abakus.gesammtWert;
            
            // Mit der Draw funktion den CSS-Teil der Kugel anpassen, damit sie sich verschiebt.
            this.draw();     
    }

    /**
     * draw() ueberschreibt den CSS-Teil des Div-Elements der Kugel um ihre Position anzupassen.
     */
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

    /**
     * create() erstellt die Kugel an Position X,Y und haengt diese im DOM ein.
     * X und Y koennten auch direkt im constructor uebergeben werden.
     */
    create(X,Y)
    {
        // Den Ursprung der sich unten links befindet kompensieren
        
        // Die Kugel um die Haelfte nach oben verschieben
        this.posY = Y - (this.radius/2);   
        
        /* Die Position der Kugel ergibt sich aus der eigenen 
         * Position im Array multipliziert mit dem Platz 
         * den die Kugel benoetigt (Radius + Spacing) */
        this.posX = X + (this.pos * (this.spacing + this.radius)); 
        
        this.X = X;
        this.Y = Y;
        var kugel = document.createElement("div");  // Das div erstellen.
        kugel.id = this.id;

        // CSS Stuff
        kugel.style = "" +
        "background-color:" + this.kugelColor + "; " + 
        "z-index: 1; " +
        "position: absolute; " +
        "width:" + this.radius + "px; " +
        "height:" + this.radius + "px; " +
        "top:" + this.posY + "px; " +
        "left:" + this.posX + "px; "+
        "border-radius:" + this.radius + "px; ";


        // Wenn die position 0 ist, handelt es sich um die Uebertrags-Kugel.
        if(this.pos === 0)
        {
            /* Der Ubertragskugel die overFlow auf dem transitionend event geben, damit diese
               ausgeloest wird, wenn sie verschoben wird. */
            kugel.addEventListener("transitionend", function(){overFlow(this);});
        }

        // Die click funktion hinzufuegen.
        kugel.addEventListener('click',function()
        {

            // Wenn keine Transitionen mehr stattfinden darf diese ausgefuehrt werden.
            if(ongoingTransitions === 0)
            { 
                // Den Berechnen-Button deaktivieren, da waehrend einer Transition keine weiter Aktion statt
                // statt finden darf. Er wird spaeter beim transitionend-event reaktiviert.
                document.getElementById("send").disabled = true;

                // Die Kugel bewegen.
                moveKugel(this.id);
            }
        });

        document.body.appendChild(kugel); // Die Kugel in das DOM haengen.

    }
}

/* Klasse fuer die Stange */
class Stange
{
    constructor(pos,wert, farbe)
    {
        
        this.settings = JSON.parse(globalJson);
        this.kugelnProStange = this.settings['KugelnProStange'];

        this.pos = pos;     // Eigene position im Stangen-Array des Abakus.                     
        this.wert = wert;   // Der Wert der Stange. bsp. 10^1, 10^2 etc.               
                                          
        this.kugeln = new Array();    // Das Array fuer die Kugeln.  
        for(var i = this.kugelnProStange; i >= 0; i--)  // Das Array mit Kugeln befuellen.
        {
            this.kugeln[i] = new Kugel(i,"id"+pos+"-"+i,this.wert,this, farbe);
        }
    }

    /*  gesammtWert() gibt den Gesammtwert der Stange zurück, das heißt den Wert aller 
        Kugeln die nach rechts geschoben worden sind. */
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

    /*
     * create() erstellt die Stange an Position X,Y und haengt diese im DOM ein.
     * X und Y koennten auch direkt im constructor uebergeben werden.
     */
    create(X,Y)
    {
        var kugelRadius = this.settings["KugelRadius"];
        var kugelSpacing = this.settings["KugelSpacing"];
        var stangenSpacing = this.settings["StangenSpacing"];
        var rahmenThickness = this.settings["RahmenThickness"];
        var stangenThickness = this.settings["StangenThickness"];
        var stangenColor = this.settings["StangenColor"];
        
        /* Die laenge ergibt sich aus den Platz den alle Kugeln benoetigen mal zwei, 
        *  da sich die Kugeln auch Platz zum verschieben brauchen.
        */
        var stangenLength = 2 * (this.kugelnProStange * (kugelRadius + kugelSpacing));	
        
        /* Die Y-Position ergibt sich aus der Position im Array und den abstand der Stangen plus
        *  den Radius der Kugel, damit mindestens immer Platz fuer die Kugeln ist.  
        *  */
        var posY = Y + this.pos * (stangenSpacing + kugelRadius);
        
        // Auf die X-Position muss die Breite des Rahmens addiert werden.
        var posX = rahmenThickness + X;
        
        // Das div-Element erstellen.
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
        // Die Stange in das DOM einhaengen.
        document.body.appendChild(stange);

        //Kugeln drawn
        for(var i = 0; i < this.kugelnProStange; i++)
        {
            this.kugeln[i].create(posX,posY);
        }

    }
}



/* Die Abakus klasse */
class Abakus
{
    constructor(x,y)
    {
        this.settings = JSON.parse(globalJson);
        
        
        this.anzahlKugelnProStange = this.settings['KugelnProStange'];
        this.anzahlStangen = this.settings['Stangen'];
        this.stangen = new Array();     // Das Array das die Stangen haelt.
        this.value = 0;
        
        var farbe = "#FF0000";	// Damit Kugeln in jedem Fall eine Farbe haben
        var exponent = 0;       // Der Exponent fuer die Wertigkeit der Stangen 10^1 10^2 etc.
        for(var i = this.anzahlStangen -1; i >=0 ; i--)
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
            this.stangen[i] = new Stange(i,Math.pow(10,exponent), farbe);
            exponent++;
        }
        
    }


    // gesammtWert() gibt den Gesammtwert des Abakus zurück, das heißt den Wert aller 
    // Gesammtwerte der Stangen.
    get gesammtWert()
    {
        var wert = 0;
        for(var i = 0; i < this.anzahlStangen; i++)
        {
            wert =  wert + this.stangen[i].gesammtWert;
        }
        return  wert;
    }

    // getter fuer stangen, haben wir nicht benutzt, da es keine Kapselung gibt, und es vergessen wurde.
    stange(pos)
    {
        return stangen[pos];
    }

    // Kugel geht durch alle Stangen und sucht die Kugel die mit der ID ueberein stimmt.
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
    /* Erstellt den Abakus an Position X und Y */
    create(X,Y)
    {
    	//Anzeigetafel drawen
    	var wertRahmen = document.createElement("div");
    	wertRahmen.id = "wertOnTop";
    	wertRahmen.style = "" +
    	"z-index: 2; " +
        "position: absolute; " +
        "width:" + 100 + "px; " +
        "height:" + 50 + "px; " +
        "top:" + (Y-150) + "px; " +
        "left:" + (X+500) + "px; ";
    	
    	//Anzeigewert erzeugen
        var anzeigeWert = document.createElement("p");
        anzeigeWert.id = "wertAnzeigeOnTop";
        anzeigeWert.style = ""+
        "font-size: 30px;";
        anzeigeWert.innerText = this.gesammtWert;
        wertRahmen.appendChild(anzeigeWert);
        
    	document.body.appendChild(wertRahmen);
    	
    	
    	
    	//Abakus Rahmen drawen
    	var linkerRahmen = document.createElement("div");
        
    	linkerRahmen.style = "" +
        "background-color: #000000; " +				//Lila Farbcode: #7401DF 
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
        "background-color: #000000; " + 
        "z-index: 2; " +
        "position: absolute; " +
        "width:" + 50 + "px; " +
        "height:" + 300 + "px; " +
        "top:" + (Y-35) + "px; " +
        "left:" + (2*this.settings['KugelnProStange'] * (this.settings["KugelRadius"] + this.settings["KugelSpacing"]) + X) + "px; "+
        "border-radius:" + 30 + "px; ";
    	document.body.appendChild(rechterRahmen);
        
        // Das transitionstart event existiert im Chrome nicht. Aus Kompatiblitaetsgruenden
        // haben wir diese entfernt, und durch einen Work-Arround ersetzt.
       /* document.body.addEventListener("transitionstart", function()
        {
            ongoingTransitions++;
            document.getElementById("send").disabled = true;

        });*/

        
        document.body.addEventListener("transitionend", function()
        {
        	ongoingTransitions--; // Wenn eine transition beendet wurde, wird ongoingTransitions angepasst.
            document.getElementById("send").disabled = false; // Den Button reaktivieren.
            
        });
        	
        //Stangen erstellen.
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
        
        
        textBox.addEventListener("keyup",valid) // Keyup event fuer die Validierung des Inputs
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
        	if (valid() === true)
        	{
	            var input = document.getElementById("wertEingabe").value;  
                input = parseInt(input.replace(/\s/g,'')); // Whitespaces mit '' ersetzen.
	            if (input > 0)
	            {
	            	addieren(input);
				}
	            if (input < 0) 
	            {
	            	input = input * (-1); // Input wieder positiv drehen
	            	subtrahieren(input);
				}
	            document.getElementById("wertEingabe").value = "";  // Die Eingabe zurueck setzen.
	            
        	}
        });
        document.body.appendChild(button);  // Den Button einhaengen.
    }
}


/* valid() validiert den input, und gibt true zurueck wenn der Input valide ist. */
function valid()
{
    // Den Wert aus der WertAnzeige holen.
	var currentValue = parseInt(document.getElementById("wertAnzeige").innerText);
    // Den input holen.
    var input = document.getElementById("wertEingabe").value;
    // Whitespaces ignorieren.
    input = parseInt(input.replace(/\s/g,''));
    // Das Ergebnis darf nicht kleiner 0 oder groeßer 99999 sein.
    if (currentValue + input < 0 || currentValue + input > 99999) 
    {
        // Das Absenden verhindern.
    	document.getElementById("send").disabled = true;
    	document.getElementById("errorMessage").innerHTML = "Der aktuelle Wert des Abakus' darf durch die Addition der "
    											+"eingegebenen Zahl nicht über 99999 oder unter 0 fallen.";
    	return false;
	}
    else 
    {
         // Das Absenden verhindern.
    	document.getElementById("send").disabled = false;
    	document.getElementById("errorMessage").innerHTML = "";
    	return true;
    }
}

/* Adiert den input auf den aktuellen Wert. */
function addieren(input)
{
    var counter = (""+input).length;    // Die laenge des inputs zum iterieren.
    
    // Ueber alle Stangen iterieren die durch die Addition beeinflusst werden.
	for(let i = abakus.anzahlStangen; i > abakus.anzahlStangen - (""+input).length -1; i--)
    {
        var currentStange = abakus.stangen[i];
        var currentZahl = (""+input)[counter];  // Eine stelle der Inputzahl
        counter--;                              // Den counter auf die naechste Stelle schieben.
        
        // Fuer die aktuelle Stelle passend viele Kugeln verschieben.
        for(let j = 1; j <= currentZahl; j++)
        {
        	/*Flippe immer die letzte nicht geflippte Kugel */
            for(var x = abakus.anzahlKugelnProStange - 1; x >= 0; x--)
            {
                if(!currentStange.kugeln[x].flippedRight)
                {
                	currentStange.kugeln[x].flip();
                	x = -1;	// Die Schleife beenden.
                }
            }
        }
    }
}

function subtrahieren(input)
{
    var inputLength = (""+input).length;
    var ergebnis = "" + (abakus.gesammtWert - input);
    var ergebnisLength = (""+ergebnis).length;
    var array = [9,9,8,7,6,5,4,3,2,1];
    
    /*Ergebnis-string mit Nullen auffüllen, bis max. length 5*/
    for(let i = 0; i < abakus.anzahlStangen - ergebnisLength; i++)
    {
        ergebnis = "0" + ergebnis;
    }

    for (let i = 0; i < abakus.anzahlStangen; i++)
    {
    	let currentStange = abakus.stangen[i];
    	if (ergebnis[i] == 0)
    	{
			if (currentStange.kugeln[array[ergebnis[i]]].flippedRight)
			{
				currentStange.kugeln[array[ergebnis[i]]].flip();
			}
		}
    	else
    	{
    		if (!currentStange.kugeln[array[ergebnis[i]]].flippedRight)
    		{
    			currentStange.kugeln[array[ergebnis[i]]].flip();
			}
    		
    		if (parseInt(ergebnis[i])+1 > array.length)
    		{
    			if (!currentStange.kugeln[array[parseInt(ergebnis[i])+1]].flippedRight)
        		{
    				currentStange.kugeln[array[1]].flip();
    			}
			}
    		else if (parseInt(ergebnis[i])+1 < array.length)
    		{
    			if (currentStange.kugeln[array[parseInt(ergebnis[i])+1]].flippedRight)
        		{
    				currentStange.kugeln[array[parseInt(ergebnis[i])+1]].flip();
    			}
			}
    	}
    	
	}
}

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

function moveKugel(id)
{
	var HTMLkugel = document.getElementById(id);
    var kugel = abakus.kugel(HTMLkugel.id);
  //  var anzeige = document.getElementById("wertAnzeige");
	kugel.flip();	 
}

 // Der Abakus
 var abakus = new Abakus();

function main()
{
    abakus.create(150,200);
}
