/* ===================================================
 * jquery-async v0.6.2
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
            //enhance .success and .error
            if(ajaxOptions.success){
                var successFunction = ajaxOptions.success;
                ajaxOptions.success=function(data){
                    successFunction(data,deferred);
                }
            }
            if(ajaxOptions.error){
                var errorFunction = ajaxOptions.error;
                ajaxOptions.error=function(jqXHR, textStatus, errorThrown){
                    errorFunction(jqXHR, textStatus, errorThrown,deferred);
                }
            }

            //construct data
            if(options.json){
                ajaxOptions.data = $.extend(ajaxOptions.data,{json:json});
            }
            if($.isFunction(options.json)){
                var json = options.json(deferred);
                if(!json){
                    deferred.reject();
                    return false;
                }
                ajaxOptions.data = $.extend(ajaxOptions.data,{json:json});
            }
            if($.isFunction(options.data)){
                ajaxOptions.data = options.data(deferred);
            }
            if($.isPlainObject(ajaxOptions.data)){
                //serialize data
                var data = '';
                var first=true;
                $.each(ajaxOptions.data,function(key,param){
                    if(!first){
                        data+='&';
                    }
                    first=false;
                    //put param in a string
                    if($.isPlainObject(param)){
                        param = JSON.stringify(param);
                    }
                    data+=key+'='+encodeURIComponent(param);
                });
                ajaxOptions.data = data;
            }
            if(ajaxOptions.data === false){
                deferred.reject();
                return;
            }

            //construct url
            if(options.url){
                if($.isFunction(options.url)){
                    ajaxOptions.url = options.url(deferred);
                }
            }
            else if(options.root){
                var params = options.params;
                if(!params)params={};
                if($.isFunction(params)) params = params(deferred);
                if(params){
                    ajaxOptions.url = createUrl(options.root,params);
                }
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

    // replace $var with params.var in root url
    //eg:
    // root: http://domain.com/api/user/$userId/$reportId/export/$name?
    // params: {userId:425,reportId:758}
    // returns - http://domain.com/api/user/425/758/export/
    function createUrl(root,params){
        var url = root;
        params = $.extend({},params);
        //replace $something with params params.something
        $.each(params,function(key,param){
            if(!param){
                if(key !== 'value'){
                    throw 'jquery-async: param undefined for key:'+key+' url is:'+url;
                }
            }
            if(url.indexOf('$'+key)<0){
                //url does not contains this param, add it as get
                if(url.indexOf('?')<0){
                    url+='?'+key+'='+param;
                }
                else{
                    url+='&'+key+'='+param;
                }
            }
            else{
                url = url.replace('$'+key+'?',param);//if optional
                url = url.replace('$'+key,param);//if not
            }
        });

        //remove all $something? from url
        url = removeOptionalParamsFromUrl(url);
        return url;
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







    