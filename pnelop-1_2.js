/*
 * PNelOP BIOS
 * Javascript BIOS Layout Loader
 *
 * Author: Gary Taylor, gary@gmerc.com
 * Version: 1.2
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
loadContainer(); // Returns jQuery html div object #pageContainer
layoutMain(); // Returns html for basic three column setup. #mainPage -> #rightColumn, #leftColumn, #mainColumn


setup(); // Runs Automatically

// Widget Setup
bootLayout(layoutPacket); // Boots Entire layout Scheme
bootWidgets(widgetPackets) // Boots Multiple Widgets at once
bootWidget(widgetPacket,widgetIdenty,widgetPlaceMarker); // Boots a Single Widget
nukeWidget(widgetIdenty,(bool false)RemovePlaceHolder,(bool true)RemoveCacheData); // Unload a Single Widget

// _navLinks .. Runs Specific Actions on URL state
// url - http://google.com/ full url
// action - runs when initiated
// clean - runs when nuked
bootLink(link url, action function(), [clean function()]); returns linkID
nukeLink(linkID); 

// Loads Javascript
bootScript(url);

// Loads CSS
bootCSS(url);
// UnLoads CSS
nukeCSS(url);

// Function Queue, add to next in list as processes are available
$.funQue.add(function() { }, this);

// Aborts all ajaxify calls
$.xhrPool.abortAll();

// Binds HTML5 History click to Selector Links.
// Note: It unbinds any previous click events
loadLinks(Selector);

// Grab Page, and Update URL History
pushURL(url);
// Grab Page
fetchPage(url):




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
      placeMarker: '#leftColumn',
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
$pNelOP_Widget->placeMarker = '#leftColumn';
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
*/

var PNelOP = (function ($) {
  version = '1.2';
  
  var _navLinks = {};
  var _widgetModules = {} // Object Routines for Widgets
  , _widgetCache = {}; // PNelOP Widget Layout Schemes
  
  widgetCache = {}; // User Accessable Widget Cache
  
  var _debug = 0;
  
  var _html5User = false;
    
  // Loading Scripts Dynamically, all page scripts must be fully loaded before the page can be viewed
  var _dynamicScriptLoadingTimeout = 15000, // length to wait for all scripts to load before timeout
  _dynamicScriptLoadingCycleStart = 100, // length of time to wait between script load checking
  _dynamicScriptLoadRetries = 3;
  
  var _loading = [], // Holds URLs for Javascripts Waiting to Finish Loading
  _loadedScripts = [], // Holds URLs to Loaded Javascripts
  _failedScripts = [], // Holds URLS to Failed Javascripts
  _loadedStyles = []; // Supposed to Hold URLS to Loaded Stylesheets
  
  
  
  var _curEpoch = new Date().getTime();
  
  // Default DOM Objects, and Utilities
  loadContainer = '<div class=\'pageContainer\'></div>';
  layoutMain = '<div class=\'mainPage\'><div class=\'rightColumn\'></div><div class=\'leftColumn\'></div><div class=\'mainColumn\'></div></div>';
  
  isMobile = function() {
    if (/android|iphone|ipad|blackberry|kindle|skyfire|teashark|jsme|blazer|bolt|fennec|gobrowser|iemobile|iris|maemo|minimo|netfront|series 60|teleca|uzard/.test(navigator.userAgent.toLowerCase()))
      return true;
    else
      return false;
  };
      
  // Library Setup
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
          _bootDebug('Ajax '+textStatus+': '+errorThrown);
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
        try { if (!!$.xhrPool[i]) $.xhrPool[i].abort(); } catch(err) { _bootDebug('Abort Err: '+err); }
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
    
    // PNelOP HTML 5 History
    pnelop_history._init();  
  };
    
  bootModule = function() {
    var _modID, _modFunc, _forceLoad = false;

    if (arguments.length>0 && (typeof arguments[0]) == 'string') { _modID = arguments[0]; } else { return; }
    if (arguments.length>1 && ((typeof arguments[1]) == 'function' || (typeof arguments[1]) == 'object')) { _modFunc = arguments[1]; } else { return; }
    if (arguments.length>1 && (typeof arguments[2]) == 'boolean') { _forceLoad = arguments[2]; }
    
    // Enforce this.protect = true;
    if ((typeof _widgetModules[_modID]) == 'object' && (typeof _widgetModules[_modID].protect) == 'boolean' && !!_widgetModules[_modID].protect)
      _forceLoad = false;
    
    if ((!!_forceLoad || (typeof _widgetModules[_modID]) == 'undefined') && (typeof _modFunc) == 'object')
    _widgetModules[_modID] = _modFunc;
      
  return _modID;
  };
  
  bootLink = function() {
    var _link, _actions, _clean, _navID;
    if (arguments.length>0 && (typeof arguments[0]) == 'string') { _link = arguments[0]; } else { return; }
    if (arguments.length>1 && (typeof arguments[1]) == 'function') { _actions = arguments[1]; } else { return; }
    if (arguments.length>2 && (typeof arguments[2]) == 'function') { _clean = arguments[2]; }
    _navID = Math.random().toString(36).substring(7);
    _navLinks[_navID] = {link: _link, action: _actions, clean: _clean};
    return _navID;
  };
  
  nukeLink = function() {
    var _navID;
    if (arguments.length>0 && (typeof arguments[0]) == 'string') { _navID = arguments[0]; } else { return; }
    if (!!_navLinks[_navID] && (typeof _navLinks[_navID]) == 'object') { delete _navLinks[_navID]; }
  return;
  };
  
  bootScript = function() {
    var _layoutScript;
    var _postScript;
    var _loadJavascriptLocal;
    var _timeout;
    
    // Validate Incoming information, Set Layout to Global Loading Variable
    if (arguments.length>0) { _layoutScript = arguments[0]; } else { return; }
    if ($.inArray(_layoutScript,_loadedScripts) > -1)
      _bootDebug('"'+_layoutScript+'" Already Booted, Try Rebooting');
      
    _loadScript.apply(this, arguments);
      
  return;
  };
  
  bootCSS = function() {
    var _cssScript;
    
    // Validate Incoming information, Set Layout to Global Loading Variable
    if (arguments.length>0) { _cssScript = arguments[0]; } else { return; }
    _loadCSS.apply(this, arguments);
      
  return;
  };
  nukeCSS = function() {
    var _cssScript;
    
    // Validate Incoming information, Set Layout to Global Loading Variable
    if (arguments.length>0) { _cssScript = arguments[0]; } else { return; }
    
    // Loaded Stylesheet Count
    var loadedSheets = document.styleSheets.length;
    for(ls=0;ls<loadedSheets;ls++)
      if (document.styleSheets[ls].href == _cssScript) {
        _cleanSplice(_loadedStyles,_cssScript,1);
        if (_loadedStyles.indexOf(_cssScript)==-1) document.styleSheets[ls].disabled = "disabled";
      } 
  }
  
  
  bootState = function() {
    var tURL, tParsed = document.createElement("a"), pURL, pParsed = document.createElement("a");
    if (arguments.length>0 && (typeof arguments[0]) == 'string') { tURL = arguments[0]; } else { return; }
    if (arguments.length>1 && (typeof arguments[1]) == 'string') { pURL = arguments[1]; }

    if (!!tURL) {
      tParsed.href = tURL;
    }
    if (!!pURL) {
      pParsed.href = pURL;
    }
    
    _bootDebug("Boot State","Cur:",tParsed.search+tParsed.hash,"Prev:",pParsed.search+pParsed.hash);

    // Cleaning
    $.each(_navLinks,function(k,v) {
      if (
       !!pURL && !!tURL
       && ((pParsed.href+pParsed.search).indexOf(v.link)>-1 || (pParsed.href+pParsed.hash).indexOf(v.link)>-1)
       && (typeof v.clean) == 'function'
      ) {  
        _bootDebug('Cleaning: ',v.link);
        v.clean();
      }
    });
    
    // Hide Tag all Unused Widget PlaceMarkers
    $.each(_widgetCache,function(k,v) {
      if (!!v.placeMarker && v.placeMarker.length && v.placeMarker.prop("tagName").toLowerCase() != 'body') v.placeMarker.css('display','none').addClass('delContainer');
    });
    
    // Activating Current
    $.each(_navLinks,function(k,v) {
      if (
       ((tParsed.href+tParsed.search).indexOf(v.link)>-1 || (tParsed.href+tParsed.hash).indexOf(v.link)>-1)
       && (typeof v.action) == 'function'
      ) {
        _bootDebug('Loading: '+v.link);
        if (!!v.placeMarker && v.placeMarker.length && v.placeMarker.prop("tagName").toLowerCase() != 'body') v.placeMarker.css('display','').removeClass('delContainer');
        $.funQue.add(function() { v.action(); }, this);
      }
    });
    
    $('.delContainer').html('').removeClass('delContainer');
  }
  // Layout Boot Starter
  bootLayout = function() {
    var _layout,
    tContainer = $('body');
    
    // Validate Incoming information, Set Layout to Global Loading Variable
    if (arguments.length>0) { _layout = arguments[0]; } else { return; }
    if (arguments.length>1)
      tContainer = arguments[1];
    else
      if (!!_layout.placeMarker) tContainer = _layout.placeMarker;
      
    if ((typeof tContainer) == 'string' && $(tContainer).length) tContainer = $(tContainer);
    if ((typeof tContainer) != 'object' || !$(tContainer).length) tContainer = $('body');
    
    _bootDebug('New Layout Init');  
    _bootDebugAll(_layout);
        
    // Display Loading Pane
//    $('#pageContainer').removeAttr('id').addClass('delContainer').hide();
    
//    var _tLoadContainer = $(loadContainer).clone();
//    $('body').prepend(_tLoadContainer);
    
    // Loaded Stylesheet Count
    var loadedSheets = document.styleSheets.length;
    
//    for(ls=0;ls<loadedSheets;ls++)
//      document.styleSheets[ls].disabled = "disabled";
    
    // Loop Layout Packets, Start loading packet scripts
    for(var i in _layout) {

      var tLayout = _layout[i];
      if ((typeof tLayout) != 'object') { continue; }
      
      if ((typeof tLayout.loaded) != 'number') tLayout.loaded = 0;
      if ((typeof tLayout.loadLoops) != 'number') tLayout.loadLoops = 0;
      
      if ((typeof tLayout.widgets) != 'object') tLayout.widgets = {};
      
      if ((typeof tLayout.js) != 'object') tLayout.js = [];
      if ((typeof tLayout.css) != 'object') tLayout.css = [];      

      // Build Packet Layout Structure For Widgets
      if (tLayout.pageLayout != '') {
        if ((typeof tLayout.pageLayout) != 'string') tLayout.pageLayout = 'single';
        if ((typeof tLayout.pageWidths) != 'string') tLayout.pageWidths = '*';
        tLayout._layoutMarker = _createDisplayLayout(tLayout.pageLayout,tLayout.pageWidths);
        if ((typeof tLayout.ident) == 'string') $(tLayout._layoutMarker).find('.mainPage').attr('id',tLayout.ident);
        tContainer.append(tLayout._layoutMarker);
      }
      
      // Setup System Loop Count, Start Epoch
      tLayout.loadLoops = 0;
      tLayout.loadStart = _curEpoch;
  
      // Load / Verify Scripts before Pushing Page
      _loadScripts(tLayout); // Load Required Scripts
    }
        
    // Start integrity checking widgets and packet layouts for loaded javascript / css
    _verifyLayoutLoading(tLayout); // Push to Verification Routines
  };

  // Boot Several Widgets
  bootWidgets = function() {
    var tWidgets;
    
    if (arguments.length>0) { tWidgets = arguments[0]; } else { return false; }
    
    // Widget Processing
    var _process = 0;
    var _objects_processed = 0;
    var _objects_total = Object.keys(tWidgets).length;   
    
    // Setup Processing Priorites
    while (_objects_total>_objects_processed && _process<25) { // max object lvl
        
      // Loop Widgets
      for(var io in tWidgets) { 
        
        var tWidget = tWidgets[io];
          
        if ((typeof tWidget) != 'object') continue;
        if ((typeof tWidget.process) != 'number') tWidget.process = 24;
        
        // Check if Match of Priority
        if (tWidget.process != 0 && _process != tWidget.process) { continue; } // Never Continue on First Match, case of undefined process
          
        bootWidget(tWidget, ((typeof tWidget.ident) == 'string' && tWidget.ident != '' ? tWidget.ident : io)); // Boot Widget Routine
        
        // Tick Objects Processed
        _objects_processed++;
      } // end layout packet loop
        
      // Ticket Process Priority
      _process++;
    } // end process priorities
  }
  
  // Boot Single Widget
  bootWidget = function() {
    var tWidget,    
    tContainer = $('body'),
    _tContainer = $('body');

    var _tWidget = {
      ident: '',
      process: 0,
      loaded: 0,
      loadLoops: 0,
      js: [],
      css: [],
      placeMarker: $('body')
    };


    if (arguments.length>0) tWidget = arguments[0]; else return;
    if (arguments.length>1 && (typeof arguments[1]) == 'string') tWidget.ident = arguments[1]; else if ((typeof tWidget.ident) != 'string')return;
    if (arguments.length>2)
      tContainer = arguments[2];
    else
      if (!!tWidget.placeMarker) tContainer = tWidget.placeMarker;
    
    if ((typeof tContainer) == 'string' && $(tContainer).length) tContainer = $(tContainer);
    
    if ((typeof tWidget.process) != 'number') tWidget.process = 0;
    if ((typeof tWidget.loaded) != 'number') tWidget.loaded = 0;
    if ((typeof tWidget.loadLoops) != 'number') tWidget.loadLoops = 0;

    if ((typeof tWidget.js) != 'object') tWidget.js = [];
    if ((typeof tWidget.css) != 'object') tWidget.css = [];
    
    $.extend(_tWidget,tWidget);
            
    // Check / Update Cache
    if ((typeof _widgetCache[_tWidget.ident]) == 'object' && !!_widgetCache[_tWidget.ident].placeMarker && $(_widgetCache[_tWidget.ident].placeMarker).length)
        tContainer = $(_widgetCache[_tWidget.ident].placeMarker);
    
    if ((typeof tContainer) == 'object' || $(tContainer).length) {
      _tContainer = tContainer;
    } else if ((typeof tContainer) != 'object' || !$(tContainer).length) {
      _tContainer = $(loadContainer);
      if ((typeof _tWidget.ident) == 'string' && _tWidget.ident != '') $(_tContainer).attr('id',_tWidget.ident);
      $('body').append(_tContainer);
    } else if ((typeof tContainer) == 'object' && tContainer.prop("tagName").toLowerCase() == 'body') {
      _tContainer = $(loadContainer).appendTo(tContainer);
      if ((typeof _tWidget.ident) == 'string' && _tWidget.ident != '') $(_tContainer).attr('id',_tWidget.ident);
    }
    
    _tWidget.placeMarker = _tContainer;
    
    // Setup System Loop Count, Start Epoch
    _tWidget.loadLoops = 0;
    _tWidget.loadStart = _curEpoch;
        
    // Setup Default Loop Timeout  
    if ((typeof _tWidget.loadTimeout) == 'undefined' || (typeof _tWidget.loadTimeout) != 'number')
      _tWidget.loadTimeout = _dynamicScriptLoadingTimeout;  
    
    // Save Widget Cache Settings
    _widgetCache[_tWidget.ident] = _tWidget;
    widgetCache[_tWidget.ident] = tWidget;
    
    _bootDebug('Load Widget Scripts: '+_tWidget.ident);
    _bootDebug(_tWidget);
    
    if ((typeof _tWidget.onStart) == 'function')
      _tWidget.onStart(_tWidget,$(_tContainer));
    
    if (!!$(_tContainer) && $(_tContainer).length)
      $(_tContainer).css('display','').removeClass('delContainer');
      
    _loadScripts(_tWidget); // Load Required Scripts for Widget
    _verifyWidget(_tWidget); // Verification Routine
    
  };
  
  fetchWidget = function() {
    if (arguments.length>0 && (typeof _widgetModules[arguments[0]]) == 'object') { return _widgetModules[arguments[0]]; } else { return false; }
  };
  
  nukeWidget = function() {
    var tWidget;
    var ls, ws;
    
    if (arguments.length>0 && (typeof _widgetCache[arguments[0]]) == 'object') { tWidget = _widgetCache[arguments[0]]; } else { return false; }
    
    // Loaded Stylesheet Count
    var widgetSheets = tWidget.css.length;

    for(ws=0;ws<widgetSheets;ws++)
      nukeCSS(tWidget.css[ws]);
    
    // Remove Javascript Associations
    if (arguments.length>2 && arguments[2] == true)
      for(ls=0;ls<_loadedScripts.length;ls++)
        for(ws=0;ws<tWidget.js.length;ws++)
          if (_loadedScripts[ls] == tWidget.js[ws])
            _cleanSplice(_loadedScripts,tWidget.js[ws]);
    
    
    // Remove Placemarker
    if (arguments.length>1 && arguments[1] == false && !!$(tWidget.placeMarker).length && tWidget.placeMarker.prop("tagName").toLowerCase() != 'body') {
      $(tWidget.placeMarker).empty();
    } else if (!!$(tWidget.placeMarker).length && tWidget.placeMarker.prop("tagName").toLowerCase() != 'body') {
      $(tWidget.placeMarker).html(''); delete tWidget.placeMarker;
    }
    
    // Remove Module
    if (arguments.length>2 && arguments[2] == true) {
      delete _widgetModules[tWidget.module];
    
      // Delete Cache Entry
      delete _widgetCache[arguments[0]];
    }
    
    _bootDebug("Nuking", tWidget);
    _bootDebug(_widgetCache);
    _bootDebug(_loadedStyles);
    _bootDebug(_loadedScripts);
    
  };
  
  
  var _verifyLayoutLoading = function() {
    var tLayout;

    if (arguments.length>0) { tLayout = arguments[0]; } else { return false; }
    
    if (_checkFailedScripts(tLayout)) {
      alert('Some Layout Script Components Failed to Load');
    } else if (!_checkScripts(tLayout)) {
      // Loop Verify Again
      _bootDebug("Need Layout Scripts Loop");
      _bootDebug(_loading);
      tLayout.loadLoops += 1;
      var nextTimeout = _dynamicScriptLoadingCycleStart;
      for(var i = 0;i<tLayout.loadLoops;i++) nextTimeout*=2;
      if (nextTimeout <= _dynamicScriptLoadingTimeout) setTimeout(function() { _verifyLayoutLoading(tLayout); },nextTimeout); else _bootDebug("Failed To Load Page Scripts");
    } else {
      tLayout.loaded = 1;
      $.funQue.add(function() { bootWidgets(tLayout.widgets); }, this);
    }
    
  };
    
    
  // pnelop_history Wrappers
  loadLinks = function() {
    pnelop_history._loadPushLinks.apply(this, arguments);
  };
  fetchPage = function() {
    pnelop_history._fetchPage.apply(this, arguments);
  };
  pushURL = function() {
    pnelop_history._pushURL.apply(this, arguments);
  };
    
    
    
    
    
  var _verifyWidget = function() {
    var tWidget,
    totalTimeout = 0;
    
    if (arguments.length>0 && (typeof arguments[0]) == 'object') tWidget = arguments[0]; else return false;
    
    if (_checkFailedScripts(tWidget)) {
      alert('Some Widget Script Components Failed to Load');
    } else if (!_checkScripts(tWidget)) {
      // Loop Verify Again
      _bootDebug("Need Widget Scripts Loop: "+tWidget.loadLoops);
      tWidget.loadLoops += 1;
      var nextTimeout = _dynamicScriptLoadingCycleStart;
      for(var i = 0;i<tWidget.loadLoops;i++) { nextTimeout*=2; totalTimeout+=nextTimeout; }
      if (totalTimeout <= tWidget.loadTimeout) setTimeout(function() { _verifyWidget(tWidget); },nextTimeout); else _bootDebug("Failed To Load Widget Scripts For "+tWidget.ident);
    } else {
      tWidget.loaded = 1;
      $.funQue.add(function() { _loadWidget(tWidget); }, this);
    }
  };
  
  
  var _loadWidget = function() {
    var tWidget,
    tContainer = $('body'),
    tIdent,
    pWidgetFunc;

    // Widget Argument
    if (arguments.length>0 && (typeof arguments[0]) == 'object') tWidget = arguments[0]; else return false;
    
    // Placemarker
    if ((typeof tWidget.placeMarker) == 'object' && tWidget.placeMarker.length)
      tContainer = tWidget.placeMarker;
    else if ((typeof tWidget.placeMarker) == 'string' && $('body').find(tWidget.placeMarker).length)
      tContainer = $('body').find(tWidget.placeMarker);
    
    if (!$(tContainer).length || (typeof tContainer) != 'object') tContainer = $('body');
    
    // Identifier
    if ((typeof tWidget.ident) == 'string') tIdent = tWidget.ident;
    if ((typeof tIdent) != 'string') tIdent = '';
    
    _bootDebug('Boot Widget: '+tIdent+' in Container: ');
    _bootDebug(tContainer);
    
    //if ((typeof _widgetModules) != 'object') { _bootError('No PNelOP Widget Modules Found, Missing JS Module File?'); return; }
    //if ((typeof _widgetModules[tWidget.module]) != 'object') {
    //  _bootError('No Reference for '+tWidget.ident+' Found in _widgetModules');
    //  return;
    //}

    if ((typeof tWidget.onReady) == 'function')
      tWidget.onReady(tWidget,$(tContainer));

    if ((typeof _widgetModules[tWidget.module]) == 'object')
      pWidgetFunc = _widgetModules[tWidget.module];
      
    if (!!pWidgetFunc && (typeof pWidgetFunc.processObject) == 'function')
      pWidgetFunc.processObject(tWidget,$(tContainer));
    
    if (!!pWidgetFunc && (typeof pWidgetFunc._init) == 'function')
      pWidgetFunc._init(tWidget,$(tContainer));
      
    if ((typeof loadLinks) == 'function') loadLinks();
    
    if ((typeof tWidget.onComplete) == 'function')
      tWidget.onComplete(tWidget,$(tContainer));
    
    tWidget.loaded = 2;
  return;
  };
  
  
  var _checkFailedScripts = function() {
    var tObject; 
    
    if (arguments.length>0 && (typeof arguments[0]) == 'object') tObject = arguments[0]; else return false;
    
    // JS
    if ((typeof tObject.js) == 'object' && !!tObject.js && tObject.js.length)
      for (var ij in tObject.js)
        if (_failedScripts.indexOf(tObject.js[ij])>-1) return true;
  return false;
  };
  
  var _checkScripts = function() {
    var tObject; 
    
    if (arguments.length>0 && (typeof arguments[0]) == 'object') tObject = arguments[0]; else return false;
    
    // JS
    if ((typeof tObject.js) == 'object') {
      if (!!tObject.js && tObject.js.length)
        for (var ij in tObject.js) {
          if (_loadedScripts == null) return false;
          if (_loadedScripts.indexOf(tObject.js[ij])>-1 && _loading.indexOf(tObject.js[ij])==-1) continue; else return false;
        }
    }
 
    // CSS 
    if ((typeof tObject.css) == 'object') {   
      if (!!tObject.css && tObject.css.length) 
        for (var ic in tObject.css) {
          if (_loadedStyles == null) return false;
          if (_loadedStyles.indexOf(tObject.css[ic])>-1 && _loading.indexOf(tObject.css[ic])==-1) continue; else return false;
        }
    }
    
  
  return true;
  };
  
  
  // Load Layout / Widget Scripts
  var _loadScripts = function() {

    var _layoutObj;
    
    // Validate Incoming information, Set Layout to Variable
    if (arguments.length>0 && (typeof arguments[0]) == 'object') _layoutObj = arguments[0]; else return;
    
    
    //document.styleSheets[0].disabled = true;
    // CSS
    if (!!_layoutObj.css && _layoutObj.css.length) 
      for (var ic in _layoutObj.css) {
        _bootDebug('Loading Stylesheet: '+_layoutObj.css[ic]);
        _loadCSS(_layoutObj.css[ic]);
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
  
  var _loadCSS = function() {
    
    var loadedSheets = document.styleSheets.length
    ,neededSheets = []
    ,ls = 0
    , cssURL = ''
    , inCache = 0;
        
    if (arguments.length>0) { cssURL = arguments[0]; } else { return; }
    
    _loadedStyles.push(cssURL);
        
    // Loops Stylesheets Enable from Cache
    for(ls=0;ls<loadedSheets;ls++) {
      if (document.styleSheets[ls].href == null) continue;
//          _bootDebug(document.styleSheets[ls].href+' -- '+_layoutObj.css[ic]+' -- '+document.styleSheets[ls].href.indexOf(_layoutObj.css[ic]));
            
      if (document.styleSheets[ls].href.indexOf(cssURL)>-1) {
        inCache = 1;
        _bootDebug('Cached Stylesheet: '+cssURL);
//        _bootDebug('Enabled: '+document.styleSheets[ls].href);
        document.styleSheets[ls].disabled = "";
        break;
      }
    }
          
    if (inCache==0) {
      _loading.push(cssURL);
          
      // Start Style Fetching Process
      _bootDebug('Fetching Stylesheet: '+cssURL);
      $('head').append($('<link rel="stylesheet" type="text/css" href="'+cssURL+'" />').ready(function() {
        _bootDebug('Stylesheet Loaded: '+cssURL);
        _bootDebugAll(this);
        _cleanSplice(_loading,cssURL);
      }));
    }
  };
  
  var _loadScript = function() {

    var _layoutScript;
    var _postScript;
    var _loadJavascriptLocal;
    var _timeout;
    
    // Validate Incoming information, Set Layout to Global Loading Variable
    if (arguments.length>0) { _layoutScript = arguments[0]; } else { return; }
    if (arguments.length>1) { _postScript = arguments[1]; } else { _postScript = null; }
    if (arguments.length>2) { _timeout = arguments[2]; } else { _timeout = _dynamicScriptLoadingTimeout; }
    if (arguments.length>3) { _loadJavascriptLocal = arguments[3]; }

    _bootDebug('Is Script: '+_layoutScript+' Loaded? '+$.inArray(_layoutScript,_loadedScripts));
    if ($.inArray(_layoutScript,_loadedScripts) == -1) {

      _bootDebug('Requesting JS: '+_layoutScript);
      _loading.push(_layoutScript);
      
      if (_layoutScript.substr(0,7) != 'http://' && _layoutScript.substr(0,8) != 'https://') _loadJavascriptLocal = 1;
      //_loadJavascriptLocal = 1;
      // Start Script Fetching Process
      if (_loadJavascriptLocal == 1) {
        // Load Local Script Tag
        var script   = document.createElement("script");
        script.type  = "text/javascript";
        script.src   = _layoutScript;    // use this for linked script
        script.text  = ""               // use this for inline script
      
        if(document.all){
          script.onreadystatechange = function() {
            if (script.readyState == 'complete') {
              script.onreadystatechange = "";
              _loadScriptSuccess(_layoutScript, _postScript);
            } else if (script.readyState == 'loaded') {
              script.onreadystatechange = "";
              _loadScriptSuccess(_layoutScript, _postScript);
            } else if (script.readyState == 'error') {
              script.onreadystatechange = "";
              _loadScriptError(_layoutScript);
            } else { _bootDebug(script.readyState); }
          }
        } else {
          script.onload = function() {
            _loadScriptSuccess(_layoutScript, _postScript);
          }
          script.onerror = function() { 
            _loadScriptError(_layoutScript);
          }
        }

        document.body.appendChild(script);

      } else {
        // Load Ajax
        $.ajax({
          type: "GET",
          url: _layoutScript,
          dataType: "script",
          timeout: _timeout,
          success: function(data, textStatus, jqXHR) {
            _loadScriptSuccess(this.url, _postScript);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            _loadScriptError(this.url, _postScript, _timeout);
          }
        });
      }
      
    } else {
      _bootDebug('Already Loaded: '+_layoutScript);         
    }
    
    _loadedScripts.push(_layoutScript);
  };
  
  var _loadScriptSuccess = function() {
    var _tURL;
    var _postScript;
    if (arguments.length>0) { _tURL = arguments[0]; } else { return; }
    if (arguments.length>1 && !!_isFunction(arguments[1])) _postScript = arguments[1];
    
    _bootDebug('Loaded JS: '+_tURL); 
    
    if (!!_isFunction(_postScript)) _postScript();
          
    // Clean Object _loading
    _bootDebug('Cleaning JS: '+_tURL); 
    _cleanSplice(_loading,_tURL);
    _cleanSplice(_failedScripts,_tURL);  
  };
  
  var _loadScriptError = function() { 
    var _tURL;
    if (arguments.length>0) { _tURL = arguments[0]; } else { return; }
    
    _bootDebug('Failed Loading JS: '+_tURL);
    if (_debug > 0) alert("Failed Loading Javascript: "+_tURL); 
   
    _failedScripts.push(_tURL);
    
    var retries = 0;
    for(var fs=0;fs<_failedScripts.length;fs++)
      if (_failedScripts[fs]==_tURL) retries+=1;
      
    // Clean Object _loading
    _cleanSplice(_loading,_tURL);
    _cleanSplice(_loadedScripts,_tURL);
    
    if (retries<_dynamicScriptLoadRetries) _loadScript.apply(this, arguments);
  };
    
  var _cleanSplice = function() {
    var _layoutObject,
    _layoutScript,
    _numCount=-1,
    _remCount=0;
        
    // Validate Incoming information, Set Layout to Global Loading Variable
    if (arguments.length>0 && (typeof arguments[0]) == 'object') { _layoutObject = arguments[0]; } else { return; }
    if (arguments.length>1 && (typeof arguments[1]) == 'string') { _layoutScript = arguments[1]; } else { return; }
    if (arguments.length>2 && (typeof arguments[2]) == 'number') { _numCount = arguments[2]; }
    
    while ((typeof _layoutObject) == 'object' && _layoutObject.length > 0 && _layoutObject.indexOf(_layoutScript) !== -1) {
      _layoutObject.splice(_layoutObject.indexOf(_layoutScript), 1);
      _remCount+=1; if (_numCount>0 && _numCount>=_remCount) return;
    }

  };
  
  
  
  
  
  
  
  var _historyPrevURL = ''
  , _historyCurURL = ''
  , _enabled = Boolean(window.history && window.history.pushState && window.history.replaceState && !(
      (/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent) /* disable for versions of iOS before version 4.3 (8F190) */
      || (/AppleWebKit\/5([0-2]|3[0-2])/i).test(navigator.userAgent) /* disable for the mercury iOS browser, or at least older versions of the webkit engine */
    ))
  , _forceFetchPage = false;

  // HTML 5 History Implementation
  var pnelop_history = {
      
    _init: function() {
      _bootDebug('HTML5 History Enabled: ',_enabled);
    
      try {
        if (_enabled) _html5User = true; else _html5User = false;
      } catch(err) {
        $(document).ready(function() {
          _html5User = false;
        });
      }

      //this._historyCurURL = location.href;
    
      // Hook into State Changes
      //$.funQue.add(function() {
        window.onpopstate = function() {
          // Prepare Variables
          _bootDebug('Pop State Change: ',location.href,pnelop_history._historyCurURL);
          if (!pnelop_history._forceFetchPage && location.href == pnelop_history._historyCurURL) {
            _bootDebug("Identical Pop State. History Cannot Help You");
            return false;
          }
        
          // Fetch Page
          //$.xhrPool.abortAll();
          //_loading = [];
          //_failedScripts = [];
          fetchPage(location.href);
          _forceFetchPage = false;
        }; // end onStateChange
    
        window.onhashchange = function() {
          _bootDebug('Hash Change: HTML5 User?',_html5User);
          if (!_html5User) $(window).trigger('popstate');
        }
      //}, this);
    

      if (!_html5User) $.funQue.add(function() { $(window).trigger('popstate'); }, this);
    
    },
  
    _addLink: function(_url) {
      if (_enabled) {
        history.pushState(null, null, _url);
      } else {
        window.location = _url;
      }
    },
  
    _loadPushLinks: function() {
      // Dbl Check HTML5
      if (!_enabled) {
        if (_html5User) _html5User = false;
        return false;
      }

      var linkClass = $('.pushLink');
      
      if (arguments.length>0 && (typeof arguments[0])=='string' && !!$(arguments[0]).length) linkClass = $(arguments[0]);
      if (arguments.length>0 && (typeof arguments[0])=='object') linkClass = arguments[0];
      
      // Wait for Document
      $(function(){
        // internal links
        linkClass.unbind('click').bind('click',function(event){

          // Continue as normal for cmd clicks etc
          if ( event.which == 2 || event.metaKey ) { return true; }

          var $this = $(this), url = $this.attr('href');
          pushURL(url);
      
          event.preventDefault();
      
          return false;
        });
    

      }); // end onDomLoad
    }, // end closure

    _pushURL: function(url) {
    
      // Check to see if pnelop_history is enabled
      if (!_enabled) {
        location.href=url;
        return false;
      }
    
      // Check against current url
      history.replaceState(null,null,url);
      if (location.href != _historyCurURL) {
        history.replaceState(null,null,_historyCurURL);
        history.pushState(null,null,url);
      }
      
      // All Links Force Page Update
      _forceFetchPage = true;
      
      // PopState to fetchPage
      $(window).trigger('popstate');
    },
  
    _fetchPage: function() {
      var _nURL = location.href; // Refresh
      var _pURL = _historyCurURL;
      var _options = {};
    
      $.xhrPool.abortAll();
      _loading = [];
      _failedScripts = [];
          
      if (arguments.length>0) { _nURL = arguments[0]; }
      if (arguments.length>1) { _pURL = arguments[1]; }
    
      _historyPrevURL = _pURL;
      _historyCurURL = _nURL;
    
    
      $.funQue.add(function() {
        $P.bootState(_nURL, _pURL);
      }, this);
    }
  };


  
  
  
  
  
  
  var _bootPageTitle = function() {
    var pTitle = document.title;
    if (arguments.length>0) { pTitle = arguments[0]; } else { return; }
    
    // Set page Title
    if (!!bootLayout.pageTitle) { document.title = pTitle; } 
  };
  
  var _createDisplayLayout = function() {
    var _layoutStyle = 'none',
    _layoutWidths = '';
    
    if (arguments.length>0 && arguments[0] != undefined) { _layoutStyle = arguments[0]; }
    if (arguments.length>1 && arguments[1] != undefined) { _layoutWidths = arguments[1]; }
      
    var _layout = $(layoutMain).clone();
      
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







  var _bootDisplayModals = function() {
    var _layoutObj;
    if (arguments.length>1) { i = arguments[0]; io = arguments[1]; } else { return; }
  
    // Load Modal Frames
    if (_layoutObj['modals'] && _layoutObj['modals'].length) {
      // run modal list thru each loaded module
      for (i in _layoutObj['modals'])
        for (obm in _widgetModules)
          if (_widgetModules[obm].processModal) _widgetModules[obm].processModal(_layoutObj['modals'][i]);

      // Fetch Modal List
      if (grabModals.length) {
        //$.funQue.add(function() { fetchModals(grabModals); }, this);
        grabModals = [];
      }
    }
  };
  
  var _addModals = function(_modals) {
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
  var _bootDebugAll = function() {
    if (!_debug || _debug < 2) return; // No Booter Debugging
    var err = '';
    if (arguments.length>0) { err = arguments[0]; }
    
    try { console.log(err) } catch (e) { /*alert(s);*/ }
  };
  var _bootError = function() {
    var err = '',
    ee = '';
    
    if (arguments.length>0) { err = arguments[0]; }
    if (arguments.length>1) { ee = arguments[1]; }
    
    try { console.log('BOOT ERROR'); if (!!err) console.log(err); if (!!ee) console.log(ee.message); } catch (e) { /*alert(s);*/ }
  };
  
  var _isFunction = function(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  };
  
    
  // Return
  return parent;  
  
}(jQuery));
var $P = PNelOP;
$P.setup(); // Setup PNelOP

