#ORU.js

JavaScript for pretty-printing JSON objects in the DOM.

Live demo: http://mjg123.github.com/oru.js/

## How can I...

You need to include oru.js on your page.  Now there is a new global called `ORU` which has a single function:

```javascript
    // Pass in an object
    var e = ORU.create( obj );

    // Get back a DOM element
    document.body.appendChild( e );
```

`create` takes an optional second argument, a number which sets the level at which arrays and objects are folded.  This is useful if your object is large.  The default value is 4.
