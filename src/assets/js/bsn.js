
/* Native Javascript for Bootstrap 4 | Dropdown
----------------------------------------------*/

// DROPDOWN DEFINITION
// ===================
var Dropdown = function( element, option ) {
    
  // initialization element
  element = queryElement(element);

  // set option
  this.persist = option === true || element[getAttribute]('data-persist') === 'true' || false;

  // constants, event targets, strings
  var self = this, children = 'children',
    parent = element[parentNode],
    component = 'dropdown', open = 'open',
    relatedTarget = null,
    menu = queryElement('.dropdown-menu', parent),
    menuItems = (function(){
      var set = menu[children], newSet = [];
      for ( var i=0; i<set[length]; i++ ){
        set[i][children][length] && (set[i][children][0].tagName === 'A' && newSet[push](set[i][children][0]));
        set[i].tagName === 'A' && newSet[push](set[i]);
      }
      return newSet;
    })(),

    // preventDefault on empty anchor links
    preventEmptyAnchor = function(anchor){
      (anchor.href && anchor.href.slice(-1) === '#' || anchor[parentNode] && anchor[parentNode].href 
        && anchor[parentNode].href.slice(-1) === '#') && this[preventDefault]();    
    },

    // toggle dismissible events
    toggleDismiss = function(){
      var type = element[open] ? on : off;
      type(DOC, clickEvent, dismissHandler); 
      type(DOC, keydownEvent, preventScroll);
      type(DOC, keyupEvent, keyHandler);
    },

    // handlers
    dismissHandler = function(e) {
      var eventTarget = e[target], hasData = eventTarget && (stringDropdown in eventTarget || stringDropdown in eventTarget[parentNode]);
      if ( (eventTarget === menu || menu[contains](eventTarget)) && (self.persist || hasData) ) { return; }
      else {
        relatedTarget = eventTarget === element || element[contains](eventTarget) ? element : null;
        hide();
      }
      preventEmptyAnchor.call(e,eventTarget);
    },
    clickHandler = function(e) {
      relatedTarget = element;
      show();
      preventEmptyAnchor.call(e,e[target]);
    },
    preventScroll = function(e){
      var key = e.which || e.keyCode;
      if( key === 38 || key === 40 ) { e[preventDefault](); }
    },
    keyHandler = function(e){
      var key = e.which || e.keyCode,
        activeItem = DOC.activeElement,
        idx = menuItems[indexOf](activeItem),
        isSameElement = activeItem === element,
        isInsideMenu = menu[contains](activeItem),
        isMenuItem = activeItem[parentNode] === menu || activeItem[parentNode][parentNode] === menu;          

      if ( isMenuItem || isSameElement ) { // navigate up | down
        idx = isSameElement ? 0 
                            : key === 38 ? (idx>1?idx-1:0)
                            : key === 40 ? (idx<menuItems[length]-1?idx+1:idx) : idx;
        menuItems[idx] && setFocus(menuItems[idx]);
      }
      if ( (menuItems[length] && isMenuItem // menu has items
            || !menuItems[length] && (isInsideMenu || isSameElement)  // menu might be a form
            || !isInsideMenu ) // or the focused element is not in the menu at all
            && element[open] && key === 27  // menu must be open
      ) {
        self.toggle();
        relatedTarget = null;
      }
    },

    // private methods
    show = function() {
      bootstrapCustomEvent.call(parent, showEvent, component, relatedTarget);
      addClass(menu,showClass);
      addClass(parent,showClass);
      menu[setAttribute](ariaExpanded,true);
      bootstrapCustomEvent.call(parent, shownEvent, component, relatedTarget);
      element[open] = true;
      off(element, clickEvent, clickHandler);
      setTimeout(function(){
        setFocus( menu[getElementsByTagName]('INPUT')[0] || element ); // focus the first input item | element
        toggleDismiss();
      },1);
    },
    hide = function() {
      bootstrapCustomEvent.call(parent, hideEvent, component, relatedTarget);
      removeClass(menu,showClass);
      removeClass(parent,showClass);
      menu[setAttribute](ariaExpanded,false);
      bootstrapCustomEvent.call(parent, hiddenEvent, component, relatedTarget);
      element[open] = false;
      toggleDismiss();
      setFocus(element);
      setTimeout(function(){ on(element, clickEvent, clickHandler); },1);
    };

  // set initial state to closed
  element[open] = false;

  // public methods
  this.toggle = function() {
    if (hasClass(parent,showClass) && element[open]) { hide(); } 
    else { show(); }
  };

  // init
  if ( !(stringDropdown in element) ) { // prevent adding event handlers twice
    !tabindex in menu && menu[setAttribute](tabindex, '0'); // Fix onblur on Chrome | Safari
    on(element, clickEvent, clickHandler);
  }

  element[stringDropdown] = self;
};


/* Native Javascript for Bootstrap 4 | Popover
----------------------------------------------*/

// POPOVER DEFINITION
// ==================
var Popover = function( element, options ) {

  // initialization element
  element = queryElement(element);

  // set options
  options = options || {};

  // DATA API
  var triggerData = element[getAttribute](dataTrigger), // click / hover / focus
      animationData = element[getAttribute](dataAnimation), // true / false
      placementData = element[getAttribute](dataPlacement),
      dismissibleData = element[getAttribute](dataDismissible),
      delayData = element[getAttribute](dataDelay),
      containerData = element[getAttribute](dataContainer),

      // internal strings
      component = 'popover',
      template = 'template',
      trigger = 'trigger',
      classString = 'class',
      div = 'div',
      fade = 'fade',
      content = 'content',
      dataContent = 'data-content',
      dismissible = 'dismissible',
      closeBtn = '<button type="button" class="close">×</button>',

      // check container
      containerElement = queryElement(options[container]),
      containerDataElement = queryElement(containerData),       
      
      // maybe the element is inside a modal
      modal = getClosest(element,'.modal'),
      
      // maybe the element is inside a fixed navbar
      navbarFixedTop = getClosest(element,'.'+fixedTop),
      navbarFixedBottom = getClosest(element,'.'+fixedBottom);

  // set instance options
  this[template] = options[template] ? options[template] : null; // JavaScript only
  this[trigger] = options[trigger] ? options[trigger] : triggerData || hoverEvent;
  this[animation] = options[animation] && options[animation] !== fade ? options[animation] : animationData || fade;
  this[placement] = options[placement] ? options[placement] : placementData || top;
  this[delay] = parseInt(options[delay] || delayData) || 200;
  this[dismissible] = options[dismissible] || dismissibleData === 'true' ? true : false;
  this[container] = containerElement ? containerElement 
                  : containerDataElement ? containerDataElement 
                  : navbarFixedTop ? navbarFixedTop
                  : navbarFixedBottom ? navbarFixedBottom
                  : modal ? modal : DOC[body];
  
  // bind, content
  var self = this, 
    titleString = element[getAttribute](dataTitle) || null,
    contentString = element[getAttribute](dataContent) || null;

  if ( !contentString && !this[template] ) return; // invalidate

  // constants, vars
  var popover = null, timer = 0, placementSetting = this[placement],
    
    // handlers
    dismissibleHandler = function(e) {
      if (popover !== null && e[target] === queryElement('.close',popover)) {
        self.hide();
      }
    },

    // private methods
    removePopover = function() {
      self[container].removeChild(popover);
      timer = null; popover = null; 
    },
    createPopover = function() {
      titleString = element[getAttribute](dataTitle); // check content again
      contentString = element[getAttribute](dataContent);

      popover = DOC[createElement](div);

      // popover arrow
      var popoverArrow = DOC[createElement](div);
      popoverArrow[setAttribute](classString,'arrow');
      popover[appendChild](popoverArrow);

      if ( contentString !== null && self[template] === null ) { //create the popover from data attributes

        popover[setAttribute]('role','tooltip');

        if (titleString !== null) {
          var popoverTitle = DOC[createElement]('h3');
          popoverTitle[setAttribute](classString,component+'-header');

          popoverTitle[innerHTML] = self[dismissible] ? titleString + closeBtn : titleString;
          popover[appendChild](popoverTitle);
        }

        //set popover content
        var popoverContent = DOC[createElement](div);
        popoverContent[setAttribute](classString,component+'-body');
        popoverContent[innerHTML] = self[dismissible] && titleString === null ? contentString + closeBtn : contentString;
        popover[appendChild](popoverContent);

      } else {  // or create the popover from template
        var popoverTemplate = DOC[createElement](div);
        popoverTemplate[innerHTML] = self[template];
        popover[innerHTML] = popoverTemplate.firstChild[innerHTML];
      }

      //append to the container
      self[container][appendChild](popover);
      popover[style].display = 'block';
      popover[setAttribute](classString, component+ ' bs-' + component+'-'+placementSetting + ' ' + self[animation]);
    },
    showPopover = function () {
      !hasClass(popover,showClass) && ( addClass(popover,showClass) );
    },
    updatePopover = function() {
      styleTip(element,popover,placementSetting,self[container]);
    },

    // event toggle
    dismissHandlerToggle = function(type){
      if (clickEvent == self[trigger] || 'focus' == self[trigger]) {
        !self[dismissible] && type( element, 'blur', self.hide );
      }
      self[dismissible] && type( DOC, clickEvent, dismissibleHandler );     
      type( globalObject, resizeEvent, self.hide );
    },

    // triggers
    showTrigger = function() {
      dismissHandlerToggle(on);
      bootstrapCustomEvent.call(element, shownEvent, component);
    },
    hideTrigger = function() {
      dismissHandlerToggle(off);
      removePopover();
      bootstrapCustomEvent.call(element, hiddenEvent, component);
    };

  // public methods / handlers
  this.toggle = function() {
    if (popover === null) { self.show(); } 
    else { self.hide(); }
  };
  this.show = function() {
    clearTimeout(timer);
    timer = setTimeout( function() {
      if (popover === null) {
        placementSetting = self[placement]; // we reset placement in all cases
        createPopover();
        updatePopover();
        showPopover();
        bootstrapCustomEvent.call(element, showEvent, component);
        !!self[animation] ? emulateTransitionEnd(popover, showTrigger) : showTrigger();
      }
    }, 20 );
  };
  this.hide = function() {
    clearTimeout(timer);
    timer = setTimeout( function() {
      if (popover && popover !== null && hasClass(popover,showClass)) {
        bootstrapCustomEvent.call(element, hideEvent, component);
        removeClass(popover,showClass);
        !!self[animation] ? emulateTransitionEnd(popover, hideTrigger) : hideTrigger();
      }
    }, self[delay] );
  };

  // init
  if ( !(stringPopover in element) ) { // prevent adding event handlers twice
    if (self[trigger] === hoverEvent) {
      on( element, mouseHover[0], self.show );
      if (!self[dismissible]) { on( element, mouseHover[1], self.hide ); }
    } else if (clickEvent == self[trigger] || 'focus' == self[trigger]) {
      on( element, self[trigger], self.toggle );
    }
  }
  element[stringPopover] = self;
};

// POPOVER DATA API
// ================
// supports[push]( [ stringPopover, Popover, '['+dataToggle+'="popover"]' ] );


module.exports = {Dropdown, Popover}