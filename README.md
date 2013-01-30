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

    <script src="../js/k.loader.js"></script>
    <script src="../js/k.async.js"></script>

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


### Link an ajax request to a asynchronous button

Most of asynchronous processes are ajax, so jquery-async drops the unuseful function calling and bundles everything in one single call:
```javascript
	$('#my-button').async('ajax',{
        type:'POST',
        url:'http://your_domain.com/your_request'
	});
```
An `$.ajax()` call is automatically made with the params, and the success of the call triggers the end animation of the button

You can still intercept the `success` of the ajax, with the `deferred` params:
```javascript
	$('#my-button').async('ajax',{
        type:'POST',
        dataType:'jsonp',
        url:'http://your_domain.com/your_request',
        success:function(json,deferred){
            //check if everything was allright
            if(json.everything_worked){
                deferred.resolve();
            }
            else{
                //something went wrong
                deferred.reject();
            }
        }
	});
```
The ajax call was still successful and returned a JSON, but the button will turn red

You can also construct the url with a function, and raise error while validating input:
```javascript
	$('#my-button').async('ajax',{
        type:'POST',
        url:function(deferred){
            var inputValue = $('#input').val();
            if(!$.isNumeric(inputValue)){
                return false;
            }
            return 'http://your_domain.com/your_request?number='+inputValue;
        }
	});
```
If the `url` param is a function, it can either return `false` or a `String`. The ajax call will not be made if the function returns `false`
The `data` params can also be a function returning a `String` or `false`.


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

License
-------------

This library is distributed under the Apache License,
Use it for your personal or commercial projects.