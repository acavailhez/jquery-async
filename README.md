jQuery Async (jquery-async)
=============

jQuery Async is a library made to easily animate clickable buttons triggering asynchronous processes such as Ajax requests
This library is made on top of jQuery and Bootstrap

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
    <link href="http://twitter.github.com/bootstrap/assets/css/bootstrap-responsive.css" rel="stylesheet">
    <script src="http://code.jquery.com/jquery-1.9.0.min.js"></script>

    <link href="../css/k.loader.css" rel="stylesheet">

    <script src="../js/k.loader.js"></script>
    <script src="../js/k.async.js"></script>

</head>
<body></body>
</html>
```

A quick dive in with examples
-------------
### .click() becomes .async()

Before jquery-async, a button waiting 2 seconds to print a text would have looked like this:
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

If you want to add a progress animation to this with jquery, change the javascript to:
```javascript
	$('#my-button').async(function(deferred){
		setTimeout(function(){
			$('#hiddent-text').show();
			deferred.resolve();
			},2000);
	});
```