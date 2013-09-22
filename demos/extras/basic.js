$P.bootModule('basicmodule', {
  protect: true,
  // Start processObject
  processObject: function()  {

    var _layoutObj, _container;
    if (arguments.length>0) _layoutObj=arguments[0]; else return;
    if (arguments.length>1) _container=arguments[1]; else return;
    
    _container.append('This Module is Awesome<br />');

  }
});
