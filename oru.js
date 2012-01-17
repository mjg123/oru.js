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

	if ( /^(https?:\/\/[\S]+)$/.test(txt) ) {
	    a = el('a', 'oru-value-string', txt);
	    a.href = txt;
	    span.appendChild(a);
	} else {
	    span.appendChild(el('span', '', txt));
	}

	span.appendChild( el('span', 'oru-key-quote', '"') );
	return span;
    };

    generators.number = function( num ){
	return el('span', 'oru-value-number', num.toString() );
    };

    generators.boolean = function( b ){
	return el('span', 'oru-value-boolean', b.toString() );
    };

    generators["null"] = function(){
	return el('span', 'oru-value-null', 'null');
    };

    generators["undefined"] = function(){
	return el('span', 'oru-value-undefined', 'undefined');
    };

    generators.array = function( arr, depth ){
	var i, contentLine, bracketS, bracketE, foldfn, isFolded=false,
	valDiv = el('div', 'oru-value'),
	brax = el('span'),
	content = el('div', 'oru-bracket-content'),
	folded = el('span', 'oru-bracket-folded oru-finger', "~~~" + arr.length + " item" + (arr.length>1?"s":"") +  "~~~");
	
	for (i=0; i<arr.length; i+=1){
	    contentLine = oru.create(arr[i], depth);
	    contentLine.className += " oru-property";
	    if ( i<arr.length-1 ){
		contentLine.appendChild( el('span', 'oru-comma', ',') );
	    }
	    content.appendChild( contentLine );
	}

	bracketS = el('span', 'oru-bracket oru-finger', '[');
	bracketE = el('span', 'oru-bracket oru-finger', ']');
	
	valDiv.appendChild( bracketS );
	brax.appendChild( content );
	valDiv.appendChild( brax );
	valDiv.appendChild( bracketE );

	addDimmer(bracketS, content);
	addDimmer(bracketE, content);

	foldfn = function(){
	    if ( isFolded ){
		brax.removeChild(folded);
		brax.appendChild(content);
	    } else {
		brax.removeChild(content);
		brax.appendChild(folded);
	    }
	    isFolded = !isFolded;
	};

	bracketS.onclick = foldfn;
	folded.onclick = foldfn;
	bracketE.onclick = foldfn;

	if (depth <= 0){
	    foldfn();
	}

	return valDiv;
    };

    generators.object = function( obj, depth ){
	var p, mapPropDiv, mapKeyDiv, mapValDiv, i=0, isFolded=false, foldfn,
	brax = el('span'),
	cp = countProps(obj),
	folded = el('span', 'oru-bracket-folded oru-finger', "~~~" + cp + " propert" + (cp>1?"ies":"y") +  "~~~"),
	bracketS, bracketE,
	propCount = countProps( obj ),
	valDiv = el('div', 'oru-value'),
	content = el('div', 'oru-bracket-content');

	for ( p in obj ){
	    if ( obj.hasOwnProperty(p) ){
		mapKeyDiv = quotedKey(p);
		mapValDiv = el('div', 'oru-value');
		mapValDiv.appendChild(oru.create(obj[p], depth));
		
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

	bracketS = el('span', 'oru-bracket oru-finger', '{');
	bracketE = el('span', 'oru-bracket oru-finger', '}');

	valDiv.appendChild( bracketS );
	brax.appendChild(content);
	valDiv.appendChild(brax);
	valDiv.appendChild( bracketE );

	addDimmer(bracketS, content);
	addDimmer(bracketE, content);

	foldfn = function(){
	    if ( isFolded ){
		brax.removeChild(folded);
		brax.appendChild(content);
	    } else {
		brax.removeChild(content);
		brax.appendChild(folded);
	    }
	    isFolded = !isFolded;
	};

	bracketS.onclick = foldfn;
	folded.onclick = foldfn;
	bracketE.onclick = foldfn;

	if ( depth <= 0 ){
	    foldfn();
	}

	return valDiv;
    };

    oru.create = function( obj, depth ){
	depth = (typeof depth === "number" ? depth : 3);
	var type = typeOf(obj);
	if ( generators[type] ){
	    return generators[type]( obj, depth-1 );
	}
	throw "No Generator for type " + type;
    };

    return oru;

}());