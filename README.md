jQuery Async (jquery-async)
=============

jQuery Async is a library made to easily animate clickable buttons triggering asynchronous processes such as Ajax requests
This library is made on top of jQuery and Bootstrap

Demo page
-------------
<a href="http://acavailhez.github.com/jquery-async/demo.html" target="_new">Go to the demo page</a>

Installation
-------------
Here is a simple HTML with jQuery and jQuery Async installed:

```html
<!doctype html>
<html lang="en">
<head>
    <title>Simple jquery-async page</title>

    <link href="http://twitter.github.com/bootstrap/assets/css/bootstrap.css" rel="stylesheet">
    <link href="http://twitter.github.com/bootstrap/assets/css/bootstrap-responsive.css" rel="stylesheet">
    <script src="http://code.jquery.com/jquery-1.9.0.min.js"></script>

    <link href="../css/k.loader.css" rel="stylesheet">

    <script src="../js/jquery.loader.js"></script>
    <script src="../js/jquery.async.js"></script>

</head>
<body></body>
</html>
```

A quick dive in with examples
-------------

### .click() becomes .async()

If you want to have a button waiting 2 seconds to show a text, here is how you can do (without jquery-async):
```html
	<a id="my-button">Click me</a>
	<div id="hidden-text" style="display:none;">Surprise!</div>
```
```javascript
	$('#my-button').click(function(){
		setTimeout(function(){
			$('#hiddent-text').show();
		},2000);
	});
```

If you want to add a progress animation to this with jquery-async, change the javascript to:
```javascript
	$('#my-button').async(function(deferred){
		setTimeout(function(){
			$('#hiddent-text').show();
			deferred.resolve();
		},2000);
	});
```
`$.async()` takes a function as a first parameter, which is passed a `$.Deferred` that you can either `.resolve()` or `.reject()`
When the `deferred` object is resolved or rejected, the animation on the button will stop and turn either green or red. The button becomes clickable again.


### Embed params in the HTML

Sometimes your javascript function is in a pre-compiled file and cannot have access to page-scoped params.
You can embed those params directly in your button's attributes, while you construct the page:
```html
	<a async-function="doSomethingWithUserId" async-params="{userId:1452}"> Do something with User Name </a>
```
```javascript
	function doSomethingWithUserId(deferred,params){
	    var userId = params.userId;
	    //do something with userId
	    deferred.resolve();
	}
```

### Bind the function and loading animation on a different event

You may want to trigger the function on 'change' instead of 'click'.
Here is how to do it in html:
```html
	<a async-bind="change" async-function="doSomethingWithUserId" async-params="{userId:1452}"> Do something with User Name </a>
```
and javascript:
```javascript
	$('#my-button').async(function(deferred){
    		setTimeout(function(){
    			$('#hiddent-text').show();
    			deferred.resolve();
    		},2000);
    	},
    	{
    	    bind:'change'
    	});
```

License
-------------

This library is distributed under the Apache License,
Use it for your personal or commercial projects.