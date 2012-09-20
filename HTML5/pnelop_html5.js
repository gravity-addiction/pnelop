/*
 * PNelOP HTML5
 * Javascript HTML5 Page Naviation
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
 * This Uses The Follow Code
 * History.js Core v1.7.1-r2
 * https://github.com/balupton/history.js
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
/* 
 * PNelOP Integration
 *
 *    // HTML Example, class pushLink activates links
 *    <a href="/" class="pushLink">Hello World</a>
 *
 *    // Javascript Required to Setup Links, Typically done as
 *    $(document).ready(function() { pnelop_html5._loadPushLinks(); }); // Startup
 *    pnelop_html5._loadPushLinks(); // After Page Load
 *
 * Author: Gary Taylor, gary@gmerc.com
 * Version: 1.0 
 */
var pnelop_html5 = {
  _staticUser: false,
  _historyPrevURL: '',
  _historyCurURL: '',

  loadPushLinks: function() {
    this._loadPushLinks();
  },
  
  _postAttempts: 0,
  
  fetchPage: function() {
    var _pURL = location.href; // Refresh
    var _options = {};
    if (arguments.length>0) { _pURL = arguments[0]; }
    if (arguments.length>1) { _options = arguments[1]; }

    this._historyCurURL = _pURL;
    
    var ajaxData = {'layout' : '1', 'mobile' : ($P.isMobile()) ? '1' : '0'};
    $.ajax({
      url: _pURL,
      type: 'GET',
      data: ajaxData,
      timeout: 8000,
      error: function(jqXHR, textStatus, errorThrown) {
        if (errorThrown=='Forbidden') {
          alert('Page Forbidden');
        } else if (this._postAttempts < 3) {
          rError('Error: '+errorThrown);
          alert('Boot Error');
          this._postAttempts++;
          this.fetchPage(_pURL,_options);
        } else if (errorThrown != 'abort') {
          alert('Page Loading Problem, Please Refresh: '+errorThrown);
        }
      },
      success: function(_resp) {
        this._postAttempts = 0;
        
        if (_resp['responseCode'] && _resp['responseCode']=='locationForward') {
          window.location = _pURL;
        } else if (_resp['layout']) { // Load PNelOP

            var _bbios = $P.bootBIOS(_resp);
            if ((typeof _resp.page) != 'undefined' && !!_resp.page) $P.setPageVars(_resp.page);

        } else { // Load Static
          // Parse Body
          var _body = _resp;
          try {
            _body = $(_resp).find('body');
          } catch(e) { }
        
          // _container in options?
          if (!!_options._container && !!$(_options._container).length) {
            $.funQue(function() { $(_options._container).append(_body); }, pnelop_html5);
          } else
          // Try to find a place to put it
          if (!!$('#pageContainer').find('#mainColumn').length) {
            $.funQue(function() { $('#pageContainer').find('#mainColumn').append(_body); }, pnelop_html5);
          } else if (!!$('#pageContainer').find('#mainPage').length) {
            $.funQue(function() { $('#pageContainer').find('#mainPage').append(_body); }, pnelop_html5);
          } else if (!!$('#pageContainer').length) {
            $.funQue(function() { $('#pageContainer').append(_body); }, pnelop_html5);
          } else if (!!$('#pnelop_main').length) {
            $.funQue(function() { $('#pnelop_main').html(_body); }, pnelop_html5);
          } else {
            $.funQue(function() { $('body').html(_body); }, pnelop_html5);
          }
          
        }        
      }
    });
  
  
  },
      
  _init: function() {
    try {
      if (History) this._staticUser = false;
      } catch(err) { 
  
      $(document).ready(function() {
        this._staticUser = true;
        //$.funQue.add(pnelop_html5._loadURL(location.href), this);
        //pnelop_html5._loadURL(location.href); // funQue REM
      });
    }
  },
  
  _addLink: function(_url) {
    if (History.enabled) {
      History.pushState(null, null, _url);
    } else {
      window.location = _url;
    }
  },
  
  _loadPushLinks: function() {
    
    // Prepare our Variables
    var History = window.History,
    $ = window.jQuery;
    
    // Check to see if History.js is enabled for our Browser
    if (History==undefined || !History.enabled) {
      if (!this._staticUser) this._staticUser = true;
      return false;
    }
    
    // Wait for Document
    $(function(){
      // Prepare Variables
      var rootUrl = History.getRootUrl(),
      State = History.getState(),
      url = State.url;
      
    this._historyPrevURL = '/'+url.replace(rootUrl,'');
    
    // internal links
    $('.pushLink').unbind('click').bind('click',function(event){
      // Continue as normal for cmd clicks etc
      if ( event.which == 2 || event.metaKey ) { return true; }
      
      var $this = $(this), url = $this.attr('href');
      pnelop_html5._pushURL(url);
      
      event.preventDefault();
      
      return false;
    });
    
    // Hook into State Changes
    $(window).unbind('statechange').bind('statechange',function(){
      // Prepare Variables
      var State = History.getState(),
      url = State.url,
      relativeUrl = url.replace(rootUrl,'');
      
      $.xhrPool.abortAll();
      
      pnelop_html5._loadURL('/'+relativeUrl);
      }); // end onStateChange
    }); // end onDomLoad
  }, // end closure

  _pushURL: function(url) {
    
    // Prepare our Variables
    var History = window.History,
    $ = window.jQuery;
    
    // Check to see if History.js is enabled for our Browser
    if (History==undefined || !History.enabled) {
      //alert('No History Loaded');
      location.href=url;
      return false;
    }
    
    if (this._historyPrevURL==url) {
      this._reloadURL();
    } else {
      History.pushState(null,null,url);
      this._historyPrevURL=url;
    }
  },
  
  _reloadURL: function() {
    var rootUrl = History.getRootUrl();
    var State = History.getState(),
    url = State.url,
    relativeUrl = url.replace(rootUrl,'');
    $.xhrPool.abortAll();
    this._loadURL('/'+relativeUrl);
  },
  
  _loadURL: function(_url) {
    $.ajaxSetup({url:_url});
    this._postAttempts = 0;
    this.fetchPage(_url);
  }
    
};

// Initalize PNelOP HTML5 Class
pnelop_html5._init();