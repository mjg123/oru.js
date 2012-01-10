/*jslint white: false*/
/*global document*/

var ORU = (function () {

    var oru = {},
    text = function(txt) {
	return document.createTextNode(txt);
    },
    el = function(classname){
	var d = document.createElement("div");
	d.className = classname;
	return d;
    },
    countProps = function(o){
	var p,c=0;
	for (p in o){
	    if (o.hasOwnProperty(p)){
		c++;
	    }
	}
	return c;
    },
    typeOf = function (value) { // thanks, crockford
	var s = typeof value;
	if (s === 'object') {
            if (value) {
		if (typeof value.length === 'number' &&
                    !(value.propertyIsEnumerable('length')) &&
                    typeof value.splice === 'function') {
                    s = 'array';
		}
            } else {
		s = 'null';
            }
	}
	return s;
    },
    quoted = function (content) {
	var span = document.createElement('span'),
	q1 = document.createElement('span'),
	q2 = document.createElement('span'),
	t = text(content);

	q1.innerHTML = '"';
	q1.className = 'quote';
	q2.innerHTML = '"';
	q2.className = 'quote';

	span.appendChild(q1);
	span.appendChild(t);
	span.appendChild(q2);

	return span;
    };

    oru.create = function (json) {

	var o, propDiv, keyDiv, valDiv, fooDiv, newDiv = el('jsondiv oru');

	if ( typeOf(json) === 'string' ) {
	    valDiv = el('jsonval string oru');
	    valDiv.innerHTML = '"' + json + '"';
	    return valDiv;
	}

	if ( typeOf(json) === 'number' ) {
	    valDiv = el('jsonval number oru');
	    valDiv.innerHTML = json;
	    return valDiv;
	}

	if ( typeOf(json) === 'null' ) {
	    valDiv = el('jsonval null oru');
	    valDiv.innerHTML = "null";
	    return valDiv;
	}

	if ( typeOf(json) === 'boolean' ) {
	    valDiv = el('jsonval boolean oru');
	    valDiv.innerHTML = json;
	    return valDiv;
	}

	if ( typeOf(json) === 'array' ){
	    newDiv.appendChild( text("[") );
	    for ( o=0; o<json.length; o+=1 ){
		propDiv = el('jsonprop');
		
		valDiv = oru.create( json[o] );
		propDiv.appendChild(valDiv);
		if ( o < json.length-1 ){
		    propDiv.appendChild(text(","));
		}
		newDiv.appendChild(propDiv);
	    }
	    newDiv.appendChild( text("]") );
	    return newDiv;
	}

	if ( typeOf(json) === 'object' ){

	    t = countProps(json);
	    c = 0;

	    newDiv.appendChild( text("{") );
	    for ( o in json ){
		if ( json.hasOwnProperty(o) ){
		    propDiv = el('jsonprop');
		    keyDiv = el('jsonkey key oru');
		    keyDiv.appendChild(quoted(o));
		    
		    valDiv = oru.create( json[o] );

		    propDiv.appendChild(keyDiv);
		    propDiv.appendChild(text(":"));
		    propDiv.appendChild(valDiv);

		    if ( c < t-1 ){
			valDiv.appendChild(text(","));
		    }
		    c++;

		    newDiv.appendChild(propDiv);
		}
	    }
	    newDiv.appendChild( text("}") );
	    return newDiv;
	}

    };

    return oru;

}());