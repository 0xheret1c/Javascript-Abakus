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
{
    //k10-0
    constructor(id,color)
    {
        this.id = id;
        this.position = id.substring(id.indexOf('-') + 1);
        this.p_htmlKugel = undefined;
        this.p_color = color;
        this.p_flippedRight = false;

    }

    set color(color)
    {
        this.p_color = color;
        this.htmlKugel.style.backgroundColor = color;
    }

    get htmlKugel()
    {
        this.p_htmlKugel = document.getElementById(id);
        return this.p_htmlKugel;
    }

    flip()
    {
        this.p_flippedRight = !this.p_flippedRight;
        //...
    }
}

