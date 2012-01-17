/*jslint white: false*/
/*global document*/

var ORU = (function(){

    var oru={}, generators={},

    typeOf = function( value ){ // Thanks, Crockford!
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

    el = function( type, className, content ){
	var e = document.createElement(type);
	content = content || "";
	e.className = className;
	e.innerHTML = content;
	return e;
    },

    quotedKey = function( key ){
	var keyDiv = el( 'div', 'oru-key' );

	keyDiv.appendChild( el('span', 'oru-key-quote', '"') );
	keyDiv.appendChild( el('span', 'oru-key-text', key) );
	keyDiv.appendChild( el('span', 'oru-key-quote', '"') );
	keyDiv.appendChild( el('span', 'oru-key-colon', ':') );

	return keyDiv;
    },

    countProps = function( obj ){
	var i=0, p;
	for ( p in obj ){
	    if ( obj.hasOwnProperty(p) ){
		i += 1;
	    }
	}
	return i;
    },

    addDimmer = function( src, dst ){
	src.onmouseover = function(){ dst.classList.add( 'oru-highlight' ); };
	src.onmouseout  = function(){ dst.classList.remove( 'oru-highlight' ); };
    };

    generators.string = function( txt ){
	var span = el('span', 'oru-value-string'), a;
	span.appendChild( el('span', 'oru-key-quote', '"') );

	if ( txt.slice(0,7) === "http://" ) {
	    a = el('a');
	    a.href = txt;
	    a.innerHTML = txt;
	    span.appendChild(a);
	} else {
	    span.appendChild(el('span', '', txt));
	}

	span.appendChild( el('span', 'oru-key-quote', '"') );
	return span;
    };

    generators.number = function( num ){
	var span = el('span', 'oru-value-number');
	span.innerHTML = num;
	return span;
    };

    generators.boolean = function( b ){
	var span = el('span', 'oru-value-boolean');
	span.innerHTML = b;
	return span;
    };

    generators["null"] = function(){
	var span = el('span', 'oru-value-null');
	span.innerHTML = "null";
	return span;
    };

    generators["undefined"] = function(){
	var span = el('span', 'oru-value-undefined');
	span.innerHTML = "undefined";
	return span;
    };

    generators.array = function( arr ){
	var i, contentLine, bracketS, bracketE,
	valDiv = el('div', 'oru-value'),
	content = el('div', 'oru-bracket-content');

	for (i=0; i<arr.length; i+=1){
	    contentLine = oru.create(arr[i]);
	    contentLine.className += " oru-property";
	    if ( i<arr.length-1 ){
		contentLine.appendChild( el('span', 'oru-comma', ',') );
	    }
	    content.appendChild( contentLine );
	}

	bracketS = el('span', 'oru-bracket', '[');
	bracketE = el('span', 'oru-bracket', ']');

	valDiv.appendChild( bracketS );
	valDiv.appendChild(content);
	valDiv.appendChild( bracketE );

	addDimmer(bracketS, content);
	addDimmer(bracketE, content);
	return valDiv;
    };

    generators.object = function( obj ){
	var p, mapPropDiv, mapKeyDiv, mapValDiv, i=0,
	bracketS, bracketE,
	propCount = countProps( obj ),
	valDiv = el('div', 'oru-value'),
	content = el('div', 'oru-bracket-content');

	for ( p in obj ){
	    if ( obj.hasOwnProperty(p) ){
		mapKeyDiv = quotedKey(p);
		mapValDiv = el('div', 'oru-value');
		mapValDiv.appendChild(oru.create(obj[p]));
		
		mapPropDiv = el('div', 'oru-property');
		mapPropDiv.appendChild(mapKeyDiv);
		mapPropDiv.appendChild(mapValDiv);
		
		addDimmer( mapKeyDiv, mapPropDiv );

		if ( i<propCount-1 ){
		    mapPropDiv.appendChild( el('span', 'oru-comma', ',') );
		    i += 1;
		}
		content.appendChild(mapPropDiv);
	    }
	}

	bracketS = el('span', 'oru-bracket', '{');
	bracketE = el('span', 'oru-bracket', '}');

	valDiv.appendChild( bracketS );
	valDiv.appendChild(content);
	valDiv.appendChild( bracketE );

	addDimmer(bracketS, content);
	addDimmer(bracketE, content);

	return valDiv;
    };

    oru.create = function( obj ){
	var type = typeOf(obj);
	if ( generators[type] ){
	    return generators[type]( obj );
	}
	throw "No Generator for type " + type;
    };

    return oru;

}());