/*
 * PNelOP BIOS
 * Javascript BIOS Layout Loader
 *
 * Author: Gary Taylor, gary@gmerc.com
 * Version: 1.0
 * Copyright 2008 - 2012 Gary Taylor <gary@gmerc.com>
 * License GNU General Public License v3 <http://www.gnu.org/licenses/>
 ******************************************************
 *   PNelOP is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   PNelOP is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with PNelOP.  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************
*/
/*
 * Javascript Example
_layoutPacket = {
  pageLayout: 'single', // single, single_left, single_right, triple
  pageWidths: '*', // Comma Seperated (single_left: '164,*') (triple: '164,250,*' (right, left, middle))
  js: [
   '/_modules/helloworld/_views/helloworld.js'
  ],
  css: [
   '/_modules/helloworld/_views/helloworld.css'
  ],
  widgets: {
    pnelopnavbar: {
      root: 'mainPage',
      place: 'leftColumn',
      data: {},
      options: {},
      jsobject: 'helloWorld',
      id: 'helloWorld_navBar',
      process: 1,
      js: [],
      css: []
    }
  },
  options: {}
);
 *
 * Javascript Implentations 
 *  Create boot data
 *   1. create javascript Layout Packet, in this case we are using above example as _layoutPacket
 *   2. create javascript variable for boot data, eg. var bootData = {};
 *   3. add layout object as an array to boot data variable, eg. bootData = { layout: [] };
 *   4. push Layout Packet to boot data layout object array, eg. bootData.layout.push(_layoutPacket);
 *
 *
 * Plan A only works if using the pnelop backend framework
 * Plan B is used when the page first loads, view source will show the user this data, no matter what page they are on
 * Plan C is typically used to change pages, can be used for page loading in place for Plan B
 *
 * Implementation Examples / Suggestions
 * Plan A) using pnelop framework, pnelop.fetchPage(<url (optional, default: location.href)>);
 *         1. send URL to pnelop.fetchPage() after page loads eg. $.(document).ready(function() { pnelop.fetchPage(); });
 *
 * Plan B) load boot data with html, send bootData to pnelop.bootBIOS
 *         1. send boot data to the browser, using above example in script tags, eg.   
<script type="javascript">
  var bootData = { layout: [
    {
      // Layout Packet
    },
    {
      // Second Layout Packet, (Optional)
    }
  ]};
</script>
 *         2. send bootData variable to pnelop.bootBIOS.
 *         - Required to happen AFTER bootData is shown in browser.
 *         - Required AFTER page loads
 *            Plan A) by using jQuery eg.
 *              $.(document).ready(function() { pnelop.bootBIOS(bootData); });
 *            Plan B) by either placing following example inside <body> tag, eg.
 *              <!-- <script language="javascript">pnelop.bootBIOS(bootData);</script> -->
 *         
 *         
 * Plan C) using a Manual AJAX Request, sending reply to pnelop.bootBIOS
 *         1. run AJAX Request $.getJSON() works well, Reply with above boot data as JSON Encoded Object.
 *            Expected response has "Content-Type: application/json"
 *         2. send boot data response to pnelop.bootBIOS()
 *
 *
 *
 *
 *
 * PHP Example -> JSON Encode, add to GET Response in object boot data object 'layout', eg. echo json_encode($arrLayoutPackets);
$arrLayoutPackets = new Array(); // Build layout object as array for Layout Packets

// Basic PHP Layout Template
$arrLayout = new StdClass; // New Layout Package
$arrLayout->pageLayout = 'single'; // single, single_left, single_right, triple
$arrLayout->pageWidths = '*'; // Comma Seperated (single_left: '164,*') (triple: '164,*,250') 
$arrLayout->modals = array();
$arrLayout->js = array();
//  $arrLayout->js[] = $v4config->site['_modules'].'helloworld/'.$v4config->site['_view'].'helloworld.js';
  
$arrLayout->css = array();
//  $arrLayout->css[] = $v4config->site['_modules'].'helloworld/'.$v4config->site['_view'].'helloworld.css';
  
$arrLayout->widgets = new StdClass;
$arrLayout->options = new StdClass;


// PNelOP Nav Bar Widget
$pNelOP_Widget = new StdClass; // New Widget Package
$pNelOP_Widget->root = 'mainPage';
$pNelOP_Widget->place = 'leftColumn';
$pNelOP_Widget->data = new StdClass();
$pNelOP_Widget->options = new StdClass();
$pNelOP_Widget->jsobject = 'helloWorld';
$pNelOP_Widget->id = 'helloWorld_navBar';
$pNelOP_Widget->process = 1;
$pNelOP_Widget->js = array();
$pNelOP_Widget->css = array();

$arrLayout->widgets->pnelopnavbar = $pNelOP_Widget; // Add Widget Package to Layout Package

// Add Generated Layout to Layout Packets array.
// Multiple packets are accepted, push them into the Layout Packets array
$arrLayoutPackets[] = $arrLayout;
 *
 * Author: Gary Taylor, gary@gmerc.com
 * Version: 1.0 
 */

var pnelopModules = {};

var PNelOP = (function ($) {
  var _debug = 0,
  _pageIdent = '',
  _pageRole = '',
  _pagePerms = '',
  _userID = '',
  _curPage = '';
  
  // Loading Scripts Dynamically, all page scripts must be fully loaded before the page can be viewed
  var _dynamicScriptLoadingTimeout = 15000, // length to wait for all scripts to load before timeout
  _dynamicPageLoadingTimeout = 30000,
  _dynamicScriptLoadingCycleLength = 100; // length of time to wait between script load checking

  var _layoutProcessing = []; // Layout Scheme
  var _layoutProcessingTimeout = '';
  
  var _loading = [],
  _loadedScripts = [], // Holds URLs to Loaded Javascripts
  _loadedStyles = []; // Supposed to Hold URLS to Loaded Stylesheets
  
  
  
  var _scriptLoaderRunning = 0;  // Bool lock for VerifyScriptLoading function
  
  var _BIOS = {};
  
  var _curEpoch = new Date().getTime();
    // Default DOM Objects, and Utilities
  var _loadContainer = '<div id=\'pageContainer\'></div>';
  
  var _layoutMain = '<div class=\'mainPage\'><div class=\'rightColumn\'></div><div class=\'leftColumn\'></div><div class=\'mainColumn\'></div></div>';
  
  isMobile = function() {
    if (/android|iphone|ipad|blackberry|kindle|skyfire|teashark|jsme|blazer|bolt|fennec|gobrowser|iemobile|iris|maemo|minimo|netfront|series 60|teleca|uzard/.test(navigator.userAgent.toLowerCase()))
      return true;
    else
      return false;
  },
    
  setup = function() {
    
    // AJAX Setup Settings
    $.ajaxSetup({
    //  url: location.href,
      async: 'true',
      cache: 'true',
      contentType: 'application/x-www-form-urlencoded',
      timeout: '8000',
      type: 'GET',
      dataType : 'json',
      beforeSend: function(jqXHR) {
        $.xhrPool.push(jqXHR);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        if (textStatus=='error' || textStatus=='timeout' || textStatus=='parseerror') {
          rError('Ajax '+textStatus+': '+errorThrown);
        }
      },
      complete: function(jqXHR, textStatus) {
        var jqXHRPointer = $.inArray(jqXHR,$.xhrPool);

        if (jqXHRPointer>-1) {
          $.xhrPool.splice(jqXHRPointer,1);
        }
      }
    });

    // Multiple Ajax Connection Pooling Methods
    $.xhrPool = [];
    $.xhrPool.abortAll = function() {
      var jqLength = $.xhrPool.length;
      for (i=0;i<jqLength;i++) {
        try { if (!!$.xhrPool[i]) $.xhrPool[i].abort(); } catch(err) { rError('Abort Err: '+err); }
      }
      $.xhrPool.splice(0,jqLength);
    };
    
    // funQue Startup
    $.funQue = {
      _timer: null,
      _queue: [],
      add: function(fn, context, time) {
        var setTimer = function(time) {
          $.funQue._timer = setTimeout(function() {
            time = $.funQue.add();
            if ($.funQue._queue.length) {
              setTimer(time);
            }
          }, time || 2);
        }
        
        if (fn) {
          $.funQue._queue.push([fn, context, time]);
          if ($.funQue._queue.length == 1) {
            setTimer(time);
          }
          return;
        }
        
        var next = $.funQue._queue.shift();
        if (!next) {
          return 0;
        }
        next[0].call(next[1] || window);
        return next[2];
      },
      clear: function() {
        clearTimeout($.funQue._timer);
        $.funQue._queue = [];
      }
    };    
  };

  
  bootBIOS = function() {

    // Validate Incoming information
    if (arguments.length>0) { _BIOS = arguments[0]; } else { return; }
    _bootDebug('New BIOS');
    _bootDebugAll(_BIOS);
    
    // START Progress Bar
    

    // Startup Page Layout
    if ((typeof _BIOS.layout) == 'object') _bootInit(_BIOS.layout);
    
    // Attach Modals
    if ((typeof _BIOS.modals) == 'object') {
      _addModals(_BIOS.modals);
    }
    
  };
  
  setPageVars = function() {
    var _pageVars = {};
    
    // Validate Incoming information, Set Layout to Global Loading Variable
    if (arguments.length>0) { _pageVars = arguments[0]; } else { return; }
    
    if (!!_pageVars.pageIdent) { _pageIdent = _pageVars.pageIdent; } // page Ident
    if (!!_pageVars.pageRole) { _pageRole = _pageVars.pageRole;} // Users Role on this page
    if (!!_pageVars.pagePerms) { _pagePerms = _pageVars.pagePerms; } // Users Role on this page
    if (!!_pageVars.pageCur) { _curPage = _pageVars.pageCur; } // Users Role on this page
    if (!!_pageVars.pageUserID) { _userID = _pageVars.pageUserID; } // Users ID on this page
  };
  
  // Boot Starter
  _bootInit = function() {
  
    // Validate Incoming information, Set Layout to Global Loading Variable
    if (arguments.length>0) { _layoutProcessing = arguments[0]; } else { return; }
    _bootDebug('New Layout Init');  
    _bootDebugAll(_layoutProcessing);
    
    // Display Loading Pane
    
    
    //$('#pageContainer').find('.pnelopWidget').each(function() { this.hide(); });
    
    $('#pageContainer').removeAttr('id').addClass('delContainer').hide();
    $('#pageContainerLoader').removeAttr('id').addClass('delContainer').hide();

    var _tLoadContainer = $(_loadContainer).clone();
    $('body').prepend(_tLoadContainer);
    
    // Loop Layout Packets, Start loading packet scripts
    for(var i in _layoutProcessing) {

      var tLayout = _layoutProcessing[i];
      if ((typeof tLayout) != 'object') { continue; }
      
      if ((typeof tLayout._loaded) != 'number') tLayout._loaded = 0;
      if ((typeof tLayout._loadLoops) != 'number') tLayout._loadLoops = 0;
      
      if ((typeof tLayout.pageLayout) != 'string') tLayout.pageLayout = '';
      if ((typeof tLayout.pageWidths) != 'string') tLayout.pageWidths = '';
      
      if ((typeof tLayout.widgets) != 'object') tLayout.widgets = {};
      
      if ((typeof tLayout.js) != 'object') tLayout.js = [];
      if ((typeof tLayout.css) != 'object') tLayout.css = [];
            
      // Build Packet Layout Structure For Widgets
      if (tLayout.pageLayout != '')
        _tLoadContainer.append(_createDisplayLayout(tLayout.pageLayout,tLayout.pageWidths));
      
      
      // Setup System Loop Count, Start Epoch
      tLayout._loadLoops = 0;
      tLayout._loadStart = _curEpoch;
    
      _loadScripts(tLayout); // Load Required Scripts
      
      
      // Widget Processing
      var _process = 0;
      var _objects_processed = 0;
      var _objects_total = Object.keys(tLayout.widgets).length;   
    
      // Setup Processing Priorites
        while (_objects_total>_objects_processed && _process<25) { // max object lvl
      
          // Add Widget to _widgetsProcess array
          for(var io in tLayout.widgets) {
            
            var tWidget = tLayout.widgets[io];
          
            if ((typeof tWidget) != 'object') continue;

            if ((typeof tWidget.process) != 'number') tWidget.process = 0;
            if ((typeof tWidget._loaded) != 'number') tWidget._loaded = 0;
            if ((typeof tWidget._loadLoops) != 'number') tWidget._loadLoops = 0;

            if ((typeof tWidget.js) != 'object') tWidget.js = [];
            if ((typeof tWidget.css) != 'object') tWidget.css = [];      
            
            // Check if Match of Priority
            if (tWidget.process != 0 && _process != tWidget.process) { continue; } // Never Continue on First Match, case of undefined process
          
            // Setup System Loop Count, Start Epoch
            tWidget._loadLoops = 0;
            tWidget._loadStart = _curEpoch;
        
            // Setup Default Loop Timeout  
            if ((typeof tWidget._loadTimeout) == 'undefined')
              tWidget._loadTimeout = _dynamicScriptLoadingTimeout;  
             
            _bootDebug('Load Widget Scripts: '+io);
            _bootDebug(tWidget);
            _loadScripts(tWidget); // Load Required Scripts for Widget
  


            // Setup Placemarker on page for Widget

            // Find page container
            if (
              (typeof tWidget.root) == 'object'
             &&
              (typeof tWidget.root[0].tagName) != 'undefined'
            ) _widgetContainer = tWidget.root;
            else if (
              (typeof tWidget.place) == 'object'
             &&
              (typeof tWidget.place[0].tagName) != 'undefined'
            ) _widgetContainer = tWidget.place;
            else if (
              (typeof tWidget.root) == 'string'
             &&
              (typeof tWidget.place) == 'string'
             &&
              (typeof _tLoadContainer.find(tWidget.root).last().find(tWidget.place).last()[0].tagName) != 'undefined'
            ) _widgetContainer = _tLoadContainer.find(tWidget.root).last().find(tWidget.place).last();
            else if (
              (typeof tWidget.root) == 'string'
             &&
              (typeof tWidget.place) == 'string'
             &&
              (typeof $(tWidget.root).last().find(tWidget.place).last()[0].tagName) != 'undefined'
            ) _widgetContainer = $(tWidget.root).last().find(tWidget.place).last();
            else if (
              (typeof tWidget.root) == 'string'
             &&
              (typeof _tLoadContainer.find(tWidget.root).last()[0].tagName) != 'undefined'
            ) _widgetContainer = _tLoadContainer.find(tWidget.root).last();
            else if (
              (typeof tWidget.root) == 'string'
             &&
              (typeof $(tWidget.root).last()[0].tagName) != 'undefined'
            ) _widgetContainer = $(tWidget.root).last();
            else if (
              (typeof tWidget.place) == 'string'
             &&
              (typeof _tLoadContainer.find(tWidget.place).last()[0].tagName) != 'undefined'
            ) _widgetContainer = _tLoadContainer.find(tWidget.place).last();
            else if (
              (typeof tWidget.place) == 'string'
             &&
              (typeof $(tWidget.root).last()[0].tagName) != 'undefined'
            ) _widgetContainer = $(tWidget.root).last();
            else if (
              (typeof tWidget.root) == 'string'
             &&
              (typeof _tLoadContainer[0].tagName) != 'undefined'
            ) _widgetContainer = _tLoadContainer;
            else if (
              (typeof $('#pageContainer')) != 'undefined'
            ) _widgetContainer = $('#pageContainer');
            else _widgetContainer = $('body');
            
                        
            
            // Find Previos Widget Container, or Build new Placemarker
            var _widgetPlacemarker = $("<p></p>");
            
            if ((typeof io) == 'string' && io != '') // Search by unique ident
              if (!!$('#'+io) && !!$('#'+io).length && $('#'+io).hasClass('pneloploaded')) {
                _widgetPlacemarker = $('#'+io).detach();
                tWidget._loaded = 2;
                tWidget._moved = true;
              } else {
                _widgetPlacemarker = $('<p id=\''+io+'\'></p>');
              }
            else if ((typeof tWidget.id) == 'string' && tWidget.id != '') // Search by id
              if (!!$('#'+tWidget.id) && !!$('#'+tWidget.id).length && $('#'+tWidget.id).hasClass('pneloploaded')) {
                _widgetPlacemarker = $('#'+tWidget.id).detach();
                tWidget._loaded = 2;
                tWidget._moved = true;
              } else {
                _widgetPlacemarker = $('<p id=\''+tWidget.id+'\'></p>');
              }

            // Append Widget Container to Page Container        
            _widgetPlacemarker.appendTo(_widgetContainer); // Append Widget to Page
        
            if (tWidget._moved && (typeof pnelopModules[tWidget.jsobject]._moved) == 'function')
              pnelopModules[tWidget.jsobject]._moved(tWidget,_widgetPlacemarker);
              
            // Tick Objects Processed
            _objects_processed++;
        
          } // end layout packet loop
        
          // Ticket Process Priority
          _process++;
        } // end process priorities
      
    }
    
    // Start integrity checking widgets and packet layouts for loaded javascript / css
    _startScriptVerify();

  };

  _loadScripts = function() {

    var _layoutObj;
    
    // Validate Incoming information, Set Layout to Global Loading Variable
    if (arguments.length>0) { _layoutObj = arguments[0]; } else { return; }

    // CSS
    if (!!_layoutObj.css && _layoutObj.css.length)
      for (var ic in _layoutObj.css)
        if ($.inArray(_layoutObj.css[ic],_loadedStyles)==-1) {
          $(_loadedStyles).push(_layoutObj.css[ic]);
              
          _bootDebug('Loading Stylesheet: '+_layoutObj.css[ic]);
          // Start Style Fetching Process
          $('head').append($('<link rel="stylesheet" type="text/css" href="'+_layoutObj.css[ic]+'" />').ready(function() {
            // Detect and Clean Loaded Stylesheets
            // TODO
            _bootDebug('Stylesheet Loaded');
            _bootDebugAll(this);
          }));
        }
       
       
        
    _bootDebug('Loading Packet: ');_bootDebug(_layoutObj);
    _bootDebug('Loading JS: ');_bootDebug(_layoutObj.js);
    // JS
    if (!!_layoutObj.js) {
      $.each($(_layoutObj.js), function(i, s) {
        _bootDebug('Loading File: '+s);
        _loadScript(s);
      });
    }

        
      
  };
  
  _loadScript = function() {

    var _layoutScript;
    
    // Validate Incoming information, Set Layout to Global Loading Variable
    if (arguments.length>0) { _layoutScript = arguments[0]; } else { return; }
    
    _bootDebug('Is Script: '+_layoutScript+' Loaded? '+$.inArray(_layoutScript,_loadedScripts));
    if ($.inArray(_layoutScript,_loadedScripts) == -1) {

      _bootDebug('Requesting JS: '+_layoutScript);
      _loadedScripts.push(_layoutScript);
      _loading.push(_layoutScript);
      
      
// Start Script Fetching Process
          $.ajax({
            type: "GET",
            url: _layoutScript,
            dataType: "script",
            success: function(data, textStatus, jqXHR) {
              var _tURL = this.url;
              _bootDebug('Loaded JS: '+_tURL); 

              // Clean Object _loading
              _cleanSplice(_loading,_tURL);
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
              var _tURL = this.url;
            
              _bootDebug('Failed Loading JS: '+_tURL);
              if (_debug > 0) alert("Failed Loading Javascript: "+_tURL+"\n"+textStatus+"\n\n"+errorThrown);
            },
            complete: function(jqXHR, textStatus) {
              var _tURL = this.url;
            
              _bootDebug('Cleaning JS: '+_tURL);              
              _cleanLayoutProcessingScripts(_tURL);
            }
                  
          });
          
          /*          
          // Start Script Fetching Process
          $.getScript(_layoutScript,function() {
            var tURL = this.url;
            
            _bootDebug('Loaded JS: '+tURL);
            _cleanLayoutProcessingScripts(tURL);

          });
          */
      } else {
     
        _bootDebug('Already Loaded: '+_layoutScript);
        if ((typeof _loading) == 'object' && _loading.indexOf(_layoutScript) == -1)
          _cleanLayoutProcessingScripts(_layoutScript);
        
      }
    
  };
  
  _cleanSplice = function() {
    var _layoutObject,
    _layoutScript;
        
    // Validate Incoming information, Set Layout to Global Loading Variable
    if (arguments.length>0 && (typeof arguments[0]) == 'object') { _layoutObject = arguments[0]; } else { return; }
    if (arguments.length>1 && (typeof arguments[1]) == 'string') { _layoutScript = arguments[1]; } else { return; }
    
    while ((typeof _layoutObject) == 'object' && _layoutObject.length > 0 && _layoutObject.indexOf(_layoutScript) !== -1) {
      _layoutObject.splice(_layoutObject.indexOf(_layoutScript), 1);
    }

  };
  
  _cleanLayoutProcessingScripts = function() {
    var _tURL;
    
    // Validate Incoming information, Set Layout to Global Loading Variable
    if (arguments.length>0) { _tURL = arguments[0]; } else { return; }

    for (var ilp in _layoutProcessing) {
      // Clean Packet JS Object
      _cleanSplice(_layoutProcessing[ilp].js,_tURL);
      
      // Clean Widget JS Object
      for (var ilpo in _layoutProcessing[ilp].widgets) {
        _cleanSplice(_layoutProcessing[ilp].widgets[ilpo].js,_tURL);
      }
    }
    
  };
  
  _startScriptVerify = function() {
  
    if (_scriptLoaderRunning == 1) {
      clearTimeout(_layoutProcessingTimeout);
      _scriptLoaderRunning = 0;
    }  
  
    if ((typeof _layoutProcessing) == 'object') {
      _scriptLoaderRunning = 1;
      _verifyScriptLoading();
    }
  };
  

  _verifyScriptLoading = function() {
    _bootDebug('Verify Script Loading');
    _bootDebugAll(_layoutProcessing);
    _bootDebugAll(_loading);
    
    // Timeout between Verifications
    var sTimeout = ((typeof _dynamicScriptLoadingCycleLength) == 'number') ? _dynamicScriptLoadingCycleLength : 500;
    var needsProcessing = 0;
  
    // Check For anything to process
    if ((typeof _layoutProcessing) == undefined || !_layoutProcessing.length) {
      _bootDebug('Running Away');
      _scriptLoaderRunning = 0;
      return;
    }
    
  
    // Loop Layout Packets
    for(var i in _layoutProcessing) {
      
      var needsLayoutProcessing = 0;
      
      var tLayout = _layoutProcessing[i];  
      
      if ((typeof tLayout) != 'object') { continue; }

      if ((typeof tLayout._loaded) != 'number') tLayout._loaded = 0;
      if ((typeof tLayout._moved) != 'boolean') tLayout._moved = false;
      if ((typeof tLayout._loadLoops) != 'number') tLayout._loadLoops = 0;
      
      if ((typeof tLayout.widgets) != 'object') tLayout.widgets = {};
      
      if ((typeof tLayout.js) != 'object') tLayout.js = [];
      if ((typeof tLayout.css) != 'object') tLayout.css = [];
          
      
      // Increase Packet Loop Cnt
      tLayout._loadLoops++;
      
      // Loop Widgets
        for(var io in tLayout.widgets) { 
                
          var tWidget = tLayout.widgets[io];
          
          if ((typeof tWidget) != 'object') continue;
          
          if ((typeof tWidget._loaded) != 'number') tWidget._loaded = 0;
          if ((typeof tWidget._moved) != 'boolean') tWidget._moved = false;
          if ((typeof tWidget._loadLoops) != 'number') tWidget._loadLoops = 0;

          if ((typeof tWidget.js) != 'object') tWidget.js = [];
          if ((typeof tWidget.css) != 'object') tWidget.css = [];
          
          
          // Increase Loop Count For Widget
          tWidget._loadLoops++;
          
    
          // Boot Widget when Pre-Reqs are Complete
          if (
            // Widget Not Already Loaded
            tWidget._loaded == 0
           && // Layout Packet Has No JS to Load
            !tLayout.js.length
           &&  // Widget Has No JS to Load
            !tWidget.js.length
          ) {
            _bootDebug('Loading: '+io);
            tWidget._loaded = 1;
            _bootWidget(tWidget, $('#'+io));
          }
          
          if (
            tWidget._loaded == 0
           &&
            tWidget._loadLoops > Math.floor(_dynamicScriptLoadingTimeout/sTimeout)
          ) tWidget._loaded = -1; // Set Widget To _loaded to Error (3)
          
          _bootDebug('Widget '+tWidget.jsobject+' : '+tWidget.id+' Loaded: '+tWidget._loaded);
          
          if (tWidget._loaded == 0) {
            needsProcessing = 1; // Widget isn't Loaded or Timed Out
            needsLayoutProcessing = 1;
          }
          
        }



      // No Layout Processing Widgets Left, Set Layout as Loaded
      if (needsLayoutProcessing == 0) tLayout._loaded = 1;
      
      
      if (
        tLayout._loaded == 0
       &&
        tLayout._loadLoops > Math.floor(_dynamicPageLoadingTimeout/sTimeout)
      ) tLayout._loaded = 3; // Set Layout To _loaded to Error (3)

      if (tLayout._loaded == 0) needsProcessing = 1;
    
    }
  
    if (needsProcessing == 1) {
      _layoutProcessingTimeout = setTimeout(function() { _verifyScriptLoading(); }, sTimeout);
    } else {
      _bootDebug('Done Loading Scripts');
      _bootDebug('Layout Processing:');
      _bootDebug(_layoutProcessing);
      _bootDebug('Loaded Scripts');
      _bootDebug(_loadedScripts);
      _bootDebug('Failed Scripts');
      _bootDebug(_loading);  
      _scriptLoaderRunning = 0;
      _bootPost();
    }
  };

  _bootPost = function() {
    
    $('.delContainer').each(function() { $(this).remove(); });
    
    // Setup pushLinks
    try { pnelop_html5.loadPushLinks(); } catch(e) { }
       
    // STOP Progress Bar
  };
  
  _bootPageTitle = function() {
    var pTitle = document.title;
    if (arguments.length>0) { pTitle = arguments[0]; } else { return; }
    
    // Set page Title
    if (!!bootLayout.pageTitle) { document.title = pTitle; } 
  };
  
  _createDisplayLayout = function() {
    var _layoutStyle = 'none',
    _layoutWidths = '';
    
    if (arguments.length>0 && arguments[0] != undefined) { _layoutStyle = arguments[0]; }
    if (arguments.length>1 && arguments[1] != undefined) { _layoutWidths = arguments[1]; }
      
    var _layout = $(_layoutMain).clone();
      
    var _layoutW, _layoutD;
    if (_layoutStyle=='single' || _layoutStyle=='single_left') { _layout.find('.rightColumn').remove(); }
    if (_layoutStyle=='single' || _layoutStyle=='single_right') { _layout.find('.leftColumn').remove(); }     
    
    if (!!_layoutWidths) {
     
      if (_layoutWidths.indexOf(',')!=-1)
        _layoutW = _layoutWidths.split(',');
      else
        _layoutW = new Array(_layoutWidths); 
      
      _layoutD = _layout.children('div').length;
      for(_layoutI=0;_layoutI<_layoutD;_layoutI++)
        if (!!_layoutW[_layoutI] && _layoutW[_layoutI]!='*') { _layout.children('div').eq(_layoutI).css('width',_layoutW[_layoutI]); }
          
    }
    
    
    return _layout;
  };


  _bootWidget = function() {
    var tWidget,
    tContainer = 'body',
    tIdent;


    if (arguments.length>0) { tWidget = arguments[0]; } else { return; }
    if (arguments.length>1) { tContainer = arguments[1]; }
    if (arguments.length>2) { tIdent = arguments[2]; }
    
    if ((typeof tWidget) != 'object') { return; }
    if ((typeof tContainer) != 'object') {
      if ((typeof $('body').find(tContainer)) == 'object') tContainer = $('body').find(tContainer);
    }
    if ((typeof tIdent) != 'string') tIdent = '';
    
    _bootDebug('Boot Widget: '+tIdent+' in Container: '+tContainer);
    
    if ((typeof tWidget.jsobject) != 'string') tWidget.jsobject = '';
    if ((typeof tWidget.id) != 'string') tWidget.id = '';
    
    if ((typeof pnelopModules) != 'object') { _bootError('No pnelopModules Found, Missing JS Module File?'); return; }
    if ((typeof pnelopModules[tWidget.jsobject]) != 'object') { _bootError('No Reference for '+tWidget.jsobject+' Found in pnelopModules'); return; }

    if ((typeof pnelopModules[tWidget.jsobject].processObject) == 'function')
      pnelopModules[tWidget.jsobject].processObject(tWidget,tContainer);
        
    if ((typeof pnelopModules[tWidget.jsobject]._init) == 'function')
        pnelopModules[tWidget.jsobject]._init(tWidget,tContainer);
   
    tContainer.addClass('pneloploaded');
    tWidget._loaded = 2;
  };


  _bootDisplayModals = function() {
    var _layoutObj;
    if (arguments.length>1) { i = arguments[0]; io = arguments[1]; } else { return; }
  
    // Load Modal Frames
    if (_layoutObj['modals'] && _layoutObj['modals'].length) {
      // run modal list thru each loaded module
      for (i in _layoutObj['modals'])
        for (obm in pnelopModules)
          if (pnelopModules[obm].processModal) pnelopModules[obm].processModal(_layoutObj['modals'][i]);

      // Fetch Modal List
      if (grabModals.length) {
        //$.funQue.add(function() { fetchModals(grabModals); }, this);
        grabModals = [];
      }
    }
  };
  
  _addModals = function(_modals) {
    var modals;
    if (arguments.length>0) { _modals = arguments[0]; } else { return; }
  
    for(i in _modals) {
      $('#modalWindows').append(_modals[i]['data']);
    }
  };    
  
  _bootDebug = function() {
    if (!_debug) return; // No Booter Debugging
    var err = '';
    if (arguments.length>0) { err = arguments[0]; }
    
    try { console.log(err) } catch (e) { /*alert(s);*/ }
  };
  _bootDebugAll = function() {
    if (!_debug || _debug < 2) return; // No Booter Debugging
    var err = '';
    if (arguments.length>0) { err = arguments[0]; }
    
    try { console.log(err) } catch (e) { /*alert(s);*/ }
  };
  _bootError = function() {
    var err = '',
    ee = '';
    
    if (arguments.length>0) { err = arguments[0]; }
    if (arguments.length>1) { ee = arguments[1]; }
    
    try { console.log('BOOT ERROR'); if (!!err) console.log(err); if (!!ee) console.log(ee.message); } catch (e) { /*alert(s);*/ }
  };
  
  return parent;  
  
}(jQuery));
var $P = PNelOP;
$P.setup(); // Setup PNelOP