/* ===================================================
 * jquery-loader v1.2
 * https://github.com/acavailhez/jquery-async
 * ===================================================
 * Copyright 2013 Arnaud CAVAILHEZ & Michael JAVAULT
 *
 * JQuery loader works great in combination with Twitter Bootstrap
 * http://twitter.github.com/bootstrap/
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

jQuery.fn.loader = function(data) {
    var $this = this;
    if(data === 'start'){
        start($this);
    }
    if(data === 'stop'){
        stop($this);
    }
    if(data === 'success'){
        success($this);
    }
    if(data === 'error'){
        error($this);
    }

    function start($this){

        $this.addClass('disabled');

        var loadingText='moving bits';
        if($this.attr('loading-text')){
            loadingText = $this.attr('loading-text')
        }

        var width = $this.outerWidth();
        var height = $this.outerHeight();
        var zIndex = $this.css('z-index');

        if(width<80){
            loadingText='';
        }
        else if(width<80){
            loadingText='wait';
        }
        if(!$this.css('position') || $this.css('position') === 'static'){
            $this.css('position','relative');
        }

        var $loader = $('<div class="kloader">'+loadingText+'</div>');

        //load defaut style
        $loader.css('position','absolute');
        $loader.css('background-color','rgba(240,240,240,0.6)');
        $loader.css('text-align','center');
        $loader.css('overflow','hidden');
        $loader.css('color','#000');
        $loader.css('font-weight','bold');
        $loader.css('font-size','12px');
        $loader.css('z-index',zIndex+1);

        $loader.css('width',width);
        $loader.css('height',height);
        $loader.css('line-height',height+'px');
        $loader.css('color','black');

        if($this.is('input') || $this.is('select') ){
            $loader.css('top',$this.position().top);
            $loader.css('left',$this.position().left);
            $this.after($loader);
        }else{
            $loader.css('top','-'+$this.css('border-top-width'));
            $loader.css('left','-'+$this.css('border-left-width'));
            $this.append($loader);
        }
        $this.data('loader',$loader);
        $loader.loading=true;
        animateHellip($loader);
    }

    function stop($this){
        $this.removeClass("disabled");

        var $loader =  $this.data('loader');

        if($loader){
            delete $this.loaderDiv;
            $loader.fadeOut(function(){
                $loader.remove();
            });
        }
    }

    function success($this){
        var $loader =  $this.data('loader');
        if($loader){
            var $loader = $this.data('loader');
            $loader.loading=false;
            var txt = 'success !';
            if($loader.width()<64){
                txt='';
            }
            $loader.html('<i class="icon-ok"></i> '+txt);
            $loader.css('color','#468847');
            $loader.css('background-color','#DFF0D8');
            setTimeout(function(){
                $this.loader('stop');
            },800);
        }
    }

    function error($this){
        var $loader =  $this.data('loader');
        if($loader){
            $loader.loading=false;
            var txt = 'error :(';
            if($loader.width()<64){
                txt='';
            }
            $loader.html('<i class="icon-remove"></i> '+txt);
            $loader.css('color','#B94A48');
            $loader.css('background-color','#F2BEBE');
            $this.addClass('btn-error');

            setTimeout(function(){
                $this.loader('stop');
            },800);
        }
    }

    function animateHellip($loader){
        if(!$loader.loading)return;
        var txt = $loader.html();
        if(txt.lastIndexOf('...') === txt.length-3){
            $loader.html(txt.substring(0,txt.length-3));
        }
        else{
            $loader.html(txt+'.');
        }
        setTimeout(function(){
            animateHellip($loader);
        },500);
    }

    return $this;
}