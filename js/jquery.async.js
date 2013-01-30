/* ===================================================
 * jquery-async v0.5
 * https://github.com/acavailhez/jquery-async
 * ===================================================
 * Copyright 2013 Arnaud CAVAILHEZ & Michael JAVAULT
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

jQuery.fn.async = function(async, options) {

    var $this = $(this);

    if(async === 'init'){
        var $element = $(this);
        //activate async on subelements of $elements
        //this function is nilpotent

        //every tag with a 'async-bind' attribute will be asynched
        if($element.attr('async-bind')){
            initAsync($element);
        }
        $('[async-function]',$element[0]).each(function(i,that){
            initAsync(that);
        });
        return;
    }

    if(async === 'ajax'){
        $(this).async(function(deferred){
            var ajaxOptions = $.extend({},options);
            if(ajaxOptions.success){
                var successFunction = ajaxOptions.success;
                ajaxOptions.success=function(data){
                    successFunction(data,deferred);
                }
            }
            if(ajaxOptions.error){
                var errorFunction = ajaxOptions.error;
                ajaxOptions.error=function(data){
                    errorFunction(data,deferred);
                }
            }
            if($.isFunction(options.url)){
                ajaxOptions.url = options.url(deferred);
            }
            if(ajaxOptions.url === true){
                deferred.resolve();
            }
            if(ajaxOptions.url){
                return $.ajax(ajaxOptions);
            }
            else{
                deferred.reject();
            }
        },options);
        return;
    }

    options = $.extend({bind:'click'},options);

    if(options.bind === false){
        launchAsync();
    }
    else{
        $this.bind(options.bind,launchAsync);
    }


    function launchAsync(){
        $this.loader('start');
        var deferred = $.Deferred();
        if($.isFunction(async)){
            var returned =  async(deferred);
            if (returned === true){
                $this.loader('success');
            }
            else if(returned === false){
                $this.loader('error');
            }
            else{
                //duck-check if returned is a Deferred.promise
                if(returned && returned.done && returned.fail){
                    //hook on the returned instead of deferred, but keep deferred on priority
                    var loaderLock = false;
                    returned
                        .done(function(){
                            !loaderLock&&$this.loader('success');
                        })
                        .fail(function(){
                            !loaderLock&&$this.loader('error');
                        });
                    deferred
                        .done(function(){
                            $this.loader('success');
                            loaderLock=true;
                        })
                        .fail(function(){
                            $this.loader('error');
                            loaderLock=true;
                        });
                }
                else{
                    deferred
                        .done(function(){
                            $this.loader('success');
                        })
                        .fail(function(){
                            $this.loader('error');
                        });
                }
                1
            }
        }
    }

    //init async function on an element
    function initAsync(that){
        var $element = $(that);
        //extract values from element
        var bind = $element.attr('async-bind');
        if(!bind)bind='click';
        var asyncFunction = eval($element.attr('async-function'));
        var asyncParams = eval('(' + $element.attr('async-params') + ')');

        //make the bind

        $element.async(function(deferred){
            asyncFunction(deferred,asyncParams);
        },{bind:bind});
        //remove attributes of async
        //this makes this function nilpotent
        $element.attr('async-bind',undefined);

    }

    return $this;
};

$(document).ready(function(){
    $(document).async('init');
});







    