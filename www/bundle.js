/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _reset = __webpack_require__(126);

var _reset2 = _interopRequireDefault(_reset);

var _style = __webpack_require__(127);

var _style2 = _interopRequireDefault(_style);

__webpack_require__(125);

var _dom = __webpack_require__(91);

var _timetables = __webpack_require__(124);

var _card = __webpack_require__(123);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dom = Object.create(_dom.DOMHelper);
var timetables = Object.create(_timetables.Timetables);
var card = Object.create(_card.Card);
var refreshHandle = void 0;

var onError = function onError(e) {
    var errorMessage = e.message || e.code || e;
    var information = 'Nie uda\u0142o si\u0119 pobra\u0107 danych przystank\xF3w w okolicy. Upewnij si\u0119, \u017Ce masz w\u0142\u0105czone us\u0142ugi lokalizacji oraz dost\u0119p do Internetu, a nast\u0119pnie uruchom ponownie aplikacj\u0119. (' + errorMessage + ')';
    navigator.notification.alert(information, null, '¯\\_(ツ)_/¯');
    console.error(e);
};

var animateSplash = function animateSplash() {
    var direction = 'up';
    var splash = dom.$('.splash');

    var changeDirection = function changeDirection() {
        if (direction === 'out') {
            splash.removeEventListener('transitionend', changeDirection);
        } else {
            direction = direction === 'down' ? 'up' : 'down';
        }
        ['down', 'up'].forEach(function (c) {
            return splash.classList.remove(c);
        });
        splash.classList.add(direction);
    };

    splash.addEventListener('transitionend', changeDirection);
    changeDirection();

    return function (outCallback) {
        direction = 'out';
        splash.addEventListener('transitionend', outCallback);
    };
};

var renderBoards = function renderBoards(boards) {
    var container = document.querySelector('.cards');
    var fragment = document.createDocumentFragment();
    var cards = boards.map(card.buildFullCard);

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    cards.forEach(function (card) {
        return fragment.appendChild(card);
    });
    container.appendChild(fragment);

    return cards;
};

var updateBoards = function updateBoards(boardsData, cardsHandles) {
    boardsData.forEach(function (boardData, index) {
        return card.update(cardsHandles[index], boardData);
    });
};

var setupRefresh = function setupRefresh(cardsHandles) {
    var refreshInterval = 30 * 1000;

    return setInterval(function () {
        timetables.fetchNearbyTimetables().then(function (boardsData) {
            return updateBoards(boardsData, cardsHandles);
        }).catch(onError);
    }, refreshInterval);
};

var onInfo = function onInfo(e) {
    var information = 'Wygodny klient rozk\u0142ad\xF3w jazdy dost\u0119pnych na stronie rozklady.lodz.pl. Aplikacja wy\u015Bwietla na \u017Cywo tablice rozk\u0142adowe przystank\xF3w znajduj\u0105cych si\u0119 w okolicy.\n\nKontakt: tabliceprzystankowe@gmail.com';
    navigator.notification.alert(information, null, 'Tablice Przystankowe');
};

var onPause = function onPause() {
    return clearInterval(refreshHandle);
};
var onResume = function onResume() {
    if (!refreshHandle) {
        var cardsHandles = dom.$all('.card');
        refreshHandle = setupRefresh(cardsHandles);
    }
    timetables.fetchNearbyTimetables();
};

var onDeviceReady = function onDeviceReady() {
    if (cordova.platformId == 'android') {
        StatusBar.backgroundColorByHexString('ee8801');
    }

    var stopAnimateSplash = animateSplash();

    dom.$('#menu-info').addEventListener('click', onInfo);
    document.addEventListener('pause', onPause);
    document.addEventListener('resume', onResume);

    timetables.fetchNearbyTimetables().then(function (boardsData) {
        var cardsHandles = renderBoards(boardsData);
        refreshHandle = setupRefresh(cardsHandles);
        stopAnimateSplash();
    }).catch(onError);
};

document.addEventListener('deviceready', onDeviceReady);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(3)
  , core      = __webpack_require__(14)
  , hide      = __webpack_require__(15)
  , redefine  = __webpack_require__(18)
  , ctx       = __webpack_require__(24)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target)redefine(target, key, out, type & $export.U);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(5);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(61)('wks')
  , uid        = __webpack_require__(43)
  , Symbol     = __webpack_require__(3).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(2)
  , IE8_DOM_DEFINE = __webpack_require__(100)
  , toPrimitive    = __webpack_require__(26)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(8) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(4)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(33)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(21);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(47)
  , defined = __webpack_require__(21);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(7)
  , createDesc = __webpack_require__(29);
module.exports = __webpack_require__(8) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(48)
  , createDesc     = __webpack_require__(29)
  , toIObject      = __webpack_require__(12)
  , toPrimitive    = __webpack_require__(26)
  , has            = __webpack_require__(11)
  , IE8_DOM_DEFINE = __webpack_require__(100)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(8) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(11)
  , toObject    = __webpack_require__(10)
  , IE_PROTO    = __webpack_require__(81)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(3)
  , hide      = __webpack_require__(15)
  , has       = __webpack_require__(11)
  , SRC       = __webpack_require__(43)('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

__webpack_require__(14).inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  var isFunction = typeof val == 'function';
  if(isFunction)has(val, 'name') || hide(val, 'name', key);
  if(O[key] === val)return;
  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if(O === global){
    O[key] = val;
  } else {
    if(!safe){
      delete O[key];
      hide(O, key, val);
    } else {
      if(O[key])O[key] = val;
      else hide(O, key, val);
    }
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1)
  , fails   = __webpack_require__(4)
  , defined = __webpack_require__(21)
  , quot    = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function(string, tag, attribute, value) {
  var S  = String(defined(string))
    , p1 = '<' + tag;
  if(attribute !== '')p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function(NAME, exec){
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function(){
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(4);

module.exports = function(method, arg){
  return !!method && fails(function(){
    arg ? method.call(null, function(){}, 1) : method.call(null);
  });
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = __webpack_require__(24)
  , IObject  = __webpack_require__(47)
  , toObject = __webpack_require__(10)
  , toLength = __webpack_require__(9)
  , asc      = __webpack_require__(132);
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(13);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(1)
  , core    = __webpack_require__(14)
  , fails   = __webpack_require__(4);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(5);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var Map     = __webpack_require__(117)
  , $export = __webpack_require__(1)
  , shared  = __webpack_require__(61)('metadata')
  , store   = shared.store || (shared.store = new (__webpack_require__(120)));

var getOrCreateMetadataMap = function(target, targetKey, create){
  var targetMetadata = store.get(target);
  if(!targetMetadata){
    if(!create)return undefined;
    store.set(target, targetMetadata = new Map);
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if(!keyMetadata){
    if(!create)return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map);
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function(MetadataKey, MetadataValue, O, P){
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function(target, targetKey){
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false)
    , keys        = [];
  if(metadataMap)metadataMap.forEach(function(_, key){ keys.push(key); });
  return keys;
};
var toMetaKey = function(it){
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function(O){
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(2)
  , dPs         = __webpack_require__(106)
  , enumBugKeys = __webpack_require__(66)
  , IE_PROTO    = __webpack_require__(81)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(65)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(68).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

if(__webpack_require__(8)){
  var LIBRARY             = __webpack_require__(38)
    , global              = __webpack_require__(3)
    , fails               = __webpack_require__(4)
    , $export             = __webpack_require__(1)
    , $typed              = __webpack_require__(62)
    , $buffer             = __webpack_require__(88)
    , ctx                 = __webpack_require__(24)
    , anInstance          = __webpack_require__(34)
    , propertyDesc        = __webpack_require__(29)
    , hide                = __webpack_require__(15)
    , redefineAll         = __webpack_require__(40)
    , toInteger           = __webpack_require__(33)
    , toLength            = __webpack_require__(9)
    , toIndex             = __webpack_require__(42)
    , toPrimitive         = __webpack_require__(26)
    , has                 = __webpack_require__(11)
    , same                = __webpack_require__(113)
    , classof             = __webpack_require__(35)
    , isObject            = __webpack_require__(5)
    , toObject            = __webpack_require__(10)
    , isArrayIter         = __webpack_require__(70)
    , create              = __webpack_require__(28)
    , getPrototypeOf      = __webpack_require__(17)
    , gOPN                = __webpack_require__(39).f
    , getIterFn           = __webpack_require__(49)
    , uid                 = __webpack_require__(43)
    , wks                 = __webpack_require__(6)
    , createArrayMethod   = __webpack_require__(23)
    , createArrayIncludes = __webpack_require__(50)
    , speciesConstructor  = __webpack_require__(82)
    , ArrayIterators      = __webpack_require__(90)
    , Iterators           = __webpack_require__(37)
    , $iterDetect         = __webpack_require__(58)
    , setSpecies          = __webpack_require__(41)
    , arrayFill           = __webpack_require__(63)
    , arrayCopyWithin     = __webpack_require__(93)
    , $DP                 = __webpack_require__(7)
    , $GOPD               = __webpack_require__(16)
    , dP                  = $DP.f
    , gOPD                = $GOPD.f
    , RangeError          = global.RangeError
    , TypeError           = global.TypeError
    , Uint8Array          = global.Uint8Array
    , ARRAY_BUFFER        = 'ArrayBuffer'
    , SHARED_BUFFER       = 'Shared' + ARRAY_BUFFER
    , BYTES_PER_ELEMENT   = 'BYTES_PER_ELEMENT'
    , PROTOTYPE           = 'prototype'
    , ArrayProto          = Array[PROTOTYPE]
    , $ArrayBuffer        = $buffer.ArrayBuffer
    , $DataView           = $buffer.DataView
    , arrayForEach        = createArrayMethod(0)
    , arrayFilter         = createArrayMethod(2)
    , arraySome           = createArrayMethod(3)
    , arrayEvery          = createArrayMethod(4)
    , arrayFind           = createArrayMethod(5)
    , arrayFindIndex      = createArrayMethod(6)
    , arrayIncludes       = createArrayIncludes(true)
    , arrayIndexOf        = createArrayIncludes(false)
    , arrayValues         = ArrayIterators.values
    , arrayKeys           = ArrayIterators.keys
    , arrayEntries        = ArrayIterators.entries
    , arrayLastIndexOf    = ArrayProto.lastIndexOf
    , arrayReduce         = ArrayProto.reduce
    , arrayReduceRight    = ArrayProto.reduceRight
    , arrayJoin           = ArrayProto.join
    , arraySort           = ArrayProto.sort
    , arraySlice          = ArrayProto.slice
    , arrayToString       = ArrayProto.toString
    , arrayToLocaleString = ArrayProto.toLocaleString
    , ITERATOR            = wks('iterator')
    , TAG                 = wks('toStringTag')
    , TYPED_CONSTRUCTOR   = uid('typed_constructor')
    , DEF_CONSTRUCTOR     = uid('def_constructor')
    , ALL_CONSTRUCTORS    = $typed.CONSTR
    , TYPED_ARRAY         = $typed.TYPED
    , VIEW                = $typed.VIEW
    , WRONG_LENGTH        = 'Wrong length!';

  var $map = createArrayMethod(1, function(O, length){
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function(){
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function(){
    new Uint8Array(1).set({});
  });

  var strictToLength = function(it, SAME){
    if(it === undefined)throw TypeError(WRONG_LENGTH);
    var number = +it
      , length = toLength(it);
    if(SAME && !same(number, length))throw RangeError(WRONG_LENGTH);
    return length;
  };

  var toOffset = function(it, BYTES){
    var offset = toInteger(it);
    if(offset < 0 || offset % BYTES)throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function(it){
    if(isObject(it) && TYPED_ARRAY in it)return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function(C, length){
    if(!(isObject(C) && TYPED_CONSTRUCTOR in C)){
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function(O, list){
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function(C, list){
    var index  = 0
      , length = list.length
      , result = allocate(C, length);
    while(length > index)result[index] = list[index++];
    return result;
  };

  var addGetter = function(it, key, internal){
    dP(it, key, {get: function(){ return this._d[internal]; }});
  };

  var $from = function from(source /*, mapfn, thisArg */){
    var O       = toObject(source)
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , iterFn  = getIterFn(O)
      , i, length, values, result, step, iterator;
    if(iterFn != undefined && !isArrayIter(iterFn)){
      for(iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++){
        values.push(step.value);
      } O = values;
    }
    if(mapping && aLen > 2)mapfn = ctx(mapfn, arguments[2], 2);
    for(i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++){
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/*...items*/){
    var index  = 0
      , length = arguments.length
      , result = allocate(this, length);
    while(length > index)result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function(){ arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString(){
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /*, end */){
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /*, thisArg */){
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /*, start, end */){ // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /*, thisArg */){
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /*, thisArg */){
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /*, thisArg */){
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /*, thisArg */){
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /*, fromIndex */){
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /*, fromIndex */){
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator){ // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */){ // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /*, thisArg */){
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse(){
      var that   = this
        , length = validate(that).length
        , middle = Math.floor(length / 2)
        , index  = 0
        , value;
      while(index < middle){
        value         = that[index];
        that[index++] = that[--length];
        that[length]  = value;
      } return that;
    },
    some: function some(callbackfn /*, thisArg */){
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn){
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end){
      var O      = validate(this)
        , length = O.length
        , $begin = toIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end){
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /*, offset */){
    validate(this);
    var offset = toOffset(arguments[1], 1)
      , length = this.length
      , src    = toObject(arrayLike)
      , len    = toLength(src.length)
      , index  = 0;
    if(len + offset > length)throw RangeError(WRONG_LENGTH);
    while(index < len)this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries(){
      return arrayEntries.call(validate(this));
    },
    keys: function keys(){
      return arrayKeys.call(validate(this));
    },
    values: function values(){
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function(target, key){
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key){
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc){
    if(isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ){
      target[key] = desc.value;
      return target;
    } else return dP(target, key, desc);
  };

  if(!ALL_CONSTRUCTORS){
    $GOPD.f = $getDesc;
    $DP.f   = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty:           $setDesc
  });

  if(fails(function(){ arrayToString.call({}); })){
    arrayToString = arrayToLocaleString = function toString(){
      return arrayJoin.call(this);
    }
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice:          $slice,
    set:            $set,
    constructor:    function(){ /* noop */ },
    toString:       arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function(){ return this[TYPED_ARRAY]; }
  });

  module.exports = function(KEY, BYTES, wrapper, CLAMPED){
    CLAMPED = !!CLAMPED;
    var NAME       = KEY + (CLAMPED ? 'Clamped' : '') + 'Array'
      , ISNT_UINT8 = NAME != 'Uint8Array'
      , GETTER     = 'get' + KEY
      , SETTER     = 'set' + KEY
      , TypedArray = global[NAME]
      , Base       = TypedArray || {}
      , TAC        = TypedArray && getPrototypeOf(TypedArray)
      , FORCED     = !TypedArray || !$typed.ABV
      , O          = {}
      , TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function(that, index){
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function(that, index, value){
      var data = that._d;
      if(CLAMPED)value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function(that, index){
      dP(that, index, {
        get: function(){
          return getter(this, index);
        },
        set: function(value){
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if(FORCED){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME, '_d');
        var index  = 0
          , offset = 0
          , buffer, byteLength, length, klass;
        if(!isObject(data)){
          length     = strictToLength(data, true)
          byteLength = length * BYTES;
          buffer     = new $ArrayBuffer(byteLength);
        } else if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if($length === undefined){
            if($len % BYTES)throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if(byteLength < 0)throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if(byteLength + offset > $len)throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if(TYPED_ARRAY in data){
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while(index < length)addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if(!$iterDetect(function(iter){
      // V8 works with iterators, but fails in many other cases
      // https://code.google.com/p/v8/issues/detail?id=4552
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if(!isObject(data))return new Base(strictToLength(data, ISNT_UINT8));
        if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if(TYPED_ARRAY in data)return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function(key){
        if(!(key in TypedArray))hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if(!LIBRARY)TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator   = TypedArrayPrototype[ITERATOR]
      , CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined)
      , $iterator         = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if(CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)){
      dP(TypedArrayPrototype, TAG, {
        get: function(){ return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES,
      from: $from,
      of: $of
    });

    if(!(BYTES_PER_ELEMENT in TypedArrayPrototype))hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, {set: $set});

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, {toString: arrayToString});

    $export($export.P + $export.F * fails(function(){
      new TypedArray(1).slice();
    }), NAME, {slice: $slice});

    $export($export.P + $export.F * (fails(function(){
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString()
    }) || !fails(function(){
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, {toLocaleString: $toLocaleString});

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if(!LIBRARY && !CORRECT_ITER_NAME)hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function(){ /* empty */ };

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(43)('meta')
  , isObject = __webpack_require__(5)
  , has      = __webpack_require__(11)
  , setDesc  = __webpack_require__(7).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(4)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(108)
  , enumBugKeys = __webpack_require__(66);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(20)
  , TAG = __webpack_require__(6)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var ctx         = __webpack_require__(24)
  , call        = __webpack_require__(102)
  , isArrayIter = __webpack_require__(70)
  , anObject    = __webpack_require__(2)
  , toLength    = __webpack_require__(9)
  , getIterFn   = __webpack_require__(49)
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = false;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(108)
  , hiddenKeys = __webpack_require__(66).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(18);
module.exports = function(target, src, safe){
  for(var key in src)redefine(target, key, src[key], safe);
  return target;
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global      = __webpack_require__(3)
  , dP          = __webpack_require__(7)
  , DESCRIPTORS = __webpack_require__(8)
  , SPECIES     = __webpack_require__(6)('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(33)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 43 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(6)('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)__webpack_require__(15)(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(7).f
  , has = __webpack_require__(11)
  , TAG = __webpack_require__(6)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1)
  , defined = __webpack_require__(21)
  , fails   = __webpack_require__(4)
  , spaces  = __webpack_require__(86)
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec, ALIAS){
  var exp   = {};
  var FORCE = fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if(ALIAS)exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(20);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 48 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(35)
  , ITERATOR  = __webpack_require__(6)('iterator')
  , Iterators = __webpack_require__(37);
module.exports = __webpack_require__(14).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(12)
  , toLength  = __webpack_require__(9)
  , toIndex   = __webpack_require__(42);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global            = __webpack_require__(3)
  , $export           = __webpack_require__(1)
  , redefine          = __webpack_require__(18)
  , redefineAll       = __webpack_require__(40)
  , meta              = __webpack_require__(31)
  , forOf             = __webpack_require__(36)
  , anInstance        = __webpack_require__(34)
  , isObject          = __webpack_require__(5)
  , fails             = __webpack_require__(4)
  , $iterDetect       = __webpack_require__(58)
  , setToStringTag    = __webpack_require__(45)
  , inheritIfRequired = __webpack_require__(69);

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO = !IS_WEAK && fails(function(){
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new C()
          , index     = 5;
        while(index--)$instance[ADDER](index, index);
        return !$instance.has(-0);
      });
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base, target, C);
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hide     = __webpack_require__(15)
  , redefine = __webpack_require__(18)
  , fails    = __webpack_require__(4)
  , defined  = __webpack_require__(21)
  , wks      = __webpack_require__(6);

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , fns      = exec(defined, SYMBOL, ''[KEY])
    , strfn    = fns[0]
    , rxfn     = fns[1];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return rxfn.call(string, this); }
    );
  }
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(2);
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};

/***/ }),
/* 54 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(5)
  , cof      = __webpack_require__(20)
  , MATCH    = __webpack_require__(6)('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(28)
  , descriptor     = __webpack_require__(29)
  , setToStringTag = __webpack_require__(45)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(15)(IteratorPrototype, __webpack_require__(6)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(38)
  , $export        = __webpack_require__(1)
  , redefine       = __webpack_require__(18)
  , hide           = __webpack_require__(15)
  , has            = __webpack_require__(11)
  , Iterators      = __webpack_require__(37)
  , $iterCreate    = __webpack_require__(56)
  , setToStringTag = __webpack_require__(45)
  , getPrototypeOf = __webpack_require__(17)
  , ITERATOR       = __webpack_require__(6)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(6)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// Forced replacement prototype accessors methods
module.exports = __webpack_require__(38)|| !__webpack_require__(4)(function(){
  var K = Math.random();
  // In FF throws only define methods
  __defineSetter__.call(null, K, function(){ /* empty */});
  delete __webpack_require__(3)[K];
});

/***/ }),
/* 60 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3)
  , hide   = __webpack_require__(15)
  , uid    = __webpack_require__(43)
  , TYPED  = uid('typed_array')
  , VIEW   = uid('view')
  , ABV    = !!(global.ArrayBuffer && global.DataView)
  , CONSTR = ABV
  , i = 0, l = 9, Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while(i < l){
  if(Typed = global[TypedArrayConstructors[i++]]){
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV:    ABV,
  CONSTR: CONSTR,
  TYPED:  TYPED,
  VIEW:   VIEW
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)

var toObject = __webpack_require__(10)
  , toIndex  = __webpack_require__(42)
  , toLength = __webpack_require__(9);
module.exports = function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , aLen   = arguments.length
    , index  = toIndex(aLen > 1 ? arguments[1] : undefined, length)
    , end    = aLen > 2 ? arguments[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(7)
  , createDesc      = __webpack_require__(29);

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(5)
  , document = __webpack_require__(3).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 66 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__(6)('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3).document && document.documentElement;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var isObject       = __webpack_require__(5)
  , setPrototypeOf = __webpack_require__(80).set;
module.exports = function(that, target, C){
  var P, S = target.constructor;
  if(S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf){
    setPrototypeOf(that, P);
  } return that;
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(37)
  , ITERATOR   = __webpack_require__(6)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(20);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 73 */
/***/ (function(module, exports) {

// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

/***/ }),
/* 74 */
/***/ (function(module, exports) {

// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(3)
  , macrotask = __webpack_require__(87).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = __webpack_require__(20)(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = __webpack_require__(32)
  , gOPS     = __webpack_require__(60)
  , pIE      = __webpack_require__(48)
  , toObject = __webpack_require__(10)
  , IObject  = __webpack_require__(47)
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(4)(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN     = __webpack_require__(39)
  , gOPS     = __webpack_require__(60)
  , anObject = __webpack_require__(2)
  , Reflect  = __webpack_require__(3).Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = gOPN.f(anObject(it))
    , getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var path      = __webpack_require__(112)
  , invoke    = __webpack_require__(54)
  , aFunction = __webpack_require__(13);
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that = this
      , aLen = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !aLen)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(aLen > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};

/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(5)
  , anObject = __webpack_require__(2);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(24)(Function.call, __webpack_require__(16).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(61)('keys')
  , uid    = __webpack_require__(43);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = __webpack_require__(2)
  , aFunction = __webpack_require__(13)
  , SPECIES   = __webpack_require__(6)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(33)
  , defined   = __webpack_require__(21);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__(55)
  , defined  = __webpack_require__(21);

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toInteger = __webpack_require__(33)
  , defined   = __webpack_require__(21);

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};

/***/ }),
/* 86 */
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var ctx                = __webpack_require__(24)
  , invoke             = __webpack_require__(54)
  , html               = __webpack_require__(68)
  , cel                = __webpack_require__(65)
  , global             = __webpack_require__(3)
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(__webpack_require__(20)(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global         = __webpack_require__(3)
  , DESCRIPTORS    = __webpack_require__(8)
  , LIBRARY        = __webpack_require__(38)
  , $typed         = __webpack_require__(62)
  , hide           = __webpack_require__(15)
  , redefineAll    = __webpack_require__(40)
  , fails          = __webpack_require__(4)
  , anInstance     = __webpack_require__(34)
  , toInteger      = __webpack_require__(33)
  , toLength       = __webpack_require__(9)
  , gOPN           = __webpack_require__(39).f
  , dP             = __webpack_require__(7).f
  , arrayFill      = __webpack_require__(63)
  , setToStringTag = __webpack_require__(45)
  , ARRAY_BUFFER   = 'ArrayBuffer'
  , DATA_VIEW      = 'DataView'
  , PROTOTYPE      = 'prototype'
  , WRONG_LENGTH   = 'Wrong length!'
  , WRONG_INDEX    = 'Wrong index!'
  , $ArrayBuffer   = global[ARRAY_BUFFER]
  , $DataView      = global[DATA_VIEW]
  , Math           = global.Math
  , RangeError     = global.RangeError
  , Infinity       = global.Infinity
  , BaseBuffer     = $ArrayBuffer
  , abs            = Math.abs
  , pow            = Math.pow
  , floor          = Math.floor
  , log            = Math.log
  , LN2            = Math.LN2
  , BUFFER         = 'buffer'
  , BYTE_LENGTH    = 'byteLength'
  , BYTE_OFFSET    = 'byteOffset'
  , $BUFFER        = DESCRIPTORS ? '_b' : BUFFER
  , $LENGTH        = DESCRIPTORS ? '_l' : BYTE_LENGTH
  , $OFFSET        = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754 = function(value, mLen, nBytes){
  var buffer = Array(nBytes)
    , eLen   = nBytes * 8 - mLen - 1
    , eMax   = (1 << eLen) - 1
    , eBias  = eMax >> 1
    , rt     = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0
    , i      = 0
    , s      = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0
    , e, m, c;
  value = abs(value)
  if(value != value || value === Infinity){
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if(value * (c = pow(2, -e)) < 1){
      e--;
      c *= 2;
    }
    if(e + eBias >= 1){
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if(value * c >= 2){
      e++;
      c /= 2;
    }
    if(e + eBias >= eMax){
      m = 0;
      e = eMax;
    } else if(e + eBias >= 1){
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for(; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for(; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
};
var unpackIEEE754 = function(buffer, mLen, nBytes){
  var eLen  = nBytes * 8 - mLen - 1
    , eMax  = (1 << eLen) - 1
    , eBias = eMax >> 1
    , nBits = eLen - 7
    , i     = nBytes - 1
    , s     = buffer[i--]
    , e     = s & 127
    , m;
  s >>= 7;
  for(; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for(; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if(e === 0){
    e = 1 - eBias;
  } else if(e === eMax){
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
};

var unpackI32 = function(bytes){
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
};
var packI8 = function(it){
  return [it & 0xff];
};
var packI16 = function(it){
  return [it & 0xff, it >> 8 & 0xff];
};
var packI32 = function(it){
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
};
var packF64 = function(it){
  return packIEEE754(it, 52, 8);
};
var packF32 = function(it){
  return packIEEE754(it, 23, 4);
};

var addGetter = function(C, key, internal){
  dP(C[PROTOTYPE], key, {get: function(){ return this[internal]; }});
};

var get = function(view, bytes, index, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
};
var set = function(view, bytes, index, conversion, value, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = conversion(+value);
  for(var i = 0; i < bytes; i++)store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
};

var validateArrayBufferArguments = function(that, length){
  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
  var numberLength = +length
    , byteLength   = toLength(numberLength);
  if(numberLength != byteLength)throw RangeError(WRONG_LENGTH);
  return byteLength;
};

if(!$typed.ABV){
  $ArrayBuffer = function ArrayBuffer(length){
    var byteLength = validateArrayBufferArguments(this, length);
    this._b       = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength){
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH]
      , offset       = toInteger(byteOffset);
    if(offset < 0 || offset > bufferLength)throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if(offset + byteLength > bufferLength)throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if(DESCRIPTORS){
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset){
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset){
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */){
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if(!fails(function(){
    new $ArrayBuffer;     // eslint-disable-line no-new
  }) || !fails(function(){
    new $ArrayBuffer(.5); // eslint-disable-line no-new
  })){
    $ArrayBuffer = function ArrayBuffer(length){
      return new BaseBuffer(validateArrayBufferArguments(this, length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for(var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j; ){
      if(!((key = keys[j++]) in $ArrayBuffer))hide($ArrayBuffer, key, BaseBuffer[key]);
    };
    if(!LIBRARY)ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2))
    , $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if(view.getInt8(0) || !view.getInt8(1))redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(3)
  , core           = __webpack_require__(14)
  , LIBRARY        = __webpack_require__(38)
  , wksExt         = __webpack_require__(115)
  , defineProperty = __webpack_require__(7).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(44)
  , step             = __webpack_require__(72)
  , Iterators        = __webpack_require__(37)
  , toIObject        = __webpack_require__(12);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(57)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var $ = function $(selector) {
    return document.querySelector(selector);
};
var $all = function $all(selector) {
    return document.querySelectorAll(selector);
};
var create = function create(tagName, text) {
    var element = document.createElement(tagName);
    if (text) {
        element.innerHTML = text;
    }
    return element;
};

var DOMHelper = exports.DOMHelper = {
    $: $, $all: $all, create: create
};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var cof = __webpack_require__(20);
module.exports = function(it, msg){
  if(typeof it != 'number' && cof(it) != 'Number')throw TypeError(msg);
  return +it;
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)

var toObject = __webpack_require__(10)
  , toIndex  = __webpack_require__(42)
  , toLength = __webpack_require__(9);

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , end   = arguments.length > 2 ? arguments[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(36);

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(13)
  , toObject  = __webpack_require__(10)
  , IObject   = __webpack_require__(47)
  , toLength  = __webpack_require__(9);

module.exports = function(that, callbackfn, aLen, memo, isRight){
  aFunction(callbackfn);
  var O      = toObject(that)
    , self   = IObject(O)
    , length = toLength(O.length)
    , index  = isRight ? length - 1 : 0
    , i      = isRight ? -1 : 1;
  if(aLen < 2)for(;;){
    if(index in self){
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if(isRight ? index < 0 : length <= index){
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for(;isRight ? index >= 0 : length > index; index += i)if(index in self){
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction  = __webpack_require__(13)
  , isObject   = __webpack_require__(5)
  , invoke     = __webpack_require__(54)
  , arraySlice = [].slice
  , factories  = {};

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /*, args... */){
  var fn       = aFunction(this)
    , partArgs = arraySlice.call(arguments, 1);
  var bound = function(/* args... */){
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if(isObject(fn.prototype))bound.prototype = fn.prototype;
  return bound;
};

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP          = __webpack_require__(7).f
  , create      = __webpack_require__(28)
  , redefineAll = __webpack_require__(40)
  , ctx         = __webpack_require__(24)
  , anInstance  = __webpack_require__(34)
  , defined     = __webpack_require__(21)
  , forOf       = __webpack_require__(36)
  , $iterDefine = __webpack_require__(57)
  , step        = __webpack_require__(72)
  , setSpecies  = __webpack_require__(41)
  , DESCRIPTORS = __webpack_require__(8)
  , fastKey     = __webpack_require__(31).fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(35)
  , from    = __webpack_require__(94);
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefineAll       = __webpack_require__(40)
  , getWeak           = __webpack_require__(31).getWeak
  , anObject          = __webpack_require__(2)
  , isObject          = __webpack_require__(5)
  , anInstance        = __webpack_require__(34)
  , forOf             = __webpack_require__(36)
  , createArrayMethod = __webpack_require__(23)
  , $has              = __webpack_require__(11)
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function(that){
  return that._l || (that._l = new UncaughtFrozenStore);
};
var UncaughtFrozenStore = function(){
  this.a = [];
};
var findUncaughtFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function(key){
    var entry = findUncaughtFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findUncaughtFrozen(this, key);
  },
  set: function(key, value){
    var entry = findUncaughtFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this)['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var data = getWeak(anObject(key), true);
    if(data === true)uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(8) && !__webpack_require__(4)(function(){
  return Object.defineProperty(__webpack_require__(65)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__(5)
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(2);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(32)
  , toIObject = __webpack_require__(12);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 104 */
/***/ (function(module, exports) {

// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var dP        = __webpack_require__(7)
  , gOPD      = __webpack_require__(16)
  , ownKeys   = __webpack_require__(77)
  , toIObject = __webpack_require__(12);

module.exports = function define(target, mixin){
  var keys   = ownKeys(toIObject(mixin))
    , length = keys.length
    , i = 0, key;
  while(length > i)dP.f(target, key = keys[i++], gOPD.f(mixin, key));
  return target;
};

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(7)
  , anObject = __webpack_require__(2)
  , getKeys  = __webpack_require__(32);

module.exports = __webpack_require__(8) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(12)
  , gOPN      = __webpack_require__(39).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(11)
  , toIObject    = __webpack_require__(12)
  , arrayIndexOf = __webpack_require__(50)(false)
  , IE_PROTO     = __webpack_require__(81)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(32)
  , toIObject = __webpack_require__(12)
  , isEnum    = __webpack_require__(48).f;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var $parseFloat = __webpack_require__(3).parseFloat
  , $trim       = __webpack_require__(46).trim;

module.exports = 1 / $parseFloat(__webpack_require__(86) + '-0') !== -Infinity ? function parseFloat(str){
  var string = $trim(String(str), 3)
    , result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(3).parseInt
  , $trim     = __webpack_require__(46).trim
  , ws        = __webpack_require__(86)
  , hex       = /^[\-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix){
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);

/***/ }),
/* 113 */
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-string-pad-start-end
var toLength = __webpack_require__(9)
  , repeat   = __webpack_require__(85)
  , defined  = __webpack_require__(21);

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength || fillStr == '')return S;
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(6);

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(35)
  , ITERATOR  = __webpack_require__(6)('iterator')
  , Iterators = __webpack_require__(37);
module.exports = __webpack_require__(14).isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(97);

// 23.1 Map Objects
module.exports = __webpack_require__(51)('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if(__webpack_require__(8) && /./g.flags != 'g')__webpack_require__(7).f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(53)
});

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(97);

// 23.2 Set Objects
module.exports = __webpack_require__(51)('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var each         = __webpack_require__(23)(0)
  , redefine     = __webpack_require__(18)
  , meta         = __webpack_require__(31)
  , assign       = __webpack_require__(76)
  , weak         = __webpack_require__(99)
  , isObject     = __webpack_require__(5)
  , getWeak      = meta.getWeak
  , isExtensible = Object.isExtensible
  , uncaughtFrozenStore = weak.ufstore
  , tmp          = {}
  , InternalMap;

var wrapper = function(get){
  return function WeakMap(){
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      var data = getWeak(key);
      if(data === true)return uncaughtFrozenStore(this).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = __webpack_require__(51)('WeakMap', wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  InternalMap = weak.getConstructor(wrapper);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on internal weakmap shim
      if(isObject(a) && !isExtensible(a)){
        if(!this._f)this._f = new InternalMap;
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}

/***/ }),
/* 121 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(320);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list, options);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list, options) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove, transformResult;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    transformResult = options.transform(obj.css);
	    
	    if (transformResult) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = transformResult;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css. 
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Card = undefined;

var _dom = __webpack_require__(91);

var expandedClassName = 'expanded';
var dom = Object.create(_dom.DOMHelper);

var createCardHeader = function createCardHeader(board) {
    return dom.create('h2', board.stopName);
};

var createCardBody = function createCardBody(board) {
    var table = dom.create('table');
    table.classList.add('timetable');
    var body = dom.create('tbody');

    board.departures.map(function (departure) {
        var row = dom.create('tr');
        var numberCell = dom.create('td', departure.number);
        var directionCell = dom.create('td', departure.direction);
        var timeCell = dom.create('td', departure.time);

        row.appendChild(numberCell);
        row.appendChild(directionCell);
        row.appendChild(timeCell);

        return row;
    }).forEach(function (row) {
        body.appendChild(row);
    });

    table.appendChild(body);
    return table;
};

var toggleExpand = function toggleExpand(event) {
    var target = event.currentTarget;

    if (target.classList.contains(expandedClassName)) {
        target.classList.remove(expandedClassName);
    } else {
        target.classList.add(expandedClassName);
    }
};

var buildContents = function buildContents(boardData) {
    var contents = document.createDocumentFragment();

    contents.appendChild(createCardHeader(boardData));
    contents.appendChild(createCardBody(boardData));

    return contents;
};

var buildFullCard = function buildFullCard(boardData) {
    var card = dom.create('div');
    var contents = buildContents(boardData);

    card.dataset.stopId = boardData.stopId;
    card.classList.add('card');
    card.addEventListener('click', toggleExpand);
    card.appendChild(contents);

    return card;
};

var update = function update(card, boardData) {
    if (card.dataset.stopId !== boardData.stopId) {
        card.dataset.stopId = boardData.stopId;
        card.classList.remove(expandedClassName);
    }
    var contents = buildContents(boardData);

    while (card.firstChild) {
        card.removeChild(card.firstChild);
    }

    card.appendChild(contents);
};

var Card = exports.Card = {
    buildFullCard: buildFullCard,
    buildContents: buildContents,
    update: update
};

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Timetables = undefined;

var _http = __webpack_require__(129);

var _geolocation = __webpack_require__(128);

var _stop = __webpack_require__(130);

var http = Object.create(_http.Http);
var geolocation = Object.create(_geolocation.Geolocation);
var stop = Object.create(_stop.Stop);

var fetchCookie = function fetchCookie() {
    return http.head('http://rozklady.lodz.pl');
};

var parseXmlDepartures = function parseXmlDepartures(rawXml) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(rawXml, 'application/xml');
    var stop = doc.getElementsByTagName('Stop')[0];
    var result = {
        currentTime: doc.firstElementChild.attributes.time.value,
        departures: [],
        stopId: stop.attributes['id'].value,
        stopName: stop.attributes['name'].value
    };

    var rows = doc.getElementsByTagName('R');

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var departure = {
            direction: row.attributes.dir.value,
            number: row.attributes.nr.value,
            time: row.firstElementChild.attributes.t.value
        };
        result.departures.push(departure);
    }

    return result;
};

var fetchTimetablesByStopsIds = function fetchTimetablesByStopsIds(stopIds) {
    var promises = stopIds.map(function (stopId) {
        return http.get('http://rozklady.lodz.pl/Home/GetTimetableReal?busStopId=' + stopId).then(function (response) {
            var parsed = parseXmlDepartures(response.responseText);
            return Promise.resolve(parsed);
        });
    });

    return Promise.all(promises);
};

var fetchNearbyTimetables = function fetchNearbyTimetables() {
    var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    return fetchCookie().then(function () {
        return geolocation.getCurrentPosition();
    }).then(function (position) {
        return stop.getNearest(position.coords.latitude, position.coords.longitude, limit);
    }).then(function (nearestStopsDistances) {
        var extractId = function extractId(nearestStopDistance) {
            return nearestStopDistance.id;
        };
        return Promise.resolve(nearestStopsDistances.map(extractId));
    }).then(function (stopsIds) {
        return fetchTimetablesByStopsIds(stopsIds);
    });
};

var Timetables = exports.Timetables = {
    fetchNearbyTimetables: fetchNearbyTimetables
};

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(317);
__webpack_require__(136);
__webpack_require__(49);
__webpack_require__(138);
__webpack_require__(116);
__webpack_require__(135);
__webpack_require__(137);
__webpack_require__(142);
__webpack_require__(140);
__webpack_require__(141);
__webpack_require__(143);
__webpack_require__(139);
__webpack_require__(144);
__webpack_require__(145);
__webpack_require__(146);
module.exports = __webpack_require__(14);

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(318);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(122)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./reset.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./reset.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(319);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(122)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./style.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var getCurrentPosition = function getCurrentPosition() {
    return new Promise(function (resolve, reject) {
        var timeout = 10000;
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: timeout });
    });
};

var Geolocation = exports.Geolocation = {
    getCurrentPosition: getCurrentPosition
};

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var METHODS = {
    GET: 'GET',
    POST: 'POST',
    HEAD: 'HEAD'
};

var doRequest = function doRequest(url) {
    var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : METHODS.GET;
    var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    return new Promise(function (resolve, reject) {
        var isAsync = true;
        var isLocalBrowser = location.protocol.indexOf('http') > -1;
        var localProxyAddress = 'http://localhost:1337/';
        var request = new XMLHttpRequest();
        request.withCredentials = true;

        if (isLocalBrowser) {
            url = url.replace('https://', '').replace('http://', '');
            url = localProxyAddress + url;
        }

        request.onreadystatechange = function (event) {
            var isSuccessful = request.readyState === XMLHttpRequest.DONE;
            if (isSuccessful) {
                var isHttpOk = request.status === 200;
                if (isHttpOk) {
                    resolve(request);
                } else {
                    reject(request);
                }
            }
        };

        request.open(method, url, isAsync);
        request.send(data);
    });
};

var Http = exports.Http = {
    get: function get(url, headers) {
        return doRequest(url, METHODS.GET, headers, null);
    },
    head: function head(url, headers) {
        return doRequest(url, METHODS.HEAD, headers, null);
    },
    post: function post(url, headers, data) {
        return doRequest(url, METHODS.POST, headers, data);
    }
};

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Stop = undefined;

var _stopsData = __webpack_require__(323);

var _stopsData2 = _interopRequireDefault(_stopsData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deg2rad = function deg2rad(deg) {
    return deg * (Math.PI / 180);
};

var getDistanceInMeters = function getDistanceInMeters(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c * 1000; // Distance in m
    return d;
};

var getNearest = function getNearest(latitude, longitude, limit) {
    var stopsDistance = _stopsData2.default.map(function (stop) {
        return {
            id: stop.id,
            name: stop.name,
            distance: getDistanceInMeters(latitude, longitude, stop.latitude, stop.longitude).toFixed(2)
        };
    }).sort(function (a, b) {
        return a.distance - b.distance;
    });

    return stopsDistance.slice(0, limit);
};

var Stop = exports.Stop = {
    getNearest: getNearest
};

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(5)
  , isArray  = __webpack_require__(71)
  , SPECIES  = __webpack_require__(6)('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(131);

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject    = __webpack_require__(2)
  , toPrimitive = __webpack_require__(26)
  , NUMBER      = 'number';

module.exports = function(hint){
  if(hint !== 'string' && hint !== NUMBER && hint !== 'default')throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(32)
  , gOPS    = __webpack_require__(60)
  , pIE     = __webpack_require__(48);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var global  = __webpack_require__(3)
  , core    = __webpack_require__(14)
  , $export = __webpack_require__(1)
  , partial = __webpack_require__(78);
// https://esdiscuss.org/topic/promise-returning-delay-function
$export($export.G + $export.F, {
  delay: function delay(time){
    return new (core.Promise || global.Promise)(function(resolve){
      setTimeout(partial.call(resolve, true), time);
    });
  }
});

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx            = __webpack_require__(24)
  , $export        = __webpack_require__(1)
  , createDesc     = __webpack_require__(29)
  , assign         = __webpack_require__(76)
  , create         = __webpack_require__(28)
  , getPrototypeOf = __webpack_require__(17)
  , getKeys        = __webpack_require__(32)
  , dP             = __webpack_require__(7)
  , keyOf          = __webpack_require__(103)
  , aFunction      = __webpack_require__(13)
  , forOf          = __webpack_require__(36)
  , isIterable     = __webpack_require__(116)
  , $iterCreate    = __webpack_require__(56)
  , step           = __webpack_require__(72)
  , isObject       = __webpack_require__(5)
  , toIObject      = __webpack_require__(12)
  , DESCRIPTORS    = __webpack_require__(8)
  , has            = __webpack_require__(11);

// 0 -> Dict.forEach
// 1 -> Dict.map
// 2 -> Dict.filter
// 3 -> Dict.some
// 4 -> Dict.every
// 5 -> Dict.find
// 6 -> Dict.findKey
// 7 -> Dict.mapPairs
var createDictMethod = function(TYPE){
  var IS_MAP   = TYPE == 1
    , IS_EVERY = TYPE == 4;
  return function(object, callbackfn, that /* = undefined */){
    var f      = ctx(callbackfn, that, 3)
      , O      = toIObject(object)
      , result = IS_MAP || TYPE == 7 || TYPE == 2
          ? new (typeof this == 'function' ? this : Dict) : undefined
      , key, val, res;
    for(key in O)if(has(O, key)){
      val = O[key];
      res = f(val, key, object);
      if(TYPE){
        if(IS_MAP)result[key] = res;            // map
        else if(res)switch(TYPE){
          case 2: result[key] = val; break;     // filter
          case 3: return true;                  // some
          case 5: return val;                   // find
          case 6: return key;                   // findKey
          case 7: result[res[0]] = res[1];      // mapPairs
        } else if(IS_EVERY)return false;        // every
      }
    }
    return TYPE == 3 || IS_EVERY ? IS_EVERY : result;
  };
};
var findKey = createDictMethod(6);

var createDictIter = function(kind){
  return function(it){
    return new DictIterator(it, kind);
  };
};
var DictIterator = function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._a = getKeys(iterated);   // keys
  this._i = 0;                   // next index
  this._k = kind;                // kind
};
$iterCreate(DictIterator, 'Dict', function(){
  var that = this
    , O    = that._t
    , keys = that._a
    , kind = that._k
    , key;
  do {
    if(that._i >= keys.length){
      that._t = undefined;
      return step(1);
    }
  } while(!has(O, key = keys[that._i++]));
  if(kind == 'keys'  )return step(0, key);
  if(kind == 'values')return step(0, O[key]);
  return step(0, [key, O[key]]);
});

function Dict(iterable){
  var dict = create(null);
  if(iterable != undefined){
    if(isIterable(iterable)){
      forOf(iterable, true, function(key, value){
        dict[key] = value;
      });
    } else assign(dict, iterable);
  }
  return dict;
}
Dict.prototype = null;

function reduce(object, mapfn, init){
  aFunction(mapfn);
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , i      = 0
    , memo, key;
  if(arguments.length < 3){
    if(!length)throw TypeError('Reduce of empty object with no initial value');
    memo = O[keys[i++]];
  } else memo = Object(init);
  while(length > i)if(has(O, key = keys[i++])){
    memo = mapfn(memo, O[key], key, object);
  }
  return memo;
}

function includes(object, el){
  return (el == el ? keyOf(object, el) : findKey(object, function(it){
    return it != it;
  })) !== undefined;
}

function get(object, key){
  if(has(object, key))return object[key];
}
function set(object, key, value){
  if(DESCRIPTORS && key in Object)dP.f(object, key, createDesc(0, value));
  else object[key] = value;
  return object;
}

function isDict(it){
  return isObject(it) && getPrototypeOf(it) === Dict.prototype;
}

$export($export.G + $export.F, {Dict: Dict});

$export($export.S, 'Dict', {
  keys:     createDictIter('keys'),
  values:   createDictIter('values'),
  entries:  createDictIter('entries'),
  forEach:  createDictMethod(0),
  map:      createDictMethod(1),
  filter:   createDictMethod(2),
  some:     createDictMethod(3),
  every:    createDictMethod(4),
  find:     createDictMethod(5),
  findKey:  findKey,
  mapPairs: createDictMethod(7),
  reduce:   reduce,
  keyOf:    keyOf,
  includes: includes,
  has:      has,
  get:      get,
  set:      set,
  isDict:   isDict
});

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var path    = __webpack_require__(112)
  , $export = __webpack_require__(1);

// Placeholder
__webpack_require__(14)._ = path._ = path._ || {};

$export($export.P + $export.F, 'Function', {part: __webpack_require__(78)});

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(2)
  , get      = __webpack_require__(49);
module.exports = __webpack_require__(14).getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(57)(Number, 'Number', function(iterated){
  this._l = +iterated;
  this._i = 0;
}, function(){
  var i    = this._i++
    , done = !(i < this._l);
  return {done: done, value: done ? undefined : i};
});

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1);

$export($export.S + $export.F, 'Object', {classof: __webpack_require__(35)});

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1)
  , define  = __webpack_require__(105);

$export($export.S + $export.F, 'Object', {define: define});

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1);

$export($export.S + $export.F, 'Object', {isObject: __webpack_require__(5)});

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1)
  , define  = __webpack_require__(105)
  , create  = __webpack_require__(28);

$export($export.S + $export.F, 'Object', {
  make: function(proto, mixin){
    return define(create(proto), mixin);
  }
});

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/benjamingr/RexExp.escape
var $export = __webpack_require__(1)
  , $re     = __webpack_require__(79)(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(1);
var $re = __webpack_require__(79)(/[&<>"']/g, {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;'
});

$export($export.P + $export.F, 'String', {escapeHTML: function escapeHTML(){ return $re(this); }});

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(1);
var $re = __webpack_require__(79)(/&(?:amp|lt|gt|quot|apos);/g, {
  '&amp;':  '&',
  '&lt;':   '<',
  '&gt;':   '>',
  '&quot;': '"',
  '&apos;': "'"
});

$export($export.P + $export.F, 'String', {unescapeHTML:  function unescapeHTML(){ return $re(this); }});

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = __webpack_require__(1);

$export($export.P, 'Array', {copyWithin: __webpack_require__(93)});

__webpack_require__(44)('copyWithin');

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(1)
  , $every  = __webpack_require__(23)(4);

$export($export.P + $export.F * !__webpack_require__(22)([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */){
    return $every(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = __webpack_require__(1);

$export($export.P, 'Array', {fill: __webpack_require__(63)});

__webpack_require__(44)('fill');

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(1)
  , $filter = __webpack_require__(23)(2);

$export($export.P + $export.F * !__webpack_require__(22)([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */){
    return $filter(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__(1)
  , $find   = __webpack_require__(23)(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(44)(KEY);

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(1)
  , $find   = __webpack_require__(23)(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(44)(KEY);

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export  = __webpack_require__(1)
  , $forEach = __webpack_require__(23)(0)
  , STRICT   = __webpack_require__(22)([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */){
    return $forEach(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx            = __webpack_require__(24)
  , $export        = __webpack_require__(1)
  , toObject       = __webpack_require__(10)
  , call           = __webpack_require__(102)
  , isArrayIter    = __webpack_require__(70)
  , toLength       = __webpack_require__(9)
  , createProperty = __webpack_require__(64)
  , getIterFn      = __webpack_require__(49);

$export($export.S + $export.F * !__webpack_require__(58)(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export       = __webpack_require__(1)
  , $indexOf      = __webpack_require__(50)(false)
  , $native       = [].indexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(22)($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /*, fromIndex = 0 */){
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(1);

$export($export.S, 'Array', {isArray: __webpack_require__(71)});

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.13 Array.prototype.join(separator)
var $export   = __webpack_require__(1)
  , toIObject = __webpack_require__(12)
  , arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (__webpack_require__(47) != Object || !__webpack_require__(22)(arrayJoin)), 'Array', {
  join: function join(separator){
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export       = __webpack_require__(1)
  , toIObject     = __webpack_require__(12)
  , toInteger     = __webpack_require__(33)
  , toLength      = __webpack_require__(9)
  , $native       = [].lastIndexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(22)($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /*, fromIndex = @[*-1] */){
    // convert -0 to +0
    if(NEGATIVE_ZERO)return $native.apply(this, arguments) || 0;
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(arguments[1]));
    if(index < 0)index = length + index;
    for(;index >= 0; index--)if(index in O)if(O[index] === searchElement)return index || 0;
    return -1;
  }
});

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(1)
  , $map    = __webpack_require__(23)(1);

$export($export.P + $export.F * !__webpack_require__(22)([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */){
    return $map(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export        = __webpack_require__(1)
  , createProperty = __webpack_require__(64);

// WebKit Array.of isn't generic
$export($export.S + $export.F * __webpack_require__(4)(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , aLen   = arguments.length
      , result = new (typeof this == 'function' ? this : Array)(aLen);
    while(aLen > index)createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(1)
  , $reduce = __webpack_require__(95);

$export($export.P + $export.F * !__webpack_require__(22)([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(1)
  , $reduce = __webpack_require__(95);

$export($export.P + $export.F * !__webpack_require__(22)([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export    = __webpack_require__(1)
  , html       = __webpack_require__(68)
  , cof        = __webpack_require__(20)
  , toIndex    = __webpack_require__(42)
  , toLength   = __webpack_require__(9)
  , arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * __webpack_require__(4)(function(){
  if(html)arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return arraySlice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(1)
  , $some   = __webpack_require__(23)(3);

$export($export.P + $export.F * !__webpack_require__(22)([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */){
    return $some(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export   = __webpack_require__(1)
  , aFunction = __webpack_require__(13)
  , toObject  = __webpack_require__(10)
  , fails     = __webpack_require__(4)
  , $sort     = [].sort
  , test      = [1, 2, 3];

$export($export.P + $export.F * (fails(function(){
  // IE8-
  test.sort(undefined);
}) || !fails(function(){
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__(22)($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn){
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(41)('Array');

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__(1);

$export($export.S, 'Date', {now: function(){ return new Date().getTime(); }});

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = __webpack_require__(1)
  , fails   = __webpack_require__(4)
  , getTime = Date.prototype.getTime;

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function(){
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function(){
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(getTime.call(this)))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export     = __webpack_require__(1)
  , toObject    = __webpack_require__(10)
  , toPrimitive = __webpack_require__(26);

$export($export.P + $export.F * __webpack_require__(4)(function(){
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({toISOString: function(){ return 1; }}) !== 1;
}), 'Date', {
  toJSON: function toJSON(key){
    var O  = toObject(this)
      , pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

var TO_PRIMITIVE = __webpack_require__(6)('toPrimitive')
  , proto        = Date.prototype;

if(!(TO_PRIMITIVE in proto))__webpack_require__(15)(proto, TO_PRIMITIVE, __webpack_require__(133));

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var DateProto    = Date.prototype
  , INVALID_DATE = 'Invalid Date'
  , TO_STRING    = 'toString'
  , $toString    = DateProto[TO_STRING]
  , getTime      = DateProto.getTime;
if(new Date(NaN) + '' != INVALID_DATE){
  __webpack_require__(18)(DateProto, TO_STRING, function toString(){
    var value = getTime.call(this);
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = __webpack_require__(1);

$export($export.P, 'Function', {bind: __webpack_require__(96)});

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isObject       = __webpack_require__(5)
  , getPrototypeOf = __webpack_require__(17)
  , HAS_INSTANCE   = __webpack_require__(6)('hasInstance')
  , FunctionProto  = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))__webpack_require__(7).f(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = getPrototypeOf(O))if(this.prototype === O)return true;
  return false;
}});

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(7).f
  , createDesc = __webpack_require__(29)
  , has        = __webpack_require__(11)
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';

var isExtensible = Object.isExtensible || function(){
  return true;
};

// 19.2.4.2 name
NAME in FProto || __webpack_require__(8) && dP(FProto, NAME, {
  configurable: true,
  get: function(){
    try {
      var that = this
        , name = ('' + that).match(nameRE)[1];
      has(that, NAME) || !isExtensible(that) || dP(that, NAME, createDesc(5, name));
      return name;
    } catch(e){
      return '';
    }
  }
});

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.3 Math.acosh(x)
var $export = __webpack_require__(1)
  , log1p   = __webpack_require__(104)
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN 
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.5 Math.asinh(x)
var $export = __webpack_require__(1)
  , $asinh  = Math.asinh;

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0 
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', {asinh: asinh});

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.7 Math.atanh(x)
var $export = __webpack_require__(1)
  , $atanh  = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0 
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.9 Math.cbrt(x)
var $export = __webpack_require__(1)
  , sign    = __webpack_require__(74);

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.11 Math.clz32(x)
var $export = __webpack_require__(1);

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.12 Math.cosh(x)
var $export = __webpack_require__(1)
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.14 Math.expm1(x)
var $export = __webpack_require__(1)
  , $expm1  = __webpack_require__(73);

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', {expm1: $expm1});

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var $export   = __webpack_require__(1)
  , sign      = __webpack_require__(74)
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = __webpack_require__(1)
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , i    = 0
      , aLen = arguments.length
      , larg = 0
      , arg, div;
    while(i < aLen){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.18 Math.imul(x, y)
var $export = __webpack_require__(1)
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * __webpack_require__(4)(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.21 Math.log10(x)
var $export = __webpack_require__(1);

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.20 Math.log1p(x)
var $export = __webpack_require__(1);

$export($export.S, 'Math', {log1p: __webpack_require__(104)});

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.22 Math.log2(x)
var $export = __webpack_require__(1);

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.28 Math.sign(x)
var $export = __webpack_require__(1);

$export($export.S, 'Math', {sign: __webpack_require__(74)});

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.30 Math.sinh(x)
var $export = __webpack_require__(1)
  , expm1   = __webpack_require__(73)
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * __webpack_require__(4)(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.33 Math.tanh(x)
var $export = __webpack_require__(1)
  , expm1   = __webpack_require__(73)
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.34 Math.trunc(x)
var $export = __webpack_require__(1);

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global            = __webpack_require__(3)
  , has               = __webpack_require__(11)
  , cof               = __webpack_require__(20)
  , inheritIfRequired = __webpack_require__(69)
  , toPrimitive       = __webpack_require__(26)
  , fails             = __webpack_require__(4)
  , gOPN              = __webpack_require__(39).f
  , gOPD              = __webpack_require__(16).f
  , dP                = __webpack_require__(7).f
  , $trim             = __webpack_require__(46).trim
  , NUMBER            = 'Number'
  , $Number           = global[NUMBER]
  , Base              = $Number
  , proto             = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF        = cof(__webpack_require__(28)(proto)) == NUMBER
  , TRIM              = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for(var keys = __webpack_require__(8) ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++){
    if(has(Base, key = keys[j]) && !has($Number, key)){
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__(18)(global, NUMBER, $Number);
}

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.1 Number.EPSILON
var $export = __webpack_require__(1);

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.2 Number.isFinite(number)
var $export   = __webpack_require__(1)
  , _isFinite = __webpack_require__(3).isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});

/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__(1);

$export($export.S, 'Number', {isInteger: __webpack_require__(101)});

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(1);

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.5 Number.isSafeInteger(number)
var $export   = __webpack_require__(1)
  , isInteger = __webpack_require__(101)
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = __webpack_require__(1);

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});

/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = __webpack_require__(1);

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

var $export     = __webpack_require__(1)
  , $parseFloat = __webpack_require__(110);
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', {parseFloat: $parseFloat});

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

var $export   = __webpack_require__(1)
  , $parseInt = __webpack_require__(111);
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {parseInt: $parseInt});

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export      = __webpack_require__(1)
  , toInteger    = __webpack_require__(33)
  , aNumberValue = __webpack_require__(92)
  , repeat       = __webpack_require__(85)
  , $toFixed     = 1..toFixed
  , floor        = Math.floor
  , data         = [0, 0, 0, 0, 0, 0]
  , ERROR        = 'Number.toFixed: incorrect invocation!'
  , ZERO         = '0';

var multiply = function(n, c){
  var i  = -1
    , c2 = c;
  while(++i < 6){
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function(n){
  var i = 6
    , c = 0;
  while(--i >= 0){
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function(){
  var i = 6
    , s = '';
  while(--i >= 0){
    if(s !== '' || i === 0 || data[i] !== 0){
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function(x, n, acc){
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function(x){
  var n  = 0
    , x2 = x;
  while(x2 >= 4096){
    n += 12;
    x2 /= 4096;
  }
  while(x2 >= 2){
    n  += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128..toFixed(0) !== '1000000000000000128'
) || !__webpack_require__(4)(function(){
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits){
    var x = aNumberValue(this, ERROR)
      , f = toInteger(fractionDigits)
      , s = ''
      , m = ZERO
      , e, z, j, k;
    if(f < 0 || f > 20)throw RangeError(ERROR);
    if(x != x)return 'NaN';
    if(x <= -1e21 || x >= 1e21)return String(x);
    if(x < 0){
      s = '-';
      x = -x;
    }
    if(x > 1e-21){
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if(e > 0){
        multiply(0, z);
        j = f;
        while(j >= 7){
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while(j >= 23){
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if(f > 0){
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export      = __webpack_require__(1)
  , $fails       = __webpack_require__(4)
  , aNumberValue = __webpack_require__(92)
  , $toPrecision = 1..toPrecision;

$export($export.P + $export.F * ($fails(function(){
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function(){
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision){
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision); 
  }
});

/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(1);

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(76)});

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1)
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(28)});

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(8), 'Object', {defineProperties: __webpack_require__(106)});

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(8), 'Object', {defineProperty: __webpack_require__(7).f});

/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(5)
  , meta     = __webpack_require__(31).onFreeze;

__webpack_require__(25)('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = __webpack_require__(12)
  , $getOwnPropertyDescriptor = __webpack_require__(16).f;

__webpack_require__(25)('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(25)('getOwnPropertyNames', function(){
  return __webpack_require__(107).f;
});

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = __webpack_require__(10)
  , $getPrototypeOf = __webpack_require__(17);

__webpack_require__(25)('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.11 Object.isExtensible(O)
var isObject = __webpack_require__(5);

__webpack_require__(25)('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.12 Object.isFrozen(O)
var isObject = __webpack_require__(5);

__webpack_require__(25)('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.13 Object.isSealed(O)
var isObject = __webpack_require__(5);

__webpack_require__(25)('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.10 Object.is(value1, value2)
var $export = __webpack_require__(1);
$export($export.S, 'Object', {is: __webpack_require__(113)});

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(10)
  , $keys    = __webpack_require__(32);

__webpack_require__(25)('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.15 Object.preventExtensions(O)
var isObject = __webpack_require__(5)
  , meta     = __webpack_require__(31).onFreeze;

__webpack_require__(25)('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.17 Object.seal(O)
var isObject = __webpack_require__(5)
  , meta     = __webpack_require__(31).onFreeze;

__webpack_require__(25)('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(1);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(80).set});

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(35)
  , test    = {};
test[__webpack_require__(6)('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  __webpack_require__(18)(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

var $export     = __webpack_require__(1)
  , $parseFloat = __webpack_require__(110);
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), {parseFloat: $parseFloat});

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

var $export   = __webpack_require__(1)
  , $parseInt = __webpack_require__(111);
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), {parseInt: $parseInt});

/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY            = __webpack_require__(38)
  , global             = __webpack_require__(3)
  , ctx                = __webpack_require__(24)
  , classof            = __webpack_require__(35)
  , $export            = __webpack_require__(1)
  , isObject           = __webpack_require__(5)
  , aFunction          = __webpack_require__(13)
  , anInstance         = __webpack_require__(34)
  , forOf              = __webpack_require__(36)
  , speciesConstructor = __webpack_require__(82)
  , task               = __webpack_require__(87).set
  , microtask          = __webpack_require__(75)()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[__webpack_require__(6)('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(40)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
__webpack_require__(45)($Promise, PROMISE);
__webpack_require__(41)(PROMISE);
Wrapper = __webpack_require__(14)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(58)(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export   = __webpack_require__(1)
  , aFunction = __webpack_require__(13)
  , anObject  = __webpack_require__(2)
  , rApply    = (__webpack_require__(3).Reflect || {}).apply
  , fApply    = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !__webpack_require__(4)(function(){
  rApply(function(){});
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    var T = aFunction(target)
      , L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export    = __webpack_require__(1)
  , create     = __webpack_require__(28)
  , aFunction  = __webpack_require__(13)
  , anObject   = __webpack_require__(2)
  , isObject   = __webpack_require__(5)
  , fails      = __webpack_require__(4)
  , bind       = __webpack_require__(96)
  , rConstruct = (__webpack_require__(3).Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function(){
  function F(){}
  return !(rConstruct(function(){}, [], F) instanceof F);
});
var ARGS_BUG = !fails(function(){
  rConstruct(function(){});
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(ARGS_BUG && !NEW_TARGET_BUG)return rConstruct(Target, args, newTarget);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      switch(args.length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP          = __webpack_require__(7)
  , $export     = __webpack_require__(1)
  , anObject    = __webpack_require__(2)
  , toPrimitive = __webpack_require__(26);

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * __webpack_require__(4)(function(){
  Reflect.defineProperty(dP.f({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});

/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = __webpack_require__(1)
  , gOPD     = __webpack_require__(16).f
  , anObject = __webpack_require__(2);

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 26.1.5 Reflect.enumerate(target)
var $export  = __webpack_require__(1)
  , anObject = __webpack_require__(2);
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
__webpack_require__(56)(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});

/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD     = __webpack_require__(16)
  , $export  = __webpack_require__(1)
  , anObject = __webpack_require__(2);

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return gOPD.f(anObject(target), propertyKey);
  }
});

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = __webpack_require__(1)
  , getProto = __webpack_require__(17)
  , anObject = __webpack_require__(2);

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD           = __webpack_require__(16)
  , getPrototypeOf = __webpack_require__(17)
  , has            = __webpack_require__(11)
  , $export        = __webpack_require__(1)
  , isObject       = __webpack_require__(5)
  , anObject       = __webpack_require__(2);

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = gOPD.f(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = getPrototypeOf(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.9 Reflect.has(target, propertyKey)
var $export = __webpack_require__(1);

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.10 Reflect.isExtensible(target)
var $export       = __webpack_require__(1)
  , anObject      = __webpack_require__(2)
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.11 Reflect.ownKeys(target)
var $export = __webpack_require__(1);

$export($export.S, 'Reflect', {ownKeys: __webpack_require__(77)});

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.12 Reflect.preventExtensions(target)
var $export            = __webpack_require__(1)
  , anObject           = __webpack_require__(2)
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = __webpack_require__(1)
  , setProto = __webpack_require__(80);

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP             = __webpack_require__(7)
  , gOPD           = __webpack_require__(16)
  , getPrototypeOf = __webpack_require__(17)
  , has            = __webpack_require__(11)
  , $export        = __webpack_require__(1)
  , createDesc     = __webpack_require__(29)
  , anObject       = __webpack_require__(2)
  , isObject       = __webpack_require__(5);

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = gOPD.f(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = getPrototypeOf(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});

/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

var global            = __webpack_require__(3)
  , inheritIfRequired = __webpack_require__(69)
  , dP                = __webpack_require__(7).f
  , gOPN              = __webpack_require__(39).f
  , isRegExp          = __webpack_require__(55)
  , $flags            = __webpack_require__(53)
  , $RegExp           = global.RegExp
  , Base              = $RegExp
  , proto             = $RegExp.prototype
  , re1               = /a/g
  , re2               = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW       = new $RegExp(re1) !== re1;

if(__webpack_require__(8) && (!CORRECT_NEW || __webpack_require__(4)(function(){
  re2[__webpack_require__(6)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var tiRE = this instanceof $RegExp
      , piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function(key){
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  };
  for(var keys = gOPN(Base), i = 0; keys.length > i; )proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__(18)(global, 'RegExp', $RegExp);
}

__webpack_require__(41)('RegExp');

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

// @@match logic
__webpack_require__(52)('match', 1, function(defined, MATCH, $match){
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

// @@replace logic
__webpack_require__(52)('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

// @@search logic
__webpack_require__(52)('search', 1, function(defined, SEARCH, $search){
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

// @@split logic
__webpack_require__(52)('split', 2, function(defined, SPLIT, $split){
  'use strict';
  var isRegExp   = __webpack_require__(55)
    , _split     = $split
    , $push      = [].push
    , $SPLIT     = 'split'
    , LENGTH     = 'length'
    , LAST_INDEX = 'lastIndex';
  if(
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ){
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function(separator, limit){
      var string = String(this);
      if(separator === undefined && limit === 0)return [];
      // If `separator` is not a regex, use native split
      if(!isRegExp(separator))return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if(!NPCG)separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while(match = separatorCopy.exec(string)){
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if(lastIndex > lastLastIndex){
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          if(!NPCG && match[LENGTH] > 1)match[0].replace(separator2, function(){
            for(i = 1; i < arguments[LENGTH] - 2; i++)if(arguments[i] === undefined)match[i] = undefined;
          });
          if(match[LENGTH] > 1 && match.index < string[LENGTH])$push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if(output[LENGTH] >= splitLimit)break;
        }
        if(separatorCopy[LAST_INDEX] === match.index)separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if(lastLastIndex === string[LENGTH]){
        if(lastLength || !separatorCopy.test(''))output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if('0'[$SPLIT](undefined, 0)[LENGTH]){
    $split = function(separator, limit){
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit){
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(118);
var anObject    = __webpack_require__(2)
  , $flags      = __webpack_require__(53)
  , DESCRIPTORS = __webpack_require__(8)
  , TO_STRING   = 'toString'
  , $toString   = /./[TO_STRING];

var define = function(fn){
  __webpack_require__(18)(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if(__webpack_require__(4)(function(){ return $toString.call({source: 'a', flags: 'b'}) != '/a/b'; })){
  define(function toString(){
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if($toString.name != TO_STRING){
  define(function toString(){
    return $toString.call(this);
  });
}

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.2 String.prototype.anchor(name)
__webpack_require__(19)('anchor', function(createHTML){
  return function anchor(name){
    return createHTML(this, 'a', 'name', name);
  }
});

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.3 String.prototype.big()
__webpack_require__(19)('big', function(createHTML){
  return function big(){
    return createHTML(this, 'big', '', '');
  }
});

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.4 String.prototype.blink()
__webpack_require__(19)('blink', function(createHTML){
  return function blink(){
    return createHTML(this, 'blink', '', '');
  }
});

/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.5 String.prototype.bold()
__webpack_require__(19)('bold', function(createHTML){
  return function bold(){
    return createHTML(this, 'b', '', '');
  }
});

/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(1)
  , $at     = __webpack_require__(83)(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])

var $export   = __webpack_require__(1)
  , toLength  = __webpack_require__(9)
  , context   = __webpack_require__(84)
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * __webpack_require__(67)(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , endPosition = arguments.length > 1 ? arguments[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.6 String.prototype.fixed()
__webpack_require__(19)('fixed', function(createHTML){
  return function fixed(){
    return createHTML(this, 'tt', '', '');
  }
});

/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.7 String.prototype.fontcolor(color)
__webpack_require__(19)('fontcolor', function(createHTML){
  return function fontcolor(color){
    return createHTML(this, 'font', 'color', color);
  }
});

/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.8 String.prototype.fontsize(size)
__webpack_require__(19)('fontsize', function(createHTML){
  return function fontsize(size){
    return createHTML(this, 'font', 'size', size);
  }
});

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

var $export        = __webpack_require__(1)
  , toIndex        = __webpack_require__(42)
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res  = []
      , aLen = arguments.length
      , i    = 0
      , code;
    while(aLen > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export  = __webpack_require__(1)
  , context  = __webpack_require__(84)
  , INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__(67)(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.9 String.prototype.italics()
__webpack_require__(19)('italics', function(createHTML){
  return function italics(){
    return createHTML(this, 'i', '', '');
  }
});

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(83)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(57)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.10 String.prototype.link(url)
__webpack_require__(19)('link', function(createHTML){
  return function link(url){
    return createHTML(this, 'a', 'href', url);
  }
});

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

var $export   = __webpack_require__(1)
  , toIObject = __webpack_require__(12)
  , toLength  = __webpack_require__(9);

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl  = toIObject(callSite.raw)
      , len  = toLength(tpl.length)
      , aLen = arguments.length
      , res  = []
      , i    = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < aLen)res.push(String(arguments[i]));
    } return res.join('');
  }
});

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1);

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: __webpack_require__(85)
});

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.11 String.prototype.small()
__webpack_require__(19)('small', function(createHTML){
  return function small(){
    return createHTML(this, 'small', '', '');
  }
});

/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export     = __webpack_require__(1)
  , toLength    = __webpack_require__(9)
  , context     = __webpack_require__(84)
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__(67)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , index  = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.12 String.prototype.strike()
__webpack_require__(19)('strike', function(createHTML){
  return function strike(){
    return createHTML(this, 'strike', '', '');
  }
});

/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.13 String.prototype.sub()
__webpack_require__(19)('sub', function(createHTML){
  return function sub(){
    return createHTML(this, 'sub', '', '');
  }
});

/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.14 String.prototype.sup()
__webpack_require__(19)('sup', function(createHTML){
  return function sup(){
    return createHTML(this, 'sup', '', '');
  }
});

/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.1.3.25 String.prototype.trim()
__webpack_require__(46)('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});

/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(3)
  , has            = __webpack_require__(11)
  , DESCRIPTORS    = __webpack_require__(8)
  , $export        = __webpack_require__(1)
  , redefine       = __webpack_require__(18)
  , META           = __webpack_require__(31).KEY
  , $fails         = __webpack_require__(4)
  , shared         = __webpack_require__(61)
  , setToStringTag = __webpack_require__(45)
  , uid            = __webpack_require__(43)
  , wks            = __webpack_require__(6)
  , wksExt         = __webpack_require__(115)
  , wksDefine      = __webpack_require__(89)
  , keyOf          = __webpack_require__(103)
  , enumKeys       = __webpack_require__(134)
  , isArray        = __webpack_require__(71)
  , anObject       = __webpack_require__(2)
  , toIObject      = __webpack_require__(12)
  , toPrimitive    = __webpack_require__(26)
  , createDesc     = __webpack_require__(29)
  , _create        = __webpack_require__(28)
  , gOPNExt        = __webpack_require__(107)
  , $GOPD          = __webpack_require__(16)
  , $DP            = __webpack_require__(7)
  , $keys          = __webpack_require__(32)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(39).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(48).f  = $propertyIsEnumerable;
  __webpack_require__(60).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(38)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(15)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export      = __webpack_require__(1)
  , $typed       = __webpack_require__(62)
  , buffer       = __webpack_require__(88)
  , anObject     = __webpack_require__(2)
  , toIndex      = __webpack_require__(42)
  , toLength     = __webpack_require__(9)
  , isObject     = __webpack_require__(5)
  , ArrayBuffer  = __webpack_require__(3).ArrayBuffer
  , speciesConstructor = __webpack_require__(82)
  , $ArrayBuffer = buffer.ArrayBuffer
  , $DataView    = buffer.DataView
  , $isView      = $typed.ABV && ArrayBuffer.isView
  , $slice       = $ArrayBuffer.prototype.slice
  , VIEW         = $typed.VIEW
  , ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), {ArrayBuffer: $ArrayBuffer});

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it){
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * __webpack_require__(4)(function(){
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end){
    if($slice !== undefined && end === undefined)return $slice.call(anObject(this), start); // FF fix
    var len    = anObject(this).byteLength
      , first  = toIndex(start, len)
      , final  = toIndex(end === undefined ? len : end, len)
      , result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first))
      , viewS  = new $DataView(this)
      , viewT  = new $DataView(result)
      , index  = 0;
    while(first < final){
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

__webpack_require__(41)(ARRAY_BUFFER);

/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1);
$export($export.G + $export.W + $export.F * !__webpack_require__(62).ABV, {
  DataView: __webpack_require__(88).DataView
});

/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Float32', 4, function(init){
  return function Float32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Float64', 8, function(init){
  return function Float64Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Int16', 2, function(init){
  return function Int16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Int32', 4, function(init){
  return function Int32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Int8', 1, function(init){
  return function Int8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Uint16', 2, function(init){
  return function Uint16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Uint32', 4, function(init){
  return function Uint32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Uint8', 1, function(init){
  return function Uint8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('Uint8', 1, function(init){
  return function Uint8ClampedArray(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
}, true);

/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var weak = __webpack_require__(99);

// 23.4 WeakSet Objects
__webpack_require__(51)('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export   = __webpack_require__(1)
  , $includes = __webpack_require__(50)(true);

$export($export.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(44)('includes');

/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export   = __webpack_require__(1)
  , microtask = __webpack_require__(75)()
  , process   = __webpack_require__(3).process
  , isNode    = __webpack_require__(20)(process) == 'process';

$export($export.G, {
  asap: function asap(fn){
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/ljharb/proposal-is-error
var $export = __webpack_require__(1)
  , cof     = __webpack_require__(20);

$export($export.S, 'Error', {
  isError: function isError(it){
    return cof(it) === 'Error';
  }
});

/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(1);

$export($export.P + $export.R, 'Map', {toJSON: __webpack_require__(98)('Map')});

/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(1);

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});

/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(1);

$export($export.S, 'Math', {
  imulh: function imulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >> 16
      , v1 = $v >> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});

/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(1);

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});

/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(1);

$export($export.S, 'Math', {
  umulh: function umulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >>> 16
      , v1 = $v >>> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});

/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export         = __webpack_require__(1)
  , toObject        = __webpack_require__(10)
  , aFunction       = __webpack_require__(13)
  , $defineProperty = __webpack_require__(7);

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
__webpack_require__(8) && $export($export.P + __webpack_require__(59), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter){
    $defineProperty.f(toObject(this), P, {get: aFunction(getter), enumerable: true, configurable: true});
  }
});

/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export         = __webpack_require__(1)
  , toObject        = __webpack_require__(10)
  , aFunction       = __webpack_require__(13)
  , $defineProperty = __webpack_require__(7);

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
__webpack_require__(8) && $export($export.P + __webpack_require__(59), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter){
    $defineProperty.f(toObject(this), P, {set: aFunction(setter), enumerable: true, configurable: true});
  }
});

/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export  = __webpack_require__(1)
  , $entries = __webpack_require__(109)(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});

/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export        = __webpack_require__(1)
  , ownKeys        = __webpack_require__(77)
  , toIObject      = __webpack_require__(12)
  , gOPD           = __webpack_require__(16)
  , createProperty = __webpack_require__(64);

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , getDesc = gOPD.f
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key;
    while(keys.length > i)createProperty(result, key = keys[i++], getDesc(O, key));
    return result;
  }
});

/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export                  = __webpack_require__(1)
  , toObject                 = __webpack_require__(10)
  , toPrimitive              = __webpack_require__(26)
  , getPrototypeOf           = __webpack_require__(17)
  , getOwnPropertyDescriptor = __webpack_require__(16).f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
__webpack_require__(8) && $export($export.P + __webpack_require__(59), 'Object', {
  __lookupGetter__: function __lookupGetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.get;
    } while(O = getPrototypeOf(O));
  }
});

/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export                  = __webpack_require__(1)
  , toObject                 = __webpack_require__(10)
  , toPrimitive              = __webpack_require__(26)
  , getPrototypeOf           = __webpack_require__(17)
  , getOwnPropertyDescriptor = __webpack_require__(16).f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
__webpack_require__(8) && $export($export.P + __webpack_require__(59), 'Object', {
  __lookupSetter__: function __lookupSetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.set;
    } while(O = getPrototypeOf(O));
  }
});

/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(1)
  , $values = __webpack_require__(109)(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});

/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/zenparsing/es-observable
var $export     = __webpack_require__(1)
  , global      = __webpack_require__(3)
  , core        = __webpack_require__(14)
  , microtask   = __webpack_require__(75)()
  , OBSERVABLE  = __webpack_require__(6)('observable')
  , aFunction   = __webpack_require__(13)
  , anObject    = __webpack_require__(2)
  , anInstance  = __webpack_require__(34)
  , redefineAll = __webpack_require__(40)
  , hide        = __webpack_require__(15)
  , forOf       = __webpack_require__(36)
  , RETURN      = forOf.RETURN;

var getMethod = function(fn){
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function(subscription){
  var cleanup = subscription._c;
  if(cleanup){
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function(subscription){
  return subscription._o === undefined;
};

var closeSubscription = function(subscription){
  if(!subscriptionClosed(subscription)){
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function(observer, subscriber){
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup      = subscriber(observer)
      , subscription = cleanup;
    if(cleanup != null){
      if(typeof cleanup.unsubscribe === 'function')cleanup = function(){ subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch(e){
    observer.error(e);
    return;
  } if(subscriptionClosed(this))cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe(){ closeSubscription(this); }
});

var SubscriptionObserver = function(subscription){
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if(m)return m.call(observer, value);
      } catch(e){
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value){
    var subscription = this._s;
    if(subscriptionClosed(subscription))throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if(!m)throw value;
      value = m.call(observer, value);
    } catch(e){
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch(e){
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber){
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer){
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn){
    var that = this;
    return new (core.Promise || global.Promise)(function(resolve, reject){
      aFunction(fn);
      var subscription = that.subscribe({
        next : function(value){
          try {
            return fn(value);
          } catch(e){
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x){
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if(method){
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function(observer){
        return observable.subscribe(observer);
      });
    }
    return new C(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          try {
            if(forOf(x, false, function(it){
              observer.next(it);
              if(done)return RETURN;
            }) === RETURN)return;
          } catch(e){
            if(done)throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  },
  of: function of(){
    for(var i = 0, l = arguments.length, items = Array(l); i < l;)items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          for(var i = 0; i < items.length; ++i){
            observer.next(items[i]);
            if(done)return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function(){ return this; });

$export($export.G, {Observable: $Observable});

__webpack_require__(41)('Observable');

/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

var metadata                  = __webpack_require__(27)
  , anObject                  = __webpack_require__(2)
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey){
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
}});

/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(27)
  , anObject               = __webpack_require__(2)
  , toMetaKey              = metadata.key
  , getOrCreateMetadataMap = metadata.map
  , store                  = metadata.store;

metadata.exp({deleteMetadata: function deleteMetadata(metadataKey, target /*, targetKey */){
  var targetKey   = arguments.length < 3 ? undefined : toMetaKey(arguments[2])
    , metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if(metadataMap === undefined || !metadataMap['delete'](metadataKey))return false;
  if(metadataMap.size)return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
}});

/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

var Set                     = __webpack_require__(119)
  , from                    = __webpack_require__(94)
  , metadata                = __webpack_require__(27)
  , anObject                = __webpack_require__(2)
  , getPrototypeOf          = __webpack_require__(17)
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

var ordinaryMetadataKeys = function(O, P){
  var oKeys  = ordinaryOwnMetadataKeys(O, P)
    , parent = getPrototypeOf(O);
  if(parent === null)return oKeys;
  var pKeys  = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({getMetadataKeys: function getMetadataKeys(target /*, targetKey */){
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});

/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(27)
  , anObject               = __webpack_require__(2)
  , getPrototypeOf         = __webpack_require__(17)
  , ordinaryHasOwnMetadata = metadata.has
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

var ordinaryGetMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({getMetadata: function getMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

var metadata                = __webpack_require__(27)
  , anObject                = __webpack_require__(2)
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

metadata.exp({getOwnMetadataKeys: function getOwnMetadataKeys(target /*, targetKey */){
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});

/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(27)
  , anObject               = __webpack_require__(2)
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

metadata.exp({getOwnMetadata: function getOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(27)
  , anObject               = __webpack_require__(2)
  , getPrototypeOf         = __webpack_require__(17)
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

var ordinaryHasMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({hasMetadata: function hasMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(27)
  , anObject               = __webpack_require__(2)
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

metadata.exp({hasOwnMetadata: function hasOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

var metadata                  = __webpack_require__(27)
  , anObject                  = __webpack_require__(2)
  , aFunction                 = __webpack_require__(13)
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({metadata: function metadata(metadataKey, metadataValue){
  return function decorator(target, targetKey){
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
}});

/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(1);

$export($export.P + $export.R, 'Set', {toJSON: __webpack_require__(98)('Set')});

/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/mathiasbynens/String.prototype.at
var $export = __webpack_require__(1)
  , $at     = __webpack_require__(83)(true);

$export($export.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});

/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/String.prototype.matchAll/
var $export     = __webpack_require__(1)
  , defined     = __webpack_require__(21)
  , toLength    = __webpack_require__(9)
  , isRegExp    = __webpack_require__(55)
  , getFlags    = __webpack_require__(53)
  , RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function(regexp, string){
  this._r = regexp;
  this._s = string;
};

__webpack_require__(56)($RegExpStringIterator, 'RegExp String', function next(){
  var match = this._r.exec(this._s);
  return {value: match, done: match === null};
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp){
    defined(this);
    if(!isRegExp(regexp))throw TypeError(regexp + ' is not a regexp!');
    var S     = String(this)
      , flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp)
      , rx    = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});

/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(1)
  , $pad    = __webpack_require__(114);

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(1)
  , $pad    = __webpack_require__(114);

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(46)('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
}, 'trimStart');

/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(46)('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
}, 'trimEnd');

/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(89)('asyncIterator');

/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(89)('observable');

/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/ljharb/proposal-global
var $export = __webpack_require__(1);

$export($export.S, 'System', {global: __webpack_require__(3)});

/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

var $iterators    = __webpack_require__(90)
  , redefine      = __webpack_require__(18)
  , global        = __webpack_require__(3)
  , hide          = __webpack_require__(15)
  , Iterators     = __webpack_require__(37)
  , wks           = __webpack_require__(6)
  , ITERATOR      = wks('iterator')
  , TO_STRING_TAG = wks('toStringTag')
  , ArrayValues   = Iterators.Array;

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype
    , key;
  if(proto){
    if(!proto[ITERATOR])hide(proto, ITERATOR, ArrayValues);
    if(!proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    for(key in $iterators)if(!proto[key])redefine(proto, key, $iterators[key], true);
  }
}

/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1)
  , $task   = __webpack_require__(87);
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});

/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

// ie9- setTimeout & setInterval additional parameters fix
var global     = __webpack_require__(3)
  , $export    = __webpack_require__(1)
  , invoke     = __webpack_require__(54)
  , partial    = __webpack_require__(78)
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(266);
__webpack_require__(205);
__webpack_require__(207);
__webpack_require__(206);
__webpack_require__(209);
__webpack_require__(211);
__webpack_require__(216);
__webpack_require__(210);
__webpack_require__(208);
__webpack_require__(218);
__webpack_require__(217);
__webpack_require__(213);
__webpack_require__(214);
__webpack_require__(212);
__webpack_require__(204);
__webpack_require__(215);
__webpack_require__(219);
__webpack_require__(220);
__webpack_require__(172);
__webpack_require__(174);
__webpack_require__(173);
__webpack_require__(222);
__webpack_require__(221);
__webpack_require__(192);
__webpack_require__(202);
__webpack_require__(203);
__webpack_require__(193);
__webpack_require__(194);
__webpack_require__(195);
__webpack_require__(196);
__webpack_require__(197);
__webpack_require__(198);
__webpack_require__(199);
__webpack_require__(200);
__webpack_require__(201);
__webpack_require__(175);
__webpack_require__(176);
__webpack_require__(177);
__webpack_require__(178);
__webpack_require__(179);
__webpack_require__(180);
__webpack_require__(181);
__webpack_require__(182);
__webpack_require__(183);
__webpack_require__(184);
__webpack_require__(185);
__webpack_require__(186);
__webpack_require__(187);
__webpack_require__(188);
__webpack_require__(189);
__webpack_require__(190);
__webpack_require__(191);
__webpack_require__(253);
__webpack_require__(258);
__webpack_require__(265);
__webpack_require__(256);
__webpack_require__(248);
__webpack_require__(249);
__webpack_require__(254);
__webpack_require__(259);
__webpack_require__(261);
__webpack_require__(244);
__webpack_require__(245);
__webpack_require__(246);
__webpack_require__(247);
__webpack_require__(250);
__webpack_require__(251);
__webpack_require__(252);
__webpack_require__(255);
__webpack_require__(257);
__webpack_require__(260);
__webpack_require__(262);
__webpack_require__(263);
__webpack_require__(264);
__webpack_require__(167);
__webpack_require__(169);
__webpack_require__(168);
__webpack_require__(171);
__webpack_require__(170);
__webpack_require__(156);
__webpack_require__(154);
__webpack_require__(160);
__webpack_require__(157);
__webpack_require__(163);
__webpack_require__(165);
__webpack_require__(153);
__webpack_require__(159);
__webpack_require__(150);
__webpack_require__(164);
__webpack_require__(148);
__webpack_require__(162);
__webpack_require__(161);
__webpack_require__(155);
__webpack_require__(158);
__webpack_require__(147);
__webpack_require__(149);
__webpack_require__(152);
__webpack_require__(151);
__webpack_require__(166);
__webpack_require__(90);
__webpack_require__(238);
__webpack_require__(243);
__webpack_require__(118);
__webpack_require__(239);
__webpack_require__(240);
__webpack_require__(241);
__webpack_require__(242);
__webpack_require__(223);
__webpack_require__(117);
__webpack_require__(119);
__webpack_require__(120);
__webpack_require__(278);
__webpack_require__(267);
__webpack_require__(268);
__webpack_require__(273);
__webpack_require__(276);
__webpack_require__(277);
__webpack_require__(271);
__webpack_require__(274);
__webpack_require__(272);
__webpack_require__(275);
__webpack_require__(269);
__webpack_require__(270);
__webpack_require__(224);
__webpack_require__(225);
__webpack_require__(226);
__webpack_require__(227);
__webpack_require__(228);
__webpack_require__(231);
__webpack_require__(229);
__webpack_require__(230);
__webpack_require__(232);
__webpack_require__(233);
__webpack_require__(234);
__webpack_require__(235);
__webpack_require__(237);
__webpack_require__(236);
__webpack_require__(279);
__webpack_require__(305);
__webpack_require__(308);
__webpack_require__(307);
__webpack_require__(309);
__webpack_require__(310);
__webpack_require__(306);
__webpack_require__(311);
__webpack_require__(312);
__webpack_require__(290);
__webpack_require__(293);
__webpack_require__(289);
__webpack_require__(287);
__webpack_require__(288);
__webpack_require__(291);
__webpack_require__(292);
__webpack_require__(282);
__webpack_require__(304);
__webpack_require__(313);
__webpack_require__(281);
__webpack_require__(283);
__webpack_require__(285);
__webpack_require__(284);
__webpack_require__(286);
__webpack_require__(295);
__webpack_require__(296);
__webpack_require__(298);
__webpack_require__(297);
__webpack_require__(300);
__webpack_require__(299);
__webpack_require__(301);
__webpack_require__(302);
__webpack_require__(303);
__webpack_require__(280);
__webpack_require__(294);
__webpack_require__(316);
__webpack_require__(315);
__webpack_require__(314);
module.exports = __webpack_require__(14);

/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(121)(undefined);
// imports


// module
exports.push([module.i, "/*\r\n  Ivan Gabriele : http://www.ivangabriele.com/cordova-css-reset/\r\n  v2.8.0 | 20150421\r\n  License: MIT\r\n*/\r\n\r\n* {\r\n  -webkit-tap-highlight-color: rgba(0,0,0,0);\r\n}\r\n\r\n:focus {\r\n  outline: none;\r\n}\r\n\r\nhtml, body, div, span, applet, object, iframe,\r\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\r\na, abbr, acronym, address, big, button, cite, code,\r\ndel, dfn, em, img, ins, kbd, q, s, samp,\r\nsmall, strike, strong, sub, sup, tt, var,\r\nb, u, i, center,\r\ndl, dt, dd, ol, ul, li,\r\nfieldset, form, label, legend,\r\ninput, select, textarea,\r\ntable, caption, tbody, tfoot, thead, tr, th, td,\r\narticle, aside, canvas, details, embed,\r\nfigure, figcaption, footer, header, hgroup,\r\nmenu, nav, output, ruby, section, summary,\r\ntime, mark, audio, video {\r\n  margin: 0;\r\n  padding: 0;\r\n  border: 0;\r\n  font-size: 100%;\r\n  font: inherit;\r\n  vertical-align: baseline;\r\n}\r\n\r\narticle, aside, details, figcaption, figure,\r\nfooter, header, hgroup, menu, nav, section {\r\n  display: block;\r\n}\r\na {\r\n  color: inherit;\r\n  outline: none;\r\n  text-decoration: none;\r\n}\r\nblockquote, q {\r\n  quotes: none;\r\n}\r\nblockquote:before, blockquote:after,\r\nq:before, q:after {\r\n  content: '';\r\n  content: none;\r\n}\r\nbody {\r\n  -webkit-font-smoothing: antialiased;\r\n  -webkit-text-size-adjust: none;\r\n  -webkit-touch-callout: none;\r\n  -webkit-transform: translateZ(0);\r\n  -webkit-user-select: none;\r\n  line-height: 1;\r\n}\r\ncaption, th {\r\n  text-align: left;\r\n}\r\nfieldset, img {\r\n  border: 0;\r\n}\r\nhtml {\r\n  color: #000;\r\n  background: #fff;\r\n}\r\nlegend {\r\n  color: #000;\r\n}\r\nol, ul {\r\n  list-style: none;\r\n}\r\nsub {\r\n  vertical-align: text-bottom;\r\n}\r\nsup {\r\n  vertical-align: text-top;\r\n}\r\ntable {\r\n  border-collapse: collapse;\r\n  border-spacing: 0;\r\n}\r\ntextarea {\r\n  resize: none;\r\n}", ""]);

// exports


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(121)(undefined);
// imports


// module
exports.push([module.i, "* {\r\n    -webkit-tap-highlight-color: rgba(0,0,0,0); /* make transparent link selection, adjust last value opacity 0 to 1.0 */\r\n}\r\n\r\nhtml, body {\r\n    height: 100%;\r\n    width: 100%;\r\n    margin: 0;\r\n    display: flex;\r\n    align-content: center;\r\n    justify-content: center;\r\n}\r\n\r\nbody {\r\n    -webkit-touch-callout: none;                /* prevent callout to copy image, etc when tap to hold */\r\n    -webkit-text-size-adjust: none;             /* prevent webkit from resizing text to fit */\r\n    -webkit-user-select: none;                  /* prevent copy paste, to allow, change 'none' to 'text' */\r\n    box-sizing: border-box;\r\n    font-family:'Roboto', 'Open Sans', 'HelveticaNeue-Light', 'HelveticaNeue', Helvetica, Arial, sans-serif;\r\n    font-size: 0.9em;\r\n    line-height: 1.333;\r\n    padding-top: 60px;\r\n    text-align: center;\r\n}\r\n\r\n/* Portrait layout (default) */\r\n\r\n\r\n/* Landscape layout (with min-width) */\r\n@media screen and (min-aspect-ratio: 1/1) and (min-width:400px) {\r\n \r\n}\r\n\r\n.hidden {\r\n    display: none;\r\n}\r\n\r\n.menu {\r\n    height: 60px;\r\n    position: fixed;\r\n    right: 0;\r\n    top: 0;\r\n    z-index: 3;\r\n}\r\n\r\n.menu img {\r\n    cursor: pointer;\r\n    height: 32px;\r\n    margin: 14px 14px 14px 0;\r\n    transition: opacity 0.1s ease-out;\r\n}\r\n\r\n.menu img:active {\r\n    opacity: 0.5;\r\n}\r\n\r\n.splash {\r\n    align-content: center;\r\n    background: #ff9912 url(" + __webpack_require__(322) + ") center no-repeat;\r\n    background-size: 100px 100px;\r\n    display: flex;\r\n    height: calc(100% + 20px);\r\n    justify-content: center;\r\n    position: fixed;\r\n    top: 0;\r\n    transition: transform 1s ease;\r\n    width: 100%;\r\n    will-change: transform;\r\n    z-index: 2;\r\n}\r\n\r\n.splash.up {transform: translateY(-20px);}\r\n.splash.down {transform: translateY(0px);}\r\n.splash.out {\r\n    transform: translateY(calc(-100% + 60px));\r\n    transition-timing-function: ease-in;\r\n}\r\n\r\n.cards {\r\n    background: #fafafa;\r\n    width: 100%;\r\n}\r\n\r\n.card {\r\n    background-color: #fff;\r\n    border: 1px solid #ddd;\r\n    border-bottom-width: 2px;\r\n    cursor: pointer;\r\n    margin: 10px;\r\n    padding: 8px 10px;\r\n    position: relative;\r\n    transition: background-color 0.1s ease-out;\r\n    z-index: 1;\r\n}\r\n\r\n.card:active {\r\n    background-color: transparent;\r\n}\r\n\r\n.card::after {\r\n    background: url(" + __webpack_require__(321) + ") center no-repeat;\r\n    background-size: 100%;\r\n    content: '';\r\n    height: 1em;\r\n    position: absolute;\r\n    right: 10px;\r\n    top: 10px;\r\n    width: 1em;\r\n}\r\n\r\n.card.expanded::after {\r\n    transform: rotate(180deg);\r\n}\r\n\r\n.card .timetable tr:nth-child(n+5) {\r\n    display: none;\r\n}\r\n\r\n.card.expanded .timetable tr:nth-child(n+5) {\r\n    display: table-row;\r\n}\r\n\r\n.card h2 {\r\n    font-size: 1.5em;\r\n    font-weight: 300;\r\n    margin: 0 0 2px 0;\r\n    text-align: left;\r\n}\r\n\r\n.timetable {\r\n    color: #666;\r\n    text-align: left;\r\n    width: 100%;\r\n}\r\n\r\n.timetable td {\r\n    padding: 2px 1px;\r\n}\r\n\r\n.timetable td:first-child {\r\n    text-align: left;\r\n    width: 40px;\r\n}\r\n\r\n.timetable td:last-child {\r\n    text-align: right;\r\n    width: 50px;\r\n}\r\n\r\n.container {\r\n    width: 100%;\r\n    height: 100%;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.container.boards {\r\n    padding: 10px;\r\n}\r\n\r\n.home {\r\n    background: #ff9912;\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-content: center;\r\n    justify-content: center;\r\n    color: #fff;\r\n    padding: 20px;\r\n    transform: translate3d(0,0,0);\r\n}\r\n\r\n.home h1 {\r\n    font-weight: normal;\r\n}\r\n\r\nbutton {\r\n    border: 0;\r\n    background: #ff9912;\r\n    color: #fff;\r\n    margin: 10px;\r\n    padding: 10px 20px;\r\n}\r\n\r\nbutton:active {\r\n    background: #583608;\r\n}\r\n\r\nbutton:focus {\r\n    outline: 0;\r\n}\r\n\r\n", ""]);

// exports


/***/ }),
/* 320 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 321 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEFElEQVR4Xu2YV47VMBRABz6AJYDonS/WQu+9DojF8E/ZAl9shjZDZw/UaynJe/J7IX6OfeNykCKRmSSOzzlORllb4x8EIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAgA+Bk3LSFp8TNc7ZJoOsy7ZVY7AKxzglc/4p21PZkovAyH8l21/ZnslGBGELbeUbvmZLKoJ5+e0NEkG4AE7LpczKb9kmFcEy+UQQTv6ZHvlJRPA/+UQwPoIh+ZNG4CKfCPwjODuw8id9HawinwhWj8DI/7XknW9Lt/dV/jD0kU8E7hGc85Sv8joYI58IhiMYKz9qBCHkE0F/BOdHrvyor4OQ8olgMYILgeUHfRLEkE8EswhiyQ8SQUz57Q0+Fxa1fja+GGnlz78OfsgYuxYfOm4/2S6HvZbNfr+E3q8xAi35J9xU9x+1gwj64Xj+5pKc9zvywvou1x8tv50fEXiaXnJadvKJYIlFzx9dlvOyWvn2PHkS2ETc968oyT/ufkt+RxLB6tw05H+T24ouv506EbhHcFVh5avKJwJ3+ddKlU8EwxFoyT82fCtxj+B1sMjXyP8jW+gPZvPX+yrXn1y+9pPghQyY+mfj67XJJ4LZE+CGkvyjsyHT+p/W6yDFJ8HN2uXX/CTQkP9FACe78u3nUE1PglsKKz8r+TU9CW4ryT9ir7Bc9kt+EiDfscISI7ijsPI/yxjZrny7jZIiQL5t13G/hAjuylxjft0z1zYr/7Aj0+wOyzkC5AfKTSuCl3K/oT4b31NY+Z9KXvl2OzlFcB/5tr4w+zlEoCX/UBik+V0l5QgeKK38auW3uaYYwUMF+R9ljOrlpxjBOvKneZWk8CTQkn9wGsTpjzplBI+UVj7yBzqcIoLHCvI3ZQzkD8hvf60ZwRMl+Qcc585hDQGtCGJ/29+U+SDfM+vcI0C+p/j503KNYIOVH8B+c4ncIkB+OPfdlXKJwMjfH2H+XFIIpB4B8hUyTTWCD6x8BfvNEKlFgHw9991IqUSA/Ankt0NOHYGRv2/C+TO0EJgqAuQnlJ92BO9Z+QnZb25FKwLkp+e+u6PYERj5exOeP7cmBGJFgPyM8godwTtWfkb2m1sNFQHy83Pf3fHYCIz8PRnPn1sXAr4RIL+gfFaN4C0rvyD7zVRcI0B+ee67GQ1FYOTvLnj+TE0I9EWA/IrysCN4w8qvyH4z1TYC5NfnvpuxiWBnxfNn6hCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACJRL4B/e99EDjS7t0AAAAAElFTkSuQmCC"

/***/ }),
/* 322 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAgAElEQVR4AQBJgLZ/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xIAAAAnAAAAJAAAABAAAAANAAAADAAAAA0AAAANAAAADQAAAA0AAAAAAAAA8wAAAPMAAADzAAAA8wAAAPQAAADzAAAA8AAAANwAAADZAQEB7gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xUAAAA5AAAAKAAAACcAAAAnAAAAJwAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7AAAANkAAADZAAAA2QAAANgAAADHAQEB6wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALwile8AACAASURBVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////DwAAAEAAAABCAAAAQgAAACsAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA1QAAAL4AAAC+AAAAwAEBAfEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////NAAAAFQAAABDAAAAMQAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/QAAAM8AAAC9AAAArAEBAcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////HAAAAFwAAABdAAAAKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANYAAACjAAAApAEBAeQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////DAAAAFMAAABeAAAAQAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/gAAAL8AAACjAAAArQEBAfQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xYAAABxAAAAagAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8gAAAJYAAACOAQEB6wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8cAAAAdQAAAGUAAAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD3AAAAmwAAAIsBAQHkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////IwAAAHgAAABeAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPoAAACiAAAAiAEBAd0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///w8AAACEAAAAaQAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/QAAAJcAAAB8AQEB8QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////XQAAAIsAAAAXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADpAAAAdAEBAaQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///ysAAACVAAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAABrAQEB1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8J////igAAAM8AAAA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeIXyYgAAIABJREFUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAADQ////iv///wkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///ykAAACqAAAALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANMAAABWAQEB2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////XQAAAMsAAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC0AAADM////XQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///woAAACUAAAAYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAADnAAAA8wAAAPMAAADzAAAA8wAAAPQAAAAAAAAADAAAAA0AAAANAAAADQAAAA0AAAAZAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ8AAABrAQEB9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////KQAAAKsAAAArAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPUAAADJAAAA2AAAANkAAADZAAAA2QAAAOIBAQH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8CAAAAHgAAACcAAAAnAAAAJwAAACgAAAA3AAAACwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADUAAAAVgEBAdcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9DAAAArwAAAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+QAAAMgAAAC9AAAAvgAAAMoBAQH7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8FAAAANgAAAEMAAABCAAAAOAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8wAAAFABAQG+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///1X////5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////6n///9M////CQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Cf///0z///+p////9/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////j///9UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////av////3//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v///8L///9k////DwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////D////2X////D/////v/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////aQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///+B//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////n///+Z////JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////JP///5n////5/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Af///5f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1////j////xsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8b////j/////X///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+W////AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////jv//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+P///4j///8VAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xX///+I////+P/////////////////////////////ZXiUIAAAgAElEQVT/////////////////////////////////////////////////////////////////////////////////////////////////jQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///93//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+4////JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////JP///7j//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///2H/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4////1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9U////4/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Tf////z///////////////////////////////////////////////////////////////////////////////////////////////////////////////////+R////DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////DP///5H////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7////TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///87////9v//////////////////////////////////////////////////////////////////////////////////////////////////////////////7f///00AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9O////7v//////////////////////////////////////////////////////////////////////////////////////////////////////////////9v///zsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xr////q///////////////////////////////////////////////////////////////////////////////////////////////////////////////F////HgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Hv///8b//////////////////////////////////////////////////////////////////////////////////////////////////////////////+n///8ZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////A////8D//////////////////////////////////////////////////////////////////////////////////////////////////////////////4n///8EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wT///+J//////////////////////////////////////////////////////////////////////////////////////////////////////////////+/////AwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////g//////////////////////////////////////////////////////////////////////////////////////////////////////////8////YgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Y/////z/////////////////////////////////////////////////////////////////////////////////////////////////////////ggAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9E/////f////////////////////////////////////////////////////////////////////////////////////////////////////f///9PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///0/////3/////////////////////////////////////////////////////////////////////////////////////////////////////f///0MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xn////p////////////////////////////////////////////////////////////////////////////////////////////////////8P///z0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8+////8P///////////////////////////////////////////////////////////////////////////////////////////////////+j///8YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Af///73////////////////////////////////////////////////////////////////////////////////////////////////////r////LgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////L////+v///////////////////////////////////////////////////////////////////////////////////////////////////+8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP5KqOIAACAASURBVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALd/SIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9g////////////////////////////////////////////////////////////////////////////////////////////////////8////zUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Nf////T///////////////////////////////////////////////////////////////////////////////////////////////////9fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xH////q///////////////////////////////////////////////////////////////////////////////////////////////6////RQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///0b////6///////////////////////////////////////////////////////////////////////////////////////////////p////EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///5b///////////////////////////////////////////////////////////////////////////////////////////////7///9ZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9a/////v//////////////////////////////////////////////////////////////////////////////////////////////lQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////NP////3//////////////////////////////////////////////////////////////////////////////////////////////3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////cf///////////////////////////////////////////////////////////////////////////////////////////////f///zMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8C////y///////////////////////////////////////////////////////////////////////////////////////////////pQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///6b//////////////////////////////////////////////////////////////////////////////////////////////8r///8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9m///////////////////////////////////////////////////////////////////////////////////////////////Z////DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///w3////Z//////////////////////////////////////////////////////////////////////////////////////////////9mAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wUAAADdAAAAHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAA3AQEB0gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///4AAAABeAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAACYAQEBjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8vAAAAyAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADjAAAAIwEBAfsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///2T//////////////////////////////////////////////////////////////////////////////////////////////2YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////R///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////NQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Z///////////////////////////////////////////////////////////////////////////////////////////////YwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AwAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAswEBAZoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBmQAAALQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeP///wMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWAAAACMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD3AAAAbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wMAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC////xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAADzAQEB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG4AAABDAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJAAAAFcAAACmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFNXaWgAAIABJREFUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8B////1f////////////////////////////////////////////////////////////////////////////////////////97AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////c/////P////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v////ZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///99/////////////////////////////////////////////////////////////////////////////////////////9T///8BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9TAAAArAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkAAAAuAQEB+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///89AAAAwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAC4BAQHUAAAAAAAAAAAAAAAAAAAAAAAAAAD///8HAAAA1AAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABTAQEBrgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGsBAQH6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAADkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQH5AAAAbQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///x8AAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuwEBAb0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBuAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////HgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFwAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADFAQEBwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANMAAAAxAAAAMQAAADEAAAAxAAAAiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAewAAADUAAAA1AAAANQAAADUAAADkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAb0AAADIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////NwAAACcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPYBAQHQAAAAAAAAAAAAAAAA////PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3gEBAcwAAAAAAAAAAAAAAAD////5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACFAAAAswAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKP///zYBAQHKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM4BAQG3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsQAAAOcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADfAAAAugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQG0AAAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8FAAAAWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxAAAAFoAAAAoAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP0AAADXAAAAfAAAAEYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlAAAAJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFj///9xAQEB/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2AAAAEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9wAAAKsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAfYAAADOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArAAAAJQAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAA2AAAAxgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsAEBAfMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADD8omyAAAgAElEQVQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEB8QAAALIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAogAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wgAAAA5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADoAAAAuwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALgAAADrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5////BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADoAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACsAQEB/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+AAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAfwAAACtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADTAAAAAAAAAAAAAAAAAAAAAAAAANMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADTAAAAAAAAAAAAAAAAAAAAAAAAANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4AAADBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACzAAAAoQAAAAAAAAAAAAAA1AAAAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1AAAA3gAAAAAAAAAAAAAAjwEBAcUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM8BAQHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQH/AAAAYP///4MAAAAPAAAA0QEBAf0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQHe////KAAAADAAAADrAQEB4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQHt////0QAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////GgAAAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAd0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEB+wAAAMsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvgAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADf///xkBAQHnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8QEBAekAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKttRTgAACAASURBVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEB6AAAAPIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8HAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb///8GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPUAAAAAAAAAAAAA8Wij4AAAIABJREFUAAAAAAAAAAAAAAAAAACA/38AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAfIAAAD5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AEBAfMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAC+1uRtAAAgAElEQVQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAV////EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8SAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALwAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABf////1AAAAL8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAEoAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADYAAAA/gAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAjgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+AAAA2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQH3AAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADfAQEB+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOP///wkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///woAAAA3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAADsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADsAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD7AAAAkwAAAFsAAACCAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPMAAACGAAAAWwAAAI8AAAD5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///9j//////////////////////////////////////////////////////////////////////////////9oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9s/////////////////////////+H///9x////i/////v///////////////////9QAAAAAAAAAAAAAAAA////LP////j/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+v///zQAAAAAAAAAAAAAAAD///9I/////////////////////f///5D///9v////3f////////////////////////9YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///9v//////////////////////////////////////////////////////////////////////////////9gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///5L///////////////////////////////////////////////////////////////////////////////////84AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9s/////////////////////////zIAAAAAAAAAAP///4f//////////////9QAAAAAAAAAAAAAAAAAAAAAAAAAAP///6j/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////sgAAAAAAAAAAAAAAAAAAAAAAAAAA////yv//////////////kQAAAAAAAAAA////KP////////////////////////9YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Of///////////////////////////////////////////////////////////////////////////////////5EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOEAAAAAAAAAAAAAAOIAAAAAAAAAAAAAAO0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7gAAAAAAAAAAAAAA4QAAAAAAAAAAAAAA4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wv////5///////////////////////////////////////////////////////////////////////////////t////BgAAAAAAAAAAAAAAAA1LrSYAACAASURBVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9s/////////////////////////5////8N////J////9r///////////////f///8aAAAAAAAAAAAAAAAA////Bv///97/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5f///woAAAAAAAAAAAAAAAD///8U////8v//////////////3////yz///8L////l/////////////////////////9YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8G////7v//////////////////////////////////////////////////////////////////////////////+f///wsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///+1////////////////////////////////////////////////////////////////////////////////////UgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9s///////////////////////////////////////////////////////////////N////LwAAAAD///8f////sv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7n///8iAAAAAP///yv////I//////////////////////////////////////////////////////////////9YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9T////////////////////////////////////////////////////////////////////////////////////tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACfAAAASgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaAAAAK4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyAAAA0P////gAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEYAAADd////+AAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyAAAA7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARf///zUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zcAAABEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADrAAAAsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQH6AAAApQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACjAQEB+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE7///8sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////MAAAAEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEB0gAAAM0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAB7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAewAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMkBAQHVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABW////LwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8yAAAAUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wsAAADfAAAAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxgAAADwBAQH/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8TAAAAzwAAAB0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANgAAAA0AQEB9QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wEAAADHAAAANwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6AAAACIBAQH3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAfX///+OAAAAhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOgAAAGEAAACeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQHt////LAAAAEAAAAAGAAAAPQAAAG4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHcAAADeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALQAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIgAAADNAAAA+AAAAL4BAQH2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGQAAAA3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjAEBAfcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8M////7P///////////////////////////////////////////////////////////////////////////////////+v///8SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////XP///////////////////////////////////zQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdZnKWgAAIABJREFUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////RP///////////////////////////////////0wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////E////+z////////////////////////////////////////////////////////////////////////////////////q////CwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQH0AAAAjwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAACIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiAAAABMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACOAQEB9QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkwAAAO8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABk////SQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9JAAAAYwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO4AAACVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEB8gAAAJEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAov///xsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xwAAACiAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJABAQHzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///w8AAADZAAAAFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMMAAABBAQEB/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////CgAAAKYAAAArAAAAAQAAAAAAAAD/AAAAvwAAAGcBAQH/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////BAAAAKAAAAA3AAAAAQAAAAAAAAD/AAAAzQAAAF4BAQH6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////BAAAAL8AAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6QAAACYBAQHyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9d//////////////////////////////////////////////////////////////////////////////////////////////+GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////h///////////////////////////////////////////////////////////////////////////////////////////////XAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////wf/////////////////////////////////////////////////////////////////////////////////////////+////TQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9N/////v/////////////////////////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////K/////v/////////////////////////////////////////////////////////////////////////////////////////9f///zgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zr////2//////////////////////////////////////////////////////////////////////////////////////////r///8qAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///4v//////////////////////////////////////////////////////////////////////////////////////////////+3///8pAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////K////+7//////////////////////////////////////////////////////////////////////////////////////////////4oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wv////j///////////////////////////////////////////////////////////////////////////////////////////////i////HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8e////5P//////////////////////////////////////////////////////////////////////////////////////////////4v///wsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9M////////////////////////////////////////////////////////////////////////////////////////////////////1P///xUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xctgguYAAAgAElEQVT////X/////////////////wAAgP9///////////////////////////////////////////////////////////////////////////////////9MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///+W////////////////////////////////////////////////////////////////////////////////////////////////////2v///yEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8j////3P///////////////////////////////////////////////////////////////////////////////////////////////////5UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8J////1f///////////////////////////////////////////////////////////////////////////////////////////////////+f///8vAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zH////o////////////////////////////////////////////////////////////////////////////////////////////////////1f///wkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////L/////j////////////////////////////////////////////////////////////////////////////////////////////////////x////QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Qf////H////////////////////////////////////////////////////////////////////////////////////////////////////4////LgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///3H/////////////////////////////////////////////////////////////////////////////////////////////////////////+P///2EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9h////+P////////////////////////////////////////////////////////////////////////////////////////////////////////9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wH///+4//////////////////////////////////////////////////////////////////////////////////////////////////////////////+h////CwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////C////6H//////////////////////////////////////////////////////////////////////////////////////////////////////////////7j///8BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8V////3///////////////////////////////////////////////////////////////////////////////////////////////////////////////1v///ywAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8s////1v//////////////////////////////////////////////////////////////////////////////////////////////////////////////3////xUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Lf////P///////////////////////////////////////////////////////////////////////////////////////////////////////////////b///9m////AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Af///2b////2///////////////////////////////////////////////////////////////////////////////////////////////////////////////z////LQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///07////9////////////////////////////////////////////////////////////////////////////////////////////////////////////////////w////y0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8t////xP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3///9OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///94//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v///+N////DQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Df///47////7/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////ov//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5P///1z///8DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wP///9d////5f//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////pAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB76ErsAACAASURBVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////B////8T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////c////ZP///wYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8G////ZP///9z////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////H////CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xL////X/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+P///9u////CQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Cf///27////j/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9n///8TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8f////5v//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7v///5f///85AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zr///+X////7v//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5////yEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////MAAAAMIAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2wAAAKQAAACjAQEB3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///yEAAABdAAAAXQAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0AAAAPwEBAc4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///0QAAAC2AAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2AAAAL8AAAC+AAAAwAEBAewAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////FAAAAEAAAABCAAAAQQAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPsAAABNAQEBuQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9cAAAAogAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAANMAAADFAAAA1wAAANkAAADYAAAA4wEBAf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AQAAAB0AAAAoAAAAJwAAACkAAAA7AAAALQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF8BAQGiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////eAAAAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9gAAANoAAADjAAAA9AAAAPMAAADzAAAA8wAAAPMAAAAAAAAADQAAAA0AAAANAAAADQAAAA0AAAAcAAAAJgAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAewEBAYYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///5QAAABrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACXAQEBagAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wIAAACsAAAAUQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALAAAABTAQEB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8IAAAAvAAAADsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxgAAAEQBAQH3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJGerkAAAIABJREFUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////EgAAAMUAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADZAAAAOgEBAe4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///x8AAADHAAAAGQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOgAAAA5AQEB4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAeEAAABJAAAA8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8wAAAEoBAQHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQHRAAAAUwAAAPsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD7AAAAUwEBAc8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBvAAAAGIAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjAQEBuwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAaQAAAB5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHoBAQGjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////kwAAAGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlQEBAWwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AgAAAKsAAABSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACvAAAAVAEBAf4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wgAAAC7AAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMUAAABEAQEB+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8RAAAAxQAAACkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2AAAADsBAQHuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////HgAAAMcAAAAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADsF8mZAAAgAElEQVQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnAAAAOQEBAeEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEB4gAAAEoAAADyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPMAAABJAQEB4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAdEAAABSAAAA+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+wAAAFIBAQHRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQG9AAAAYQAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAYgEBAbwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBpQAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB5AQEBpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///+SAAAAbQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJQBAQFtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8CAAAAqgAAAFMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArgAAAFUBAQH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////CAAAALoAAAA9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADEAAAARQEBAfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xEAAADEAAAAKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANcAAAA7AQEB7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8eAAAAxwAAABoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5gAAADkBAQHiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQHiAAAASQAAAPIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI82wsgAACAASURBVAAAAAAAAAAAAAAAAADyAAAASgEBAeIByHE3jgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQHSAAAAUQAAAPoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+gAAAFEBAQHRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBvgAAAGEAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAYQEBAb4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///91//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////92AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////kf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Av///6v/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////q////wIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wcAAAC6AAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDAAAARQEBAfkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8RAAAAxAAAACoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANYAAAA8AQEB7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////HQAAAMcAAAAbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5QAAADkBAQHjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEB4wAAAEkAAADxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxAAAASQEBAeMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAdMAAABRAAAA+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPoAAABRAQEB0wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAl5nxfgAAIABJREFUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Wf////7//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v///1kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///3T/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///+Q//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8C////qv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6r///8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////B////8H/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wf///wcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xD////U///////////////////////////////////////////////////////////////////////////////////////////////////////////////U////EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8d////5P///////////////////////////////////////////////////////////////////////////////////////////////////+T///8cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Lf////D/////////////////////////////////////////////////////////////////////////////////////////8P///y0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///0D////5///////////////////////////////////////////////////////////////////////////////5////QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9Y/////v////////////////////////////////////////////////////////////////////7///9XAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2KWxwAAAgAElEQVQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////c////////////////////////////////////////////////////////////////////3IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///4//////////////////////////////////////////////////////////jgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wH///+p//////////////////////////////////////////////+o////AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8H////wP///////////////////////////////////7////8HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////EP///9P/////////////////////////0////w8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xz////j///////////////j////HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8s////8P///+////8sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////QP///z8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYhmyIAABHnSURBVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADrd/f4HTuNXQAAAABJRU5ErkJggg=="

/***/ }),
/* 323 */
/***/ (function(module, exports) {

module.exports = [
	{
		"id": 1,
		"name": "Abramowskiego-Sienkiewicza",
		"latitude": 51.75425,
		"longitude": 19.46545
	},
	{
		"id": 2,
		"name": "Brzeźna-Piotrkowska",
		"latitude": 51.75286,
		"longitude": 19.46029
	},
	{
		"id": 3,
		"name": "Chochoła",
		"latitude": 51.8044,
		"longitude": 19.35776
	},
	{
		"id": 4,
		"name": "Aleksandrowska-Lechicka",
		"latitude": 51.80375,
		"longitude": 19.36265
	},
	{
		"id": 5,
		"name": "Aleksandrowska-Szczecińska",
		"latitude": 51.8028,
		"longitude": 19.36713
	},
	{
		"id": 6,
		"name": "Aleksandrowska-Szparagowa",
		"latitude": 51.80113,
		"longitude": 19.37542
	},
	{
		"id": 7,
		"name": "Teofilów",
		"latitude": 51.80229,
		"longitude": 19.3681
	},
	{
		"id": 8,
		"name": "Aleksandrowska-Kaczeńcowa",
		"latitude": 51.79904,
		"longitude": 19.38588
	},
	{
		"id": 9,
		"name": "Aleksandrowska-Traktorowa",
		"latitude": 51.79751,
		"longitude": 19.39352
	},
	{
		"id": 10,
		"name": "Aleksandrowska-Kaczeńcowa",
		"latitude": 51.79868,
		"longitude": 19.38818
	},
	{
		"id": 11,
		"name": "Aleksandrowska-Traktorowa",
		"latitude": 51.79727,
		"longitude": 19.39527
	},
	{
		"id": 12,
		"name": "Aleksandrowska-Bielicowa",
		"latitude": 51.79582,
		"longitude": 19.40199
	},
	{
		"id": 13,
		"name": "Aleksandrowska-Bielicowa",
		"latitude": 51.79565,
		"longitude": 19.40354
	},
	{
		"id": 14,
		"name": "Limanowskiego-Woronicza",
		"latitude": 51.79416,
		"longitude": 19.41058
	},
	{
		"id": 16,
		"name": "Woronicza-Dw. Łódź Żabieniec",
		"latitude": 51.79304,
		"longitude": 19.40858
	},
	{
		"id": 17,
		"name": "Limanowskiego-zajezdnia LIMANOWSKIE",
		"latitude": 51.79151,
		"longitude": 19.42553
	},
	{
		"id": 18,
		"name": "Limanowskiego-Żabieniec",
		"latitude": 51.79418,
		"longitude": 19.41088
	},
	{
		"id": 19,
		"name": "Aleksandrowska-Bielicowa",
		"latitude": 51.79566,
		"longitude": 19.40328
	},
	{
		"id": 20,
		"name": "Aleksandrowska-Traktorowa",
		"latitude": 51.79731,
		"longitude": 19.39511
	},
	{
		"id": 21,
		"name": "Aleksandrowska-Bielicowa",
		"latitude": 51.79631,
		"longitude": 19.40144
	},
	{
		"id": 22,
		"name": "Traktorowa-Grabieniec",
		"latitude": 51.79576,
		"longitude": 19.3939
	},
	{
		"id": 23,
		"name": "Aleksandrowska-Traktorowa",
		"latitude": 51.79795,
		"longitude": 19.39334
	},
	{
		"id": 24,
		"name": "Traktorowa-Sierpowa",
		"latitude": 51.79899,
		"longitude": 19.3947
	},
	{
		"id": 25,
		"name": "Aleksandrowska-Kaczeńcowa",
		"latitude": 51.79873,
		"longitude": 19.38795
	},
	{
		"id": 26,
		"name": "Kaczeńcowa-Aleksandrowska",
		"latitude": 51.80043,
		"longitude": 19.38793
	},
	{
		"id": 27,
		"name": "Aleksandrowska-Kaczeńcowa",
		"latitude": 51.79946,
		"longitude": 19.38562
	},
	{
		"id": 28,
		"name": "Aleksandrowska-Szparagowa",
		"latitude": 51.80093,
		"longitude": 19.37694
	},
	{
		"id": 29,
		"name": "Szparagowa-Aleksandrowska",
		"latitude": 51.80195,
		"longitude": 19.37737
	},
	{
		"id": 30,
		"name": "Aleksandrowska-Szczecińska",
		"latitude": 51.80255,
		"longitude": 19.36884
	},
	{
		"id": 31,
		"name": "Aleksandrowska-Lechicka",
		"latitude": 51.80378,
		"longitude": 19.36274
	},
	{
		"id": 32,
		"name": "Chochoła",
		"latitude": 51.8046,
		"longitude": 19.35703
	},
	{
		"id": 33,
		"name": "Armii Krajowej-Napierskiego",
		"latitude": 51.74679,
		"longitude": 19.39797
	},
	{
		"id": 34,
		"name": "Kusocińskiego-Armii Krajowej",
		"latitude": 51.74998,
		"longitude": 19.39136
	},
	{
		"id": 35,
		"name": "Armii Krajowej-Napierskiego",
		"latitude": 51.74704,
		"longitude": 19.39754
	},
	{
		"id": 36,
		"name": "Retkińska-Wyszyńskiego",
		"latitude": 51.74902,
		"longitude": 19.4074
	},
	{
		"id": 38,
		"name": "Augustów-Przybyszewskiego",
		"latitude": 51.75044,
		"longitude": 19.54766
	},
	{
		"id": 39,
		"name": "Augustów-Wujaka",
		"latitude": 51.75337,
		"longitude": 19.55104
	},
	{
		"id": 40,
		"name": "Augustów-Rokicińska",
		"latitude": 51.75672,
		"longitude": 19.55326
	},
	{
		"id": 41,
		"name": "Rokicińska-Lermontowa",
		"latitude": 51.75869,
		"longitude": 19.5498
	},
	{
		"id": 42,
		"name": "Augustów-Rokicińska",
		"latitude": 51.75659,
		"longitude": 19.55314
	},
	{
		"id": 43,
		"name": "Augustów-Wujaka",
		"latitude": 51.75319,
		"longitude": 19.55063
	},
	{
		"id": 44,
		"name": "Augustów-Przybyszewskiego",
		"latitude": 51.75173,
		"longitude": 19.54895
	},
	{
		"id": 46,
		"name": "Pabianicka-Chocianowicka",
		"latitude": 51.70602,
		"longitude": 19.42206
	},
	{
		"id": 47,
		"name": "Pabianicka-Długa",
		"latitude": 51.703,
		"longitude": 19.41801
	},
	{
		"id": 48,
		"name": "Grabińska-Nowosolna",
		"latitude": 51.79458,
		"longitude": 19.58983
	},
	{
		"id": 49,
		"name": "Grabińska-Grabińska 10",
		"latitude": 51.8016,
		"longitude": 19.59068
	},
	{
		"id": 50,
		"name": "Grabińska-Nowosolna",
		"latitude": 51.79445,
		"longitude": 19.58966
	},
	{
		"id": 51,
		"name": "Wiączyńska-Nowosolna",
		"latitude": 51.79271,
		"longitude": 19.59107
	},
	{
		"id": 52,
		"name": "Bieszczadzka-Kolumny",
		"latitude": 51.70743,
		"longitude": 19.51265
	},
	{
		"id": 53,
		"name": "Józefów-Bieszczadzka",
		"latitude": 51.70644,
		"longitude": 19.51092
	},
	{
		"id": 54,
		"name": "Bieszczadzka-Kolumny",
		"latitude": 51.70768,
		"longitude": 19.51276
	},
	{
		"id": 55,
		"name": "Kolumny-Bronisin",
		"latitude": 51.70798,
		"longitude": 19.51746
	},
	{
		"id": 56,
		"name": "Borowa-Siewna",
		"latitude": 51.77988,
		"longitude": 19.40942
	},
	{
		"id": 57,
		"name": "Siewna-Krakowska",
		"latitude": 51.77937,
		"longitude": 19.40052
	},
	{
		"id": 58,
		"name": "Boya-Żeleńskiego-Sucharskiego",
		"latitude": 51.79027,
		"longitude": 19.47564
	},
	{
		"id": 59,
		"name": "Wojska Polskiego-Sporna",
		"latitude": 51.78927,
		"longitude": 19.47999
	},
	{
		"id": 60,
		"name": "Boya-Żeleńskiego-Sucharskiego",
		"latitude": 51.79047,
		"longitude": 19.47449
	},
	{
		"id": 61,
		"name": "Obr.Westerplatte-Organizacji WiN",
		"latitude": 51.78927,
		"longitude": 19.46781
	},
	{
		"id": 62,
		"name": "Bratysławska-Wróblewskiego",
		"latitude": 51.74923,
		"longitude": 19.42288
	},
	{
		"id": 63,
		"name": "Bratysławska-Wileńska",
		"latitude": 51.75198,
		"longitude": 19.42514
	},
	{
		"id": 64,
		"name": "Grabińska-Podwodna",
		"latitude": 51.80635,
		"longitude": 19.59102
	},
	{
		"id": 65,
		"name": "Bandurskiego-Dw. Łódź Kaliska",
		"latitude": 51.75563,
		"longitude": 19.43186
	},
	{
		"id": 66,
		"name": "Bratysławska-Wróblewskiego",
		"latitude": 51.74979,
		"longitude": 19.42329
	},
	{
		"id": 67,
		"name": "Wyszyńskiego-Waltera-Janke",
		"latitude": 51.74753,
		"longitude": 19.4179
	},
	{
		"id": 69,
		"name": "Grabińska-Grabińska 10",
		"latitude": 51.8017,
		"longitude": 19.59041
	},
	{
		"id": 70,
		"name": "Broniewskiego-Kilińskiego",
		"latitude": 51.7311,
		"longitude": 19.47677
	},
	{
		"id": 71,
		"name": "Broniewskiego-Kraszewskiego",
		"latitude": 51.73218,
		"longitude": 19.48202
	},
	{
		"id": 72,
		"name": "Kilińskiego-Dąbrowskiego",
		"latitude": 51.73791,
		"longitude": 19.47883
	},
	{
		"id": 73,
		"name": "Broniewskiego-Śmigłego-Rydza",
		"latitude": 51.73248,
		"longitude": 19.48659
	},
	{
		"id": 74,
		"name": "Broniewskiego-Tatrzańska",
		"latitude": 51.73302,
		"longitude": 19.49264
	},
	{
		"id": 75,
		"name": "Felińskiego-Kruczkowskiego",
		"latitude": 51.73235,
		"longitude": 19.49592
	},
	{
		"id": 76,
		"name": "Tatrzańska-Dąbrowskiego",
		"latitude": 51.73823,
		"longitude": 19.4949
	},
	{
		"id": 77,
		"name": "Dąbrowskiego-Kossaka",
		"latitude": 51.73658,
		"longitude": 19.49803
	},
	{
		"id": 78,
		"name": "Broniewskiego-Śmigłego-Rydza",
		"latitude": 51.73293,
		"longitude": 19.49084
	},
	{
		"id": 79,
		"name": "Broniewskiego-Kraszewskiego",
		"latitude": 51.73236,
		"longitude": 19.48148
	},
	{
		"id": 80,
		"name": "Broniewskiego-Kilińskiego",
		"latitude": 51.73097,
		"longitude": 19.47581
	},
	{
		"id": 81,
		"name": "Rzgowska-Bankowa",
		"latitude": 51.72917,
		"longitude": 19.47643
	},
	{
		"id": 82,
		"name": "Dąbrowskiego-Kilińskiego",
		"latitude": 51.73865,
		"longitude": 19.47834
	},
	{
		"id": 83,
		"name": "Paderewskiego-Tuszyńska",
		"latitude": 51.72856,
		"longitude": 19.46929
	},
	{
		"id": 84,
		"name": "Rzgowska-Paderewskiego",
		"latitude": 51.73174,
		"longitude": 19.47385
	},
	{
		"id": 85,
		"name": "Paderewskiego-Rzgowska",
		"latitude": 51.73031,
		"longitude": 19.47379
	},
	{
		"id": 86,
		"name": "Brukowa-Limanowskiego",
		"latitude": 51.79601,
		"longitude": 19.40948
	},
	{
		"id": 87,
		"name": "Brukowa-Pojezierska",
		"latitude": 51.80026,
		"longitude": 19.41096
	},
	{
		"id": 88,
		"name": "Pojezierska-Elektrociepłownia EC3",
		"latitude": 51.79952,
		"longitude": 19.4201
	},
	{
		"id": 89,
		"name": "Brukowa-św. Teresy",
		"latitude": 51.80583,
		"longitude": 19.41183
	},
	{
		"id": 90,
		"name": "Św. Teresy-Włókniarzy",
		"latitude": 51.80439,
		"longitude": 19.42189
	},
	{
		"id": 91,
		"name": "Brukowa-Pojezierska",
		"latitude": 51.80184,
		"longitude": 19.41121
	},
	{
		"id": 92,
		"name": "Limanowskiego-Dw. Łódź Żabieniec",
		"latitude": 51.79514,
		"longitude": 19.40744
	},
	{
		"id": 93,
		"name": "Grabińska 40",
		"latitude": 51.81422,
		"longitude": 19.5919
	},
	{
		"id": 94,
		"name": "Grabińska-Podwodna",
		"latitude": 51.80621,
		"longitude": 19.59089
	},
	{
		"id": 95,
		"name": "Grabina-Grabina/Lipowa1",
		"latitude": 51.8195,
		"longitude": 19.59675
	},
	{
		"id": 96,
		"name": "Grabińska 39",
		"latitude": 51.81374,
		"longitude": 19.59168
	},
	{
		"id": 97,
		"name": "Brzezińska-Śnieżna",
		"latitude": 51.79596,
		"longitude": 19.50407
	},
	{
		"id": 98,
		"name": "Brzezińska-CH M1",
		"latitude": 51.79627,
		"longitude": 19.51081
	},
	{
		"id": 99,
		"name": "Brzezińska-Kerna",
		"latitude": 51.79648,
		"longitude": 19.51605
	},
	{
		"id": 100,
		"name": "Brzezińska-Janosika",
		"latitude": 51.79653,
		"longitude": 19.52353
	},
	{
		"id": 101,
		"name": "Brzezińska-Marmurowa",
		"latitude": 51.7959,
		"longitude": 19.53405
	},
	{
		"id": 102,
		"name": "Janosika-Powstańców Śląskich",
		"latitude": 51.79242,
		"longitude": 19.52374
	},
	{
		"id": 103,
		"name": "Zjazdowa-Beskidzka",
		"latitude": 51.79998,
		"longitude": 19.5292
	},
	{
		"id": 104,
		"name": "Brzezińska-Olkuska",
		"latitude": 51.79589,
		"longitude": 19.55699
	},
	{
		"id": 106,
		"name": "Brzezińska-Karkonoska",
		"latitude": 51.79593,
		"longitude": 19.54936
	},
	{
		"id": 107,
		"name": "Brzezińska-Granatowa",
		"latitude": 51.79528,
		"longitude": 19.56602
	},
	{
		"id": 108,
		"name": "Brzezińska-Hiacyntowa",
		"latitude": 51.79469,
		"longitude": 19.57526
	},
	{
		"id": 109,
		"name": "Brzezińska-Nowosolna",
		"latitude": 51.7937,
		"longitude": 19.58909
	},
	{
		"id": 110,
		"name": "Brzezińska-Hiacyntowa",
		"latitude": 51.79495,
		"longitude": 19.57339
	},
	{
		"id": 111,
		"name": "Brzezińska-Granatowa",
		"latitude": 51.79554,
		"longitude": 19.56419
	},
	{
		"id": 112,
		"name": "Brzezińska-Karkonoska",
		"latitude": 51.79607,
		"longitude": 19.54842
	},
	{
		"id": 113,
		"name": "Brzezińska-Olkuska",
		"latitude": 51.79583,
		"longitude": 19.5595
	},
	{
		"id": 114,
		"name": "Brzezińska-Marmurowa",
		"latitude": 51.79603,
		"longitude": 19.53562
	},
	{
		"id": 115,
		"name": "Brzezińska-Janosika",
		"latitude": 51.7967,
		"longitude": 19.5231
	},
	{
		"id": 116,
		"name": "Brzezińska-Kerna",
		"latitude": 51.7967,
		"longitude": 19.51311
	},
	{
		"id": 117,
		"name": "Brzezińska-Śnieżna",
		"latitude": 51.79585,
		"longitude": 19.50173
	},
	{
		"id": 118,
		"name": "Wojska Polskiego-Łomnicka",
		"latitude": 51.79317,
		"longitude": 19.49261
	},
	{
		"id": 119,
		"name": "Brzeźna-Piotrkowska",
		"latitude": 51.75275,
		"longitude": 19.46057
	},
	{
		"id": 120,
		"name": "Sienkiewicza-Tymienieckiego (Ericss",
		"latitude": 51.75013,
		"longitude": 19.46383
	},
	{
		"id": 121,
		"name": "Sienkiewicza-Pogotowie Ratunkowe",
		"latitude": 51.75451,
		"longitude": 19.46416
	},
	{
		"id": 122,
		"name": "Radwańska-Wólczańska",
		"latitude": 51.7525,
		"longitude": 19.45629
	},
	{
		"id": 123,
		"name": "Chocianowicka-Chocianowicka 199",
		"latitude": 51.70897,
		"longitude": 19.38187
	},
	{
		"id": 124,
		"name": "Chocianowicka-Chocianowicka 143",
		"latitude": 51.70835,
		"longitude": 19.39175
	},
	{
		"id": 125,
		"name": "Chocianowicka-Chocianowicka 95",
		"latitude": 51.70774,
		"longitude": 19.40187
	},
	{
		"id": 126,
		"name": "Chocianowicka-Chocianowicka 57",
		"latitude": 51.70722,
		"longitude": 19.41036
	},
	{
		"id": 127,
		"name": "Pabianicka-Chocianowicka",
		"latitude": 51.70677,
		"longitude": 19.42367
	},
	{
		"id": 128,
		"name": "Chocianowicka-Chocianowicka 57",
		"latitude": 51.70732,
		"longitude": 19.41018
	},
	{
		"id": 129,
		"name": "Chocianowicka-Chocianowicka 95",
		"latitude": 51.70784,
		"longitude": 19.40156
	},
	{
		"id": 130,
		"name": "Chocianowicka-Chocianowicka 143",
		"latitude": 51.70841,
		"longitude": 19.39218
	},
	{
		"id": 131,
		"name": "Chocianowicka-Chocianowicka 199",
		"latitude": 51.70908,
		"longitude": 19.38148
	},
	{
		"id": 132,
		"name": "Łaskowice-Nad Dobrzynką",
		"latitude": 51.7097,
		"longitude": 19.37142
	},
	{
		"id": 133,
		"name": "Cmentarna-Legionów",
		"latitude": 51.77511,
		"longitude": 19.44298
	},
	{
		"id": 134,
		"name": "Legionów-Gdańska",
		"latitude": 51.77606,
		"longitude": 19.44705
	},
	{
		"id": 135,
		"name": "Cmentarna-Legionów",
		"latitude": 51.77528,
		"longitude": 19.44217
	},
	{
		"id": 136,
		"name": "Cmentarna-cm. Ogrodowa",
		"latitude": 51.77572,
		"longitude": 19.43715
	},
	{
		"id": 137,
		"name": "Srebrzyńska-Kasprzaka",
		"latitude": 51.77362,
		"longitude": 19.42798
	},
	{
		"id": 138,
		"name": "Czechosłowacka-Mazowiecka",
		"latitude": 51.77205,
		"longitude": 19.50943
	},
	{
		"id": 139,
		"name": "Czechosłowacka-Edwarda",
		"latitude": 51.77041,
		"longitude": 19.51536
	},
	{
		"id": 140,
		"name": "Edwarda-Pomorska",
		"latitude": 51.77476,
		"longitude": 19.52129
	},
	{
		"id": 141,
		"name": "Czechosłowacka-Edwarda",
		"latitude": 51.77052,
		"longitude": 19.51538
	},
	{
		"id": 142,
		"name": "Czechosłowacka-Mazowiecka",
		"latitude": 51.77219,
		"longitude": 19.50907
	},
	{
		"id": 143,
		"name": "Czechosłowacka-Niciarniana",
		"latitude": 51.77173,
		"longitude": 19.50592
	},
	{
		"id": 144,
		"name": "Niciarniana-Dw. Łódź Niciarniana",
		"latitude": 51.76777,
		"longitude": 19.50661
	},
	{
		"id": 145,
		"name": "Czerwona-Piotrkowska",
		"latitude": 51.74571,
		"longitude": 19.45886
	},
	{
		"id": 146,
		"name": "Piotrkowska-pl. Niepodległości",
		"latitude": 51.74054,
		"longitude": 19.4626
	},
	{
		"id": 148,
		"name": "Kilińskiego-Poznańska",
		"latitude": 51.74247,
		"longitude": 19.47772
	},
	{
		"id": 150,
		"name": "Dąbrowskiego-Kilińskiego",
		"latitude": 51.73848,
		"longitude": 19.47786
	},
	{
		"id": 151,
		"name": "Dąbrowskiego-Tatrzańska",
		"latitude": 51.73695,
		"longitude": 19.49509
	},
	{
		"id": 152,
		"name": "Śmigłego-Rydza-Zbaraska",
		"latitude": 51.74337,
		"longitude": 19.48938
	},
	{
		"id": 154,
		"name": "Tatrzańska-Broniewskiego",
		"latitude": 51.73402,
		"longitude": 19.49392
	},
	{
		"id": 155,
		"name": "Dąbrowskiego-Kossaka",
		"latitude": 51.73657,
		"longitude": 19.49935
	},
	{
		"id": 156,
		"name": "Dąbrowskiego-Podhalańska",
		"latitude": 51.73624,
		"longitude": 19.50306
	},
	{
		"id": 157,
		"name": "Dąbrowskiego-Podhalańska",
		"latitude": 51.7361,
		"longitude": 19.50362
	},
	{
		"id": 158,
		"name": "Dąbrowskiego-Dw. Łódź Dąbrowa",
		"latitude": 51.73557,
		"longitude": 19.50937
	},
	{
		"id": 159,
		"name": "Dąbrowskiego-Wedmanowej",
		"latitude": 51.73544,
		"longitude": 19.51601
	},
	{
		"id": 160,
		"name": "Dąbrowskiego-Lodowa",
		"latitude": 51.73487,
		"longitude": 19.52219
	},
	{
		"id": 161,
		"name": "Lodowa-Lodowa 91",
		"latitude": 51.73654,
		"longitude": 19.52449
	},
	{
		"id": 162,
		"name": "Tomaszowska-Bławatna",
		"latitude": 51.73205,
		"longitude": 19.52997
	},
	{
		"id": 163,
		"name": "Dąbrowskiego-Tomaszowska",
		"latitude": 51.73435,
		"longitude": 19.52962
	},
	{
		"id": 164,
		"name": "Dąbrowskiego-Tomaszowska",
		"latitude": 51.73496,
		"longitude": 19.52832
	},
	{
		"id": 165,
		"name": "Dąbrowskiego-Lodowa",
		"latitude": 51.73515,
		"longitude": 19.52315
	},
	{
		"id": 166,
		"name": "Lodowa-Dąbrowskiego",
		"latitude": 51.73371,
		"longitude": 19.52396
	},
	{
		"id": 167,
		"name": "Dąbrowskiego-Wedmanowej",
		"latitude": 51.73572,
		"longitude": 19.51583
	},
	{
		"id": 168,
		"name": "Gojawiczyńskiej-Dąbrowskiego",
		"latitude": 51.73534,
		"longitude": 19.50508
	},
	{
		"id": 169,
		"name": "Dąbrowskiego-Podhalańska",
		"latitude": 51.7363,
		"longitude": 19.50454
	},
	{
		"id": 170,
		"name": "Dw. Łódź Dąbrowa",
		"latitude": 51.73633,
		"longitude": 19.50901
	},
	{
		"id": 171,
		"name": "Dąbrowskiego-Podhalańska",
		"latitude": 51.73634,
		"longitude": 19.50307
	},
	{
		"id": 172,
		"name": "Dąbrowskiego-Kossaka",
		"latitude": 51.73666,
		"longitude": 19.49936
	},
	{
		"id": 173,
		"name": "Dąbrowskiego-Tatrzańska",
		"latitude": 51.73712,
		"longitude": 19.49402
	},
	{
		"id": 174,
		"name": "Dąbrowskiego-Kossaka",
		"latitude": 51.73678,
		"longitude": 19.49954
	},
	{
		"id": 175,
		"name": "Śmigłego-Rydza-Milionowa",
		"latitude": 51.75223,
		"longitude": 19.48965
	},
	{
		"id": 176,
		"name": "Dąbrowskiego-Śmigłego-Rydza",
		"latitude": 51.73748,
		"longitude": 19.4899
	},
	{
		"id": 179,
		"name": "Pl. Niepodległości",
		"latitude": 51.74041,
		"longitude": 19.46391
	},
	{
		"id": 180,
		"name": "Dąbrowskiego-Rzgowska",
		"latitude": 51.7386,
		"longitude": 19.46742
	},
	{
		"id": 181,
		"name": "plac Niepodległości-pl. Niepodległo",
		"latitude": 51.73987,
		"longitude": 19.46353
	},
	{
		"id": 182,
		"name": "Pabianicka-Wólczańska",
		"latitude": 51.73599,
		"longitude": 19.45877
	},
	{
		"id": 183,
		"name": "Piotrkowska-pl. Niepodległości",
		"latitude": 51.74098,
		"longitude": 19.46264
	},
	{
		"id": 184,
		"name": "Pl. Niepodległości",
		"latitude": 51.73987,
		"longitude": 19.4634
	},
	{
		"id": 185,
		"name": "Rzgowska-Lecznicza",
		"latitude": 51.73456,
		"longitude": 19.4708
	},
	{
		"id": 186,
		"name": "Rzgowska-Lecznicza",
		"latitude": 51.73459,
		"longitude": 19.47076
	},
	{
		"id": 187,
		"name": "Starorudzka-Demokratyczna",
		"latitude": 51.71009,
		"longitude": 19.43794
	},
	{
		"id": 188,
		"name": "Demokratyczna-Dzwonowa",
		"latitude": 51.71064,
		"longitude": 19.4442
	},
	{
		"id": 189,
		"name": "Ekonomiczna-Starorudzka",
		"latitude": 51.70678,
		"longitude": 19.4397
	},
	{
		"id": 190,
		"name": "Demokratyczna-Matowa",
		"latitude": 51.71147,
		"longitude": 19.45082
	},
	{
		"id": 191,
		"name": "Demokratyczna-Demokratyczna 117",
		"latitude": 51.71184,
		"longitude": 19.45898
	},
	{
		"id": 192,
		"name": "Demokratyczna-Bartoszewskiego",
		"latitude": 51.71171,
		"longitude": 19.46349
	},
	{
		"id": 193,
		"name": "Demokratyczna-Bartoszewskiego",
		"latitude": 51.71191,
		"longitude": 19.4596
	},
	{
		"id": 194,
		"name": "Demokratyczna-Matowa",
		"latitude": 51.71144,
		"longitude": 19.45016
	},
	{
		"id": 195,
		"name": "Demokratyczna-Dzwonowa",
		"latitude": 51.71083,
		"longitude": 19.4453
	},
	{
		"id": 196,
		"name": "Demokratyczna-Starorudzka",
		"latitude": 51.70983,
		"longitude": 19.43738
	},
	{
		"id": 197,
		"name": "Gombrowicza-Pabianicka",
		"latitude": 51.7132,
		"longitude": 19.43187
	},
	{
		"id": 198,
		"name": "Dolna-Łagiewnicka",
		"latitude": 51.79112,
		"longitude": 19.45399
	},
	{
		"id": 199,
		"name": "Łagiewnicka-Kowalska",
		"latitude": 51.79529,
		"longitude": 19.45554
	},
	{
		"id": 200,
		"name": "Dolna-Łagiewnicka",
		"latitude": 51.79119,
		"longitude": 19.45399
	},
	{
		"id": 201,
		"name": "Zgierska-Dolna",
		"latitude": 51.78996,
		"longitude": 19.44915
	},
	{
		"id": 202,
		"name": "DK nr 71-Łagiewniki Nowe",
		"latitude": 51.85113,
		"longitude": 19.46543
	},
	{
		"id": 203,
		"name": "DK nr 71-Przyklasztorze",
		"latitude": 51.85359,
		"longitude": 19.47332
	},
	{
		"id": 204,
		"name": "DK nr 71-Łagiewniki Nowe",
		"latitude": 51.85082,
		"longitude": 19.4641
	},
	{
		"id": 205,
		"name": "Secesyjna",
		"latitude": 51.84796,
		"longitude": 19.46062
	},
	{
		"id": 206,
		"name": "Drewnowska-Okrzei",
		"latitude": 51.78127,
		"longitude": 19.42937
	},
	{
		"id": 207,
		"name": "Drewnowska-Karskiego",
		"latitude": 51.78064,
		"longitude": 19.43721
	},
	{
		"id": 208,
		"name": "Drewnowska-Piwna",
		"latitude": 51.78108,
		"longitude": 19.44308
	},
	{
		"id": 209,
		"name": "Zachodnia-Legionów",
		"latitude": 51.77753,
		"longitude": 19.45171
	},
	{
		"id": 210,
		"name": "Drewnowska-Zachodnia",
		"latitude": 51.78209,
		"longitude": 19.44996
	},
	{
		"id": 211,
		"name": "Drewnowska-Piwna",
		"latitude": 51.78136,
		"longitude": 19.44354
	},
	{
		"id": 212,
		"name": "Drewnowska-Karskiego",
		"latitude": 51.78082,
		"longitude": 19.43671
	},
	{
		"id": 213,
		"name": "Drewnowska-Kasprzaka",
		"latitude": 51.78127,
		"longitude": 19.42721
	},
	{
		"id": 214,
		"name": "Kasprzaka-Tybury",
		"latitude": 51.78454,
		"longitude": 19.42642
	},
	{
		"id": 215,
		"name": "Bionanopark",
		"latitude": 51.71852,
		"longitude": 19.41194
	},
	{
		"id": 216,
		"name": "Dubois-Pusta",
		"latitude": 51.71991,
		"longitude": 19.41546
	},
	{
		"id": 217,
		"name": "Dubois-Hoffmanowej",
		"latitude": 51.71858,
		"longitude": 19.42306
	},
	{
		"id": 218,
		"name": "Dubois-Pabianicka",
		"latitude": 51.7156,
		"longitude": 19.43185
	},
	{
		"id": 219,
		"name": "Rudzka-Pabianicka",
		"latitude": 51.71055,
		"longitude": 19.42893
	},
	{
		"id": 220,
		"name": "Pabianicka-3 Maja",
		"latitude": 51.71862,
		"longitude": 19.43784
	},
	{
		"id": 221,
		"name": "Pabianicka-Dubois",
		"latitude": 51.7155,
		"longitude": 19.43396
	},
	{
		"id": 222,
		"name": "Pabianicka-Odrzańska",
		"latitude": 51.71163,
		"longitude": 19.42858
	},
	{
		"id": 223,
		"name": "Pabianicka-Rudzka",
		"latitude": 51.71143,
		"longitude": 19.42909
	},
	{
		"id": 224,
		"name": "Dubois-Pabianicka",
		"latitude": 51.7154,
		"longitude": 19.43236
	},
	{
		"id": 225,
		"name": "Dubois-Hoffmanowej",
		"latitude": 51.7184,
		"longitude": 19.4238
	},
	{
		"id": 226,
		"name": "Pokładowa-Świętojańska",
		"latitude": 51.71926,
		"longitude": 19.43182
	},
	{
		"id": 227,
		"name": "Dubois-Pusta",
		"latitude": 51.72026,
		"longitude": 19.41617
	},
	{
		"id": 229,
		"name": "Obr.Westerplatte-Organizacji WiN",
		"latitude": 51.78855,
		"longitude": 19.46793
	},
	{
		"id": 231,
		"name": "Bałucki Rynek-Bałucki Rynek",
		"latitude": 51.78756,
		"longitude": 19.45374
	},
	{
		"id": 234,
		"name": "Pomorska-CKD szpital",
		"latitude": 51.77741,
		"longitude": 19.50258
	},
	{
		"id": 235,
		"name": "Telefoniczna pętla",
		"latitude": 51.78134,
		"longitude": 19.50673
	},
	{
		"id": 236,
		"name": "Pomorska-CKD szpital",
		"latitude": 51.77745,
		"longitude": 19.50247
	},
	{
		"id": 237,
		"name": "Pomorska-Konstytucyjna",
		"latitude": 51.77743,
		"longitude": 19.49724
	},
	{
		"id": 238,
		"name": "Pomorska-Kasprowy Wierch",
		"latitude": 51.77355,
		"longitude": 19.53446
	},
	{
		"id": 239,
		"name": "Krokusowa-Zrębowa",
		"latitude": 51.777,
		"longitude": 19.52244
	},
	{
		"id": 240,
		"name": "Edwarda-Pomorska",
		"latitude": 51.77461,
		"longitude": 19.52098
	},
	{
		"id": 241,
		"name": "Elektronowa-Obywatelska",
		"latitude": 51.73814,
		"longitude": 19.42518
	},
	{
		"id": 242,
		"name": "Obywatelska-Elektronowa",
		"latitude": 51.73712,
		"longitude": 19.42755
	},
	{
		"id": 243,
		"name": "Pienista-Obywatelska",
		"latitude": 51.74063,
		"longitude": 19.41683
	},
	{
		"id": 244,
		"name": "Waltera-Janke-Maratońska",
		"latitude": 51.74436,
		"longitude": 19.4211
	},
	{
		"id": 246,
		"name": "Elektronowa-Zakłady Mięsne",
		"latitude": 51.74156,
		"longitude": 19.42649
	},
	{
		"id": 247,
		"name": "Fabryczna-Targowa",
		"latitude": 51.75616,
		"longitude": 19.47415
	},
	{
		"id": 248,
		"name": "Fabryczna-Przędzalniana",
		"latitude": 51.75754,
		"longitude": 19.48135
	},
	{
		"id": 249,
		"name": "Przędzalniana-Tymienieckiego",
		"latitude": 51.75352,
		"longitude": 19.48437
	},
	{
		"id": 250,
		"name": "Fabryczna-Przędzalniana",
		"latitude": 51.75761,
		"longitude": 19.48117
	},
	{
		"id": 251,
		"name": "Fabryczna-Kilińskiego",
		"latitude": 51.75581,
		"longitude": 19.47178
	},
	{
		"id": 252,
		"name": "Śląska-Kruczkowskiego",
		"latitude": 51.72788,
		"longitude": 19.49886
	},
	{
		"id": 253,
		"name": "Felińskiego-Kadłubka",
		"latitude": 51.73228,
		"longitude": 19.50077
	},
	{
		"id": 254,
		"name": "Felińskiego-Gojawiczyńskiej",
		"latitude": 51.7323,
		"longitude": 19.50382
	},
	{
		"id": 255,
		"name": "Gojawiczyńskiej-Dąbrowskiego",
		"latitude": 51.735,
		"longitude": 19.50508
	},
	{
		"id": 256,
		"name": "Felińskiego-Kadłubka",
		"latitude": 51.73231,
		"longitude": 19.50051
	},
	{
		"id": 257,
		"name": "Felińskiego-Kruczkowskiego",
		"latitude": 51.7323,
		"longitude": 19.49787
	},
	{
		"id": 258,
		"name": "DK nr 71-Rzemieślnicza",
		"latitude": 51.85615,
		"longitude": 19.48136
	},
	{
		"id": 259,
		"name": "DK nr 71-Przyklasztorze",
		"latitude": 51.85344,
		"longitude": 19.47244
	},
	{
		"id": 260,
		"name": "Skotniki",
		"latitude": 51.85877,
		"longitude": 19.49095
	},
	{
		"id": 261,
		"name": "DK nr 71-Rzemieślnicza",
		"latitude": 51.85607,
		"longitude": 19.48072
	},
	{
		"id": 262,
		"name": "Św. Franciszka-Czahary",
		"latitude": 51.72708,
		"longitude": 19.42278
	},
	{
		"id": 263,
		"name": "Czahary-Prądzyńskiego",
		"latitude": 51.72366,
		"longitude": 19.42316
	},
	{
		"id": 264,
		"name": "Św. Franciszka-Zenitowa",
		"latitude": 51.72706,
		"longitude": 19.43146
	},
	{
		"id": 265,
		"name": "Franciszkańska-Wojska Polskiego",
		"latitude": 51.78436,
		"longitude": 19.46039
	},
	{
		"id": 266,
		"name": "Wojska Polskiego-Marynarska",
		"latitude": 51.78545,
		"longitude": 19.46466
	},
	{
		"id": 267,
		"name": "pl. Kościelny",
		"latitude": 51.78356,
		"longitude": 19.45374
	},
	{
		"id": 268,
		"name": "Franciszkańska-Wojska Polskiego",
		"latitude": 51.78431,
		"longitude": 19.46053
	},
	{
		"id": 269,
		"name": "Wojska Polskiego-Marynarska",
		"latitude": 51.78536,
		"longitude": 19.46461
	},
	{
		"id": 270,
		"name": "Franciszkańska-Północna",
		"latitude": 51.77994,
		"longitude": 19.46115
	},
	{
		"id": 271,
		"name": "Kilińskiego-Pomorska",
		"latitude": 51.77754,
		"longitude": 19.46177
	},
	{
		"id": 272,
		"name": "Północna-Nowomiejska",
		"latitude": 51.77899,
		"longitude": 19.45468
	},
	{
		"id": 273,
		"name": "Franciszkańska-Północna",
		"latitude": 51.77996,
		"longitude": 19.46127
	},
	{
		"id": 274,
		"name": "Północna-Nowomiejska",
		"latitude": 51.77908,
		"longitude": 19.45547
	},
	{
		"id": 275,
		"name": "Gajcego-Gajcego 121",
		"latitude": 51.75275,
		"longitude": 19.63065
	},
	{
		"id": 277,
		"name": "Gajcego-Gajcego 121",
		"latitude": 51.75242,
		"longitude": 19.63002
	},
	{
		"id": 278,
		"name": "Rataja-Gajcego",
		"latitude": 51.74882,
		"longitude": 19.62289
	},
	{
		"id": 279,
		"name": "Gdańska-Skłodowskiej-Curie",
		"latitude": 51.76399,
		"longitude": 19.45032
	},
	{
		"id": 280,
		"name": "Gdańska-Zielona",
		"latitude": 51.76971,
		"longitude": 19.44905
	},
	{
		"id": 281,
		"name": "Gdańska-1 Maja",
		"latitude": 51.77286,
		"longitude": 19.44844
	},
	{
		"id": 282,
		"name": "Zielona/Kościuszki",
		"latitude": 51.77027,
		"longitude": 19.45282
	},
	{
		"id": 283,
		"name": "Gdańska-Legionów",
		"latitude": 51.77585,
		"longitude": 19.44781
	},
	{
		"id": 284,
		"name": "Legionów-Zachodnia",
		"latitude": 51.77647,
		"longitude": 19.45166
	},
	{
		"id": 285,
		"name": "Legionów-Cmentarna",
		"latitude": 51.77493,
		"longitude": 19.44298
	},
	{
		"id": 286,
		"name": "Gdańska-1 Maja",
		"latitude": 51.77332,
		"longitude": 19.44814
	},
	{
		"id": 287,
		"name": "Gdańska-Zielona",
		"latitude": 51.77054,
		"longitude": 19.44872
	},
	{
		"id": 288,
		"name": "Gdańska-Struga",
		"latitude": 51.76516,
		"longitude": 19.44986
	},
	{
		"id": 289,
		"name": "Kopernika-Żeromskiego",
		"latitude": 51.76238,
		"longitude": 19.44844
	},
	{
		"id": 290,
		"name": "Zbocze-Giewont",
		"latitude": 51.77869,
		"longitude": 19.52823
	},
	{
		"id": 291,
		"name": "Telefoniczna-Pieniny",
		"latitude": 51.78295,
		"longitude": 19.52546
	},
	{
		"id": 292,
		"name": "Wedmanowej-Dąbrowskiego",
		"latitude": 51.735,
		"longitude": 19.51509
	},
	{
		"id": 293,
		"name": "Dw. Łódź Dąbrowa",
		"latitude": 51.73658,
		"longitude": 19.50964
	},
	{
		"id": 294,
		"name": "Felińskiego-Gojawiczyńskiej",
		"latitude": 51.73261,
		"longitude": 19.50373
	},
	{
		"id": 295,
		"name": "Hipoteczna-Olsztyńska",
		"latitude": 51.79495,
		"longitude": 19.43219
	},
	{
		"id": 296,
		"name": "Kniaziewicza-Kalinowa",
		"latitude": 51.79931,
		"longitude": 19.43418
	},
	{
		"id": 297,
		"name": "Pojezierska-Sierakowskiego",
		"latitude": 51.7978,
		"longitude": 19.43667
	},
	{
		"id": 298,
		"name": "Hipoteczna-Olsztyńska",
		"latitude": 51.79552,
		"longitude": 19.43212
	},
	{
		"id": 299,
		"name": "Hipoteczna-Limanowskiego",
		"latitude": 51.79086,
		"longitude": 19.43032
	},
	{
		"id": 300,
		"name": "Kasprzaka-Tybury",
		"latitude": 51.78442,
		"longitude": 19.42626
	},
	{
		"id": 301,
		"name": "Lutomierska-Klonowa",
		"latitude": 51.78823,
		"longitude": 19.42727
	},
	{
		"id": 302,
		"name": "Inflancka-r. Powstańców 1863r.",
		"latitude": 51.80082,
		"longitude": 19.45829
	},
	{
		"id": 303,
		"name": "Marysińska-Inflancka",
		"latitude": 51.79948,
		"longitude": 19.46564
	},
	{
		"id": 304,
		"name": "Inflancka-Marysińska",
		"latitude": 51.80053,
		"longitude": 19.46639
	},
	{
		"id": 305,
		"name": "Inflancka-Gibalskiego",
		"latitude": 51.80021,
		"longitude": 19.47246
	},
	{
		"id": 306,
		"name": "Zagajnikowa-Inflancka",
		"latitude": 51.79902,
		"longitude": 19.47673
	},
	{
		"id": 307,
		"name": "Strykowska-Inflancka",
		"latitude": 51.7976,
		"longitude": 19.48761
	},
	{
		"id": 308,
		"name": "Wycieczkowa-Strykowska",
		"latitude": 51.80219,
		"longitude": 19.48849
	},
	{
		"id": 309,
		"name": "Inflancka-Gibalskiego",
		"latitude": 51.80052,
		"longitude": 19.47245
	},
	{
		"id": 310,
		"name": "Inflancka-Marysińska",
		"latitude": 51.80075,
		"longitude": 19.46537
	},
	{
		"id": 311,
		"name": "Inflancka-r. Powstańców 1863r.",
		"latitude": 51.801,
		"longitude": 19.45839
	},
	{
		"id": 313,
		"name": "r. Powstańców 1863r.",
		"latitude": 51.80129,
		"longitude": 19.45918
	},
	{
		"id": 314,
		"name": "Julianowska-Żarnowcowa",
		"latitude": 51.79966,
		"longitude": 19.45138
	},
	{
		"id": 315,
		"name": "Łagiewnicka-rondo Powstańców 1863r.",
		"latitude": 51.80152,
		"longitude": 19.45778
	},
	{
		"id": 316,
		"name": "Janosika-Pszczyńska",
		"latitude": 51.77938,
		"longitude": 19.52179
	},
	{
		"id": 317,
		"name": "Janosika-Telefoniczna",
		"latitude": 51.78307,
		"longitude": 19.52242
	},
	{
		"id": 318,
		"name": "Janosika-Wyżynna",
		"latitude": 51.78789,
		"longitude": 19.52369
	},
	{
		"id": 319,
		"name": "Janosika-Powstańców Śląskich",
		"latitude": 51.79199,
		"longitude": 19.52439
	},
	{
		"id": 320,
		"name": "Janosika-Wyżynna",
		"latitude": 51.78777,
		"longitude": 19.52347
	},
	{
		"id": 321,
		"name": "Janosika-Telefoniczna",
		"latitude": 51.7829,
		"longitude": 19.52227
	},
	{
		"id": 322,
		"name": "Telefoniczna-Weselna",
		"latitude": 51.78325,
		"longitude": 19.51988
	},
	{
		"id": 323,
		"name": "Janosika-Pszczyńska",
		"latitude": 51.77931,
		"longitude": 19.52165
	},
	{
		"id": 324,
		"name": "Krokusowa-Zrębowa",
		"latitude": 51.77735,
		"longitude": 19.52243
	},
	{
		"id": 325,
		"name": "Jaracza-Wierzbowa",
		"latitude": 51.77464,
		"longitude": 19.47784
	},
	{
		"id": 327,
		"name": "Sterlinga-Pomorska",
		"latitude": 51.77743,
		"longitude": 19.46891
	},
	{
		"id": 328,
		"name": "Jaracza-P.O.W.",
		"latitude": 51.77373,
		"longitude": 19.46713
	},
	{
		"id": 329,
		"name": "Jaracza-Kilińskiego",
		"latitude": 51.77327,
		"longitude": 19.46195
	},
	{
		"id": 330,
		"name": "Jaracza-Piotrkowska",
		"latitude": 51.77278,
		"longitude": 19.45606
	},
	{
		"id": 331,
		"name": "Więckowskiego-Gdańska",
		"latitude": 51.77205,
		"longitude": 19.44804
	},
	{
		"id": 332,
		"name": "Zachodnia-Legionów",
		"latitude": 51.77558,
		"longitude": 19.45257
	},
	{
		"id": 333,
		"name": "Józefów-Rzgowska",
		"latitude": 51.70693,
		"longitude": 19.48906
	},
	{
		"id": 334,
		"name": "Józefów-Nowe Górki",
		"latitude": 51.70647,
		"longitude": 19.49566
	},
	{
		"id": 335,
		"name": "Józefów-Józefów 60",
		"latitude": 51.70637,
		"longitude": 19.50475
	},
	{
		"id": 336,
		"name": "Józefów-Bieszczadzka",
		"latitude": 51.70639,
		"longitude": 19.51036
	},
	{
		"id": 337,
		"name": "Józefów-Józefów 60",
		"latitude": 51.70638,
		"longitude": 19.50504
	},
	{
		"id": 338,
		"name": "Józefów-Nowe Górki",
		"latitude": 51.70652,
		"longitude": 19.49626
	},
	{
		"id": 339,
		"name": "Józefów-Rzgowska",
		"latitude": 51.70711,
		"longitude": 19.48758
	},
	{
		"id": 340,
		"name": "Rzgowska-Paradna",
		"latitude": 51.70865,
		"longitude": 19.48774
	},
	{
		"id": 341,
		"name": "Julianowska-Zgierska",
		"latitude": 51.79765,
		"longitude": 19.44553
	},
	{
		"id": 342,
		"name": "Julianowska-Żarnowcowa",
		"latitude": 51.79974,
		"longitude": 19.45254
	},
	{
		"id": 344,
		"name": "Julianowska-Zgierska",
		"latitude": 51.79785,
		"longitude": 19.44497
	},
	{
		"id": 345,
		"name": "Pojezierska-Sierakowskiego",
		"latitude": 51.79781,
		"longitude": 19.43796
	},
	{
		"id": 346,
		"name": "Kaczeńcowa-Lniana",
		"latitude": 51.79728,
		"longitude": 19.38626
	},
	{
		"id": 347,
		"name": "Kaczeńcowa-Kaczeńcowa 16",
		"latitude": 51.80723,
		"longitude": 19.39063
	},
	{
		"id": 348,
		"name": "Kaczeńcowa-św. Teresy",
		"latitude": 51.80867,
		"longitude": 19.39147
	},
	{
		"id": 349,
		"name": "Św. Teresy-Kaczeńcowa",
		"latitude": 51.80982,
		"longitude": 19.38981
	},
	{
		"id": 350,
		"name": "Kaczeńcowa-Kaczeńcowa 16",
		"latitude": 51.80673,
		"longitude": 19.39009
	},
	{
		"id": 351,
		"name": "Kaczeńcowa-Aleksandrowska",
		"latitude": 51.80002,
		"longitude": 19.38735
	},
	{
		"id": 352,
		"name": "Kaczeńcowa-Lniana",
		"latitude": 51.79779,
		"longitude": 19.38631
	},
	{
		"id": 353,
		"name": "Rojna-Kaczeńcowa",
		"latitude": 51.79357,
		"longitude": 19.38576
	},
	{
		"id": 354,
		"name": "Ekonomiczna-Żwawa",
		"latitude": 51.70752,
		"longitude": 19.44558
	},
	{
		"id": 355,
		"name": "Kniaziewicza-Kalinowa",
		"latitude": 51.799,
		"longitude": 19.43369
	},
	{
		"id": 356,
		"name": "Pojezierska-Grunwaldzka",
		"latitude": 51.7985,
		"longitude": 19.43156
	},
	{
		"id": 357,
		"name": "Ekonomiczna-Kwaterunkowa",
		"latitude": 51.70819,
		"longitude": 19.4509
	},
	{
		"id": 358,
		"name": "Ekonomiczna-Żwawa",
		"latitude": 51.70766,
		"longitude": 19.4466
	},
	{
		"id": 359,
		"name": "Ekonomiczna-Starorudzka",
		"latitude": 51.70676,
		"longitude": 19.4397
	},
	{
		"id": 360,
		"name": "Ekonomiczna-Kwaterunkowa",
		"latitude": 51.70828,
		"longitude": 19.45125
	},
	{
		"id": 361,
		"name": "Ekonomiczna-Graniczna",
		"latitude": 51.70877,
		"longitude": 19.45563
	},
	{
		"id": 363,
		"name": "Ekonomiczna-Graniczna",
		"latitude": 51.70872,
		"longitude": 19.45495
	},
	{
		"id": 364,
		"name": "Karolewska-Wileńska",
		"latitude": 51.75254,
		"longitude": 19.42539
	},
	{
		"id": 365,
		"name": "Kasprzaka-Legionów",
		"latitude": 51.77048,
		"longitude": 19.42904
	},
	{
		"id": 366,
		"name": "Kasprzaka-Srebrzyńska",
		"latitude": 51.77398,
		"longitude": 19.42745
	},
	{
		"id": 367,
		"name": "Kasprzaka-Drewnowska",
		"latitude": 51.78076,
		"longitude": 19.42696
	},
	{
		"id": 368,
		"name": "Unii Lubelskiej-Praussa",
		"latitude": 51.77669,
		"longitude": 19.41512
	},
	{
		"id": 369,
		"name": "Tybury-Odolanowska",
		"latitude": 51.78498,
		"longitude": 19.43174
	},
	{
		"id": 370,
		"name": "Klonowa-Limanowskiego",
		"latitude": 51.79003,
		"longitude": 19.43002
	},
	{
		"id": 371,
		"name": "Kasprzaka-Drewnowska",
		"latitude": 51.7802,
		"longitude": 19.42688
	},
	{
		"id": 372,
		"name": "Kasprzaka-Srebrzyńska",
		"latitude": 51.77461,
		"longitude": 19.42717
	},
	{
		"id": 373,
		"name": "Kasprzaka-Legionów",
		"latitude": 51.77046,
		"longitude": 19.42878
	},
	{
		"id": 374,
		"name": "1 Maja-Żeligowskiego",
		"latitude": 51.77065,
		"longitude": 19.4371
	},
	{
		"id": 375,
		"name": "Dw. Łódź Chojny",
		"latitude": 51.72786,
		"longitude": 19.47945
	},
	{
		"id": 376,
		"name": "Dw. Łódź Chojny",
		"latitude": 51.72773,
		"longitude": 19.48
	},
	{
		"id": 377,
		"name": "Kilińskiego-Broniewskiego",
		"latitude": 51.73103,
		"longitude": 19.47915
	},
	{
		"id": 378,
		"name": "Kilińskiego-Dąbrowskiego",
		"latitude": 51.73833,
		"longitude": 19.47883
	},
	{
		"id": 379,
		"name": "Kilińskiego-Przybyszewskiego",
		"latitude": 51.74499,
		"longitude": 19.47634
	},
	{
		"id": 380,
		"name": "Kilińskiego-Przybyszewskiego",
		"latitude": 51.74438,
		"longitude": 19.47682
	},
	{
		"id": 381,
		"name": "Przybyszewskiego-Brzozowa",
		"latitude": 51.74457,
		"longitude": 19.47081
	},
	{
		"id": 382,
		"name": "Kilińskiego-Senatorska",
		"latitude": 51.74768,
		"longitude": 19.47503
	},
	{
		"id": 383,
		"name": "Przybyszewskiego-Łęczycka",
		"latitude": 51.74691,
		"longitude": 19.48402
	},
	{
		"id": 384,
		"name": "Kilińskiego-Senatorska",
		"latitude": 51.7477,
		"longitude": 19.4751
	},
	{
		"id": 385,
		"name": "Kilińskiego-Tymienieckiego",
		"latitude": 51.75129,
		"longitude": 19.47339
	},
	{
		"id": 387,
		"name": "Kilińskiego-Fabryczna",
		"latitude": 51.75517,
		"longitude": 19.47108
	},
	{
		"id": 388,
		"name": "Kilińskiego-Fabryczna",
		"latitude": 51.75499,
		"longitude": 19.47144
	},
	{
		"id": 389,
		"name": "Kilińskiego-Piłsudskiego",
		"latitude": 51.75944,
		"longitude": 19.46916
	},
	{
		"id": 391,
		"name": "Kilińskiego-Nawrot",
		"latitude": 51.76299,
		"longitude": 19.46755
	},
	{
		"id": 392,
		"name": "Piłsudskiego-Sienkiewicza",
		"latitude": 51.75986,
		"longitude": 19.46372
	},
	{
		"id": 393,
		"name": "Kilińskiego-Nawrot",
		"latitude": 51.76288,
		"longitude": 19.46758
	},
	{
		"id": 394,
		"name": "Kilińskiego-Tuwima",
		"latitude": 51.7661,
		"longitude": 19.46591
	},
	{
		"id": 395,
		"name": "Kilińskiego-Tuwima",
		"latitude": 51.76611,
		"longitude": 19.46598
	},
	{
		"id": 396,
		"name": "Kilińskiego-Przystanek mBank",
		"latitude": 51.76927,
		"longitude": 19.46451
	},
	{
		"id": 397,
		"name": "Tuwima-Sienkiewicza",
		"latitude": 51.76588,
		"longitude": 19.46121
	},
	{
		"id": 398,
		"name": "Kilińskiego-Narutowicza",
		"latitude": 51.77163,
		"longitude": 19.46327
	},
	{
		"id": 399,
		"name": "Kilińskiego-Rewolucji 1905 r.",
		"latitude": 51.7751,
		"longitude": 19.46245
	},
	{
		"id": 401,
		"name": "Kilińskiego-Pomorska",
		"latitude": 51.77719,
		"longitude": 19.46206
	},
	{
		"id": 402,
		"name": "Kilińskiego-Północna",
		"latitude": 51.77917,
		"longitude": 19.46156
	},
	{
		"id": 403,
		"name": "Pomorska-Sterlinga",
		"latitude": 51.77792,
		"longitude": 19.4684
	},
	{
		"id": 404,
		"name": "Pomorska-pl. Wolności",
		"latitude": 51.77694,
		"longitude": 19.45575
	},
	{
		"id": 405,
		"name": "Kilińskiego-Rewolucji 1905 r.",
		"latitude": 51.77459,
		"longitude": 19.46239
	},
	{
		"id": 406,
		"name": "Kilińskiego-Narutowicza",
		"latitude": 51.77174,
		"longitude": 19.4632
	},
	{
		"id": 407,
		"name": "Kilińskiego-Przystanek mBank",
		"latitude": 51.76907,
		"longitude": 19.46453
	},
	{
		"id": 408,
		"name": "Zielona/Kościuszki",
		"latitude": 51.77046,
		"longitude": 19.45399
	},
	{
		"id": 409,
		"name": "Kilińskiego-Tuwima",
		"latitude": 51.76547,
		"longitude": 19.46607
	},
	{
		"id": 411,
		"name": "Piłsudskiego / Kilińskiego",
		"latitude": 51.76034,
		"longitude": 19.46735
	},
	{
		"id": 412,
		"name": "Kilińskiego-Piłsudskiego",
		"latitude": 51.76066,
		"longitude": 19.46843
	},
	{
		"id": 413,
		"name": "Kilińskiego-Fabryczna",
		"latitude": 51.75574,
		"longitude": 19.47093
	},
	{
		"id": 414,
		"name": "Piłsudskiego-Targowa",
		"latitude": 51.76063,
		"longitude": 19.47385
	},
	{
		"id": 417,
		"name": "Kilińskiego-Tymienieckiego",
		"latitude": 51.75183,
		"longitude": 19.47305
	},
	{
		"id": 420,
		"name": "Kilińskiego-Senatorska",
		"latitude": 51.74805,
		"longitude": 19.47472
	},
	{
		"id": 421,
		"name": "Kilińskiego-Senatorska",
		"latitude": 51.74815,
		"longitude": 19.47471
	},
	{
		"id": 422,
		"name": "Kilińskiego-Przybyszewskiego",
		"latitude": 51.74583,
		"longitude": 19.47583
	},
	{
		"id": 423,
		"name": "Kilińskiego-Przybyszewskiego",
		"latitude": 51.7459,
		"longitude": 19.47577
	},
	{
		"id": 424,
		"name": "Kilińskiego-Poznańska",
		"latitude": 51.74257,
		"longitude": 19.47754
	},
	{
		"id": 425,
		"name": "Kilińskiego-Poznańska",
		"latitude": 51.74262,
		"longitude": 19.47741
	},
	{
		"id": 426,
		"name": "Kilińskiego-Dąbrowskiego",
		"latitude": 51.73883,
		"longitude": 19.47858
	},
	{
		"id": 427,
		"name": "Kilińskiego-Dąbrowskiego",
		"latitude": 51.73897,
		"longitude": 19.47855
	},
	{
		"id": 428,
		"name": "Kilińskiego-Broniewskiego",
		"latitude": 51.73317,
		"longitude": 19.47874
	},
	{
		"id": 430,
		"name": "Kniaziewicza-Brzóski",
		"latitude": 51.79992,
		"longitude": 19.4401
	},
	{
		"id": 431,
		"name": "Liściasta-Zgierska",
		"latitude": 51.80663,
		"longitude": 19.438
	},
	{
		"id": 432,
		"name": "Sikorskiego-Zgierska",
		"latitude": 51.81557,
		"longitude": 19.43573
	},
	{
		"id": 433,
		"name": "Kniaziewicza-Brzóski",
		"latitude": 51.79994,
		"longitude": 19.43852
	},
	{
		"id": 434,
		"name": "Kolumny-Wrzecionowa",
		"latitude": 51.70873,
		"longitude": 19.52338
	},
	{
		"id": 435,
		"name": "Kolumny-Kolumny 242",
		"latitude": 51.70972,
		"longitude": 19.5311
	},
	{
		"id": 436,
		"name": "Kolumny-Cierniówki",
		"latitude": 51.71047,
		"longitude": 19.53715
	},
	{
		"id": 437,
		"name": "Kolumny-Tomaszowska",
		"latitude": 51.71171,
		"longitude": 19.54355
	},
	{
		"id": 438,
		"name": "Tomaszowska-Małego Rycerza",
		"latitude": 51.71686,
		"longitude": 19.5416
	},
	{
		"id": 439,
		"name": "Kolumny-Kalinowskiego",
		"latitude": 51.71235,
		"longitude": 19.55146
	},
	{
		"id": 440,
		"name": "Kolumny-Morenowa",
		"latitude": 51.71485,
		"longitude": 19.55615
	},
	{
		"id": 441,
		"name": "Kolumny-Mahoniowa",
		"latitude": 51.71634,
		"longitude": 19.56374
	},
	{
		"id": 442,
		"name": "Kolumny-Ogrodnicza",
		"latitude": 51.7145,
		"longitude": 19.57411
	},
	{
		"id": 443,
		"name": "Kolumny-Mozaikowa",
		"latitude": 51.71179,
		"longitude": 19.58561
	},
	{
		"id": 444,
		"name": "Kolumny-Platanowa",
		"latitude": 51.70955,
		"longitude": 19.59735
	},
	{
		"id": 445,
		"name": "Kolumny-Autostrada A1",
		"latitude": 51.70689,
		"longitude": 19.60427
	},
	{
		"id": 446,
		"name": "Kolumny-Czajewskiego",
		"latitude": 51.70422,
		"longitude": 19.61155
	},
	{
		"id": 449,
		"name": "Kolumny-Czajewskiego",
		"latitude": 51.70464,
		"longitude": 19.61089
	},
	{
		"id": 450,
		"name": "Kolumny-Autostrada A1",
		"latitude": 51.70687,
		"longitude": 19.60436
	},
	{
		"id": 451,
		"name": "Kolumny-Platanowa",
		"latitude": 51.70977,
		"longitude": 19.59642
	},
	{
		"id": 452,
		"name": "Kolumny-Mozaikowa",
		"latitude": 51.71211,
		"longitude": 19.58459
	},
	{
		"id": 453,
		"name": "Kolumny-Ogrodnicza",
		"latitude": 51.71474,
		"longitude": 19.57351
	},
	{
		"id": 454,
		"name": "Kolumny-Mahoniowa",
		"latitude": 51.71639,
		"longitude": 19.56348
	},
	{
		"id": 455,
		"name": "Kolumny-Morenowa",
		"latitude": 51.71501,
		"longitude": 19.55616
	},
	{
		"id": 456,
		"name": "Kolumny-Kalinowskiego",
		"latitude": 51.71233,
		"longitude": 19.55054
	},
	{
		"id": 457,
		"name": "Kolumny-Tomaszowska",
		"latitude": 51.71175,
		"longitude": 19.54338
	},
	{
		"id": 458,
		"name": "Kolumny-Cierniówki",
		"latitude": 51.71057,
		"longitude": 19.53715
	},
	{
		"id": 459,
		"name": "Kolumny-Kolumny 242",
		"latitude": 51.70992,
		"longitude": 19.53192
	},
	{
		"id": 460,
		"name": "Kolumny-Wrzecionowa",
		"latitude": 51.70899,
		"longitude": 19.52476
	},
	{
		"id": 461,
		"name": "Kolumny-Bronisin",
		"latitude": 51.70814,
		"longitude": 19.51781
	},
	{
		"id": 462,
		"name": "Dw. Łódź Widzew",
		"latitude": 51.76257,
		"longitude": 19.543
	},
	{
		"id": 463,
		"name": "Puszkina-Rondo Inwalidów",
		"latitude": 51.7619,
		"longitude": 19.53666
	},
	{
		"id": 464,
		"name": "Krzemieniecka-Konstantynowska",
		"latitude": 51.76176,
		"longitude": 19.40857
	},
	{
		"id": 465,
		"name": "Retkińska-Krzemieniecka",
		"latitude": 51.7573,
		"longitude": 19.41418
	},
	{
		"id": 466,
		"name": "Krzemieniecka-Retkińska",
		"latitude": 51.75746,
		"longitude": 19.41597
	},
	{
		"id": 467,
		"name": "Konstantynowska-ZOO",
		"latitude": 51.76405,
		"longitude": 19.41212
	},
	{
		"id": 468,
		"name": "Konstantynowska-Unii Lubelskiej",
		"latitude": 51.76709,
		"longitude": 19.42069
	},
	{
		"id": 469,
		"name": "Legionów-Włókniarzy",
		"latitude": 51.76933,
		"longitude": 19.42706
	},
	{
		"id": 470,
		"name": "Konstantynowska-Unii Lubelskiej",
		"latitude": 51.76715,
		"longitude": 19.42059
	},
	{
		"id": 471,
		"name": "Konstantynowska-ZOO",
		"latitude": 51.76432,
		"longitude": 19.41271
	},
	{
		"id": 472,
		"name": "Konstantynowska-Krakowska",
		"latitude": 51.76307,
		"longitude": 19.40915
	},
	{
		"id": 473,
		"name": "Zdrowie",
		"latitude": 51.76509,
		"longitude": 19.40623
	},
	{
		"id": 474,
		"name": "Dw. Łódź Widzew",
		"latitude": 51.76255,
		"longitude": 19.54166
	},
	{
		"id": 475,
		"name": "Dw. Łódź Widzew",
		"latitude": 51.76263,
		"longitude": 19.5425
	},
	{
		"id": 476,
		"name": "Konstytucyjna-Małachowskiego",
		"latitude": 51.77159,
		"longitude": 19.49918
	},
	{
		"id": 477,
		"name": "Narutowicza-Radiostacja",
		"latitude": 51.77422,
		"longitude": 19.49533
	},
	{
		"id": 478,
		"name": "Pomorska-Konstytucyjna",
		"latitude": 51.77736,
		"longitude": 19.49713
	},
	{
		"id": 479,
		"name": "Kopcińskiego-Tuwima",
		"latitude": 51.76743,
		"longitude": 19.48397
	},
	{
		"id": 480,
		"name": "Kopcińskiego-Narutowicza",
		"latitude": 51.77256,
		"longitude": 19.48288
	},
	{
		"id": 481,
		"name": "Kopcińskiego-Tuwima",
		"latitude": 51.76739,
		"longitude": 19.48421
	},
	{
		"id": 482,
		"name": "Kopcińskiego-Narutowicza",
		"latitude": 51.77187,
		"longitude": 19.48327
	},
	{
		"id": 483,
		"name": "Narutowicza-Matejki (kampus UŁ)",
		"latitude": 51.77343,
		"longitude": 19.48841
	},
	{
		"id": 484,
		"name": "Narutowicza-Tramwajowa",
		"latitude": 51.77252,
		"longitude": 19.47689
	},
	{
		"id": 485,
		"name": "Narutowicza-Matejki (kampus UŁ)",
		"latitude": 51.77342,
		"longitude": 19.48829
	},
	{
		"id": 486,
		"name": "Kopcińskiego-Rondo Solidarności",
		"latitude": 51.778,
		"longitude": 19.48185
	},
	{
		"id": 487,
		"name": "Palki-Źródłowa",
		"latitude": 51.78146,
		"longitude": 19.4832
	},
	{
		"id": 488,
		"name": "Kopcińskiego-Narutowicza",
		"latitude": 51.77194,
		"longitude": 19.48268
	},
	{
		"id": 489,
		"name": "Kopcińskiego-Tuwima",
		"latitude": 51.76725,
		"longitude": 19.48363
	},
	{
		"id": 490,
		"name": "Kopcińskiego-Tuwima",
		"latitude": 51.76727,
		"longitude": 19.48388
	},
	{
		"id": 491,
		"name": "Śmigłego-Rydza-Piłsudskiego",
		"latitude": 51.76097,
		"longitude": 19.48554
	},
	{
		"id": 492,
		"name": "Tuwima-Kopcińskiego",
		"latitude": 51.7678,
		"longitude": 19.48382
	},
	{
		"id": 493,
		"name": "Śmigłego-Rydza-Piłsudskiego",
		"latitude": 51.76054,
		"longitude": 19.48572
	},
	{
		"id": 494,
		"name": "Przędzalniana-Nawrot",
		"latitude": 51.76488,
		"longitude": 19.48048
	},
	{
		"id": 495,
		"name": "Piłsudskiego-Śmigłego-Rydza",
		"latitude": 51.76153,
		"longitude": 19.48711
	},
	{
		"id": 496,
		"name": "Piłsudskiego-Sarnia",
		"latitude": 51.76212,
		"longitude": 19.49247
	},
	{
		"id": 497,
		"name": "Śmigłego-Rydza-Zbiorcza",
		"latitude": 51.75814,
		"longitude": 19.48798
	},
	{
		"id": 498,
		"name": "Piłsudskiego-Przędzalniana",
		"latitude": 51.76112,
		"longitude": 19.48027
	},
	{
		"id": 499,
		"name": "Puszkina-Chmielowskiego",
		"latitude": 51.75844,
		"longitude": 19.53568
	},
	{
		"id": 500,
		"name": "Rokicińska-Maszynowa",
		"latitude": 51.76248,
		"longitude": 19.52861
	},
	{
		"id": 501,
		"name": "Kopernika-Tobaco Park",
		"latitude": 51.75778,
		"longitude": 19.43672
	},
	{
		"id": 502,
		"name": "Kopernika-Łąkowa",
		"latitude": 51.75987,
		"longitude": 19.44236
	},
	{
		"id": 503,
		"name": "Kopernika-Żeromskiego",
		"latitude": 51.76175,
		"longitude": 19.44702
	},
	{
		"id": 504,
		"name": "Żeromskiego-Mickiewicza",
		"latitude": 51.75869,
		"longitude": 19.44821
	},
	{
		"id": 505,
		"name": "Kopernika-Łąkowa",
		"latitude": 51.76034,
		"longitude": 19.4431
	},
	{
		"id": 506,
		"name": "Kopernika-Tobaco Park",
		"latitude": 51.75826,
		"longitude": 19.43769
	},
	{
		"id": 507,
		"name": "Bandurskiego-Dw. Łódź Kaliska",
		"latitude": 51.7558,
		"longitude": 19.4324
	},
	{
		"id": 508,
		"name": "Włókniarzy-Karolewska (Dw. Łódź Kal",
		"latitude": 51.75825,
		"longitude": 19.4335
	},
	{
		"id": 509,
		"name": "Mickiewicza-Żeromskiego",
		"latitude": 51.75803,
		"longitude": 19.44914
	},
	{
		"id": 510,
		"name": "Służbowa-Dw. Łódź Widzew",
		"latitude": 51.76204,
		"longitude": 19.54306
	},
	{
		"id": 511,
		"name": "Augustów-Rokicińska",
		"latitude": 51.75916,
		"longitude": 19.5543
	},
	{
		"id": 512,
		"name": "Służbowa-Dw. Łódź Widzew",
		"latitude": 51.76228,
		"longitude": 19.54228
	},
	{
		"id": 513,
		"name": "Kosynierów Gdyńskich-Wczesna",
		"latitude": 51.71552,
		"longitude": 19.47551
	},
	{
		"id": 514,
		"name": "Kosynierów Gdyńskich-Królewska",
		"latitude": 51.71365,
		"longitude": 19.48169
	},
	{
		"id": 515,
		"name": "Rzgowska-św. Wojciecha",
		"latitude": 51.71406,
		"longitude": 19.48682
	},
	{
		"id": 516,
		"name": "Kosynierów Gdyńskich-Królewska",
		"latitude": 51.7138,
		"longitude": 19.48134
	},
	{
		"id": 517,
		"name": "Kosynierów Gdyńskich-Wczesna",
		"latitude": 51.7153,
		"longitude": 19.47615
	},
	{
		"id": 518,
		"name": "Kosynierów Gdyńskich-Łazowskiego",
		"latitude": 51.71701,
		"longitude": 19.4719
	},
	{
		"id": 519,
		"name": "Kosynierów Gdyńskich-Trybunalska",
		"latitude": 51.71818,
		"longitude": 19.46901
	},
	{
		"id": 520,
		"name": "Trybunalska-Kwietniowa",
		"latitude": 51.7141,
		"longitude": 19.46612
	},
	{
		"id": 522,
		"name": "Kościuszki-Zamenhofa",
		"latitude": 51.76181,
		"longitude": 19.45525
	},
	{
		"id": 523,
		"name": "Mickiewicza-Żeromskiego",
		"latitude": 51.75813,
		"longitude": 19.4491
	},
	{
		"id": 524,
		"name": "Kościuszki-Mickiewicza",
		"latitude": 51.76006,
		"longitude": 19.45569
	},
	{
		"id": 525,
		"name": "Struga-Gdańska",
		"latitude": 51.76496,
		"longitude": 19.44948
	},
	{
		"id": 526,
		"name": "Kościuszki-Struga",
		"latitude": 51.76629,
		"longitude": 19.4544
	},
	{
		"id": 527,
		"name": "Kościuszki-Struga",
		"latitude": 51.7657,
		"longitude": 19.45437
	},
	{
		"id": 528,
		"name": "Kościuszki-Zielona",
		"latitude": 51.76978,
		"longitude": 19.4535
	},
	{
		"id": 529,
		"name": "Zachodnia-Zielona",
		"latitude": 51.77075,
		"longitude": 19.45358
	},
	{
		"id": 530,
		"name": "Kościuszki-Zielona",
		"latitude": 51.76947,
		"longitude": 19.45363
	},
	{
		"id": 531,
		"name": "Zachodnia-Więckowskiego",
		"latitude": 51.77274,
		"longitude": 19.453
	},
	{
		"id": 532,
		"name": "Zielona-Piotrkowska",
		"latitude": 51.77053,
		"longitude": 19.45577
	},
	{
		"id": 533,
		"name": "Zielona/Gdańska",
		"latitude": 51.77007,
		"longitude": 19.44964
	},
	{
		"id": 534,
		"name": "Kościuszki-Zielona",
		"latitude": 51.76967,
		"longitude": 19.45324
	},
	{
		"id": 535,
		"name": "Kościuszki-Struga",
		"latitude": 51.76623,
		"longitude": 19.45405
	},
	{
		"id": 538,
		"name": "Zamenhofa-Piotrkowska",
		"latitude": 51.76215,
		"longitude": 19.45607
	},
	{
		"id": 539,
		"name": "Kościuszki-Mickiewicza",
		"latitude": 51.75854,
		"longitude": 19.45574
	},
	{
		"id": 540,
		"name": "Kościuszki-Struga",
		"latitude": 51.7649,
		"longitude": 19.45443
	},
	{
		"id": 541,
		"name": "Kościuszki-Zamenhofa",
		"latitude": 51.76239,
		"longitude": 19.45502
	},
	{
		"id": 543,
		"name": "Piotrkowska Centrum",
		"latitude": 51.75931,
		"longitude": 19.45788
	},
	{
		"id": 544,
		"name": "Piotrkowska-Żwirki",
		"latitude": 51.75613,
		"longitude": 19.45919
	},
	{
		"id": 545,
		"name": "Kościuszki-Radwańska",
		"latitude": 51.75311,
		"longitude": 19.45691
	},
	{
		"id": 546,
		"name": "Piotrkowska-Brzeźna",
		"latitude": 51.75301,
		"longitude": 19.45976
	},
	{
		"id": 547,
		"name": "Krakowska-Minerska",
		"latitude": 51.76487,
		"longitude": 19.40468
	},
	{
		"id": 548,
		"name": "Krakowska-Michałowicza",
		"latitude": 51.77005,
		"longitude": 19.40178
	},
	{
		"id": 549,
		"name": "Krakowska-Biegunowa",
		"latitude": 51.77402,
		"longitude": 19.39923
	},
	{
		"id": 550,
		"name": "Krakowska-Siewna",
		"latitude": 51.77877,
		"longitude": 19.39938
	},
	{
		"id": 551,
		"name": "Złotno-Kwiatowa",
		"latitude": 51.77961,
		"longitude": 19.39342
	},
	{
		"id": 552,
		"name": "Traktorowa-Rąbieńska",
		"latitude": 51.78351,
		"longitude": 19.39187
	},
	{
		"id": 553,
		"name": "Krakowska-Biegunowa",
		"latitude": 51.77517,
		"longitude": 19.39861
	},
	{
		"id": 554,
		"name": "Srebrzyńska-cm. Mania",
		"latitude": 51.77582,
		"longitude": 19.40514
	},
	{
		"id": 555,
		"name": "Krakowska-Michałowicza",
		"latitude": 51.76959,
		"longitude": 19.40179
	},
	{
		"id": 556,
		"name": "Solec-cm. Mania",
		"latitude": 51.77608,
		"longitude": 19.40529
	},
	{
		"id": 557,
		"name": "Krakowska-Minerska",
		"latitude": 51.76552,
		"longitude": 19.40395
	},
	{
		"id": 558,
		"name": "Rokicińska-Augustów",
		"latitude": 51.75714,
		"longitude": 19.55446
	},
	{
		"id": 559,
		"name": "Augustów-Rokicińska",
		"latitude": 51.7585,
		"longitude": 19.55411
	},
	{
		"id": 560,
		"name": "Krzemieniecka-Kowieńska",
		"latitude": 51.75631,
		"longitude": 19.42067
	},
	{
		"id": 561,
		"name": "Bandurskiego-Atlas Arena",
		"latitude": 51.75554,
		"longitude": 19.42673
	},
	{
		"id": 562,
		"name": "Bandurskiego-Wileńska",
		"latitude": 51.7539,
		"longitude": 19.42123
	},
	{
		"id": 563,
		"name": "Krzemieniecka-Kowieńska",
		"latitude": 51.7563,
		"longitude": 19.4219
	},
	{
		"id": 564,
		"name": "Krzemieniecka-Retkińska",
		"latitude": 51.75838,
		"longitude": 19.41343
	},
	{
		"id": 565,
		"name": "Krakowska-Konstantynowska",
		"latitude": 51.76296,
		"longitude": 19.40719
	},
	{
		"id": 566,
		"name": "Książąt Polskich-Zakładowa",
		"latitude": 51.74407,
		"longitude": 19.55188
	},
	{
		"id": 567,
		"name": "Zakładowa-Olechowska",
		"latitude": 51.74294,
		"longitude": 19.55449
	},
	{
		"id": 568,
		"name": "Kurczaki-Rzgowska",
		"latitude": 51.7179,
		"longitude": 19.48614
	},
	{
		"id": 569,
		"name": "Kurczaki-Socjalna",
		"latitude": 51.71849,
		"longitude": 19.49038
	},
	{
		"id": 570,
		"name": "Kurczaki-cm. Kurczaki",
		"latitude": 51.71926,
		"longitude": 19.49589
	},
	{
		"id": 571,
		"name": "Komorniki",
		"latitude": 51.72006,
		"longitude": 19.50363
	},
	{
		"id": 572,
		"name": "Kurczaki-cm. Kurczaki",
		"latitude": 51.71944,
		"longitude": 19.49652
	},
	{
		"id": 573,
		"name": "Kurczaki-Socjalna",
		"latitude": 51.71867,
		"longitude": 19.49133
	},
	{
		"id": 574,
		"name": "Rzgowska-Kurczaki",
		"latitude": 51.71861,
		"longitude": 19.48513
	},
	{
		"id": 575,
		"name": "Kusocińskiego",
		"latitude": 51.74772,
		"longitude": 19.3833
	},
	{
		"id": 576,
		"name": "Popiełuszki-Wyszyńskiego",
		"latitude": 51.74189,
		"longitude": 19.38283
	},
	{
		"id": 577,
		"name": "Kusocińskiego",
		"latitude": 51.74773,
		"longitude": 19.3836
	},
	{
		"id": 578,
		"name": "Kusocińskiego",
		"latitude": 51.74803,
		"longitude": 19.3837
	},
	{
		"id": 579,
		"name": "Kusocińskiego-Popiełuszki",
		"latitude": 51.74804,
		"longitude": 19.38523
	},
	{
		"id": 580,
		"name": "Kusocińskiego-Armii Krajowej",
		"latitude": 51.75013,
		"longitude": 19.39231
	},
	{
		"id": 581,
		"name": "Kusocińskiego-Babickiego",
		"latitude": 51.75224,
		"longitude": 19.40016
	},
	{
		"id": 582,
		"name": "Kusocińskiego-Popiełuszki",
		"latitude": 51.74762,
		"longitude": 19.38386
	},
	{
		"id": 583,
		"name": "Limanowskiego-Pułaskiego",
		"latitude": 51.79265,
		"longitude": 19.41795
	},
	{
		"id": 584,
		"name": "Włókniarzy-Wielkopolska",
		"latitude": 51.79025,
		"longitude": 19.42097
	},
	{
		"id": 585,
		"name": "Limanowskiego-Mokra",
		"latitude": 51.79121,
		"longitude": 19.4252
	},
	{
		"id": 586,
		"name": "Limanowskiego-Klonowa",
		"latitude": 51.79038,
		"longitude": 19.42928
	},
	{
		"id": 587,
		"name": "Limanowskiego-Sierakowskiego",
		"latitude": 51.78922,
		"longitude": 19.43565
	},
	{
		"id": 588,
		"name": "Limanowskiego-Piwna",
		"latitude": 51.78779,
		"longitude": 19.44307
	},
	{
		"id": 589,
		"name": "Limanowskiego-Zachodnia",
		"latitude": 51.78712,
		"longitude": 19.44876
	},
	{
		"id": 590,
		"name": "Zachodnia-Lutomierska",
		"latitude": 51.78333,
		"longitude": 19.45024
	},
	{
		"id": 591,
		"name": "Limanowskiego-Bałucki Rynek",
		"latitude": 51.78666,
		"longitude": 19.45138
	},
	{
		"id": 592,
		"name": "Limanowskiego-Piwna",
		"latitude": 51.7877,
		"longitude": 19.4436
	},
	{
		"id": 593,
		"name": "Limanowskiego-Sierakowskiego",
		"latitude": 51.78918,
		"longitude": 19.43612
	},
	{
		"id": 594,
		"name": "Limanowskiego-Klonowa",
		"latitude": 51.79036,
		"longitude": 19.43039
	},
	{
		"id": 595,
		"name": "Limanowskiego-Mokra",
		"latitude": 51.79118,
		"longitude": 19.42561
	},
	{
		"id": 596,
		"name": "Limanowskiego-Pułaskiego",
		"latitude": 51.79271,
		"longitude": 19.418
	},
	{
		"id": 597,
		"name": "Limanowskiego-Woronicza",
		"latitude": 51.79426,
		"longitude": 19.41051
	},
	{
		"id": 598,
		"name": "Dw. Łódź Żabieniec",
		"latitude": 51.79398,
		"longitude": 19.40826
	},
	{
		"id": 599,
		"name": "11 Listopada-Jantarowa",
		"latitude": 51.81574,
		"longitude": 19.42252
	},
	{
		"id": 602,
		"name": "11 Listopada",
		"latitude": 51.81783,
		"longitude": 19.4188
	},
	{
		"id": 603,
		"name": "11 Listopada",
		"latitude": 51.81761,
		"longitude": 19.41908
	},
	{
		"id": 604,
		"name": "11 Listopada-Jantarowa",
		"latitude": 51.8154,
		"longitude": 19.42271
	},
	{
		"id": 605,
		"name": "Włókniarzy-Liściasta",
		"latitude": 51.81011,
		"longitude": 19.42513
	},
	{
		"id": 606,
		"name": "Liściasta-Liściasta 72",
		"latitude": 51.80833,
		"longitude": 19.42884
	},
	{
		"id": 607,
		"name": "Liściasta-Czereśniowa",
		"latitude": 51.80709,
		"longitude": 19.43524
	},
	{
		"id": 608,
		"name": "Liściasta-Zgierska",
		"latitude": 51.80635,
		"longitude": 19.4388
	},
	{
		"id": 609,
		"name": "Liściasta-Czereśniowa",
		"latitude": 51.80743,
		"longitude": 19.43401
	},
	{
		"id": 610,
		"name": "Liściasta-Liściasta 72",
		"latitude": 51.80846,
		"longitude": 19.42895
	},
	{
		"id": 611,
		"name": "Włókniarzy-Liściasta",
		"latitude": 51.80973,
		"longitude": 19.42576
	},
	{
		"id": 612,
		"name": "Włókniarzy-św. Teresy",
		"latitude": 51.80383,
		"longitude": 19.42549
	},
	{
		"id": 613,
		"name": "Lodowa-Ordonówny",
		"latitude": 51.72881,
		"longitude": 19.5179
	},
	{
		"id": 614,
		"name": "Lodowa-Lodowa 97",
		"latitude": 51.7302,
		"longitude": 19.52419
	},
	{
		"id": 615,
		"name": "Lodowa-Dąbrowskiego",
		"latitude": 51.73396,
		"longitude": 19.52422
	},
	{
		"id": 616,
		"name": "Lodowa-Dostawcza",
		"latitude": 51.74032,
		"longitude": 19.52417
	},
	{
		"id": 617,
		"name": "Lodowa-Andrzejewskiej",
		"latitude": 51.74629,
		"longitude": 19.52249
	},
	{
		"id": 618,
		"name": "Lodowa-cm. Zarzew",
		"latitude": 51.74989,
		"longitude": 19.52139
	},
	{
		"id": 619,
		"name": "Przybyszewskiego-Lodowa",
		"latitude": 51.75166,
		"longitude": 19.52185
	},
	{
		"id": 620,
		"name": "Lodowa-cm. Zarzew",
		"latitude": 51.7494,
		"longitude": 19.52135
	},
	{
		"id": 621,
		"name": "Lodowa-Andrzejewskiej",
		"latitude": 51.7461,
		"longitude": 19.52235
	},
	{
		"id": 622,
		"name": "Lodowa-Dostawcza",
		"latitude": 51.74,
		"longitude": 19.52413
	},
	{
		"id": 623,
		"name": "Lodowa-Lodowa 91",
		"latitude": 51.73728,
		"longitude": 19.52429
	},
	{
		"id": 624,
		"name": "Lodowa-Lodowa 97",
		"latitude": 51.73075,
		"longitude": 19.52399
	},
	{
		"id": 625,
		"name": "Lodowa-Ordonówny",
		"latitude": 51.72887,
		"longitude": 19.51824
	},
	{
		"id": 626,
		"name": "Wedmanowej-Lodowa",
		"latitude": 51.73138,
		"longitude": 19.51256
	},
	{
		"id": 627,
		"name": "Lutomierska-Klonowa",
		"latitude": 51.78804,
		"longitude": 19.42771
	},
	{
		"id": 628,
		"name": "Lutomierska-Czarnkowska",
		"latitude": 51.78515,
		"longitude": 19.43792
	},
	{
		"id": 631,
		"name": "Lutomierska-Zachodnia",
		"latitude": 51.78298,
		"longitude": 19.44959
	},
	{
		"id": 633,
		"name": "Zachodnia-Lutomierska",
		"latitude": 51.78334,
		"longitude": 19.45047
	},
	{
		"id": 634,
		"name": "Zachodnia-Lutomierska",
		"latitude": 51.78247,
		"longitude": 19.45037
	},
	{
		"id": 635,
		"name": "Lutomierska-Zachodnia",
		"latitude": 51.78319,
		"longitude": 19.44932
	},
	{
		"id": 636,
		"name": "Lutomierska-Czarnkowska",
		"latitude": 51.78554,
		"longitude": 19.43643
	},
	{
		"id": 639,
		"name": "Tybury-Odolanowska",
		"latitude": 51.78527,
		"longitude": 19.43272
	},
	{
		"id": 640,
		"name": "Wielkopolska-Pułaskiego",
		"latitude": 51.79062,
		"longitude": 19.41841
	},
	{
		"id": 642,
		"name": "Łagiewnicka-Dolna",
		"latitude": 51.79186,
		"longitude": 19.45497
	},
	{
		"id": 643,
		"name": "Łagiewnicka-Kowalska",
		"latitude": 51.79526,
		"longitude": 19.45554
	},
	{
		"id": 644,
		"name": "Łagiewnicka-Murarska",
		"latitude": 51.79919,
		"longitude": 19.4564
	},
	{
		"id": 645,
		"name": "Łagiewnicka-Murarska",
		"latitude": 51.79915,
		"longitude": 19.4564
	},
	{
		"id": 646,
		"name": "Łagiewnicka-Rondo Powstańców 1863r.",
		"latitude": 51.80141,
		"longitude": 19.45775
	},
	{
		"id": 647,
		"name": "Warszawska-Irysowa",
		"latitude": 51.80289,
		"longitude": 19.46257
	},
	{
		"id": 648,
		"name": "Zamojska-Prądzyńskiego",
		"latitude": 51.72292,
		"longitude": 19.43962
	},
	{
		"id": 649,
		"name": "Św. Franciszka-Zwrotnikowa",
		"latitude": 51.72688,
		"longitude": 19.43677
	},
	{
		"id": 650,
		"name": "Łagiewnicka-Litewska",
		"latitude": 51.80456,
		"longitude": 19.45923
	},
	{
		"id": 651,
		"name": "Łagiewnicka-Morelowa",
		"latitude": 51.80844,
		"longitude": 19.45782
	},
	{
		"id": 652,
		"name": "Łagiewnicka-Sowińskiego",
		"latitude": 51.81226,
		"longitude": 19.45557
	},
	{
		"id": 653,
		"name": "Sikorskiego-Dw. Łódź Arturówek",
		"latitude": 51.81682,
		"longitude": 19.45419
	},
	{
		"id": 654,
		"name": "Łagiewnicka-Dw. Łódź Arturówek",
		"latitude": 51.8163,
		"longitude": 19.45509
	},
	{
		"id": 655,
		"name": "Świtezianki-Sikorskiego",
		"latitude": 51.81988,
		"longitude": 19.44881
	},
	{
		"id": 656,
		"name": "Sikorskiego-Dw. Łódź Arturówek",
		"latitude": 51.81676,
		"longitude": 19.45367
	},
	{
		"id": 657,
		"name": "Łagiewnicka-Sowińskiego",
		"latitude": 51.81219,
		"longitude": 19.45521
	},
	{
		"id": 658,
		"name": "Łagiewnicka-Morelowa",
		"latitude": 51.80757,
		"longitude": 19.45817
	},
	{
		"id": 659,
		"name": "Łagiewnicka-Litewska",
		"latitude": 51.80458,
		"longitude": 19.45888
	},
	{
		"id": 660,
		"name": "Łagiewnicka-rondo Powstańców 1863r.",
		"latitude": 51.80135,
		"longitude": 19.45756
	},
	{
		"id": 661,
		"name": "Łagiewnicka-Rondo Powstańców 1863r.",
		"latitude": 51.80138,
		"longitude": 19.45761
	},
	{
		"id": 662,
		"name": "Łagiewnicka-Murarska",
		"latitude": 51.79913,
		"longitude": 19.45632
	},
	{
		"id": 663,
		"name": "Łagiewnicka-Stefana",
		"latitude": 51.7951,
		"longitude": 19.45545
	},
	{
		"id": 664,
		"name": "Łagiewnicka-Stefana",
		"latitude": 51.79505,
		"longitude": 19.45545
	},
	{
		"id": 665,
		"name": "Łagiewnicka-Dolna",
		"latitude": 51.79093,
		"longitude": 19.45447
	},
	{
		"id": 666,
		"name": "Łaskowice-Nad Dobrzynką",
		"latitude": 51.70968,
		"longitude": 19.37042
	},
	{
		"id": 667,
		"name": "Sanitariuszek-Łaskowice",
		"latitude": 51.71292,
		"longitude": 19.3661
	},
	{
		"id": 668,
		"name": "Łupkowa-Kobaltowa",
		"latitude": 51.81486,
		"longitude": 19.49822
	},
	{
		"id": 669,
		"name": "Strykowska-Herbowa",
		"latitude": 51.8124,
		"longitude": 19.5028
	},
	{
		"id": 670,
		"name": "Strykowska-Rogowska",
		"latitude": 51.81887,
		"longitude": 19.50615
	},
	{
		"id": 671,
		"name": "Łupkowa-Kobaltowa",
		"latitude": 51.81513,
		"longitude": 19.49861
	},
	{
		"id": 672,
		"name": "Warszawska-Wycieczkowa",
		"latitude": 51.81348,
		"longitude": 19.48659
	},
	{
		"id": 673,
		"name": "1 Maja-Pogonowskiego",
		"latitude": 51.772,
		"longitude": 19.44127
	},
	{
		"id": 674,
		"name": "Żeligowskiego-pl. Hallera",
		"latitude": 51.76795,
		"longitude": 19.43866
	},
	{
		"id": 675,
		"name": "Pl. Wolności",
		"latitude": 51.77659,
		"longitude": 19.45513
	},
	{
		"id": 676,
		"name": "Żeromskiego-Więckowskiego (LO nr 1)",
		"latitude": 51.77225,
		"longitude": 19.44524
	},
	{
		"id": 677,
		"name": "Próchnika-Gdańska",
		"latitude": 51.77396,
		"longitude": 19.44724
	},
	{
		"id": 678,
		"name": "Olechowska 22",
		"latitude": 51.73041,
		"longitude": 19.53964
	},
	{
		"id": 679,
		"name": "Olechowska-Tomaszowska",
		"latitude": 51.72797,
		"longitude": 19.53547
	},
	{
		"id": 680,
		"name": "3 Maja-Morska",
		"latitude": 51.71647,
		"longitude": 19.4486
	},
	{
		"id": 681,
		"name": "3 Maja-Świetlicowa",
		"latitude": 51.71587,
		"longitude": 19.45249
	},
	{
		"id": 682,
		"name": "Pryncypalna-Mocna",
		"latitude": 51.71864,
		"longitude": 19.4601
	},
	{
		"id": 683,
		"name": "3 Maja-Świetlicowa",
		"latitude": 51.71594,
		"longitude": 19.45202
	},
	{
		"id": 684,
		"name": "3 Maja-Morska",
		"latitude": 51.71674,
		"longitude": 19.44779
	},
	{
		"id": 685,
		"name": "Pabianicka-3 Maja",
		"latitude": 51.71877,
		"longitude": 19.43739
	},
	{
		"id": 686,
		"name": "Olechowska 22",
		"latitude": 51.73061,
		"longitude": 19.54017
	},
	{
		"id": 687,
		"name": "Olechowska-Olechowska 36",
		"latitude": 51.73271,
		"longitude": 19.54366
	},
	{
		"id": 688,
		"name": "Malownicza-Taborowa",
		"latitude": 51.75345,
		"longitude": 19.59275
	},
	{
		"id": 689,
		"name": "Malownicza-Gerberowa",
		"latitude": 51.75864,
		"longitude": 19.60297
	},
	{
		"id": 690,
		"name": "Malownicza-Rataja",
		"latitude": 51.76083,
		"longitude": 19.60717
	},
	{
		"id": 691,
		"name": "Rataja-Słoneczne Zacisze",
		"latitude": 51.75417,
		"longitude": 19.61641
	},
	{
		"id": 692,
		"name": "Malownicza-Rataja",
		"latitude": 51.76107,
		"longitude": 19.60744
	},
	{
		"id": 693,
		"name": "Malownicza-Gerberowa",
		"latitude": 51.75759,
		"longitude": 19.60061
	},
	{
		"id": 694,
		"name": "Malownicza-Taborowa",
		"latitude": 51.75332,
		"longitude": 19.59233
	},
	{
		"id": 695,
		"name": "Maratońska-Sanitariuszek",
		"latitude": 51.72707,
		"longitude": 19.35266
	},
	{
		"id": 696,
		"name": "Maratońska-Maratońska 172",
		"latitude": 51.73029,
		"longitude": 19.35889
	},
	{
		"id": 697,
		"name": "Maratońska-Golfowa",
		"latitude": 51.73273,
		"longitude": 19.3681
	},
	{
		"id": 698,
		"name": "Maratońska-Kolarska",
		"latitude": 51.73458,
		"longitude": 19.37498
	},
	{
		"id": 699,
		"name": "Maratońska-Gimnastyczna",
		"latitude": 51.7358,
		"longitude": 19.37937
	},
	{
		"id": 700,
		"name": "Maratońska-Popiełuszki",
		"latitude": 51.73629,
		"longitude": 19.38541
	},
	{
		"id": 701,
		"name": "Popiełuszki-Popiełuszki 21",
		"latitude": 51.74025,
		"longitude": 19.38407
	},
	{
		"id": 702,
		"name": "Maratońska-Maratońska 91",
		"latitude": 51.73683,
		"longitude": 19.39123
	},
	{
		"id": 703,
		"name": "Maratońska-Plocka",
		"latitude": 51.7388,
		"longitude": 19.39811
	},
	{
		"id": 704,
		"name": "Maratońska-Retkińska",
		"latitude": 51.74132,
		"longitude": 19.40638
	},
	{
		"id": 705,
		"name": "Retkińska-Maratońska",
		"latitude": 51.74205,
		"longitude": 19.40542
	},
	{
		"id": 706,
		"name": "Maratońska-Obywatelska",
		"latitude": 51.7424,
		"longitude": 19.41201
	},
	{
		"id": 707,
		"name": "Nowe Sady-Waltera-Janke",
		"latitude": 51.74307,
		"longitude": 19.42293
	},
	{
		"id": 708,
		"name": "Waltera-Janke-Maratońska",
		"latitude": 51.74327,
		"longitude": 19.42127
	},
	{
		"id": 709,
		"name": "Waltera-Janke-Bratysławska",
		"latitude": 51.74675,
		"longitude": 19.41967
	},
	{
		"id": 711,
		"name": "Maratońska-Obywatelska",
		"latitude": 51.74244,
		"longitude": 19.41179
	},
	{
		"id": 712,
		"name": "Maratońska-Retkińska",
		"latitude": 51.741,
		"longitude": 19.40404
	},
	{
		"id": 713,
		"name": "Maratońska-Plocka",
		"latitude": 51.73875,
		"longitude": 19.39749
	},
	{
		"id": 714,
		"name": "Maratońska-Maratońska 91",
		"latitude": 51.73681,
		"longitude": 19.39046
	},
	{
		"id": 715,
		"name": "Maratońska-Popiełuszki",
		"latitude": 51.73638,
		"longitude": 19.38572
	},
	{
		"id": 717,
		"name": "Maratońska (wew.)-Popiełuszki",
		"latitude": 51.73711,
		"longitude": 19.38812
	},
	{
		"id": 718,
		"name": "Maratońska-Popiełuszki",
		"latitude": 51.73714,
		"longitude": 19.38739
	},
	{
		"id": 720,
		"name": "Maratońska-Gimnastyczna",
		"latitude": 51.7359,
		"longitude": 19.37922
	},
	{
		"id": 721,
		"name": "Maratońska-Kolarska",
		"latitude": 51.73493,
		"longitude": 19.37583
	},
	{
		"id": 722,
		"name": "Maratońska-Golfowa",
		"latitude": 51.73276,
		"longitude": 19.36767
	},
	{
		"id": 723,
		"name": "Golfowa-Maratońska",
		"latitude": 51.73277,
		"longitude": 19.3671
	},
	{
		"id": 724,
		"name": "Maratońska-Maratońska 172",
		"latitude": 51.73048,
		"longitude": 19.3591
	},
	{
		"id": 725,
		"name": "Maratońska-Sanitariuszek",
		"latitude": 51.72661,
		"longitude": 19.35202
	},
	{
		"id": 726,
		"name": "Sanitariuszek-G.O.Ś.",
		"latitude": 51.72708,
		"longitude": 19.34939
	},
	{
		"id": 727,
		"name": "Marmurowa-Moskuliki",
		"latitude": 51.81075,
		"longitude": 19.55017
	},
	{
		"id": 735,
		"name": "Marmurowa-Moskuliki",
		"latitude": 51.81052,
		"longitude": 19.54968
	},
	{
		"id": 738,
		"name": "Marysińska-Szklana",
		"latitude": 51.79316,
		"longitude": 19.46597
	},
	{
		"id": 739,
		"name": "Mickiewicza-Żeromskiego",
		"latitude": 51.75728,
		"longitude": 19.44689
	},
	{
		"id": 741,
		"name": "Piłsudskiego / Kilińskiego",
		"latitude": 51.76017,
		"longitude": 19.46999
	},
	{
		"id": 743,
		"name": "Piłsudskiego-Sienkiewicza",
		"latitude": 51.75978,
		"longitude": 19.46383
	},
	{
		"id": 744,
		"name": "Piotrkowska Centrum",
		"latitude": 51.75922,
		"longitude": 19.45647
	},
	{
		"id": 746,
		"name": "Bandurskiego-Dw. Łódź Kaliska",
		"latitude": 51.75588,
		"longitude": 19.4318
	},
	{
		"id": 747,
		"name": "Nowy Józefów-Golfowa",
		"latitude": 51.73637,
		"longitude": 19.3675
	},
	{
		"id": 748,
		"name": "Żeromskiego-Kopernika",
		"latitude": 51.76157,
		"longitude": 19.44768
	},
	{
		"id": 749,
		"name": "Włókniarzy-Karolewska (Dw. Ł. Kalis",
		"latitude": 51.75843,
		"longitude": 19.43379
	},
	{
		"id": 751,
		"name": "Dw. Łódź Kaliska",
		"latitude": 51.75671,
		"longitude": 19.43101
	},
	{
		"id": 752,
		"name": "Milionowa-Przędzalniana",
		"latitude": 51.75138,
		"longitude": 19.48674
	},
	{
		"id": 753,
		"name": "Śmigłego-Rydza-Milionowa",
		"latitude": 51.75119,
		"longitude": 19.48908
	},
	{
		"id": 754,
		"name": "Milionowa-Śmigłego-Rydza",
		"latitude": 51.75174,
		"longitude": 19.48845
	},
	{
		"id": 755,
		"name": "Przędzalniana-Milionowa",
		"latitude": 51.75165,
		"longitude": 19.4858
	},
	{
		"id": 756,
		"name": "Młynek",
		"latitude": 51.72359,
		"longitude": 19.52048
	},
	{
		"id": 757,
		"name": "Śląska-Kowalszczyzna",
		"latitude": 51.72655,
		"longitude": 19.51676
	},
	{
		"id": 758,
		"name": "Narutowicza-Kilińskiego",
		"latitude": 51.77113,
		"longitude": 19.46315
	},
	{
		"id": 759,
		"name": "Narutowicza-P.O.W.",
		"latitude": 51.77118,
		"longitude": 19.46537
	},
	{
		"id": 761,
		"name": "Narutowicza-pl. Dąbrowskiego",
		"latitude": 51.77185,
		"longitude": 19.47037
	},
	{
		"id": 762,
		"name": "Sterlinga-pl. Dąbrowskiego",
		"latitude": 51.77327,
		"longitude": 19.46914
	},
	{
		"id": 763,
		"name": "Narutowicza-pl. Dąbrowskiego",
		"latitude": 51.77192,
		"longitude": 19.47043
	},
	{
		"id": 764,
		"name": "Uniwersytecka-Rondo Solidarności",
		"latitude": 51.77814,
		"longitude": 19.48015
	},
	{
		"id": 765,
		"name": "Narutowicza-Tramwajowa",
		"latitude": 51.7723,
		"longitude": 19.47572
	},
	{
		"id": 766,
		"name": "Narutowicza-Tramwajowa",
		"latitude": 51.77239,
		"longitude": 19.47588
	},
	{
		"id": 767,
		"name": "Narutowicza-Kopcińskiego",
		"latitude": 51.77288,
		"longitude": 19.48137
	},
	{
		"id": 768,
		"name": "Narutowicza-Kopcińskiego",
		"latitude": 51.77292,
		"longitude": 19.48203
	},
	{
		"id": 769,
		"name": "Narutowicza-pl. Dąbrowskiego",
		"latitude": 51.7719,
		"longitude": 19.46972
	},
	{
		"id": 770,
		"name": "Narutowicza-Radiostacja",
		"latitude": 51.77422,
		"longitude": 19.49513
	},
	{
		"id": 771,
		"name": "Krzywickiego-Radiostacja",
		"latitude": 51.77346,
		"longitude": 19.4934
	},
	{
		"id": 772,
		"name": "Narutowicza-Radiostacja",
		"latitude": 51.77398,
		"longitude": 19.49449
	},
	{
		"id": 773,
		"name": "Pomorska-Lumumby (kampus UŁ)",
		"latitude": 51.77764,
		"longitude": 19.49439
	},
	{
		"id": 774,
		"name": "Narutowicza-Radiostacja",
		"latitude": 51.77432,
		"longitude": 19.49442
	},
	{
		"id": 775,
		"name": "Pomorska-Konstytucyjna",
		"latitude": 51.77757,
		"longitude": 19.49681
	},
	{
		"id": 776,
		"name": "Narutowicza-Radiostacja",
		"latitude": 51.77426,
		"longitude": 19.49483
	},
	{
		"id": 777,
		"name": "Narutowicza-Matejki (kampus UŁ)",
		"latitude": 51.77373,
		"longitude": 19.49006
	},
	{
		"id": 778,
		"name": "Narutowicza-Matejki (kampus UŁ)",
		"latitude": 51.77374,
		"longitude": 19.4901
	},
	{
		"id": 779,
		"name": "Narutowicza-Kopcińskiego",
		"latitude": 51.7731,
		"longitude": 19.48346
	},
	{
		"id": 780,
		"name": "Narutowicza-Kopcińskiego",
		"latitude": 51.77319,
		"longitude": 19.484
	},
	{
		"id": 783,
		"name": "Narutowicza-pl. Dąbrowskiego",
		"latitude": 51.77191,
		"longitude": 19.46981
	},
	{
		"id": 784,
		"name": "Narutowicza-Kilińskiego",
		"latitude": 51.77116,
		"longitude": 19.46297
	},
	{
		"id": 787,
		"name": "Narutowicza-Piotrkowska",
		"latitude": 51.7707,
		"longitude": 19.45649
	},
	{
		"id": 788,
		"name": "Nawrot-Kilińskiego",
		"latitude": 51.76302,
		"longitude": 19.46654
	},
	{
		"id": 789,
		"name": "Nawrot-Targowa",
		"latitude": 51.76359,
		"longitude": 19.47347
	},
	{
		"id": 790,
		"name": "Nawrot-Wysoka",
		"latitude": 51.76391,
		"longitude": 19.47732
	},
	{
		"id": 791,
		"name": "Niciarniana-szpital położniczy",
		"latitude": 51.75637,
		"longitude": 19.51027
	},
	{
		"id": 792,
		"name": "Niciarniana-przychodnia",
		"latitude": 51.75995,
		"longitude": 19.5092
	},
	{
		"id": 793,
		"name": "Niciarniana-Piłsudskiego",
		"latitude": 51.76429,
		"longitude": 19.50793
	},
	{
		"id": 794,
		"name": "Niciarniana-Dw. Łódź Niciarniana",
		"latitude": 51.76745,
		"longitude": 19.50693
	},
	{
		"id": 795,
		"name": "Niciarniana-Czechosłowacka",
		"latitude": 51.77133,
		"longitude": 19.50579
	},
	{
		"id": 796,
		"name": "Piłsudskiego-Niciarniana",
		"latitude": 51.76339,
		"longitude": 19.50734
	},
	{
		"id": 797,
		"name": "Piłsudskiego-Niciarniana",
		"latitude": 51.76333,
		"longitude": 19.50898
	},
	{
		"id": 798,
		"name": "Niciarniana-Piłsudskiego",
		"latitude": 51.76278,
		"longitude": 19.50817
	},
	{
		"id": 799,
		"name": "Niciarniana-przychodnia",
		"latitude": 51.75963,
		"longitude": 19.50912
	},
	{
		"id": 800,
		"name": "Niciarniana-szpital położniczy",
		"latitude": 51.75575,
		"longitude": 19.51028
	},
	{
		"id": 801,
		"name": "Przybyszewskiego-Niciarniana",
		"latitude": 51.75047,
		"longitude": 19.51355
	},
	{
		"id": 802,
		"name": "Niższa-Śląska",
		"latitude": 51.72893,
		"longitude": 19.4901
	},
	{
		"id": 803,
		"name": "Niższa-Śląska",
		"latitude": 51.729,
		"longitude": 19.49019
	},
	{
		"id": 804,
		"name": "Niższa-Broniewskiego",
		"latitude": 51.73219,
		"longitude": 19.4891
	},
	{
		"id": 805,
		"name": "Śmigłego-Rydza-Dąbrowskiego",
		"latitude": 51.73703,
		"longitude": 19.48894
	},
	{
		"id": 806,
		"name": "Nowe Sady-Elektronowa",
		"latitude": 51.74154,
		"longitude": 19.43429
	},
	{
		"id": 807,
		"name": "Nowe Sady-zajezdnia NOWE SADY",
		"latitude": 51.74605,
		"longitude": 19.43138
	},
	{
		"id": 808,
		"name": "Nowe Sady-zajezdnia MPK",
		"latitude": 51.7464,
		"longitude": 19.43021
	},
	{
		"id": 809,
		"name": "Nowe Sady-ROD Olimpijka",
		"latitude": 51.74239,
		"longitude": 19.42712
	},
	{
		"id": 810,
		"name": "Nowe Sady-ROD Olimpijka",
		"latitude": 51.74325,
		"longitude": 19.42647
	},
	{
		"id": 811,
		"name": "Nowe Sady-Waltera-Janke",
		"latitude": 51.74318,
		"longitude": 19.42357
	},
	{
		"id": 812,
		"name": "Nowe Sady-ROD Olimpijka",
		"latitude": 51.74317,
		"longitude": 19.42672
	},
	{
		"id": 813,
		"name": "Nowe Sady-zajezdnia MPK",
		"latitude": 51.74634,
		"longitude": 19.43072
	},
	{
		"id": 814,
		"name": "Nowomiejska-Północna",
		"latitude": 51.77865,
		"longitude": 19.45441
	},
	{
		"id": 815,
		"name": "Zgierska-pl. Kościelny",
		"latitude": 51.78309,
		"longitude": 19.45337
	},
	{
		"id": 816,
		"name": "Nowomiejska-Północna",
		"latitude": 51.77923,
		"longitude": 19.4541
	},
	{
		"id": 817,
		"name": "Pomorska-pl. Wolności",
		"latitude": 51.77692,
		"longitude": 19.45701
	},
	{
		"id": 818,
		"name": "Legionów-Zachodnia",
		"latitude": 51.77665,
		"longitude": 19.45259
	},
	{
		"id": 819,
		"name": "Legionów-Artyleryjska",
		"latitude": 51.77094,
		"longitude": 19.43166
	},
	{
		"id": 820,
		"name": "Zielona-1 Maja",
		"latitude": 51.76913,
		"longitude": 19.431
	},
	{
		"id": 821,
		"name": "Legionów-Włókniarzy",
		"latitude": 51.76873,
		"longitude": 19.42693
	},
	{
		"id": 822,
		"name": "Legionów-Legionów",
		"latitude": 51.76918,
		"longitude": 19.4286
	},
	{
		"id": 823,
		"name": "Legionów-Włókniarzy",
		"latitude": 51.76933,
		"longitude": 19.42707
	},
	{
		"id": 824,
		"name": "Legionów-Żeligowskiego",
		"latitude": 51.77284,
		"longitude": 19.43726
	},
	{
		"id": 825,
		"name": "Legionów-Cmentarna",
		"latitude": 51.77495,
		"longitude": 19.44321
	},
	{
		"id": 826,
		"name": "Zachodnia-Próchnika",
		"latitude": 51.77414,
		"longitude": 19.4526
	},
	{
		"id": 827,
		"name": "Ogrodowa-Nowomiejska",
		"latitude": 51.77886,
		"longitude": 19.45374
	},
	{
		"id": 828,
		"name": "Zachodnia-Manufaktura",
		"latitude": 51.78031,
		"longitude": 19.45135
	},
	{
		"id": 829,
		"name": "Legionów-Gdańska",
		"latitude": 51.77627,
		"longitude": 19.44816
	},
	{
		"id": 830,
		"name": "Legionów-Żeligowskiego",
		"latitude": 51.77322,
		"longitude": 19.43808
	},
	{
		"id": 831,
		"name": "Legionów-Artyleryjska",
		"latitude": 51.77206,
		"longitude": 19.43484
	},
	{
		"id": 832,
		"name": "Włókniarzy-Koziny",
		"latitude": 51.77234,
		"longitude": 19.42168
	},
	{
		"id": 833,
		"name": "Legionów-Włókniarzy",
		"latitude": 51.76946,
		"longitude": 19.42692
	},
	{
		"id": 834,
		"name": "Unii Lubelskiej-Konstantynowska",
		"latitude": 51.7681,
		"longitude": 19.42098
	},
	{
		"id": 835,
		"name": "Źródłowa-Wojska Polskiego",
		"latitude": 51.78551,
		"longitude": 19.46756
	},
	{
		"id": 836,
		"name": "Obywatelska-Obywatelska 106",
		"latitude": 51.73687,
		"longitude": 19.43196
	},
	{
		"id": 837,
		"name": "Obywatelska-Nowe Sady",
		"latitude": 51.73642,
		"longitude": 19.43558
	},
	{
		"id": 838,
		"name": "Jana Pawła II-Obywatelska",
		"latitude": 51.73581,
		"longitude": 19.442
	},
	{
		"id": 839,
		"name": "Obywatelska-Jana Pawła II",
		"latitude": 51.73633,
		"longitude": 19.44302
	},
	{
		"id": 840,
		"name": "Jana Pawła II-Obywatelska",
		"latitude": 51.73726,
		"longitude": 19.44248
	},
	{
		"id": 841,
		"name": "Politechniki-Obywatelska",
		"latitude": 51.73689,
		"longitude": 19.45291
	},
	{
		"id": 842,
		"name": "Politechniki-Obywatelska",
		"latitude": 51.73614,
		"longitude": 19.45252
	},
	{
		"id": 843,
		"name": "Obywatelska-Politechniki",
		"latitude": 51.73641,
		"longitude": 19.45171
	},
	{
		"id": 844,
		"name": "Obywatelska-Jana Pawła II",
		"latitude": 51.73655,
		"longitude": 19.44288
	},
	{
		"id": 845,
		"name": "Obywatelska-Nowe Sady",
		"latitude": 51.73679,
		"longitude": 19.43539
	},
	{
		"id": 846,
		"name": "Obywatelska-Jana Pawła II",
		"latitude": 51.73656,
		"longitude": 19.44116
	},
	{
		"id": 847,
		"name": "Obywatelska-Elektronowa",
		"latitude": 51.73761,
		"longitude": 19.42592
	},
	{
		"id": 848,
		"name": "Północna-Kilińskiego",
		"latitude": 51.77947,
		"longitude": 19.46058
	},
	{
		"id": 850,
		"name": "Ogrodowa-Nowomiejska",
		"latitude": 51.77876,
		"longitude": 19.4537
	},
	{
		"id": 851,
		"name": "Północna-Kilińskiego",
		"latitude": 51.77936,
		"longitude": 19.46014
	},
	{
		"id": 852,
		"name": "Okólna-Łagiewniki",
		"latitude": 51.84689,
		"longitude": 19.47469
	},
	{
		"id": 853,
		"name": "Okólna-Łagiewnicka",
		"latitude": 51.84675,
		"longitude": 19.4688
	},
	{
		"id": 854,
		"name": "Wycieczkowa-sanatorium",
		"latitude": 51.83531,
		"longitude": 19.48328
	},
	{
		"id": 855,
		"name": "Olechowska-Olechowska 56",
		"latitude": 51.73516,
		"longitude": 19.54777
	},
	{
		"id": 856,
		"name": "Olechowska-Przewozowa",
		"latitude": 51.73786,
		"longitude": 19.55245
	},
	{
		"id": 857,
		"name": "Zakładowa-Odnowiciela",
		"latitude": 51.74153,
		"longitude": 19.56262
	},
	{
		"id": 858,
		"name": "Olechowska-Przewozowa",
		"latitude": 51.73806,
		"longitude": 19.55259
	},
	{
		"id": 859,
		"name": "Olechowska-Olechowska 56",
		"latitude": 51.73503,
		"longitude": 19.54735
	},
	{
		"id": 860,
		"name": "Olechowska-Olechowska 36",
		"latitude": 51.73257,
		"longitude": 19.54325
	},
	{
		"id": 861,
		"name": "Tomaszowska-Bławatna",
		"latitude": 51.73241,
		"longitude": 19.52974
	},
	{
		"id": 862,
		"name": "Opolska-Zjazdowa",
		"latitude": 51.80695,
		"longitude": 19.53219
	},
	{
		"id": 863,
		"name": "Zjazdowa-Budy",
		"latitude": 51.8044,
		"longitude": 19.53072
	},
	{
		"id": 864,
		"name": "Pabianicka-Chocianowicka",
		"latitude": 51.70603,
		"longitude": 19.42193
	},
	{
		"id": 865,
		"name": "Pabianicka-Rudzka",
		"latitude": 51.71165,
		"longitude": 19.42909
	},
	{
		"id": 866,
		"name": "Pabianicka-Chocianowicka",
		"latitude": 51.70608,
		"longitude": 19.42183
	},
	{
		"id": 867,
		"name": "Pabianicka- ET-2",
		"latitude": 51.70791,
		"longitude": 19.42448
	},
	{
		"id": 868,
		"name": "Pabianicka-Dubois",
		"latitude": 51.71561,
		"longitude": 19.43388
	},
	{
		"id": 869,
		"name": "Pabianicka-3 Maja",
		"latitude": 51.71869,
		"longitude": 19.43765
	},
	{
		"id": 870,
		"name": "Starorudzka-Pabianicka",
		"latitude": 51.71628,
		"longitude": 19.436
	},
	{
		"id": 871,
		"name": "Pabianicka-Prądzyńskiego",
		"latitude": 51.72312,
		"longitude": 19.44302
	},
	{
		"id": 872,
		"name": "Pabianicka-Prądzyńskiego",
		"latitude": 51.72303,
		"longitude": 19.44312
	},
	{
		"id": 873,
		"name": "Pabianicka-Jana Pawła II",
		"latitude": 51.72763,
		"longitude": 19.4486
	},
	{
		"id": 874,
		"name": "Jana Pawła II-Rogozińskiego",
		"latitude": 51.73275,
		"longitude": 19.44215
	},
	{
		"id": 875,
		"name": "Pabianicka-Jana Pawła II",
		"latitude": 51.72738,
		"longitude": 19.44846
	},
	{
		"id": 876,
		"name": "Pabianicka-r. Lotników Lwowskich",
		"latitude": 51.73058,
		"longitude": 19.45226
	},
	{
		"id": 877,
		"name": "Pabianicka-r. Lotników Lwowskich",
		"latitude": 51.73015,
		"longitude": 19.45188
	},
	{
		"id": 878,
		"name": "Pabianicka-Wólczańska",
		"latitude": 51.73656,
		"longitude": 19.45953
	},
	{
		"id": 879,
		"name": "Paderewskiego-Zaolziańska",
		"latitude": 51.72933,
		"longitude": 19.45675
	},
	{
		"id": 880,
		"name": "Politechniki-Obywatelska",
		"latitude": 51.73609,
		"longitude": 19.45283
	},
	{
		"id": 881,
		"name": "Pabianicka-Jana Pawła II",
		"latitude": 51.72752,
		"longitude": 19.44827
	},
	{
		"id": 882,
		"name": "Pabianicka-r. Lotników Lwowskich",
		"latitude": 51.73208,
		"longitude": 19.45429
	},
	{
		"id": 883,
		"name": "Paderewskiego-Zaolziańska",
		"latitude": 51.72883,
		"longitude": 19.45752
	},
	{
		"id": 884,
		"name": "Politechniki-r. Lotników Lwowskich",
		"latitude": 51.73303,
		"longitude": 19.45294
	},
	{
		"id": 885,
		"name": "Piotrkowska-pl. Niepodległości",
		"latitude": 51.74085,
		"longitude": 19.46266
	},
	{
		"id": 886,
		"name": "Wólczańska-Skargi",
		"latitude": 51.7388,
		"longitude": 19.45863
	},
	{
		"id": 887,
		"name": "pl. Niepodległości",
		"latitude": 51.73981,
		"longitude": 19.46356
	},
	{
		"id": 888,
		"name": "Rzgowska-Dąbrowskiego",
		"latitude": 51.73866,
		"longitude": 19.4669
	},
	{
		"id": 889,
		"name": "Przybyszewskiego-pl. Reymonta",
		"latitude": 51.74278,
		"longitude": 19.46264
	},
	{
		"id": 890,
		"name": "Piotrkowska-Czerwona",
		"latitude": 51.74573,
		"longitude": 19.46167
	},
	{
		"id": 891,
		"name": "Pabianicka-pl. Niepodległości",
		"latitude": 51.73855,
		"longitude": 19.46182
	},
	{
		"id": 892,
		"name": "Pabianicka-r. Lotników Lwowskich",
		"latitude": 51.73247,
		"longitude": 19.45411
	},
	{
		"id": 893,
		"name": "Pabianicka-r. Lotników Lwowskich",
		"latitude": 51.73228,
		"longitude": 19.45417
	},
	{
		"id": 894,
		"name": "Pabianicka-Jana Pawła II",
		"latitude": 51.72811,
		"longitude": 19.44883
	},
	{
		"id": 895,
		"name": "Pabianicka-Prądzyńskiego",
		"latitude": 51.723,
		"longitude": 19.4427
	},
	{
		"id": 896,
		"name": "Pabianicka-Prądzyńskiego",
		"latitude": 51.7232,
		"longitude": 19.44273
	},
	{
		"id": 897,
		"name": "Pabianicka-3 Maja",
		"latitude": 51.71862,
		"longitude": 19.43735
	},
	{
		"id": 898,
		"name": "Pabianicka-Dubois",
		"latitude": 51.71567,
		"longitude": 19.43376
	},
	{
		"id": 899,
		"name": "Pabianicka-Dubois",
		"latitude": 51.71576,
		"longitude": 19.43359
	},
	{
		"id": 900,
		"name": "Pabianicka-Rudzka",
		"latitude": 51.71166,
		"longitude": 19.42889
	},
	{
		"id": 901,
		"name": "Pabianicka-Długa",
		"latitude": 51.70314,
		"longitude": 19.41792
	},
	{
		"id": 902,
		"name": "Paderewskiego-Karpacka",
		"latitude": 51.72665,
		"longitude": 19.46271
	},
	{
		"id": 903,
		"name": "Paderewskiego-Karpacka",
		"latitude": 51.72622,
		"longitude": 19.46416
	},
	{
		"id": 904,
		"name": "Paderewskiego-Karpacka",
		"latitude": 51.72608,
		"longitude": 19.46426
	},
	{
		"id": 905,
		"name": "Paderewskiego-Tuszyńska",
		"latitude": 51.72853,
		"longitude": 19.46954
	},
	{
		"id": 906,
		"name": "Paderewskiego-Karpacka",
		"latitude": 51.72697,
		"longitude": 19.46224
	},
	{
		"id": 907,
		"name": "Paderewskiego-Tuszyńska",
		"latitude": 51.72889,
		"longitude": 19.47067
	},
	{
		"id": 908,
		"name": "Paderewskiego-Rzgowska",
		"latitude": 51.73025,
		"longitude": 19.47427
	},
	{
		"id": 909,
		"name": "Rzgowska-Dachowa",
		"latitude": 51.7251,
		"longitude": 19.4805
	},
	{
		"id": 910,
		"name": "Paderewskiego-Rzgowska",
		"latitude": 51.73033,
		"longitude": 19.4742
	},
	{
		"id": 911,
		"name": "Paderewskiego-Tuszyńska",
		"latitude": 51.72892,
		"longitude": 19.4703
	},
	{
		"id": 912,
		"name": "Paderewskiego-Zaolziańska",
		"latitude": 51.7295,
		"longitude": 19.45687
	},
	{
		"id": 913,
		"name": "Paderewskiego-Karpacka",
		"latitude": 51.72673,
		"longitude": 19.46277
	},
	{
		"id": 914,
		"name": "Paderewskiego-Zaolziańska",
		"latitude": 51.72904,
		"longitude": 19.45754
	},
	{
		"id": 915,
		"name": "Paderewskiego-r. Lotników Lwowskich",
		"latitude": 51.73096,
		"longitude": 19.45388
	},
	{
		"id": 916,
		"name": "Paradna-Obszerna",
		"latitude": 51.71114,
		"longitude": 19.47285
	},
	{
		"id": 917,
		"name": "Paradna-Matek Polskich",
		"latitude": 51.70997,
		"longitude": 19.47805
	},
	{
		"id": 918,
		"name": "Matek Polskich-Sczanieckiej",
		"latitude": 51.70693,
		"longitude": 19.47572
	},
	{
		"id": 919,
		"name": "Matek Polskich-Przednia",
		"latitude": 51.7042,
		"longitude": 19.47861
	},
	{
		"id": 920,
		"name": "Matek Polskich-ICZMP szpital",
		"latitude": 51.70511,
		"longitude": 19.48213
	},
	{
		"id": 921,
		"name": "Paradna-Rzgowska",
		"latitude": 51.70927,
		"longitude": 19.48562
	},
	{
		"id": 922,
		"name": "Matek Polskich-ICZMP przychodnia",
		"latitude": 51.70851,
		"longitude": 19.48475
	},
	{
		"id": 923,
		"name": "Matek Polskich-ICZMP szpital",
		"latitude": 51.70555,
		"longitude": 19.48241
	},
	{
		"id": 924,
		"name": "Matek Polskich-Przednia",
		"latitude": 51.7043,
		"longitude": 19.47857
	},
	{
		"id": 925,
		"name": "Matek Polskich-Sczanieckiej",
		"latitude": 51.70715,
		"longitude": 19.4761
	},
	{
		"id": 926,
		"name": "Paradna-Matek Polskich",
		"latitude": 51.71025,
		"longitude": 19.4771
	},
	{
		"id": 927,
		"name": "Paradna-Obszerna",
		"latitude": 51.71089,
		"longitude": 19.47429
	},
	{
		"id": 928,
		"name": "Demokratyczna-Trybunalska",
		"latitude": 51.71177,
		"longitude": 19.46573
	},
	{
		"id": 929,
		"name": "Ustronna-Demokratyczna",
		"latitude": 51.71157,
		"longitude": 19.46589
	},
	{
		"id": 930,
		"name": "Pieniny-Giewont",
		"latitude": 51.77893,
		"longitude": 19.52723
	},
	{
		"id": 931,
		"name": "Piłsudskiego-Kilińskiego",
		"latitude": 51.76013,
		"longitude": 19.46801
	},
	{
		"id": 933,
		"name": "Tuwima-Wydawnicza",
		"latitude": 51.76722,
		"longitude": 19.48625
	},
	{
		"id": 934,
		"name": "Tuwima-Wydawnicza",
		"latitude": 51.76722,
		"longitude": 19.48637
	},
	{
		"id": 935,
		"name": "Piłsudskiego-Przędzalniana",
		"latitude": 51.76105,
		"longitude": 19.4803
	},
	{
		"id": 936,
		"name": "Piłsudskiego-Śmigłego-Rydza",
		"latitude": 51.7616,
		"longitude": 19.48609
	},
	{
		"id": 937,
		"name": "Piłsudskiego-Sarnia",
		"latitude": 51.76211,
		"longitude": 19.49434
	},
	{
		"id": 938,
		"name": "Piłsudskiego-Konstytucyjna",
		"latitude": 51.76291,
		"longitude": 19.50219
	},
	{
		"id": 939,
		"name": "Piłsudskiego-Konstytucyjna",
		"latitude": 51.76288,
		"longitude": 19.50355
	},
	{
		"id": 940,
		"name": "Piłsudskiego-Niciarniana",
		"latitude": 51.76342,
		"longitude": 19.50888
	},
	{
		"id": 941,
		"name": "Piłsudskiego-WIDZEW STADION",
		"latitude": 51.76371,
		"longitude": 19.51698
	},
	{
		"id": 942,
		"name": "Piłsudskiego-WIDZEW STADION",
		"latitude": 51.76371,
		"longitude": 19.51707
	},
	{
		"id": 943,
		"name": "Rokicińska-Maszynowa",
		"latitude": 51.76243,
		"longitude": 19.52778
	},
	{
		"id": 944,
		"name": "Piłsudskiego-WIDZEW STADION",
		"latitude": 51.76421,
		"longitude": 19.5166
	},
	{
		"id": 945,
		"name": "Rokicińska-Maszynowa",
		"latitude": 51.76218,
		"longitude": 19.52865
	},
	{
		"id": 946,
		"name": "Widzewska-Wiejska",
		"latitude": 51.76023,
		"longitude": 19.51789
	},
	{
		"id": 947,
		"name": "Piłsudskiego-Niciarniana",
		"latitude": 51.76338,
		"longitude": 19.50722
	},
	{
		"id": 948,
		"name": "Piłsudskiego-WIDZEW STADION",
		"latitude": 51.76422,
		"longitude": 19.51687
	},
	{
		"id": 949,
		"name": "Piłsudskiego-Konstytucyjna",
		"latitude": 51.76299,
		"longitude": 19.50218
	},
	{
		"id": 950,
		"name": "Piłsudskiego-Konstytucyjna",
		"latitude": 51.76314,
		"longitude": 19.50196
	},
	{
		"id": 951,
		"name": "Piłsudskiego-Sarnia",
		"latitude": 51.76225,
		"longitude": 19.49314
	},
	{
		"id": 952,
		"name": "Piłsudskiego-Sarnia",
		"latitude": 51.76235,
		"longitude": 19.4923
	},
	{
		"id": 953,
		"name": "Piłsudskiego-Śmigłego-Rydza",
		"latitude": 51.76145,
		"longitude": 19.48401
	},
	{
		"id": 954,
		"name": "Piłsudskiego-Śmigłego-Rydza",
		"latitude": 51.76192,
		"longitude": 19.48761
	},
	{
		"id": 955,
		"name": "Wydawnicza",
		"latitude": 51.76721,
		"longitude": 19.48595
	},
	{
		"id": 956,
		"name": "Piłsudskiego-Targowa",
		"latitude": 51.76071,
		"longitude": 19.47381
	},
	{
		"id": 957,
		"name": "Piłsudskiego-Kilińskiego",
		"latitude": 51.76034,
		"longitude": 19.4695
	},
	{
		"id": 958,
		"name": "Sienkiewicza-Piłsudskiego",
		"latitude": 51.75897,
		"longitude": 19.46295
	},
	{
		"id": 959,
		"name": "Piotrkowska-pl. Katedralny",
		"latitude": 51.74821,
		"longitude": 19.46115
	},
	{
		"id": 960,
		"name": "Piotrkowska-Brzeźna",
		"latitude": 51.75234,
		"longitude": 19.4602
	},
	{
		"id": 961,
		"name": "Piotrkowska-Żwirki",
		"latitude": 51.75569,
		"longitude": 19.45935
	},
	{
		"id": 962,
		"name": "Piotrkowska-pl. Katedralny",
		"latitude": 51.74972,
		"longitude": 19.46048
	},
	{
		"id": 963,
		"name": "Piotrkowska-Czerwona",
		"latitude": 51.74668,
		"longitude": 19.46116
	},
	{
		"id": 964,
		"name": "Piotrkowska-pl. Niepodległości",
		"latitude": 51.74047,
		"longitude": 19.46261
	},
	{
		"id": 965,
		"name": "Przybyszewskiego-Brzozowa",
		"latitude": 51.74399,
		"longitude": 19.4687
	},
	{
		"id": 967,
		"name": "Rewolucji 1905r.-Kamińskiego",
		"latitude": 51.77641,
		"longitude": 19.47476
	},
	{
		"id": 970,
		"name": "Zgierska-Bałucki Rynek",
		"latitude": 51.78595,
		"longitude": 19.45273
	},
	{
		"id": 972,
		"name": "Rzgowska-pl. Niepodległości",
		"latitude": 51.7394,
		"longitude": 19.4661
	},
	{
		"id": 973,
		"name": "Politechniki-Felsztyńskiego",
		"latitude": 51.74045,
		"longitude": 19.45239
	},
	{
		"id": 974,
		"name": "Bandurskiego-Wileńska",
		"latitude": 51.75384,
		"longitude": 19.42178
	},
	{
		"id": 975,
		"name": "Waltera-Janke-Wyszyńskiego",
		"latitude": 51.74658,
		"longitude": 19.41892
	},
	{
		"id": 977,
		"name": "Włókniarzy-Mickiewicza (Dw. Ł. Kali",
		"latitude": 51.75689,
		"longitude": 19.43371
	},
	{
		"id": 978,
		"name": "Pojezierska-Włókniarzy",
		"latitude": 51.799,
		"longitude": 19.42561
	},
	{
		"id": 979,
		"name": "Pojezierska-Grunwaldzka",
		"latitude": 51.79852,
		"longitude": 19.43007
	},
	{
		"id": 980,
		"name": "Zgierska-Sędziowska",
		"latitude": 51.79493,
		"longitude": 19.44573
	},
	{
		"id": 981,
		"name": "Pojezierska-Włókniarzy",
		"latitude": 51.79906,
		"longitude": 19.42638
	},
	{
		"id": 982,
		"name": "Pojezierska-Elektrociepłownia EC3",
		"latitude": 51.79959,
		"longitude": 19.4212
	},
	{
		"id": 983,
		"name": "Św. Teresy-św. Teresy 91",
		"latitude": 51.80473,
		"longitude": 19.42035
	},
	{
		"id": 984,
		"name": "Włókniarzy-św. Teresy",
		"latitude": 51.80531,
		"longitude": 19.42618
	},
	{
		"id": 985,
		"name": "Politechniki-Felsztyńskiego",
		"latitude": 51.73962,
		"longitude": 19.4524
	},
	{
		"id": 986,
		"name": "Politechniki-Wróblewskiego (kampus",
		"latitude": 51.74402,
		"longitude": 19.4514
	},
	{
		"id": 987,
		"name": "Politechniki-Wróblewskiego (kampus",
		"latitude": 51.74372,
		"longitude": 19.45157
	},
	{
		"id": 988,
		"name": "Politechniki-Radwańska (kampus PŁ)",
		"latitude": 51.75109,
		"longitude": 19.45003
	},
	{
		"id": 989,
		"name": "Rembielińskiego-Inżynierska",
		"latitude": 51.75042,
		"longitude": 19.4439
	},
	{
		"id": 991,
		"name": "Wólczańska-Skrzywana",
		"latitude": 51.74408,
		"longitude": 19.45731
	},
	{
		"id": 992,
		"name": "Politechniki-Radwańska (kampus PŁ)",
		"latitude": 51.75157,
		"longitude": 19.4497
	},
	{
		"id": 993,
		"name": "Żeromskiego-Mickiewicza",
		"latitude": 51.75734,
		"longitude": 19.44858
	},
	{
		"id": 994,
		"name": "Żeromskiego-Mickiewicza",
		"latitude": 51.75621,
		"longitude": 19.44885
	},
	{
		"id": 995,
		"name": "Radwańska-Wólczańska",
		"latitude": 51.75226,
		"longitude": 19.45508
	},
	{
		"id": 996,
		"name": "Politechniki-Wróblewskiego (kampus",
		"latitude": 51.74471,
		"longitude": 19.45106
	},
	{
		"id": 997,
		"name": "Politechniki-Felsztyńskiego",
		"latitude": 51.73961,
		"longitude": 19.45223
	},
	{
		"id": 998,
		"name": "Politechniki-Wróblewskiego (kampus",
		"latitude": 51.74498,
		"longitude": 19.45072
	},
	{
		"id": 999,
		"name": "Politechniki-Felsztyńskiego",
		"latitude": 51.739,
		"longitude": 19.4522
	},
	{
		"id": 1000,
		"name": "Politechniki-Obywatelska",
		"latitude": 51.73663,
		"longitude": 19.45261
	},
	{
		"id": 1001,
		"name": "Politechniki-r. Lotników Lwowskich",
		"latitude": 51.73229,
		"longitude": 19.4527
	},
	{
		"id": 1002,
		"name": "Politechniki-r. Lotników Lwowskich",
		"latitude": 51.7331,
		"longitude": 19.45264
	},
	{
		"id": 1003,
		"name": "Pomorska-Kilińskiego",
		"latitude": 51.77734,
		"longitude": 19.46144
	},
	{
		"id": 1004,
		"name": "Pomorska-Kamińskiego",
		"latitude": 51.77841,
		"longitude": 19.47449
	},
	{
		"id": 1005,
		"name": "Pomorska-Rondo Solidarności",
		"latitude": 51.7789,
		"longitude": 19.4801
	},
	{
		"id": 1006,
		"name": "Pomorska-Matejki",
		"latitude": 51.77859,
		"longitude": 19.48503
	},
	{
		"id": 1007,
		"name": "Pomorska-Tamka",
		"latitude": 51.77814,
		"longitude": 19.48916
	},
	{
		"id": 1008,
		"name": "Pomorska-Lumumby (kampus UŁ)",
		"latitude": 51.77753,
		"longitude": 19.4953
	},
	{
		"id": 1009,
		"name": "Pomorska-Juhasowa",
		"latitude": 51.77265,
		"longitude": 19.5437
	},
	{
		"id": 1010,
		"name": "Pomorska-Arniki",
		"latitude": 51.77165,
		"longitude": 19.55322
	},
	{
		"id": 1011,
		"name": "Pomorska-Henrykowska",
		"latitude": 51.77063,
		"longitude": 19.56315
	},
	{
		"id": 1012,
		"name": "Pomorska-Mileszki",
		"latitude": 51.77003,
		"longitude": 19.57096
	},
	{
		"id": 1013,
		"name": "Pomorska-Pomorska 466",
		"latitude": 51.77439,
		"longitude": 19.58112
	},
	{
		"id": 1014,
		"name": "Pomorska-Śródziemnomorska",
		"latitude": 51.78013,
		"longitude": 19.58829
	},
	{
		"id": 1015,
		"name": "Pomorska-Gryfa Pomorskiego",
		"latitude": 51.78453,
		"longitude": 19.58877
	},
	{
		"id": 1016,
		"name": "Pomorska-Wendy",
		"latitude": 51.78816,
		"longitude": 19.58914
	},
	{
		"id": 1017,
		"name": "Pomorska-Nowosolna",
		"latitude": 51.79319,
		"longitude": 19.58949
	},
	{
		"id": 1018,
		"name": "Pomorska-Wendy",
		"latitude": 51.78877,
		"longitude": 19.58905
	},
	{
		"id": 1019,
		"name": "Pomorska-Gryfa Pomorskiego",
		"latitude": 51.78511,
		"longitude": 19.58869
	},
	{
		"id": 1020,
		"name": "Pomorska-Śródziemnomorska",
		"latitude": 51.77987,
		"longitude": 19.58811
	},
	{
		"id": 1021,
		"name": "Pomorska-Pomorska 466",
		"latitude": 51.77405,
		"longitude": 19.58023
	},
	{
		"id": 1022,
		"name": "Pomorska-Mileszki",
		"latitude": 51.77024,
		"longitude": 19.57111
	},
	{
		"id": 1023,
		"name": "Pomorska-Henrykowska",
		"latitude": 51.77069,
		"longitude": 19.5635
	},
	{
		"id": 1024,
		"name": "Pomorska-Arniki",
		"latitude": 51.77174,
		"longitude": 19.55333
	},
	{
		"id": 1025,
		"name": "Skalna-Juhasowa",
		"latitude": 51.77415,
		"longitude": 19.54318
	},
	{
		"id": 1026,
		"name": "Pomorska-Tamka",
		"latitude": 51.77816,
		"longitude": 19.49041
	},
	{
		"id": 1027,
		"name": "Pomorska-Matejki",
		"latitude": 51.77857,
		"longitude": 19.48639
	},
	{
		"id": 1028,
		"name": "Pomorska-Rondo Solidarności",
		"latitude": 51.779,
		"longitude": 19.48012
	},
	{
		"id": 1029,
		"name": "Pomorska-Kamińskiego",
		"latitude": 51.7786,
		"longitude": 19.47519
	},
	{
		"id": 1030,
		"name": "Pomorska-Sterlinga",
		"latitude": 51.7781,
		"longitude": 19.46916
	},
	{
		"id": 1031,
		"name": "Pomorska-Kilińskiego",
		"latitude": 51.77751,
		"longitude": 19.46237
	},
	{
		"id": 1032,
		"name": "Popiełuszki-Pływacka",
		"latitude": 51.74376,
		"longitude": 19.38215
	},
	{
		"id": 1033,
		"name": "Popiełuszki-Popiełuszki 21",
		"latitude": 51.7399,
		"longitude": 19.38416
	},
	{
		"id": 1034,
		"name": "Północna-Kamińskiego",
		"latitude": 51.78044,
		"longitude": 19.47284
	},
	{
		"id": 1035,
		"name": "Kopcińskiego-rondo Solidarności",
		"latitude": 51.77812,
		"longitude": 19.48141
	},
	{
		"id": 1036,
		"name": "Północna-Kamińskiego",
		"latitude": 51.78068,
		"longitude": 19.47459
	},
	{
		"id": 1037,
		"name": "Sterlinga-Pomorska",
		"latitude": 51.77849,
		"longitude": 19.4686
	},
	{
		"id": 1038,
		"name": "Zachodnia-Legionów",
		"latitude": 51.77696,
		"longitude": 19.45198
	},
	{
		"id": 1039,
		"name": "Zachodnia-Lutomierska",
		"latitude": 51.78335,
		"longitude": 19.45033
	},
	{
		"id": 1040,
		"name": "Próchnika-Piotrkowska",
		"latitude": 51.77462,
		"longitude": 19.45469
	},
	{
		"id": 1041,
		"name": "Rewolucji 1905r.-Kilińskiego",
		"latitude": 51.77538,
		"longitude": 19.46365
	},
	{
		"id": 1042,
		"name": "Pryncypalna-Kosynierów Gdyńskich",
		"latitude": 51.72114,
		"longitude": 19.46664
	},
	{
		"id": 1043,
		"name": "Pryncypalna-Mieszkalna",
		"latitude": 51.72272,
		"longitude": 19.47068
	},
	{
		"id": 1044,
		"name": "Kongresowa-Pryncypalna",
		"latitude": 51.72353,
		"longitude": 19.47385
	},
	{
		"id": 1045,
		"name": "Pryncypalna-Kosynierów Gdyńskich",
		"latitude": 51.72129,
		"longitude": 19.46717
	},
	{
		"id": 1046,
		"name": "Pryncypalna-Mocna",
		"latitude": 51.71884,
		"longitude": 19.46035
	},
	{
		"id": 1047,
		"name": "Pryncypalna-Mieszkalna",
		"latitude": 51.72247,
		"longitude": 19.47014
	},
	{
		"id": 1048,
		"name": "Tymienieckiego-Przędzalniana",
		"latitude": 51.75413,
		"longitude": 19.48284
	},
	{
		"id": 1049,
		"name": "Przędzalniana-Tymienieckiego",
		"latitude": 51.75491,
		"longitude": 19.48369
	},
	{
		"id": 1050,
		"name": "Tuwima-Przędzalniana",
		"latitude": 51.76752,
		"longitude": 19.48039
	},
	{
		"id": 1051,
		"name": "Przędzalniana-Piłsudskiego",
		"latitude": 51.76201,
		"longitude": 19.48098
	},
	{
		"id": 1052,
		"name": "Przybyszewskiego-Kilińskiego",
		"latitude": 51.74511,
		"longitude": 19.47474
	},
	{
		"id": 1053,
		"name": "Przybyszewskiego-Śmigłego-Rydza",
		"latitude": 51.74752,
		"longitude": 19.48885
	},
	{
		"id": 1054,
		"name": "Przybyszewskiego-Tatrzańska",
		"latitude": 51.74802,
		"longitude": 19.49291
	},
	{
		"id": 1055,
		"name": "Śmigłego-Rydza-Zbaraska",
		"latitude": 51.744,
		"longitude": 19.48928
	},
	{
		"id": 1056,
		"name": "Przybyszewskiego-Zapadła",
		"latitude": 51.74876,
		"longitude": 19.49934
	},
	{
		"id": 1057,
		"name": "Przybyszewskiego-Tatrzańska",
		"latitude": 51.74804,
		"longitude": 19.49306
	},
	{
		"id": 1058,
		"name": "Przybyszewskiego-Zapadła",
		"latitude": 51.74876,
		"longitude": 19.49942
	},
	{
		"id": 1059,
		"name": "Przybyszewskiego-Nurta-Kaszyńskiego",
		"latitude": 51.74969,
		"longitude": 19.50573
	},
	{
		"id": 1060,
		"name": "Przybyszewskiego-Nurta-Kaszyńskiego",
		"latitude": 51.74971,
		"longitude": 19.5059
	},
	{
		"id": 1061,
		"name": "Przybyszewskiego-Niciarniana",
		"latitude": 51.75056,
		"longitude": 19.51352
	},
	{
		"id": 1062,
		"name": "Przybyszewskiego-Lodowa",
		"latitude": 51.75178,
		"longitude": 19.5215
	},
	{
		"id": 1064,
		"name": "Przybyszewskiego-Papiernicza (CRO)",
		"latitude": 51.75113,
		"longitude": 19.51857
	},
	{
		"id": 1065,
		"name": "Przybyszewskiego-Rondo Sybiraków",
		"latitude": 51.75248,
		"longitude": 19.52906
	},
	{
		"id": 1066,
		"name": "Przybyszewskiego-Rondo Sybiraków",
		"latitude": 51.75229,
		"longitude": 19.52898
	},
	{
		"id": 1067,
		"name": "Puszkina-Rondo Sybiraków",
		"latitude": 51.75402,
		"longitude": 19.53282
	},
	{
		"id": 1068,
		"name": "Zakładowa-Hetmańska",
		"latitude": 51.74061,
		"longitude": 19.56769
	},
	{
		"id": 1069,
		"name": "Przybyszewskiego-Czajkowskiego",
		"latitude": 51.75125,
		"longitude": 19.54102
	},
	{
		"id": 1070,
		"name": "Przybyszewskiego-Augustów",
		"latitude": 51.74922,
		"longitude": 19.54712
	},
	{
		"id": 1071,
		"name": "Przybyszewskiego-Czajkowskiego",
		"latitude": 51.75155,
		"longitude": 19.5416
	},
	{
		"id": 1072,
		"name": "Przybyszewskiego-Rondo Sybiraków",
		"latitude": 51.75291,
		"longitude": 19.52875
	},
	{
		"id": 1073,
		"name": "Przybyszewskiego-Lodowa",
		"latitude": 51.75188,
		"longitude": 19.52141
	},
	{
		"id": 1074,
		"name": "Przybyszewskiego-Lodowa",
		"latitude": 51.75188,
		"longitude": 19.52148
	},
	{
		"id": 1075,
		"name": "Przybyszewskiego-Niciarniana",
		"latitude": 51.75067,
		"longitude": 19.51348
	},
	{
		"id": 1076,
		"name": "Przybyszewskiego-Niciarniana",
		"latitude": 51.75072,
		"longitude": 19.51298
	},
	{
		"id": 1077,
		"name": "Przybyszewskiego-Nurta-Kaszyńskiego",
		"latitude": 51.74991,
		"longitude": 19.50697
	},
	{
		"id": 1078,
		"name": "Przybyszewskiego-Nurta-Kaszyńskiego",
		"latitude": 51.74992,
		"longitude": 19.50706
	},
	{
		"id": 1079,
		"name": "Przybyszewskiego-Zapadła",
		"latitude": 51.74888,
		"longitude": 19.49981
	},
	{
		"id": 1080,
		"name": "Przybyszewskiego-Zapadła",
		"latitude": 51.74889,
		"longitude": 19.49991
	},
	{
		"id": 1081,
		"name": "Przybyszewskiego-Śmigłego-Rydza",
		"latitude": 51.74774,
		"longitude": 19.4903
	},
	{
		"id": 1082,
		"name": "Przybyszewskiego-Śmigłego-Rydza",
		"latitude": 51.74775,
		"longitude": 19.49042
	},
	{
		"id": 1084,
		"name": "Przybyszewskiego-Łęczycka",
		"latitude": 51.74685,
		"longitude": 19.48314
	},
	{
		"id": 1085,
		"name": "Przybyszewskiego-Łęczycka",
		"latitude": 51.74696,
		"longitude": 19.48401
	},
	{
		"id": 1086,
		"name": "Śmigłego-Rydza-Milionowa",
		"latitude": 51.75131,
		"longitude": 19.48942
	},
	{
		"id": 1087,
		"name": "Przybyszewskiego-Kilińskiego",
		"latitude": 51.74571,
		"longitude": 19.47703
	},
	{
		"id": 1088,
		"name": "Przybyszewskiego-pl. Reymonta",
		"latitude": 51.74284,
		"longitude": 19.46251
	},
	{
		"id": 1089,
		"name": "Puszkina-Andrzejewskiej",
		"latitude": 51.74796,
		"longitude": 19.5317
	},
	{
		"id": 1090,
		"name": "Puszkina-Rondo Sybiraków",
		"latitude": 51.75359,
		"longitude": 19.53206
	},
	{
		"id": 1091,
		"name": "Puszkina-Chmielowskiego",
		"latitude": 51.7577,
		"longitude": 19.53572
	},
	{
		"id": 1092,
		"name": "Puszkina-rondo Inwalidów",
		"latitude": 51.75883,
		"longitude": 19.5365
	},
	{
		"id": 1093,
		"name": "Rokicińska-Rondo Inwalidów",
		"latitude": 51.76044,
		"longitude": 19.53874
	},
	{
		"id": 1094,
		"name": "Rokicińska-Maszynowa",
		"latitude": 51.76252,
		"longitude": 19.52783
	},
	{
		"id": 1095,
		"name": "Puszkina-Rondo Inwalidów",
		"latitude": 51.76163,
		"longitude": 19.53812
	},
	{
		"id": 1096,
		"name": "Rondo Inwalidów",
		"latitude": 51.7622,
		"longitude": 19.53754
	},
	{
		"id": 1097,
		"name": "Puszkina-Chmielowskiego",
		"latitude": 51.75776,
		"longitude": 19.53561
	},
	{
		"id": 1098,
		"name": "Puszkina-Rondo Sybiraków",
		"latitude": 51.75413,
		"longitude": 19.53236
	},
	{
		"id": 1099,
		"name": "Puszkina-Rondo Sybiraków",
		"latitude": 51.7538,
		"longitude": 19.53156
	},
	{
		"id": 1100,
		"name": "Przybyszewskiego-Rondo Sybiraków",
		"latitude": 51.7526,
		"longitude": 19.529
	},
	{
		"id": 1101,
		"name": "Puszkina-Andrzejewskiej",
		"latitude": 51.74882,
		"longitude": 19.53093
	},
	{
		"id": 1102,
		"name": "Puszkina-Dostawcza",
		"latitude": 51.74117,
		"longitude": 19.53169
	},
	{
		"id": 1103,
		"name": "Radwańska-Politechniki (kampus PŁ)",
		"latitude": 51.75166,
		"longitude": 19.44791
	},
	{
		"id": 1104,
		"name": "Kościuszki-Radwańska",
		"latitude": 51.75328,
		"longitude": 19.45737
	},
	{
		"id": 1107,
		"name": "Rataja-Gajcego",
		"latitude": 51.74824,
		"longitude": 19.62342
	},
	{
		"id": 1108,
		"name": "Rataja-Słoneczne Zacisze",
		"latitude": 51.75423,
		"longitude": 19.61653
	},
	{
		"id": 1109,
		"name": "Śląska-Lodowa",
		"latitude": 51.7275,
		"longitude": 19.51001
	},
	{
		"id": 1110,
		"name": "Śląska-Szymańskiego",
		"latitude": 51.72794,
		"longitude": 19.50495
	},
	{
		"id": 1111,
		"name": "Śląska-Lodowa",
		"latitude": 51.72753,
		"longitude": 19.50915
	},
	{
		"id": 1112,
		"name": "Śląska-Kowalszczyzna",
		"latitude": 51.72598,
		"longitude": 19.51839
	},
	{
		"id": 1113,
		"name": "Retkińska-Zagrodniki",
		"latitude": 51.74583,
		"longitude": 19.40584
	},
	{
		"id": 1114,
		"name": "Retkińska-Kusocińskiego",
		"latitude": 51.75288,
		"longitude": 19.41119
	},
	{
		"id": 1115,
		"name": "Retkińska-Kusocińskiego",
		"latitude": 51.75142,
		"longitude": 19.4098
	},
	{
		"id": 1116,
		"name": "Retkińska-Wyszyńskiego",
		"latitude": 51.74687,
		"longitude": 19.4055
	},
	{
		"id": 1117,
		"name": "Kusocińskiego-Babickiego",
		"latitude": 51.75236,
		"longitude": 19.40009
	},
	{
		"id": 1119,
		"name": "Retkińska-Zagrodniki",
		"latitude": 51.74475,
		"longitude": 19.4053
	},
	{
		"id": 1120,
		"name": "Rewolucji 1905r.-Sterlinga",
		"latitude": 51.77577,
		"longitude": 19.46772
	},
	{
		"id": 1121,
		"name": "Rojna",
		"latitude": 51.79548,
		"longitude": 19.36137
	},
	{
		"id": 1122,
		"name": "Rojna-Wici",
		"latitude": 51.79475,
		"longitude": 19.36999
	},
	{
		"id": 1123,
		"name": "Rydzowa-Lniana",
		"latitude": 51.79737,
		"longitude": 19.3756
	},
	{
		"id": 1124,
		"name": "Rojna-Rydzowa",
		"latitude": 51.79464,
		"longitude": 19.37482
	},
	{
		"id": 1126,
		"name": "Traktorowa-Nektarowa",
		"latitude": 51.78657,
		"longitude": 19.39223
	},
	{
		"id": 1127,
		"name": "Traktorowa-Grabieniec",
		"latitude": 51.79617,
		"longitude": 19.39423
	},
	{
		"id": 1128,
		"name": "Rojna-Traktorowa",
		"latitude": 51.79264,
		"longitude": 19.39183
	},
	{
		"id": 1129,
		"name": "Rojna-Kaczeńcowa",
		"latitude": 51.79369,
		"longitude": 19.38586
	},
	{
		"id": 1130,
		"name": "Rojna-Rydzowa",
		"latitude": 51.79472,
		"longitude": 19.37478
	},
	{
		"id": 1131,
		"name": "Rojna-Wici",
		"latitude": 51.79488,
		"longitude": 19.37137
	},
	{
		"id": 1132,
		"name": "Rojna-Szczecińska",
		"latitude": 51.79548,
		"longitude": 19.36184
	},
	{
		"id": 1133,
		"name": "Aleksandrowska-Szczecińska",
		"latitude": 51.80314,
		"longitude": 19.36676
	},
	{
		"id": 1134,
		"name": "Rokicińska-Rondo Inwalidów",
		"latitude": 51.7601,
		"longitude": 19.53902
	},
	{
		"id": 1135,
		"name": "Rokicińska-Lermontowa",
		"latitude": 51.75841,
		"longitude": 19.54988
	},
	{
		"id": 1136,
		"name": "Rokicińska-Lermontowa",
		"latitude": 51.75831,
		"longitude": 19.54957
	},
	{
		"id": 1137,
		"name": "Rokicińska-Augustów",
		"latitude": 51.75813,
		"longitude": 19.5524
	},
	{
		"id": 1138,
		"name": "Janów",
		"latitude": 51.75225,
		"longitude": 19.57492
	},
	{
		"id": 1140,
		"name": "Rokicińska-Lermontowa",
		"latitude": 51.75855,
		"longitude": 19.54989
	},
	{
		"id": 1141,
		"name": "Rokicińska-Rondo Inwalidów",
		"latitude": 51.76052,
		"longitude": 19.53879
	},
	{
		"id": 1142,
		"name": "Rokicińska-Rondo Inwalidów",
		"latitude": 51.76057,
		"longitude": 19.53974
	},
	{
		"id": 1145,
		"name": "Rudzka-Municypalna",
		"latitude": 51.70588,
		"longitude": 19.43341
	},
	{
		"id": 1146,
		"name": "Rudzka-Przestrzenna",
		"latitude": 51.70285,
		"longitude": 19.43737
	},
	{
		"id": 1148,
		"name": "Rudzka-Farna",
		"latitude": 51.70053,
		"longitude": 19.43845
	},
	{
		"id": 1149,
		"name": "Rudzka-Popioły",
		"latitude": 51.69766,
		"longitude": 19.44111
	},
	{
		"id": 1150,
		"name": "Rudzka-Cienista",
		"latitude": 51.69293,
		"longitude": 19.4455
	},
	{
		"id": 1153,
		"name": "Rudzka-Skrajna",
		"latitude": 51.68871,
		"longitude": 19.4528
	},
	{
		"id": 1154,
		"name": "Rudzka-Cienista",
		"latitude": 51.69319,
		"longitude": 19.44544
	},
	{
		"id": 1155,
		"name": "Rudzka-Popioły",
		"latitude": 51.69815,
		"longitude": 19.44105
	},
	{
		"id": 1156,
		"name": "Rudzka-Farna",
		"latitude": 51.70103,
		"longitude": 19.43847
	},
	{
		"id": 1157,
		"name": "Rudzka-Przestrzenna",
		"latitude": 51.70305,
		"longitude": 19.43746
	},
	{
		"id": 1158,
		"name": "Rudzka-Municypalna",
		"latitude": 51.70548,
		"longitude": 19.43418
	},
	{
		"id": 1159,
		"name": "Rudzka-Pabianicka",
		"latitude": 51.71018,
		"longitude": 19.4295
	},
	{
		"id": 1160,
		"name": "Chocianowicka-Pabianicka",
		"latitude": 51.70657,
		"longitude": 19.42184
	},
	{
		"id": 1161,
		"name": "Aleksandrowska-Szparagowa",
		"latitude": 51.80148,
		"longitude": 19.37547
	},
	{
		"id": 1162,
		"name": "Rydzowa-Lniana",
		"latitude": 51.79727,
		"longitude": 19.37524
	},
	{
		"id": 1164,
		"name": "MATEK POLSKICH",
		"latitude": 51.70356,
		"longitude": 19.48088
	},
	{
		"id": 1165,
		"name": "Rzgowska-ICZMP szpital",
		"latitude": 51.70467,
		"longitude": 19.48376
	},
	{
		"id": 1166,
		"name": "Rzgowska-Kurczaki",
		"latitude": 51.71818,
		"longitude": 19.4865
	},
	{
		"id": 1167,
		"name": "Rzgowska-Kurczaki",
		"latitude": 51.71849,
		"longitude": 19.48623
	},
	{
		"id": 1168,
		"name": "Rzgowska-cm. Rzgowska",
		"latitude": 51.7212,
		"longitude": 19.4839
	},
	{
		"id": 1169,
		"name": "Rzgowska-cm. Rzgowska",
		"latitude": 51.72124,
		"longitude": 19.48401
	},
	{
		"id": 1170,
		"name": "Rzgowska-Dachowa",
		"latitude": 51.72512,
		"longitude": 19.4806
	},
	{
		"id": 1171,
		"name": "Rzgowska-Dachowa",
		"latitude": 51.7249,
		"longitude": 19.48103
	},
	{
		"id": 1172,
		"name": "Dw. Łódź Chojny",
		"latitude": 51.72632,
		"longitude": 19.47999
	},
	{
		"id": 1173,
		"name": "Dw. Łódź Chojny",
		"latitude": 51.72646,
		"longitude": 19.48005
	},
	{
		"id": 1174,
		"name": "Dw. Łódź Chojny",
		"latitude": 51.72653,
		"longitude": 19.4802
	},
	{
		"id": 1175,
		"name": "Dw. Łódź Chojny",
		"latitude": 51.72653,
		"longitude": 19.48044
	},
	{
		"id": 1176,
		"name": "Rzgowska-Paderewskiego",
		"latitude": 51.73153,
		"longitude": 19.47409
	},
	{
		"id": 1177,
		"name": "Rzgowska-Dachowa",
		"latitude": 51.72443,
		"longitude": 19.48098
	},
	{
		"id": 1178,
		"name": "Rzgowska-Lecznicza",
		"latitude": 51.73413,
		"longitude": 19.47151
	},
	{
		"id": 1179,
		"name": "Rzgowska-Lecznicza",
		"latitude": 51.73407,
		"longitude": 19.47157
	},
	{
		"id": 1180,
		"name": "Rzgowska-Dąbrowskiego",
		"latitude": 51.73839,
		"longitude": 19.46718
	},
	{
		"id": 1181,
		"name": "Rzgowska-Dąbrowskiego",
		"latitude": 51.73802,
		"longitude": 19.46754
	},
	{
		"id": 1182,
		"name": "Rzgowska-Paderewskiego",
		"latitude": 51.73084,
		"longitude": 19.47452
	},
	{
		"id": 1183,
		"name": "Rzgowska-cm. Rzgowska",
		"latitude": 51.72107,
		"longitude": 19.48385
	},
	{
		"id": 1184,
		"name": "Rzgowska-cm. Rzgowska",
		"latitude": 51.72048,
		"longitude": 19.48402
	},
	{
		"id": 1185,
		"name": "Rzgowska-Kurczaki",
		"latitude": 51.71727,
		"longitude": 19.485
	},
	{
		"id": 1186,
		"name": "Strażacka-Rzgowska",
		"latitude": 51.71779,
		"longitude": 19.48312
	},
	{
		"id": 1187,
		"name": "Rzgowska-św. Wojciecha",
		"latitude": 51.71411,
		"longitude": 19.48626
	},
	{
		"id": 1188,
		"name": "Paradna-Rzgowska",
		"latitude": 51.70944,
		"longitude": 19.48709
	},
	{
		"id": 1189,
		"name": "Rzgowska-Paradna",
		"latitude": 51.70849,
		"longitude": 19.48671
	},
	{
		"id": 1190,
		"name": "Rzgowska-ICZMP szpital",
		"latitude": 51.70342,
		"longitude": 19.48203
	},
	{
		"id": 1191,
		"name": "Rzgowska-Zagłoby",
		"latitude": 51.69873,
		"longitude": 19.47891
	},
	{
		"id": 1192,
		"name": "Ustronna",
		"latitude": 51.69995,
		"longitude": 19.47268
	},
	{
		"id": 1193,
		"name": "Graniczna-Graniczna 62",
		"latitude": 51.69723,
		"longitude": 19.46874
	},
	{
		"id": 1195,
		"name": "Centrum Handlowe PTAK",
		"latitude": 51.64719,
		"longitude": 19.49029
	},
	{
		"id": 1197,
		"name": "Sanitariuszek-Dw. Łódź Lublinek",
		"latitude": 51.71896,
		"longitude": 19.35936
	},
	{
		"id": 1198,
		"name": "Sanitariuszek-Biwakowa",
		"latitude": 51.72331,
		"longitude": 19.35439
	},
	{
		"id": 1199,
		"name": "Sanitariuszek-Dw. Łódź Lublinek",
		"latitude": 51.71919,
		"longitude": 19.35885
	},
	{
		"id": 1200,
		"name": "Sanitariuszek-Łaskowice",
		"latitude": 51.71337,
		"longitude": 19.36578
	},
	{
		"id": 1201,
		"name": "Sienkiewicza-Piłsudskiego",
		"latitude": 51.75819,
		"longitude": 19.4634
	},
	{
		"id": 1202,
		"name": "Wigury-Kilińskiego",
		"latitude": 51.75721,
		"longitude": 19.46886
	},
	{
		"id": 1203,
		"name": "Sienkiewicza-park Sienkiewicza",
		"latitude": 51.76444,
		"longitude": 19.46201
	},
	{
		"id": 1204,
		"name": "Sienkiewicza-Narutowicza",
		"latitude": 51.76979,
		"longitude": 19.46088
	},
	{
		"id": 1205,
		"name": "Sienkiewicza-Pogotowie Ratunkowe",
		"latitude": 51.75482,
		"longitude": 19.46384
	},
	{
		"id": 1206,
		"name": "Tymienieckiego-Kilińskiego",
		"latitude": 51.75132,
		"longitude": 19.47229
	},
	{
		"id": 1207,
		"name": "Sikorskiego-Nastrojowa",
		"latitude": 51.81751,
		"longitude": 19.44491
	},
	{
		"id": 1208,
		"name": "Sikorskiego-Nastrojowa",
		"latitude": 51.81753,
		"longitude": 19.44367
	},
	{
		"id": 1209,
		"name": "Sikorskiego-Studzińskiego",
		"latitude": 51.81641,
		"longitude": 19.43961
	},
	{
		"id": 1210,
		"name": "Zgierska-Sikorskiego",
		"latitude": 51.81485,
		"longitude": 19.43439
	},
	{
		"id": 1211,
		"name": "Skalna-Kasprowy Wierch",
		"latitude": 51.77528,
		"longitude": 19.53609
	},
	{
		"id": 1212,
		"name": "Zbocze-Potokowa",
		"latitude": 51.77654,
		"longitude": 19.53094
	},
	{
		"id": 1216,
		"name": "Skłodowskiej-Curie-Żeromskiego",
		"latitude": 51.76333,
		"longitude": 19.44696
	},
	{
		"id": 1217,
		"name": "Skłodowskiej-Curie-Gdańska",
		"latitude": 51.76452,
		"longitude": 19.45129
	},
	{
		"id": 1218,
		"name": "Skrzydlata-Kasztelańska",
		"latitude": 51.8132,
		"longitude": 19.47327
	},
	{
		"id": 1219,
		"name": "Skrzydlata-Żucza",
		"latitude": 51.81798,
		"longitude": 19.47369
	},
	{
		"id": 1220,
		"name": "Arturówek",
		"latitude": 51.82136,
		"longitude": 19.47432
	},
	{
		"id": 1221,
		"name": "Skrzydlata-Żucza",
		"latitude": 51.8181,
		"longitude": 19.47364
	},
	{
		"id": 1222,
		"name": "Skrzydlata-Kasztelańska",
		"latitude": 51.81366,
		"longitude": 19.4731
	},
	{
		"id": 1224,
		"name": "Warszawska-Centralna",
		"latitude": 51.81052,
		"longitude": 19.48006
	},
	{
		"id": 1225,
		"name": "Solec-Borowa",
		"latitude": 51.77821,
		"longitude": 19.41123
	},
	{
		"id": 1227,
		"name": "Sporna-Wojska Polskiego",
		"latitude": 51.78953,
		"longitude": 19.47904
	},
	{
		"id": 1228,
		"name": "Sporna-Bracka",
		"latitude": 51.79253,
		"longitude": 19.47822
	},
	{
		"id": 1229,
		"name": "Inflancka-Zagajnikowa",
		"latitude": 51.80034,
		"longitude": 19.47623
	},
	{
		"id": 1230,
		"name": "Sporna-Bracka",
		"latitude": 51.79198,
		"longitude": 19.47811
	},
	{
		"id": 1231,
		"name": "Wojska Polskiego-Sporna",
		"latitude": 51.78883,
		"longitude": 19.4778
	},
	{
		"id": 1233,
		"name": "Srebrzyńska-Jarzynowa",
		"latitude": 51.77445,
		"longitude": 19.40852
	},
	{
		"id": 1234,
		"name": "Srebrzyńska-Unii Lubelskiej",
		"latitude": 51.77286,
		"longitude": 19.41693
	},
	{
		"id": 1235,
		"name": "Konstantynowska-Unii Lubelskiej",
		"latitude": 51.76743,
		"longitude": 19.42192
	},
	{
		"id": 1236,
		"name": "Bandurskiego-Atlas Arena",
		"latitude": 51.75602,
		"longitude": 19.42649
	},
	{
		"id": 1237,
		"name": "Unii Lubelskiej-Praussa",
		"latitude": 51.77611,
		"longitude": 19.41564
	},
	{
		"id": 1238,
		"name": "Srebrzyńska-Koziny",
		"latitude": 51.77269,
		"longitude": 19.42252
	},
	{
		"id": 1239,
		"name": "Srebrzyńska-Koziny",
		"latitude": 51.77256,
		"longitude": 19.42316
	},
	{
		"id": 1240,
		"name": "Srebrzyńska-Kasprzaka",
		"latitude": 51.77335,
		"longitude": 19.42696
	},
	{
		"id": 1241,
		"name": "Srebrzyńska-cm. Ogrodowa",
		"latitude": 51.77544,
		"longitude": 19.43576
	},
	{
		"id": 1242,
		"name": "Srebrzyńska-Unii Lubelskiej",
		"latitude": 51.77312,
		"longitude": 19.41615
	},
	{
		"id": 1243,
		"name": "Srebrzyńska-Jarzynowa",
		"latitude": 51.77436,
		"longitude": 19.40966
	},
	{
		"id": 1244,
		"name": "Srebrzyńska-cm. Mania",
		"latitude": 51.77573,
		"longitude": 19.40622
	},
	{
		"id": 1245,
		"name": "Żeromskiego-pl. Barlickiego",
		"latitude": 51.76897,
		"longitude": 19.44619
	},
	{
		"id": 1246,
		"name": "Struga-Pogonowskiego",
		"latitude": 51.76445,
		"longitude": 19.4439
	},
	{
		"id": 1247,
		"name": "Struga-Żeligowskiego",
		"latitude": 51.76419,
		"longitude": 19.44078
	},
	{
		"id": 1248,
		"name": "Łąkowa-Karolewska",
		"latitude": 51.76138,
		"longitude": 19.44119
	},
	{
		"id": 1249,
		"name": "Palki-Smutna",
		"latitude": 51.78797,
		"longitude": 19.485
	},
	{
		"id": 1250,
		"name": "Doły-Telefoniczna",
		"latitude": 51.78374,
		"longitude": 19.49129
	},
	{
		"id": 1251,
		"name": "Telefoniczna-Bystrzycka",
		"latitude": 51.78299,
		"longitude": 19.49318
	},
	{
		"id": 1252,
		"name": "Palki-Wojska Polskiego",
		"latitude": 51.79018,
		"longitude": 19.48696
	},
	{
		"id": 1253,
		"name": "Wojska Polskiego-Palki",
		"latitude": 51.7908,
		"longitude": 19.48593
	},
	{
		"id": 1254,
		"name": "Strykowska-Inflancka",
		"latitude": 51.79712,
		"longitude": 19.48812
	},
	{
		"id": 1255,
		"name": "Wojska Polskiego-Łomnicka",
		"latitude": 51.79364,
		"longitude": 19.49483
	},
	{
		"id": 1256,
		"name": "Strykowska-Kwarcowa",
		"latitude": 51.80269,
		"longitude": 19.4934
	},
	{
		"id": 1257,
		"name": "Strykowska-Opolska",
		"latitude": 51.80679,
		"longitude": 19.49946
	},
	{
		"id": 1258,
		"name": "Strykowska-Herbowa",
		"latitude": 51.81256,
		"longitude": 19.50316
	},
	{
		"id": 1259,
		"name": "Strykowska-Łodzianka",
		"latitude": 51.82496,
		"longitude": 19.51999
	},
	{
		"id": 1260,
		"name": "Strykowska-Okólna",
		"latitude": 51.82981,
		"longitude": 19.53105
	},
	{
		"id": 1261,
		"name": "Strykowska-Jana i Cecylii",
		"latitude": 51.83445,
		"longitude": 19.5416
	},
	{
		"id": 1262,
		"name": "Strykowska-Strykowska 241",
		"latitude": 51.83826,
		"longitude": 19.5503
	},
	{
		"id": 1263,
		"name": "Strykowska-Imielnik Nowy",
		"latitude": 51.84252,
		"longitude": 19.55847
	},
	{
		"id": 1265,
		"name": "Strykowska-Strykowska 241",
		"latitude": 51.83812,
		"longitude": 19.54956
	},
	{
		"id": 1267,
		"name": "Strykowska-Jana i Cecylii",
		"latitude": 51.83428,
		"longitude": 19.54079
	},
	{
		"id": 1268,
		"name": "Strykowska-Okólna",
		"latitude": 51.8296,
		"longitude": 19.53017
	},
	{
		"id": 1269,
		"name": "Strykowska-Łodzianka",
		"latitude": 51.82586,
		"longitude": 19.52156
	},
	{
		"id": 1270,
		"name": "Strykowska-Rogowska",
		"latitude": 51.81945,
		"longitude": 19.50694
	},
	{
		"id": 1271,
		"name": "Strykowska-Opolska",
		"latitude": 51.80702,
		"longitude": 19.49948
	},
	{
		"id": 1272,
		"name": "Strykowska-Kwarcowa",
		"latitude": 51.80264,
		"longitude": 19.49294
	},
	{
		"id": 1273,
		"name": "Palki-Wojska Polskiego",
		"latitude": 51.79037,
		"longitude": 19.4865
	},
	{
		"id": 1274,
		"name": "Doły",
		"latitude": 51.79719,
		"longitude": 19.48762
	},
	{
		"id": 1275,
		"name": "Doły",
		"latitude": 51.79705,
		"longitude": 19.48751
	},
	{
		"id": 1276,
		"name": "Wojska Polskiego-Palki",
		"latitude": 51.79142,
		"longitude": 19.48655
	},
	{
		"id": 1277,
		"name": "Palki-Smutna",
		"latitude": 51.78735,
		"longitude": 19.48393
	},
	{
		"id": 1278,
		"name": "Palki-Źródłowa",
		"latitude": 51.78026,
		"longitude": 19.4821
	},
	{
		"id": 1279,
		"name": "Uniwersytecka-rondo Solidarności",
		"latitude": 51.77854,
		"longitude": 19.48004
	},
	{
		"id": 1280,
		"name": "Pomorska-rondo Solidarności",
		"latitude": 51.77889,
		"longitude": 19.48242
	},
	{
		"id": 1281,
		"name": "Szczecińska-św. Teresy",
		"latitude": 51.81208,
		"longitude": 19.37754
	},
	{
		"id": 1282,
		"name": "Cm. Szczecińska",
		"latitude": 51.81685,
		"longitude": 19.382
	},
	{
		"id": 1284,
		"name": "Szczecińska-św. Teresy",
		"latitude": 51.81278,
		"longitude": 19.37814
	},
	{
		"id": 1285,
		"name": "Św. Teresy-Kaczeńcowa",
		"latitude": 51.80944,
		"longitude": 19.3907
	},
	{
		"id": 1286,
		"name": "Św. Teresy-św. Teresy 109",
		"latitude": 51.81119,
		"longitude": 19.38246
	},
	{
		"id": 1287,
		"name": "Wersalska-Szczecińska",
		"latitude": 51.80956,
		"longitude": 19.37788
	},
	{
		"id": 1288,
		"name": "Wersalska-Wersalska 47",
		"latitude": 51.80868,
		"longitude": 19.37941
	},
	{
		"id": 1289,
		"name": "Szparagowa-Aleksandrowska",
		"latitude": 51.80247,
		"longitude": 19.37736
	},
	{
		"id": 1290,
		"name": "Rydzowa-Aleksandrowska",
		"latitude": 51.8008,
		"longitude": 19.37577
	},
	{
		"id": 1291,
		"name": "Aleksandrowska-Rydzowa",
		"latitude": 51.80088,
		"longitude": 19.37717
	},
	{
		"id": 1292,
		"name": "Śląska-Szymańskiego",
		"latitude": 51.72788,
		"longitude": 19.5044
	},
	{
		"id": 1293,
		"name": "Śląska-Kruczkowskiego",
		"latitude": 51.72797,
		"longitude": 19.49877
	},
	{
		"id": 1294,
		"name": "Kruczkowskiego-Felińskiego",
		"latitude": 51.73174,
		"longitude": 19.49712
	},
	{
		"id": 1295,
		"name": "Śmigłego-Rydza-Przybyszewskiego",
		"latitude": 51.74716,
		"longitude": 19.48983
	},
	{
		"id": 1296,
		"name": "Śmigłego-Rydza-Zbiorcza",
		"latitude": 51.75817,
		"longitude": 19.48806
	},
	{
		"id": 1297,
		"name": "Śmigłego-Rydza-Zbiorcza",
		"latitude": 51.75819,
		"longitude": 19.48831
	},
	{
		"id": 1298,
		"name": "Kopcińskiego-Piłsudskiego",
		"latitude": 51.76215,
		"longitude": 19.48493
	},
	{
		"id": 1300,
		"name": "Śmigłego-Rydza-Zbiorcza",
		"latitude": 51.75802,
		"longitude": 19.48776
	},
	{
		"id": 1302,
		"name": "Śmigłego-Rydza-Milionowa",
		"latitude": 51.75219,
		"longitude": 19.4893
	},
	{
		"id": 1303,
		"name": "Śmigłego-Rydza-Przybyszewskiego",
		"latitude": 51.74833,
		"longitude": 19.48954
	},
	{
		"id": 1305,
		"name": "Śmigłego-Rydza-Dąbrowskiego",
		"latitude": 51.73797,
		"longitude": 19.48892
	},
	{
		"id": 1306,
		"name": "Śmigłego-Rydza-Broniewskiego",
		"latitude": 51.73341,
		"longitude": 19.48888
	},
	{
		"id": 1307,
		"name": "Świtezianki-Syrenki",
		"latitude": 51.82184,
		"longitude": 19.4481
	},
	{
		"id": 1308,
		"name": "Świtezianki-Sikorskiego",
		"latitude": 51.81895,
		"longitude": 19.44834
	},
	{
		"id": 1309,
		"name": "Tatrzańska-Grota-Roweckiego",
		"latitude": 51.74397,
		"longitude": 19.49465
	},
	{
		"id": 1310,
		"name": "Tatrzańska-Grota-Roweckiego",
		"latitude": 51.74328,
		"longitude": 19.49459
	},
	{
		"id": 1311,
		"name": "Tatrzańska-Dąbrowskiego",
		"latitude": 51.73776,
		"longitude": 19.49464
	},
	{
		"id": 1312,
		"name": "Telefoniczna- ET-1",
		"latitude": 51.78292,
		"longitude": 19.50991
	},
	{
		"id": 1313,
		"name": "Telefoniczna-Telefoniczna (Zaj.MPK)",
		"latitude": 51.78208,
		"longitude": 19.51026
	},
	{
		"id": 1314,
		"name": "działki-Telefoniczna pętla",
		"latitude": 51.78135,
		"longitude": 19.50662
	},
	{
		"id": 1315,
		"name": "Telefoniczna-Chmurna",
		"latitude": 51.78206,
		"longitude": 19.51324
	},
	{
		"id": 1316,
		"name": "Telefoniczna-Weselna",
		"latitude": 51.78318,
		"longitude": 19.51973
	},
	{
		"id": 1317,
		"name": "Telefoniczna-Chmurna",
		"latitude": 51.78209,
		"longitude": 19.51328
	},
	{
		"id": 1318,
		"name": "Telefoniczna-Weselna",
		"latitude": 51.78329,
		"longitude": 19.52108
	},
	{
		"id": 1319,
		"name": "Telefoniczna-Pieniny",
		"latitude": 51.78293,
		"longitude": 19.52561
	},
	{
		"id": 1320,
		"name": "Telefoniczna-Pieniny",
		"latitude": 51.78287,
		"longitude": 19.52526
	},
	{
		"id": 1322,
		"name": "Stoki",
		"latitude": 51.78252,
		"longitude": 19.52927
	},
	{
		"id": 1323,
		"name": "Telefoniczna-Pieniny",
		"latitude": 51.78297,
		"longitude": 19.52561
	},
	{
		"id": 1324,
		"name": "Telefoniczna-Weselna",
		"latitude": 51.78329,
		"longitude": 19.51963
	},
	{
		"id": 1325,
		"name": "Telefoniczna-Chmurna",
		"latitude": 51.7824,
		"longitude": 19.51523
	},
	{
		"id": 1326,
		"name": "Telefoniczna-Chmurna",
		"latitude": 51.78233,
		"longitude": 19.51511
	},
	{
		"id": 1327,
		"name": "Telefoniczna-zajezdnia MPK",
		"latitude": 51.78217,
		"longitude": 19.50976
	},
	{
		"id": 1328,
		"name": "Telefoniczna",
		"latitude": 51.78324,
		"longitude": 19.50966
	},
	{
		"id": 1329,
		"name": "Telefoniczna-Telefoniczna 27",
		"latitude": 51.78267,
		"longitude": 19.50416
	},
	{
		"id": 1330,
		"name": "Św. Teresy-Traktorowa",
		"latitude": 51.80826,
		"longitude": 19.3954
	},
	{
		"id": 1331,
		"name": "Traktorowa-Ludowa",
		"latitude": 51.80624,
		"longitude": 19.39569
	},
	{
		"id": 1332,
		"name": "Św. Teresy-Brukowa",
		"latitude": 51.80599,
		"longitude": 19.41279
	},
	{
		"id": 1333,
		"name": "Św. Teresy-św. Teresy 109",
		"latitude": 51.81114,
		"longitude": 19.38373
	},
	{
		"id": 1334,
		"name": "Św. Teresy-Szczecińska",
		"latitude": 51.81214,
		"longitude": 19.3795
	},
	{
		"id": 1335,
		"name": "Cm. Szczecińska",
		"latitude": 51.81691,
		"longitude": 19.38188
	},
	{
		"id": 1336,
		"name": "Cm. Szczecińska",
		"latitude": 51.81694,
		"longitude": 19.38179
	},
	{
		"id": 1337,
		"name": "Cm. Szczecińska",
		"latitude": 51.81703,
		"longitude": 19.38162
	},
	{
		"id": 1338,
		"name": "Tomaszowska-Olechowska",
		"latitude": 51.72782,
		"longitude": 19.53455
	},
	{
		"id": 1339,
		"name": "Tomaszowska-Ofiar Terroryzmu 11 Wrz",
		"latitude": 51.72461,
		"longitude": 19.53774
	},
	{
		"id": 1340,
		"name": "al. Ofiar Terroryzmu 11 Września-To",
		"latitude": 51.72557,
		"longitude": 19.53913
	},
	{
		"id": 1341,
		"name": "Tomaszowska-Jędrzejowska",
		"latitude": 51.72057,
		"longitude": 19.53967
	},
	{
		"id": 1342,
		"name": "Tomaszowska-Małego Rycerza",
		"latitude": 51.71608,
		"longitude": 19.54182
	},
	{
		"id": 1343,
		"name": "Tomaszowska-Jędrzejowska",
		"latitude": 51.72018,
		"longitude": 19.54005
	},
	{
		"id": 1344,
		"name": "Tomaszowska-Ofiar Terroryzmu 11 Wrz",
		"latitude": 51.72588,
		"longitude": 19.53685
	},
	{
		"id": 1345,
		"name": "Tomaszowska-Olechowska",
		"latitude": 51.7274,
		"longitude": 19.5352
	},
	{
		"id": 1346,
		"name": "Traktorowa-Nektarowa",
		"latitude": 51.78712,
		"longitude": 19.39259
	},
	{
		"id": 1347,
		"name": "Traktorowa-Duńska",
		"latitude": 51.80196,
		"longitude": 19.39519
	},
	{
		"id": 1348,
		"name": "Traktorowa-Ludowa",
		"latitude": 51.80397,
		"longitude": 19.39553
	},
	{
		"id": 1349,
		"name": "Traktorowa-św. Teresy",
		"latitude": 51.80772,
		"longitude": 19.39626
	},
	{
		"id": 1350,
		"name": "Traktorowa-Duńska",
		"latitude": 51.80127,
		"longitude": 19.39477
	},
	{
		"id": 1351,
		"name": "Traktorowa-Rąbieńska",
		"latitude": 51.78322,
		"longitude": 19.39157
	},
	{
		"id": 1352,
		"name": "Złotno-Siewna",
		"latitude": 51.77925,
		"longitude": 19.39842
	},
	{
		"id": 1353,
		"name": "Trybunalska-Kwietniowa",
		"latitude": 51.71491,
		"longitude": 19.46653
	},
	{
		"id": 1354,
		"name": "Trybunalska-Kosynierów Gdyńskich",
		"latitude": 51.71828,
		"longitude": 19.46806
	},
	{
		"id": 1355,
		"name": "Kosynierów Gdyńskich-Łazowskiego",
		"latitude": 51.71661,
		"longitude": 19.47264
	},
	{
		"id": 1357,
		"name": "Tuwima-Wydawnicza",
		"latitude": 51.76722,
		"longitude": 19.48615
	},
	{
		"id": 1358,
		"name": "Tuwima-Kopcińskiego",
		"latitude": 51.76781,
		"longitude": 19.48317
	},
	{
		"id": 1359,
		"name": "Przędzalniana-Nawrot",
		"latitude": 51.76398,
		"longitude": 19.48051
	},
	{
		"id": 1360,
		"name": "Tuwima-Wysoka",
		"latitude": 51.76734,
		"longitude": 19.47834
	},
	{
		"id": 1361,
		"name": "Tuwima-Targowa Planetarium",
		"latitude": 51.76679,
		"longitude": 19.47209
	},
	{
		"id": 1362,
		"name": "Tuwima-Kilińskiego EC1 Zach.",
		"latitude": 51.7664,
		"longitude": 19.46674
	},
	{
		"id": 1363,
		"name": "Tymienieckiego-ŁSSE",
		"latitude": 51.75315,
		"longitude": 19.47942
	},
	{
		"id": 1364,
		"name": "Tymienieckiego-ŁSSE",
		"latitude": 51.75319,
		"longitude": 19.47913
	},
	{
		"id": 1365,
		"name": "Tymienieckiego-Kilińskiego",
		"latitude": 51.75134,
		"longitude": 19.47181
	},
	{
		"id": 1366,
		"name": "Tymienieckiego-Sienkiewicza",
		"latitude": 51.74956,
		"longitude": 19.46476
	},
	{
		"id": 1367,
		"name": "Unii Lubelskiej-Srebrzyńska",
		"latitude": 51.77317,
		"longitude": 19.41752
	},
	{
		"id": 1368,
		"name": "Unii Lubelskiej-Srebrzyńska",
		"latitude": 51.77335,
		"longitude": 19.41716
	},
	{
		"id": 1369,
		"name": "Uniwersytecka-Rewolucji 1905 r.",
		"latitude": 51.77579,
		"longitude": 19.4768
	},
	{
		"id": 1370,
		"name": "Warszawska-Deczyńskiego",
		"latitude": 51.80496,
		"longitude": 19.46735
	},
	{
		"id": 1371,
		"name": "Warszawska-Skrzydlata",
		"latitude": 51.80757,
		"longitude": 19.47335
	},
	{
		"id": 1372,
		"name": "Warszawska-Słowicza",
		"latitude": 51.80948,
		"longitude": 19.47774
	},
	{
		"id": 1373,
		"name": "Warszawska-Centralna",
		"latitude": 51.81054,
		"longitude": 19.48022
	},
	{
		"id": 1374,
		"name": "Warszawska-Wycieczkowa",
		"latitude": 51.81325,
		"longitude": 19.48666
	},
	{
		"id": 1375,
		"name": "Warszawska-Wycieczkowa",
		"latitude": 51.81313,
		"longitude": 19.48615
	},
	{
		"id": 1376,
		"name": "Warszawska-Centralna",
		"latitude": 51.81075,
		"longitude": 19.48009
	},
	{
		"id": 1377,
		"name": "Warszawska-Centralna",
		"latitude": 51.8106,
		"longitude": 19.48016
	},
	{
		"id": 1378,
		"name": "Warszawska-Słowicza",
		"latitude": 51.80948,
		"longitude": 19.47753
	},
	{
		"id": 1379,
		"name": "Warszawska-Skrzydlata",
		"latitude": 51.80784,
		"longitude": 19.47328
	},
	{
		"id": 1380,
		"name": "Warszawska-Skrzydlata",
		"latitude": 51.80762,
		"longitude": 19.4733
	},
	{
		"id": 1381,
		"name": "Warszawska-Deczyńskiego",
		"latitude": 51.80539,
		"longitude": 19.46815
	},
	{
		"id": 1382,
		"name": "Warszawska-Deczyńskiego",
		"latitude": 51.8055,
		"longitude": 19.46815
	},
	{
		"id": 1383,
		"name": "Warszawska-Irysowa",
		"latitude": 51.80309,
		"longitude": 19.46285
	},
	{
		"id": 1384,
		"name": "Wedmanowej-Dąbrowskiego",
		"latitude": 51.73492,
		"longitude": 19.51522
	},
	{
		"id": 1385,
		"name": "Wedmanowej-Lodowa",
		"latitude": 51.73026,
		"longitude": 19.51208
	},
	{
		"id": 1386,
		"name": "Wersalska-Wersalska 47",
		"latitude": 51.80848,
		"longitude": 19.37936
	},
	{
		"id": 1387,
		"name": "Wersalska-Szczecińska",
		"latitude": 51.81058,
		"longitude": 19.37672
	},
	{
		"id": 1395,
		"name": "Wiączyńska-Autostrada A1",
		"latitude": 51.7814,
		"longitude": 19.60534
	},
	{
		"id": 1396,
		"name": "Wiączyńska-Wiączyńska 16",
		"latitude": 51.78852,
		"longitude": 19.59657
	},
	{
		"id": 1397,
		"name": "Wiączyńska-Wiączyńska 32",
		"latitude": 51.78374,
		"longitude": 19.60284
	},
	{
		"id": 1398,
		"name": "Wiączyńska-Autostrada A1",
		"latitude": 51.78093,
		"longitude": 19.60537
	},
	{
		"id": 1399,
		"name": "Wiączyńska-Wiączyńska 32",
		"latitude": 51.78349,
		"longitude": 19.60338
	},
	{
		"id": 1400,
		"name": "Wiączyńska-Wiączyńska 16",
		"latitude": 51.78879,
		"longitude": 19.59641
	},
	{
		"id": 1401,
		"name": "Wiączyńska-Nowosolna",
		"latitude": 51.79365,
		"longitude": 19.59004
	},
	{
		"id": 1402,
		"name": "Wielkopolska-Pułaskiego",
		"latitude": 51.79089,
		"longitude": 19.41711
	},
	{
		"id": 1404,
		"name": "Woronicza-Dw. Łódź Żabieniec",
		"latitude": 51.79428,
		"longitude": 19.40719
	},
	{
		"id": 1405,
		"name": "Żeromskiego-pl. Barlickiego",
		"latitude": 51.76902,
		"longitude": 19.44605
	},
	{
		"id": 1406,
		"name": "Więckowskiego-Pogonowskiego",
		"latitude": 51.77158,
		"longitude": 19.44314
	},
	{
		"id": 1407,
		"name": "Więckowskiego-Żeligowskiego",
		"latitude": 51.76975,
		"longitude": 19.43693
	},
	{
		"id": 1408,
		"name": "Maratońska-Wróblewskiego",
		"latitude": 51.74842,
		"longitude": 19.42868
	},
	{
		"id": 1409,
		"name": "Jana Pawła II-Wróblewskiego",
		"latitude": 51.74556,
		"longitude": 19.4406
	},
	{
		"id": 1410,
		"name": "Jana Pawła II-Łaska",
		"latitude": 51.74929,
		"longitude": 19.43797
	},
	{
		"id": 1411,
		"name": "Dw. Łódź Kaliska",
		"latitude": 51.75685,
		"longitude": 19.43097
	},
	{
		"id": 1412,
		"name": "Włókniarzy-Legionów",
		"latitude": 51.76827,
		"longitude": 19.42614
	},
	{
		"id": 1414,
		"name": "Włókniarzy-Długosza",
		"latitude": 51.77746,
		"longitude": 19.42132
	},
	{
		"id": 1415,
		"name": "Włókniarzy-Żubardzka",
		"latitude": 51.78525,
		"longitude": 19.42132
	},
	{
		"id": 1416,
		"name": "Włókniarzy-Wielkopolska",
		"latitude": 51.7893,
		"longitude": 19.42114
	},
	{
		"id": 1418,
		"name": "Włókniarzy-Legionów",
		"latitude": 51.76787,
		"longitude": 19.42594
	},
	{
		"id": 1420,
		"name": "Włókniarzy-Żubardzka",
		"latitude": 51.78567,
		"longitude": 19.42116
	},
	{
		"id": 1421,
		"name": "Włókniarzy-Długosza",
		"latitude": 51.77769,
		"longitude": 19.42122
	},
	{
		"id": 1422,
		"name": "Włókniarzy-Koziny",
		"latitude": 51.77216,
		"longitude": 19.4218
	},
	{
		"id": 1423,
		"name": "Włókniarzy-Legionów",
		"latitude": 51.76823,
		"longitude": 19.42604
	},
	{
		"id": 1424,
		"name": "Włókniarzy-Karolewska (Dw. Łódź Kal",
		"latitude": 51.75817,
		"longitude": 19.43343
	},
	{
		"id": 1425,
		"name": "Jana Pawła II-Łaska",
		"latitude": 51.74965,
		"longitude": 19.43713
	},
	{
		"id": 1426,
		"name": "Jana Pawła II-Wróblewskiego",
		"latitude": 51.7457,
		"longitude": 19.43994
	},
	{
		"id": 1427,
		"name": "Jana Pawła II-Rogozińskiego",
		"latitude": 51.73213,
		"longitude": 19.44177
	},
	{
		"id": 1428,
		"name": "Wojska Polskiego-Franciszkańska",
		"latitude": 51.7845,
		"longitude": 19.45969
	},
	{
		"id": 1429,
		"name": "Wojska Polskiego-Głowackiego",
		"latitude": 51.78729,
		"longitude": 19.47201
	},
	{
		"id": 1430,
		"name": "Wojska Polskiego-Sporna",
		"latitude": 51.78893,
		"longitude": 19.47825
	},
	{
		"id": 1431,
		"name": "Wojska Polskiego-Palki",
		"latitude": 51.79079,
		"longitude": 19.48592
	},
	{
		"id": 1432,
		"name": "Wojska Polskiego-Palki",
		"latitude": 51.79146,
		"longitude": 19.48687
	},
	{
		"id": 1433,
		"name": "Śnieżna-Brzezińska",
		"latitude": 51.79506,
		"longitude": 19.50365
	},
	{
		"id": 1434,
		"name": "Wojska Polskiego-Sporna",
		"latitude": 51.78937,
		"longitude": 19.47956
	},
	{
		"id": 1435,
		"name": "Wojska Polskiego-Głowackiego",
		"latitude": 51.78732,
		"longitude": 19.47159
	},
	{
		"id": 1436,
		"name": "Wojska Polskiego-Marynarska",
		"latitude": 51.7858,
		"longitude": 19.46567
	},
	{
		"id": 1437,
		"name": "Wojska Polskiego-Marynarska",
		"latitude": 51.78567,
		"longitude": 19.46541
	},
	{
		"id": 1438,
		"name": "Wojska Polskiego-Franciszkańska",
		"latitude": 51.7848,
		"longitude": 19.46083
	},
	{
		"id": 1439,
		"name": "Wojska Polskiego-Franciszkańska",
		"latitude": 51.78484,
		"longitude": 19.46085
	},
	{
		"id": 1440,
		"name": "Wólczańska-Skargi",
		"latitude": 51.73906,
		"longitude": 19.45838
	},
	{
		"id": 1442,
		"name": "Wycieczkowa-Wypoczynkowa",
		"latitude": 51.8044,
		"longitude": 19.48776
	},
	{
		"id": 1443,
		"name": "Wycieczkowa-Woskowa",
		"latitude": 51.81014,
		"longitude": 19.48738
	},
	{
		"id": 1444,
		"name": "Wycieczkowa-Warszawska",
		"latitude": 51.81332,
		"longitude": 19.48733
	},
	{
		"id": 1445,
		"name": "Wycieczkowa-Rogowska",
		"latitude": 51.81718,
		"longitude": 19.48662
	},
	{
		"id": 1446,
		"name": "Wycieczkowa-Wiewiórcza",
		"latitude": 51.8218,
		"longitude": 19.48738
	},
	{
		"id": 1447,
		"name": "Wycieczkowa-Radiostacja",
		"latitude": 51.82502,
		"longitude": 19.48798
	},
	{
		"id": 1448,
		"name": "Wycieczkowa-sanatorium",
		"latitude": 51.83496,
		"longitude": 19.48368
	},
	{
		"id": 1449,
		"name": "Wycieczkowa-Radiostacja",
		"latitude": 51.82563,
		"longitude": 19.48791
	},
	{
		"id": 1450,
		"name": "Wycieczkowa-Wiewiórcza",
		"latitude": 51.8216,
		"longitude": 19.48714
	},
	{
		"id": 1451,
		"name": "Wycieczkowa-Rogowska",
		"latitude": 51.81798,
		"longitude": 19.48651
	},
	{
		"id": 1452,
		"name": "Wycieczkowa-Warszawska",
		"latitude": 51.81392,
		"longitude": 19.48705
	},
	{
		"id": 1453,
		"name": "Wycieczkowa-Woskowa",
		"latitude": 51.80965,
		"longitude": 19.48727
	},
	{
		"id": 1454,
		"name": "Wycieczkowa-Wypoczynkowa",
		"latitude": 51.80487,
		"longitude": 19.48742
	},
	{
		"id": 1455,
		"name": "Wycieczkowa-Strykowska",
		"latitude": 51.80107,
		"longitude": 19.48862
	},
	{
		"id": 1456,
		"name": "Retkinia",
		"latitude": 51.74239,
		"longitude": 19.38406
	},
	{
		"id": 1457,
		"name": "Retkinia",
		"latitude": 51.7422,
		"longitude": 19.38457
	},
	{
		"id": 1458,
		"name": "Wyszyńskiego-blok 270",
		"latitude": 51.74441,
		"longitude": 19.39225
	},
	{
		"id": 1459,
		"name": "Wyszyńskiego-Armii Krajowej",
		"latitude": 51.74633,
		"longitude": 19.39888
	},
	{
		"id": 1460,
		"name": "Wyszyńskiego-Retkińska",
		"latitude": 51.74807,
		"longitude": 19.40547
	},
	{
		"id": 1461,
		"name": "Wyszyńskiego-os. Piaski",
		"latitude": 51.74751,
		"longitude": 19.41339
	},
	{
		"id": 1462,
		"name": "Wyszyńskiego-os. Piaski",
		"latitude": 51.74742,
		"longitude": 19.41325
	},
	{
		"id": 1463,
		"name": "Wyszyńskiego-Waltera-Janke",
		"latitude": 51.74741,
		"longitude": 19.41825
	},
	{
		"id": 1464,
		"name": "Wyszyńskiego-Waltera-Janke",
		"latitude": 51.74708,
		"longitude": 19.41782
	},
	{
		"id": 1465,
		"name": "Wyszyńskiego-os. Piaski",
		"latitude": 51.74755,
		"longitude": 19.41368
	},
	{
		"id": 1466,
		"name": "Wyszyńskiego-Waltera-Janke",
		"latitude": 51.74817,
		"longitude": 19.41721
	},
	{
		"id": 1467,
		"name": "Wyszyńskiego-os. Piaski",
		"latitude": 51.74778,
		"longitude": 19.41268
	},
	{
		"id": 1468,
		"name": "Wyszyńskiego-Retkińska",
		"latitude": 51.74813,
		"longitude": 19.40502
	},
	{
		"id": 1469,
		"name": "Wyszyńskiego-Armii Krajowej",
		"latitude": 51.74639,
		"longitude": 19.39885
	},
	{
		"id": 1470,
		"name": "Wyszyńskiego-blok 270",
		"latitude": 51.74451,
		"longitude": 19.39219
	},
	{
		"id": 1471,
		"name": "Zachodnia-Legionów",
		"latitude": 51.77617,
		"longitude": 19.45226
	},
	{
		"id": 1472,
		"name": "Zachodnia-Limanowskiego",
		"latitude": 51.78669,
		"longitude": 19.44928
	},
	{
		"id": 1473,
		"name": "Zachodnia-Limanowskiego",
		"latitude": 51.78618,
		"longitude": 19.44958
	},
	{
		"id": 1474,
		"name": "Bałucki Rynek-Bałucki Rynek",
		"latitude": 51.78666,
		"longitude": 19.45302
	},
	{
		"id": 1475,
		"name": "Zgierska-Dolna",
		"latitude": 51.79003,
		"longitude": 19.44963
	},
	{
		"id": 1476,
		"name": "Zgierska-Dolna",
		"latitude": 51.79012,
		"longitude": 19.44929
	},
	{
		"id": 1477,
		"name": "Zachodnia-Limanowskiego",
		"latitude": 51.78751,
		"longitude": 19.44901
	},
	{
		"id": 1478,
		"name": "Zachodnia-Limanowskiego",
		"latitude": 51.78637,
		"longitude": 19.44912
	},
	{
		"id": 1479,
		"name": "Zachodnia-Manufaktura",
		"latitude": 51.78033,
		"longitude": 19.45126
	},
	{
		"id": 1480,
		"name": "Zachodnia-Zielona",
		"latitude": 51.77084,
		"longitude": 19.45329
	},
	{
		"id": 1482,
		"name": "al. Ofiar Terroryzmu 11 Września-Tr",
		"latitude": 51.73256,
		"longitude": 19.56301
	},
	{
		"id": 1483,
		"name": "Hetmańska-Dąbrówki",
		"latitude": 51.74215,
		"longitude": 19.56982
	},
	{
		"id": 1484,
		"name": "Zakładowa-Transmisyjna",
		"latitude": 51.73899,
		"longitude": 19.57742
	},
	{
		"id": 1485,
		"name": "Janów",
		"latitude": 51.75221,
		"longitude": 19.57441
	},
	{
		"id": 1486,
		"name": "Zakładowa-Dorabialskiej",
		"latitude": 51.73727,
		"longitude": 19.58724
	},
	{
		"id": 1487,
		"name": "Zakładowa-Tranzytowa",
		"latitude": 51.73693,
		"longitude": 19.59063
	},
	{
		"id": 1488,
		"name": "Zakładowa-Dyspozytorska",
		"latitude": 51.73691,
		"longitude": 19.59766
	},
	{
		"id": 1489,
		"name": "Gajcego-Zakładowa",
		"latitude": 51.73729,
		"longitude": 19.60774
	},
	{
		"id": 1490,
		"name": "Gajcego-Rokicińska",
		"latitude": 51.73995,
		"longitude": 19.61128
	},
	{
		"id": 1491,
		"name": "Zakładowa-Dyspozytorska",
		"latitude": 51.73701,
		"longitude": 19.59891
	},
	{
		"id": 1492,
		"name": "Zakładowa-Tranzytowa",
		"latitude": 51.73698,
		"longitude": 19.59169
	},
	{
		"id": 1493,
		"name": "Zakładowa-Dorabialskiej",
		"latitude": 51.7374,
		"longitude": 19.5869
	},
	{
		"id": 1494,
		"name": "Zakładowa-Transmisyjna",
		"latitude": 51.73896,
		"longitude": 19.57793
	},
	{
		"id": 1495,
		"name": "Zakładowa-Hetmańska",
		"latitude": 51.74071,
		"longitude": 19.56807
	},
	{
		"id": 1496,
		"name": "Zakładowa-Odnowiciela",
		"latitude": 51.74188,
		"longitude": 19.5616
	},
	{
		"id": 1497,
		"name": "Zakładowa-Olechowska",
		"latitude": 51.74264,
		"longitude": 19.55696
	},
	{
		"id": 1498,
		"name": "Zakładowa-Książąt Polskich",
		"latitude": 51.74334,
		"longitude": 19.55261
	},
	{
		"id": 1499,
		"name": "Przybyszewskiego-Augustów",
		"latitude": 51.74928,
		"longitude": 19.54711
	},
	{
		"id": 1500,
		"name": "Zdrowie",
		"latitude": 51.76474,
		"longitude": 19.40595
	},
	{
		"id": 1501,
		"name": "Krakowska-Konstantynowska",
		"latitude": 51.76326,
		"longitude": 19.4076
	},
	{
		"id": 1502,
		"name": "Limanowskiego-Zachodnia",
		"latitude": 51.78694,
		"longitude": 19.44972
	},
	{
		"id": 1503,
		"name": "Zgierska-Adwokacka",
		"latitude": 51.79291,
		"longitude": 19.44761
	},
	{
		"id": 1504,
		"name": "Zgierska-Sędziowska",
		"latitude": 51.79552,
		"longitude": 19.44597
	},
	{
		"id": 1505,
		"name": "Zgierska-Julianowska",
		"latitude": 51.79715,
		"longitude": 19.44461
	},
	{
		"id": 1506,
		"name": "Zgierska-Julianowska",
		"latitude": 51.79835,
		"longitude": 19.44404
	},
	{
		"id": 1507,
		"name": "Zgierska-Biegańskiego",
		"latitude": 51.79976,
		"longitude": 19.44275
	},
	{
		"id": 1508,
		"name": "Zgierska-cm. Radogoszcz",
		"latitude": 51.8066,
		"longitude": 19.43953
	},
	{
		"id": 1509,
		"name": "Zgierska-pl. Pamięci Narodowej",
		"latitude": 51.80877,
		"longitude": 19.43843
	},
	{
		"id": 1510,
		"name": "Zgierska-Przedwiośnie",
		"latitude": 51.8116,
		"longitude": 19.43669
	},
	{
		"id": 1511,
		"name": "Zgierska-Sikorskiego",
		"latitude": 51.81507,
		"longitude": 19.43425
	},
	{
		"id": 1512,
		"name": "Zgierska-Pasieczna",
		"latitude": 51.81884,
		"longitude": 19.43232
	},
	{
		"id": 1513,
		"name": "Zgierska-Świtezianki",
		"latitude": 51.82262,
		"longitude": 19.43005
	},
	{
		"id": 1514,
		"name": "Zgierska-Brzoskwiniowa",
		"latitude": 51.82591,
		"longitude": 19.42805
	},
	{
		"id": 1515,
		"name": "Zgierska-Helenówek",
		"latitude": 51.82862,
		"longitude": 19.42641
	},
	{
		"id": 1516,
		"name": "Zgierska-Helenówek-pętla",
		"latitude": 51.8297,
		"longitude": 19.42573
	},
	{
		"id": 1517,
		"name": "Chełmy",
		"latitude": 51.83463,
		"longitude": 19.42271
	},
	{
		"id": 1518,
		"name": "Zgierska-Helenówek",
		"latitude": 51.8286,
		"longitude": 19.42631
	},
	{
		"id": 1519,
		"name": "Aleksandrowska-Romanowska",
		"latitude": 51.81191,
		"longitude": 19.34016
	},
	{
		"id": 1520,
		"name": "Szatonia",
		"latitude": 51.81421,
		"longitude": 19.32916
	},
	{
		"id": 1521,
		"name": "Aleksandrowska-Romanowska",
		"latitude": 51.81178,
		"longitude": 19.34043
	},
	{
		"id": 1522,
		"name": "Aleksandrowska-Spadkowa",
		"latitude": 51.80931,
		"longitude": 19.3472
	},
	{
		"id": 1523,
		"name": "Zgierska-Brzoskwiniowa",
		"latitude": 51.82549,
		"longitude": 19.42815
	},
	{
		"id": 1524,
		"name": "Zgierska-Świtezianki",
		"latitude": 51.82255,
		"longitude": 19.42995
	},
	{
		"id": 1525,
		"name": "Zgierska-Pasieczna",
		"latitude": 51.81888,
		"longitude": 19.43215
	},
	{
		"id": 1526,
		"name": "Zgierska-Sikorskiego",
		"latitude": 51.81631,
		"longitude": 19.43348
	},
	{
		"id": 1527,
		"name": "Zgierska-Przedwiośnie",
		"latitude": 51.81193,
		"longitude": 19.43635
	},
	{
		"id": 1528,
		"name": "Zgierska-Julianowska",
		"latitude": 51.79817,
		"longitude": 19.44366
	},
	{
		"id": 1529,
		"name": "Zgierska-pl. Pamięci Narodowej",
		"latitude": 51.80902,
		"longitude": 19.43815
	},
	{
		"id": 1530,
		"name": "Zgierska-cm. Radogoszcz",
		"latitude": 51.80658,
		"longitude": 19.4394
	},
	{
		"id": 1531,
		"name": "Zgierska-Biegańskiego",
		"latitude": 51.79973,
		"longitude": 19.44261
	},
	{
		"id": 1532,
		"name": "Zgierska-Julianowska",
		"latitude": 51.79702,
		"longitude": 19.44452
	},
	{
		"id": 1533,
		"name": "Zgierska-Adwokacka",
		"latitude": 51.79325,
		"longitude": 19.44721
	},
	{
		"id": 1534,
		"name": "Zgierska-Dolna",
		"latitude": 51.79006,
		"longitude": 19.44885
	},
	{
		"id": 1535,
		"name": "Zgierska-Bałucki Rynek",
		"latitude": 51.78766,
		"longitude": 19.4514
	},
	{
		"id": 1536,
		"name": "Zgierska-pl. Kościelny",
		"latitude": 51.78383,
		"longitude": 19.453
	},
	{
		"id": 1537,
		"name": "Zielona-pl. Hallera",
		"latitude": 51.76884,
		"longitude": 19.43804
	},
	{
		"id": 1538,
		"name": "Zielona-pl. Barlickiego",
		"latitude": 51.76962,
		"longitude": 19.44575
	},
	{
		"id": 1539,
		"name": "Zielona/Gdańska",
		"latitude": 51.76989,
		"longitude": 19.44871
	},
	{
		"id": 1540,
		"name": "Zielona-Piotrkowska",
		"latitude": 51.77052,
		"longitude": 19.45572
	},
	{
		"id": 1542,
		"name": "Zielona-pl. Barlickiego",
		"latitude": 51.76976,
		"longitude": 19.44626
	},
	{
		"id": 1543,
		"name": "Zielona-pl. Hallera",
		"latitude": 51.76898,
		"longitude": 19.43892
	},
	{
		"id": 1544,
		"name": "Zielona-1 Maja",
		"latitude": 51.76902,
		"longitude": 19.43283
	},
	{
		"id": 1545,
		"name": "Zjazdowa-Budy",
		"latitude": 51.805,
		"longitude": 19.53102
	},
	{
		"id": 1546,
		"name": "Zjazdowa-Opolska",
		"latitude": 51.80661,
		"longitude": 19.53151
	},
	{
		"id": 1547,
		"name": "Zjazdowa-Moskuliki",
		"latitude": 51.80941,
		"longitude": 19.53475
	},
	{
		"id": 1548,
		"name": "Zjazdowa",
		"latitude": 51.81474,
		"longitude": 19.53331
	},
	{
		"id": 1549,
		"name": "Zjazdowa-Moskuliki",
		"latitude": 51.80977,
		"longitude": 19.53436
	},
	{
		"id": 1550,
		"name": "Zjazdowa-Beskidzka",
		"latitude": 51.79984,
		"longitude": 19.52899
	},
	{
		"id": 1551,
		"name": "Złotno-Złotno 141",
		"latitude": 51.7759,
		"longitude": 19.3595
	},
	{
		"id": 1552,
		"name": "Złotno-Stare Złotno",
		"latitude": 51.77586,
		"longitude": 19.36786
	},
	{
		"id": 1553,
		"name": "Złotno-Legnicka",
		"latitude": 51.77682,
		"longitude": 19.37564
	},
	{
		"id": 1555,
		"name": "Złotno-Podchorążych",
		"latitude": 51.77855,
		"longitude": 19.38915
	},
	{
		"id": 1556,
		"name": "Złotno-Kwiatowa",
		"latitude": 51.77965,
		"longitude": 19.39407
	},
	{
		"id": 1557,
		"name": "Złotno-Stare Złotno",
		"latitude": 51.77589,
		"longitude": 19.36755
	},
	{
		"id": 1558,
		"name": "Złotno-Złotno 141",
		"latitude": 51.77598,
		"longitude": 19.35966
	},
	{
		"id": 1559,
		"name": "Złotno-Huta Jagodnica",
		"latitude": 51.77552,
		"longitude": 19.34741
	},
	{
		"id": 1560,
		"name": "Huta Jagodnica",
		"latitude": 51.77528,
		"longitude": 19.3492
	},
	{
		"id": 1561,
		"name": "Żeligowskiego-6 Sierpnia",
		"latitude": 51.76591,
		"longitude": 19.43925
	},
	{
		"id": 1562,
		"name": "Żeromskiego-Radwańska (kampus PŁ)",
		"latitude": 51.75221,
		"longitude": 19.4494
	},
	{
		"id": 1563,
		"name": "Politechniki-Radwańska (kampus PŁ)",
		"latitude": 51.75147,
		"longitude": 19.44934
	},
	{
		"id": 1564,
		"name": "Wróblewskiego-Politechniki (kampus",
		"latitude": 51.74434,
		"longitude": 19.4525
	},
	{
		"id": 1565,
		"name": "Rokicińska-Książąt Polskich",
		"latitude": 51.7553,
		"longitude": 19.56624
	},
	{
		"id": 1566,
		"name": "Rokicińska-Hetmańska",
		"latitude": 51.75343,
		"longitude": 19.57589
	},
	{
		"id": 1568,
		"name": "Rokicińska-Transmisyjna",
		"latitude": 51.75217,
		"longitude": 19.58308
	},
	{
		"id": 1569,
		"name": "Rokicińska-Józefiaka",
		"latitude": 51.75075,
		"longitude": 19.5909
	},
	{
		"id": 1570,
		"name": "Rokicińska-Autostrada A1",
		"latitude": 51.74751,
		"longitude": 19.59943
	},
	{
		"id": 1571,
		"name": "Rokicińska-Tatarkówny-Majkowskiej",
		"latitude": 51.74402,
		"longitude": 19.60556
	},
	{
		"id": 1572,
		"name": "Rokicińska-Gajcego",
		"latitude": 51.74027,
		"longitude": 19.61223
	},
	{
		"id": 1573,
		"name": "Rokicińska-Gwarna",
		"latitude": 51.7375,
		"longitude": 19.61709
	},
	{
		"id": 1574,
		"name": "Rokicińska-Rzeźna",
		"latitude": 51.73199,
		"longitude": 19.62694
	},
	{
		"id": 1575,
		"name": "Wieńcowa-Rokicińska",
		"latitude": 51.73325,
		"longitude": 19.62407
	},
	{
		"id": 1576,
		"name": "Rokicińska-Gwarna",
		"latitude": 51.73684,
		"longitude": 19.61866
	},
	{
		"id": 1577,
		"name": "Dw. Łódź Andrzejów",
		"latitude": 51.74164,
		"longitude": 19.61443
	},
	{
		"id": 1578,
		"name": "Rokicińska-Gajcego",
		"latitude": 51.74073,
		"longitude": 19.61179
	},
	{
		"id": 1579,
		"name": "Rokicińska-Tatarkówny-Majkowskiej",
		"latitude": 51.74463,
		"longitude": 19.6048
	},
	{
		"id": 1580,
		"name": "Rokicińska-Autostrada A1",
		"latitude": 51.7474,
		"longitude": 19.59971
	},
	{
		"id": 1581,
		"name": "Rokicińska-Józefiaka",
		"latitude": 51.75141,
		"longitude": 19.58936
	},
	{
		"id": 1582,
		"name": "Rokicińska-Transmisyjna",
		"latitude": 51.75282,
		"longitude": 19.58158
	},
	{
		"id": 1583,
		"name": "Rokicińska-Hetmańska",
		"latitude": 51.75412,
		"longitude": 19.57421
	},
	{
		"id": 1584,
		"name": "Rokicińska-Książąt Polskich",
		"latitude": 51.75593,
		"longitude": 19.56462
	},
	{
		"id": 1585,
		"name": "Rokicińska-Rokicińska 144",
		"latitude": 51.75695,
		"longitude": 19.55892
	},
	{
		"id": 1586,
		"name": "Wieńcowa-Przylesie",
		"latitude": 51.73168,
		"longitude": 19.61432
	},
	{
		"id": 1587,
		"name": "Wieńcowa-Rokicińska",
		"latitude": 51.73313,
		"longitude": 19.62358
	},
	{
		"id": 1588,
		"name": "Wieńcowa-Przylesie",
		"latitude": 51.7318,
		"longitude": 19.61439
	},
	{
		"id": 1589,
		"name": "Łagiewnicka-Przepiórcza",
		"latitude": 51.8235,
		"longitude": 19.45905
	},
	{
		"id": 1590,
		"name": "Łagiewnicka-Pszczelna",
		"latitude": 51.82678,
		"longitude": 19.46188
	},
	{
		"id": 1591,
		"name": "Łagiewnicka-Łagiewnicka 290",
		"latitude": 51.8291,
		"longitude": 19.46354
	},
	{
		"id": 1592,
		"name": "Łagiewnicka-Kuropatwia",
		"latitude": 51.83681,
		"longitude": 19.46675
	},
	{
		"id": 1593,
		"name": "Łagiewnicka-Jaskółcza",
		"latitude": 51.84118,
		"longitude": 19.46751
	},
	{
		"id": 1594,
		"name": "Łagiewnicka-Łagiewnicka 311",
		"latitude": 51.84604,
		"longitude": 19.46813
	},
	{
		"id": 1595,
		"name": "Okólna-Łagiewniki",
		"latitude": 51.84686,
		"longitude": 19.4751
	},
	{
		"id": 1596,
		"name": "Łagiewnicka-Jaskółcza",
		"latitude": 51.84131,
		"longitude": 19.46736
	},
	{
		"id": 1597,
		"name": "Łagiewnicka-Kuropatwia",
		"latitude": 51.83723,
		"longitude": 19.46682
	},
	{
		"id": 1598,
		"name": "Łagiewnicka-Łagiewnicka 292",
		"latitude": 51.82952,
		"longitude": 19.46364
	},
	{
		"id": 1599,
		"name": "Łagiewnicka-Pszczelna",
		"latitude": 51.82656,
		"longitude": 19.4615
	},
	{
		"id": 1600,
		"name": "Łagiewnicka-Przepiórcza",
		"latitude": 51.82304,
		"longitude": 19.4587
	},
	{
		"id": 1601,
		"name": "Łagiewnicka-Dw. Łódź Arturówek",
		"latitude": 51.81755,
		"longitude": 19.45621
	},
	{
		"id": 1602,
		"name": "Okólna-Serwituty",
		"latitude": 51.84506,
		"longitude": 19.50163
	},
	{
		"id": 1603,
		"name": "Okólna-Modrzew",
		"latitude": 51.84358,
		"longitude": 19.50738
	},
	{
		"id": 1604,
		"name": "Okólna-Serwituty",
		"latitude": 51.84511,
		"longitude": 19.50201
	},
	{
		"id": 1605,
		"name": "Okólna-Łagiewniki",
		"latitude": 51.847,
		"longitude": 19.47494
	},
	{
		"id": 1606,
		"name": "Okólna-Secesyjna",
		"latitude": 51.84814,
		"longitude": 19.46019
	},
	{
		"id": 1607,
		"name": "Sanitariuszek-Biwakowa",
		"latitude": 51.72246,
		"longitude": 19.35507
	},
	{
		"id": 1608,
		"name": "Wieńcowa-Feliksińska",
		"latitude": 51.72524,
		"longitude": 19.60497
	},
	{
		"id": 1609,
		"name": "Wieńcowa-Feliksińska",
		"latitude": 51.72538,
		"longitude": 19.60501
	},
	{
		"id": 1610,
		"name": "Feliksińska-Dworcowa",
		"latitude": 51.72649,
		"longitude": 19.60067
	},
	{
		"id": 1611,
		"name": "Jędrzejowska-Feliksin",
		"latitude": 51.72965,
		"longitude": 19.59611
	},
	{
		"id": 1612,
		"name": "Feliksińska-Dworcowa",
		"latitude": 51.72673,
		"longitude": 19.59995
	},
	{
		"id": 1614,
		"name": "Rudzka-Mała(Rzgów)",
		"latitude": 51.6709,
		"longitude": 19.48138
	},
	{
		"id": 1617,
		"name": "Nowosolna",
		"latitude": 51.7943,
		"longitude": 19.59007
	},
	{
		"id": 1618,
		"name": "Byszewska-Nowosolna",
		"latitude": 51.79473,
		"longitude": 19.59145
	},
	{
		"id": 1619,
		"name": "Doły-Smutna",
		"latitude": 51.78803,
		"longitude": 19.49217
	},
	{
		"id": 1620,
		"name": "Smutna",
		"latitude": 51.78961,
		"longitude": 19.49944
	},
	{
		"id": 1621,
		"name": "Bandurskiego-Dw. Łódź Kaliska",
		"latitude": 51.75548,
		"longitude": 19.43214
	},
	{
		"id": 1622,
		"name": "Dw. Łódź Kaliska",
		"latitude": 51.75667,
		"longitude": 19.43103
	},
	{
		"id": 1623,
		"name": "Kopernika-Tobaco Park",
		"latitude": 51.75776,
		"longitude": 19.43668
	},
	{
		"id": 1624,
		"name": "Maratońska-Bandurskiego",
		"latitude": 51.75615,
		"longitude": 19.42998
	},
	{
		"id": 1625,
		"name": "Maratońska-Wróblewskiego",
		"latitude": 51.74802,
		"longitude": 19.42772
	},
	{
		"id": 1626,
		"name": "Maratońska-Waltera-Janke",
		"latitude": 51.7448,
		"longitude": 19.42093
	},
	{
		"id": 1627,
		"name": "Biegunowa-Krakowska",
		"latitude": 51.7745,
		"longitude": 19.3993
	},
	{
		"id": 1628,
		"name": "Pomorska-Nowosolna",
		"latitude": 51.79302,
		"longitude": 19.58964
	},
	{
		"id": 1629,
		"name": "Brzezińska-Nowosolna",
		"latitude": 51.79373,
		"longitude": 19.59099
	},
	{
		"id": 1630,
		"name": "Kasprowicza-ROD Relaks",
		"latitude": 51.80097,
		"longitude": 19.58044
	},
	{
		"id": 1631,
		"name": "Elektronowa-Nowe Sady",
		"latitude": 51.74178,
		"longitude": 19.43324
	},
	{
		"id": 1632,
		"name": "Telefoniczna-Telefoniczna 27",
		"latitude": 51.78261,
		"longitude": 19.50354
	},
	{
		"id": 1633,
		"name": "Rokicińska",
		"latitude": 51.7624,
		"longitude": 19.53745
	},
	{
		"id": 1637,
		"name": "Przestrzenna-Karowa",
		"latitude": 51.70324,
		"longitude": 19.44887
	},
	{
		"id": 1638,
		"name": "Przestrzenna-Tabelowa",
		"latitude": 51.70481,
		"longitude": 19.45703
	},
	{
		"id": 1639,
		"name": "Przestrzenna-Karowa",
		"latitude": 51.70347,
		"longitude": 19.45018
	},
	{
		"id": 1640,
		"name": "Przestrzenna-Sławna",
		"latitude": 51.70312,
		"longitude": 19.44378
	},
	{
		"id": 1641,
		"name": "Graniczna-Przestrzenna",
		"latitude": 51.70644,
		"longitude": 19.45883
	},
	{
		"id": 1642,
		"name": "Przestrzenna-Tabelowa",
		"latitude": 51.7047,
		"longitude": 19.45615
	},
	{
		"id": 1643,
		"name": "Graniczna-Rozalii",
		"latitude": 51.70032,
		"longitude": 19.46428
	},
	{
		"id": 1644,
		"name": "Graniczna-Graniczna 62",
		"latitude": 51.6973,
		"longitude": 19.46925
	},
	{
		"id": 1645,
		"name": "Graniczna-Rozalii",
		"latitude": 51.70097,
		"longitude": 19.4638
	},
	{
		"id": 1646,
		"name": "Siostrzana-Graniczna",
		"latitude": 51.70324,
		"longitude": 19.46205
	},
	{
		"id": 1647,
		"name": "Kongresowa-Jutrzenki",
		"latitude": 51.72028,
		"longitude": 19.47718
	},
	{
		"id": 1648,
		"name": "Kongresowa-Pryncypalna",
		"latitude": 51.72323,
		"longitude": 19.47423
	},
	{
		"id": 1649,
		"name": "Doły-Smutna",
		"latitude": 51.78786,
		"longitude": 19.49197
	},
	{
		"id": 1650,
		"name": "Wólczańska-Skrzywana",
		"latitude": 51.74285,
		"longitude": 19.45774
	},
	{
		"id": 1655,
		"name": "Strykowska-Imielnik Nowy",
		"latitude": 51.84271,
		"longitude": 19.55855
	},
	{
		"id": 1664,
		"name": "Pienista-Komandorska",
		"latitude": 51.73601,
		"longitude": 19.40761
	},
	{
		"id": 1665,
		"name": "Maczka-Aeroklub",
		"latitude": 51.72853,
		"longitude": 19.40391
	},
	{
		"id": 1667,
		"name": "Pienista-Komandorska",
		"latitude": 51.73626,
		"longitude": 19.40856
	},
	{
		"id": 1668,
		"name": "Przestrzenna-Sławna",
		"latitude": 51.70314,
		"longitude": 19.44288
	},
	{
		"id": 1669,
		"name": "Pienista-Rusałki",
		"latitude": 51.73881,
		"longitude": 19.41347
	},
	{
		"id": 1670,
		"name": "Pienista-Obywatelska",
		"latitude": 51.7404,
		"longitude": 19.4168
	},
	{
		"id": 1671,
		"name": "Pienista-Rusałki",
		"latitude": 51.73905,
		"longitude": 19.41374
	},
	{
		"id": 1673,
		"name": "Karolewska-Włókniarzy",
		"latitude": 51.75847,
		"longitude": 19.43516
	},
	{
		"id": 1674,
		"name": "Struga-Włókniarzy",
		"latitude": 51.76136,
		"longitude": 19.43285
	},
	{
		"id": 1675,
		"name": "Łąkowa-Struga",
		"latitude": 51.76362,
		"longitude": 19.43889
	},
	{
		"id": 1676,
		"name": "Skłodowskiej-Curie-Pogonowskiego",
		"latitude": 51.76161,
		"longitude": 19.44236
	},
	{
		"id": 1677,
		"name": "Puszkina-Dąbrowskiego",
		"latitude": 51.73635,
		"longitude": 19.53162
	},
	{
		"id": 1678,
		"name": "Puszkina-Dostawcza",
		"latitude": 51.74138,
		"longitude": 19.53223
	},
	{
		"id": 1679,
		"name": "Prądzyńskiego-Rozwojowa",
		"latitude": 51.72304,
		"longitude": 19.42678
	},
	{
		"id": 1680,
		"name": "Prądzyńskiego-Darniowa",
		"latitude": 51.72283,
		"longitude": 19.43278
	},
	{
		"id": 1682,
		"name": "Pokładowa-Świętojańska",
		"latitude": 51.71872,
		"longitude": 19.43124
	},
	{
		"id": 1683,
		"name": "Kasprowicza-Witkacego",
		"latitude": 51.8043,
		"longitude": 19.57611
	},
	{
		"id": 1684,
		"name": "ROD Polanka",
		"latitude": 51.80644,
		"longitude": 19.57332
	},
	{
		"id": 1685,
		"name": "ROD Polanka",
		"latitude": 51.8067,
		"longitude": 19.57262
	},
	{
		"id": 1686,
		"name": "Kasprowicza-Witkacego",
		"latitude": 51.80354,
		"longitude": 19.57698
	},
	{
		"id": 1687,
		"name": "Kasprowicza-ROD Relaks",
		"latitude": 51.80091,
		"longitude": 19.58036
	},
	{
		"id": 1689,
		"name": "Śnieżna-Stokowska",
		"latitude": 51.79081,
		"longitude": 19.50667
	},
	{
		"id": 1690,
		"name": "Śnieżna-Brzezińska",
		"latitude": 51.79433,
		"longitude": 19.50435
	},
	{
		"id": 1692,
		"name": "Śnieżna-Stokowska",
		"latitude": 51.79137,
		"longitude": 19.50647
	},
	{
		"id": 1693,
		"name": "Stokowska",
		"latitude": 51.79193,
		"longitude": 19.51249
	},
	{
		"id": 1694,
		"name": "Janów",
		"latitude": 51.75206,
		"longitude": 19.57487
	},
	{
		"id": 1695,
		"name": "Hetmańska-Juranda ze Spychowa",
		"latitude": 51.74878,
		"longitude": 19.57264
	},
	{
		"id": 1696,
		"name": "Janów",
		"latitude": 51.75209,
		"longitude": 19.57482
	},
	{
		"id": 1697,
		"name": "Janów",
		"latitude": 51.752,
		"longitude": 19.57532
	},
	{
		"id": 1698,
		"name": "Janów",
		"latitude": 51.75197,
		"longitude": 19.57542
	},
	{
		"id": 1699,
		"name": "Łagiewnicka-Murarska",
		"latitude": 51.79912,
		"longitude": 19.45629
	},
	{
		"id": 1700,
		"name": "Kongresowa-Jutrzenki",
		"latitude": 51.72058,
		"longitude": 19.47678
	},
	{
		"id": 1701,
		"name": "Kongresowa-Tuszyńska",
		"latitude": 51.71787,
		"longitude": 19.48061
	},
	{
		"id": 1703,
		"name": "Chmielowskiego-Widzewska",
		"latitude": 51.75928,
		"longitude": 19.51944
	},
	{
		"id": 1704,
		"name": "Pomorska-Tamka",
		"latitude": 51.77813,
		"longitude": 19.49049
	},
	{
		"id": 1705,
		"name": "Pomorska-Konstytucyjna",
		"latitude": 51.77751,
		"longitude": 19.49668
	},
	{
		"id": 1706,
		"name": "Konstytucyjna-Narutowicza",
		"latitude": 51.77504,
		"longitude": 19.49778
	},
	{
		"id": 1707,
		"name": "Pomorska-rondo Solidarności",
		"latitude": 51.77885,
		"longitude": 19.48335
	},
	{
		"id": 1708,
		"name": "Pomorska-Matejki",
		"latitude": 51.77862,
		"longitude": 19.48515
	},
	{
		"id": 1709,
		"name": "Pomorska-Matejki",
		"latitude": 51.77855,
		"longitude": 19.4863
	},
	{
		"id": 1710,
		"name": "Pomorska-Tamka",
		"latitude": 51.77815,
		"longitude": 19.48955
	},
	{
		"id": 1711,
		"name": "Pojezierska-Brukowa",
		"latitude": 51.80056,
		"longitude": 19.41192
	},
	{
		"id": 1712,
		"name": "Świtezianki-Syrenki",
		"latitude": 51.82228,
		"longitude": 19.44798
	},
	{
		"id": 1713,
		"name": "Świtezianki",
		"latitude": 51.82464,
		"longitude": 19.43821
	},
	{
		"id": 1714,
		"name": "Świtezianki",
		"latitude": 51.82479,
		"longitude": 19.43852
	},
	{
		"id": 1715,
		"name": "Świtezianki",
		"latitude": 51.82493,
		"longitude": 19.43804
	},
	{
		"id": 1717,
		"name": "Świtezianki",
		"latitude": 51.82475,
		"longitude": 19.43815
	},
	{
		"id": 1718,
		"name": "Pabianicka-Mierzejowa",
		"latitude": 51.70131,
		"longitude": 19.41565
	},
	{
		"id": 1719,
		"name": "Łódzka-Mały Skręt",
		"latitude": 51.69505,
		"longitude": 19.40906
	},
	{
		"id": 1720,
		"name": "Chocianowice IKEA",
		"latitude": 51.70081,
		"longitude": 19.41343
	},
	{
		"id": 1721,
		"name": "Pabianicka-Mierzejowa",
		"latitude": 51.70123,
		"longitude": 19.41572
	},
	{
		"id": 1722,
		"name": "Pabianicka-Długa",
		"latitude": 51.70315,
		"longitude": 19.41818
	},
	{
		"id": 1724,
		"name": "Brzezińska-Tatarkiewicza",
		"latitude": 51.79301,
		"longitude": 19.60237
	},
	{
		"id": 1725,
		"name": "Brzezińska-Autostrada A1",
		"latitude": 51.79236,
		"longitude": 19.61321
	},
	{
		"id": 1726,
		"name": "Brzezińska-Tatarkiewicza",
		"latitude": 51.79331,
		"longitude": 19.59943
	},
	{
		"id": 1727,
		"name": "Brzezińska-Nowosolna",
		"latitude": 51.79382,
		"longitude": 19.59153
	},
	{
		"id": 1732,
		"name": "Brzezińska-Autostrada A1",
		"latitude": 51.79252,
		"longitude": 19.61233
	},
	{
		"id": 1733,
		"name": "Wróblewskiego-Politechniki (kampus",
		"latitude": 51.74456,
		"longitude": 19.45265
	},
	{
		"id": 1734,
		"name": "Hetmańska-Zagłoby",
		"latitude": 51.74622,
		"longitude": 19.57148
	},
	{
		"id": 1735,
		"name": "Hetmańska-Dąbrówki",
		"latitude": 51.74339,
		"longitude": 19.57019
	},
	{
		"id": 1736,
		"name": "Hetmańska-Zagłoby",
		"latitude": 51.7473,
		"longitude": 19.57219
	},
	{
		"id": 1738,
		"name": "Żeromskiego-szpital im.WAM",
		"latitude": 51.76124,
		"longitude": 19.44754
	},
	{
		"id": 1739,
		"name": "Kopernika-Tobaco Park",
		"latitude": 51.75827,
		"longitude": 19.43774
	},
	{
		"id": 1741,
		"name": "Aleksandrowska-Chochoła",
		"latitude": 51.80516,
		"longitude": 19.35637
	},
	{
		"id": 1742,
		"name": "Szczecińska-Aleksandrowska",
		"latitude": 51.80215,
		"longitude": 19.36694
	},
	{
		"id": 1744,
		"name": "Okólna-Antyczna",
		"latitude": 51.84706,
		"longitude": 19.46624
	},
	{
		"id": 1745,
		"name": "Dw. Łódź Andrzejów",
		"latitude": 51.74147,
		"longitude": 19.61462
	},
	{
		"id": 1746,
		"name": "Gajcego-Rokicińska",
		"latitude": 51.73998,
		"longitude": 19.61114
	},
	{
		"id": 1747,
		"name": "Gajcego-Zakładowa",
		"latitude": 51.73828,
		"longitude": 19.60854
	},
	{
		"id": 1748,
		"name": "Retkińska-Wileńska",
		"latitude": 51.75483,
		"longitude": 19.41235
	},
	{
		"id": 1749,
		"name": "Okólna-Okólna 244",
		"latitude": 51.84929,
		"longitude": 19.4527
	},
	{
		"id": 1750,
		"name": "Długa-Łagiewnicka (Zgierz)",
		"latitude": 51.8504,
		"longitude": 19.4453
	},
	{
		"id": 1751,
		"name": "Okólna-Okólna 244",
		"latitude": 51.84896,
		"longitude": 19.45403
	},
	{
		"id": 1752,
		"name": "Doły-Telefoniczna",
		"latitude": 51.78381,
		"longitude": 19.49117
	},
	{
		"id": 1766,
		"name": "Aleksandrowska-Szczecińska",
		"latitude": 51.80256,
		"longitude": 19.37016
	},
	{
		"id": 1767,
		"name": "Aleksandrowska-Szczecińska",
		"latitude": 51.8025,
		"longitude": 19.36907
	},
	{
		"id": 1768,
		"name": "Aleksandrowska-Spadkowa",
		"latitude": 51.809,
		"longitude": 19.34805
	},
	{
		"id": 1769,
		"name": "Aleksandrowska-Chochoła",
		"latitude": 51.80479,
		"longitude": 19.3576
	},
	{
		"id": 1770,
		"name": "Byszewska-Pomarańczowa",
		"latitude": 51.79925,
		"longitude": 19.60045
	},
	{
		"id": 1771,
		"name": "Byszewska-Byszewska 26",
		"latitude": 51.80438,
		"longitude": 19.61058
	},
	{
		"id": 1772,
		"name": "Janów wieś",
		"latitude": 51.81358,
		"longitude": 19.62071
	},
	{
		"id": 1773,
		"name": "Byszewska-Byszewska 26",
		"latitude": 51.80407,
		"longitude": 19.60979
	},
	{
		"id": 1774,
		"name": "Byszewska-Pomarańczowa",
		"latitude": 51.79931,
		"longitude": 19.60035
	},
	{
		"id": 1775,
		"name": "Andrespol-Młynarska",
		"latitude": 51.72872,
		"longitude": 19.63269
	},
	{
		"id": 1776,
		"name": "Rokicińska-Rzeźna",
		"latitude": 51.73208,
		"longitude": 19.62713
	},
	{
		"id": 1777,
		"name": "Gillette-Nowy Józefów",
		"latitude": 51.73907,
		"longitude": 19.36761
	},
	{
		"id": 1778,
		"name": "Nowy Józefów-Golfowa",
		"latitude": 51.73627,
		"longitude": 19.3666
	},
	{
		"id": 1782,
		"name": "Warszawska-Deczyńskiego",
		"latitude": 51.80545,
		"longitude": 19.46831
	},
	{
		"id": 1783,
		"name": "Warszawska-Irysowa",
		"latitude": 51.80317,
		"longitude": 19.46278
	},
	{
		"id": 1784,
		"name": "Przybyszewskiego-Kilińskiego",
		"latitude": 51.74573,
		"longitude": 19.47712
	},
	{
		"id": 1785,
		"name": "Przybyszewskiego-Łęczycka",
		"latitude": 51.74707,
		"longitude": 19.48511
	},
	{
		"id": 1786,
		"name": "Przybyszewskiego-Brzozowa",
		"latitude": 51.74464,
		"longitude": 19.47065
	},
	{
		"id": 1787,
		"name": "Przybyszewskiego-Kilińskiego",
		"latitude": 51.74517,
		"longitude": 19.47485
	},
	{
		"id": 1798,
		"name": "Kusocińskiego-Retkińska",
		"latitude": 51.75227,
		"longitude": 19.40758
	},
	{
		"id": 1799,
		"name": "Siostrzana-Graniczna",
		"latitude": 51.70313,
		"longitude": 19.46156
	},
	{
		"id": 1800,
		"name": "OLECHÓW",
		"latitude": 51.73416,
		"longitude": 19.57574
	},
	{
		"id": 1801,
		"name": "Dell/parking",
		"latitude": 51.73171,
		"longitude": 19.56902
	},
	{
		"id": 1803,
		"name": "al. Ofiar Terroryzmu 11 Września-Tr",
		"latitude": 51.73212,
		"longitude": 19.56054
	},
	{
		"id": 1804,
		"name": "al. Ofiar Terroryzmu 11 Września-ko",
		"latitude": 51.72977,
		"longitude": 19.55346
	},
	{
		"id": 1805,
		"name": "al. Ofiar Terroryzmu 11 Września-ko",
		"latitude": 51.72948,
		"longitude": 19.5513
	},
	{
		"id": 1806,
		"name": "al. Ofiar Terroryzmu 11 Września-De",
		"latitude": 51.73344,
		"longitude": 19.56938
	},
	{
		"id": 1807,
		"name": "Kalonka (osiedle)",
		"latitude": 51.82799,
		"longitude": 19.57106
	},
	{
		"id": 1814,
		"name": "Graniczna-Przestrzenna",
		"latitude": 51.70713,
		"longitude": 19.45821
	},
	{
		"id": 1815,
		"name": "Sortownia",
		"latitude": 51.72866,
		"longitude": 19.39584
	},
	{
		"id": 1816,
		"name": "Chocianowice IKEA",
		"latitude": 51.70084,
		"longitude": 19.41333
	},
	{
		"id": 1817,
		"name": "Pabianicka-Długa",
		"latitude": 51.70277,
		"longitude": 19.4185
	},
	{
		"id": 1818,
		"name": "Staffa-Os. 650-lecia (Zgierz)",
		"latitude": 51.86605,
		"longitude": 19.37796
	},
	{
		"id": 1819,
		"name": "Staffa-szkoła (Zgierz)",
		"latitude": 51.86248,
		"longitude": 19.37773
	},
	{
		"id": 1820,
		"name": "Łaska -Wiejska (Pabianice)",
		"latitude": 51.65851,
		"longitude": 19.32324
	},
	{
		"id": 1821,
		"name": "Łaska -Szarych Szeregów(Pabianice)",
		"latitude": 51.65986,
		"longitude": 19.32565
	},
	{
		"id": 1822,
		"name": "plac Kilińskiego (Zgierz)",
		"latitude": 51.85465,
		"longitude": 19.41615
	},
	{
		"id": 1823,
		"name": "1 Maja-3 Maja (Zgierz)",
		"latitude": 51.85165,
		"longitude": 19.41513
	},
	{
		"id": 1824,
		"name": "Majątek Byszewy",
		"latitude": 51.83226,
		"longitude": 19.63064
	},
	{
		"id": 1825,
		"name": "Byszewska-Boginia",
		"latitude": 51.83977,
		"longitude": 19.63338
	},
	{
		"id": 1826,
		"name": "Majątek Byszewy",
		"latitude": 51.83198,
		"longitude": 19.63041
	},
	{
		"id": 1827,
		"name": "Byszewy",
		"latitude": 51.82597,
		"longitude": 19.62777
	},
	{
		"id": 1828,
		"name": "Adelmówek",
		"latitude": 51.83849,
		"longitude": 19.42028
	},
	{
		"id": 1829,
		"name": "Chełmy",
		"latitude": 51.83445,
		"longitude": 19.42277
	},
	{
		"id": 1830,
		"name": "Długa-Sierakowskiego (Zgierz)",
		"latitude": 51.85193,
		"longitude": 19.43494
	},
	{
		"id": 1831,
		"name": "Długa-Łagiewnicka (Zgierz)",
		"latitude": 51.85032,
		"longitude": 19.44527
	},
	{
		"id": 1832,
		"name": "Długa-Spacerowa (Zgierz)",
		"latitude": 51.85311,
		"longitude": 19.42724
	},
	{
		"id": 1833,
		"name": "Długa-Sierakowskiego (Zgierz)",
		"latitude": 51.85165,
		"longitude": 19.43666
	},
	{
		"id": 1834,
		"name": "Długa-Skłodowskiej-Curie (Zgierz)",
		"latitude": 51.85401,
		"longitude": 19.42142
	},
	{
		"id": 1835,
		"name": "Długa-Spacerowa (Zgierz)",
		"latitude": 51.85323,
		"longitude": 19.4261
	},
	{
		"id": 1836,
		"name": "1 Maja-plac Kilińskiego (Zgierz)",
		"latitude": 51.85484,
		"longitude": 19.41665
	},
	{
		"id": 1837,
		"name": "Długa-Skłodowskiej-Curie (Zgierz)",
		"latitude": 51.85407,
		"longitude": 19.42059
	},
	{
		"id": 1838,
		"name": "1 Maja-Dubois (Zgierz)",
		"latitude": 51.85843,
		"longitude": 19.41792
	},
	{
		"id": 1839,
		"name": "Długa-plac Kilińskiego (Zgierz)",
		"latitude": 51.85462,
		"longitude": 19.41687
	},
	{
		"id": 1840,
		"name": "1 Maja-Piłsudskiego (Zgierz)",
		"latitude": 51.86146,
		"longitude": 19.41624
	},
	{
		"id": 1841,
		"name": "1 Maja-Dubois (Zgierz)",
		"latitude": 51.85816,
		"longitude": 19.41776
	},
	{
		"id": 1842,
		"name": "Piłsudskiego-szkoła nr 1 (Zgierz)",
		"latitude": 51.86117,
		"longitude": 19.40873
	},
	{
		"id": 1844,
		"name": "Piłsudskiego-szkoła nr 1 (Zgierz)",
		"latitude": 51.86095,
		"longitude": 19.40791
	},
	{
		"id": 1845,
		"name": "1 Maja-Piłsudskiego (Zgierz)",
		"latitude": 51.86129,
		"longitude": 19.41625
	},
	{
		"id": 1847,
		"name": "Gałczyńskiego-Parzęczewska  (Zgierz",
		"latitude": 51.86115,
		"longitude": 19.39391
	},
	{
		"id": 1850,
		"name": "Gałczyńskiego-Tuwima (Zgierz)",
		"latitude": 51.8577,
		"longitude": 19.39063
	},
	{
		"id": 1851,
		"name": "Gałczyńskiego-Parzęczewska  (Zgierz",
		"latitude": 51.86119,
		"longitude": 19.39413
	},
	{
		"id": 1852,
		"name": "Tuwima-Sezam (Zgierz)",
		"latitude": 51.85786,
		"longitude": 19.38502
	},
	{
		"id": 1853,
		"name": "Gałczyńskiego-Tuwima (Zgierz)",
		"latitude": 51.85863,
		"longitude": 19.39112
	},
	{
		"id": 1854,
		"name": "Tuwima-Boya-Żeleńskiego (Zgierz)",
		"latitude": 51.85811,
		"longitude": 19.37994
	},
	{
		"id": 1855,
		"name": "Sezam (Zgierz)",
		"latitude": 51.8577,
		"longitude": 19.38635
	},
	{
		"id": 1856,
		"name": "Staffa-przychodnia (Zgierz)",
		"latitude": 51.86024,
		"longitude": 19.37827
	},
	{
		"id": 1857,
		"name": "Tuwima-Boya-Żeleńskiego (Zgierz)",
		"latitude": 51.85802,
		"longitude": 19.38059
	},
	{
		"id": 1858,
		"name": "Staffa-szkoła (Zgierz)",
		"latitude": 51.86303,
		"longitude": 19.37776
	},
	{
		"id": 1859,
		"name": "Staffa-przychodnia (Zgierz)",
		"latitude": 51.85878,
		"longitude": 19.37824
	},
	{
		"id": 1860,
		"name": "Staffa-Os. 650-lecia (Zgierz)",
		"latitude": 51.86691,
		"longitude": 19.37843
	},
	{
		"id": 1861,
		"name": "Parzęczewska /Staffa(Zgierz)",
		"latitude": 51.86778,
		"longitude": 19.38196
	},
	{
		"id": 1862,
		"name": "pl. Łukasińskiego (Stryków)",
		"latitude": 51.90064,
		"longitude": 19.60204
	},
	{
		"id": 1863,
		"name": "Warszawska-Legionów (Stryków)",
		"latitude": 51.89653,
		"longitude": 19.59849
	},
	{
		"id": 1864,
		"name": "Dobra",
		"latitude": 51.86754,
		"longitude": 19.57025
	},
	{
		"id": 1865,
		"name": "Sosnowiec",
		"latitude": 51.88125,
		"longitude": 19.58218
	},
	{
		"id": 1866,
		"name": "Dobra",
		"latitude": 51.86661,
		"longitude": 19.56929
	},
	{
		"id": 1867,
		"name": "Dobra Nowiny",
		"latitude": 51.86208,
		"longitude": 19.56674
	},
	{
		"id": 1868,
		"name": "Plichtów",
		"latitude": 51.82011,
		"longitude": 19.62613
	},
	{
		"id": 1869,
		"name": "Byszewy",
		"latitude": 51.8264,
		"longitude": 19.62787
	},
	{
		"id": 1870,
		"name": "Skoszewy (szkoła)",
		"latitude": 51.8509,
		"longitude": 19.63536
	},
	{
		"id": 1871,
		"name": "Skoszewy",
		"latitude": 51.85483,
		"longitude": 19.63899
	},
	{
		"id": 1872,
		"name": "Skoszewy (szkoła)",
		"latitude": 51.85076,
		"longitude": 19.6352
	},
	{
		"id": 1873,
		"name": "Byszewska-Boginia",
		"latitude": 51.83944,
		"longitude": 19.63337
	},
	{
		"id": 1874,
		"name": "Boginia działki",
		"latitude": 51.83634,
		"longitude": 19.61667
	},
	{
		"id": 1875,
		"name": "Plichtów",
		"latitude": 51.81993,
		"longitude": 19.6259
	},
	{
		"id": 1876,
		"name": "Janów wieś",
		"latitude": 51.81373,
		"longitude": 19.62069
	},
	{
		"id": 1877,
		"name": "Adelmówek",
		"latitude": 51.83833,
		"longitude": 19.42035
	},
	{
		"id": 1878,
		"name": "Łódzka-Kurak (Zgierz)",
		"latitude": 51.84648,
		"longitude": 19.41289
	},
	{
		"id": 1879,
		"name": "1 Maja-3 Maja (Zgierz)",
		"latitude": 51.85164,
		"longitude": 19.41528
	},
	{
		"id": 1880,
		"name": "Łódzka-Kurak (Zgierz)",
		"latitude": 51.84624,
		"longitude": 19.413
	},
	{
		"id": 1881,
		"name": "Łódzka-Ksawerów",
		"latitude": 51.68921,
		"longitude": 19.40608
	},
	{
		"id": 1882,
		"name": "Łódzka-Mały Skręt",
		"latitude": 51.69497,
		"longitude": 19.40914
	},
	{
		"id": 1883,
		"name": "Łódzka-Widzew -Żdżary",
		"latitude": 51.683,
		"longitude": 19.4028
	},
	{
		"id": 1884,
		"name": "Łódzka-Ksawerów",
		"latitude": 51.68888,
		"longitude": 19.40595
	},
	{
		"id": 1885,
		"name": "Łódzka-Teklin",
		"latitude": 51.67676,
		"longitude": 19.39953
	},
	{
		"id": 1886,
		"name": "Łódzka-Widzew -Żdżary",
		"latitude": 51.68256,
		"longitude": 19.40264
	},
	{
		"id": 1887,
		"name": "Łódzka-Dąbrowa",
		"latitude": 51.67042,
		"longitude": 19.39627
	},
	{
		"id": 1888,
		"name": "Łódzka-Teklin",
		"latitude": 51.67634,
		"longitude": 19.39938
	},
	{
		"id": 1889,
		"name": "Warszawska-Duży Skręt",
		"latitude": 51.66408,
		"longitude": 19.39295
	},
	{
		"id": 1890,
		"name": "Warszawska-Dąbrowa",
		"latitude": 51.67,
		"longitude": 19.39612
	},
	{
		"id": 1891,
		"name": "Warszawska-\"Tkaniny Techniczne\"(Pab",
		"latitude": 51.6635,
		"longitude": 19.3861
	},
	{
		"id": 1892,
		"name": "Warszawska-Duży Skręt",
		"latitude": 51.66437,
		"longitude": 19.39317
	},
	{
		"id": 1893,
		"name": "Warszawska-Sikorskiego (Pabianice)",
		"latitude": 51.66375,
		"longitude": 19.37757
	},
	{
		"id": 1894,
		"name": "Warszawska-\"Tkaniny Techniczne\"(Pab",
		"latitude": 51.66344,
		"longitude": 19.38615
	},
	{
		"id": 1895,
		"name": "Warszawska-Kapliczna (Pabianice)",
		"latitude": 51.66395,
		"longitude": 19.37017
	},
	{
		"id": 1896,
		"name": "Warszawska-Nawrockiego (Pabianice)",
		"latitude": 51.66368,
		"longitude": 19.37805
	},
	{
		"id": 1897,
		"name": "Warszawska-Poprzeczna (Pabianice)",
		"latitude": 51.66399,
		"longitude": 19.36582
	},
	{
		"id": 1898,
		"name": "Warszawska-3 Maja (Pabianice)",
		"latitude": 51.66387,
		"longitude": 19.37051
	},
	{
		"id": 1899,
		"name": "Warszawska-Zamek (Pabianice)",
		"latitude": 51.66396,
		"longitude": 19.3603
	},
	{
		"id": 1900,
		"name": "Warszawska-Poprzeczna (Pabianice)",
		"latitude": 51.66386,
		"longitude": 19.36514
	},
	{
		"id": 1901,
		"name": "Zamkowa-św. Jana (Pabianice)",
		"latitude": 51.66437,
		"longitude": 19.35536
	},
	{
		"id": 1902,
		"name": "Warszawska-kościół św. Mateusza (Pa",
		"latitude": 51.66387,
		"longitude": 19.36155
	},
	{
		"id": 1903,
		"name": "Zamkowa-Traugutta (Pabianice)",
		"latitude": 51.6645,
		"longitude": 19.3514
	},
	{
		"id": 1904,
		"name": "Zamkowa-Kilińskiego (Pabianice)",
		"latitude": 51.66429,
		"longitude": 19.35425
	},
	{
		"id": 1905,
		"name": "Zamkowa-Lutomierska (Pabianice)",
		"latitude": 51.6648,
		"longitude": 19.3455
	},
	{
		"id": 1906,
		"name": "Zamkowa-Narutowicza (Pabianice)",
		"latitude": 51.66443,
		"longitude": 19.35137
	},
	{
		"id": 1907,
		"name": "Zamkowa-Staszewskiego (Pab.)",
		"latitude": 51.66497,
		"longitude": 19.34165
	},
	{
		"id": 1908,
		"name": "Zamkowa-Wyspiańskiego (Pabianice)",
		"latitude": 51.66461,
		"longitude": 19.34567
	},
	{
		"id": 1909,
		"name": "Łaska -Mielczarskiego (Pabianice)",
		"latitude": 51.66402,
		"longitude": 19.33598
	},
	{
		"id": 1910,
		"name": "Zamkowa-Konopnickiej (Pabianice)",
		"latitude": 51.6649,
		"longitude": 19.34079
	},
	{
		"id": 1911,
		"name": "Łaska -Tkacka (Pabianice)",
		"latitude": 51.66239,
		"longitude": 19.33203
	},
	{
		"id": 1912,
		"name": "Łaska -Mielczarskiego (Pabianice)",
		"latitude": 51.66387,
		"longitude": 19.33565
	},
	{
		"id": 1913,
		"name": "Łaska -Szarych Szeregów(Pabianice)",
		"latitude": 51.66031,
		"longitude": 19.32653
	},
	{
		"id": 1914,
		"name": "Łaska -Tkacka (Pabianice)",
		"latitude": 51.66236,
		"longitude": 19.33216
	},
	{
		"id": 1915,
		"name": "Dobra Nowiny",
		"latitude": 51.86328,
		"longitude": 19.56741
	},
	{
		"id": 1917,
		"name": "Warszawska-Legionów (Stryków)",
		"latitude": 51.89694,
		"longitude": 19.59906
	},
	{
		"id": 1918,
		"name": "Corning (Smolice)",
		"latitude": 51.8937,
		"longitude": 19.57711
	},
	{
		"id": 1919,
		"name": "Sosnowiec",
		"latitude": 51.88096,
		"longitude": 19.58186
	},
	{
		"id": 1920,
		"name": "Wojska Polskiego-Bratoszewskiego (A",
		"latitude": 51.81617,
		"longitude": 19.31961
	},
	{
		"id": 1921,
		"name": "Szatonia",
		"latitude": 51.81379,
		"longitude": 19.33037
	},
	{
		"id": 1922,
		"name": "Wojska Polskiego-Krótka (Aleksandró",
		"latitude": 51.81766,
		"longitude": 19.31234
	},
	{
		"id": 1923,
		"name": "Wojska Polskiego-Bratoszewskiego (A",
		"latitude": 51.81651,
		"longitude": 19.31736
	},
	{
		"id": 1924,
		"name": "Wojska Polskiego-Południowa (Aleks.",
		"latitude": 51.81873,
		"longitude": 19.30718
	},
	{
		"id": 1925,
		"name": "Warszawska (Aleksandrów)",
		"latitude": 51.82144,
		"longitude": 19.30497
	},
	{
		"id": 1926,
		"name": "Wojska Polskiego-Południowa (Aleks.",
		"latitude": 51.8184,
		"longitude": 19.30845
	},
	{
		"id": 1927,
		"name": "Niecki",
		"latitude": 51.83029,
		"longitude": 19.58268
	},
	{
		"id": 1928,
		"name": "Borchówka 21",
		"latitude": 51.83354,
		"longitude": 19.58917
	},
	{
		"id": 1929,
		"name": "Niecki",
		"latitude": 51.83019,
		"longitude": 19.58215
	},
	{
		"id": 1930,
		"name": "Kalonka (osiedle)",
		"latitude": 51.82799,
		"longitude": 19.57086
	},
	{
		"id": 1931,
		"name": "Borchówka  Las",
		"latitude": 51.8394,
		"longitude": 19.60197
	},
	{
		"id": 1932,
		"name": "Borchówka 39",
		"latitude": 51.83617,
		"longitude": 19.59398
	},
	{
		"id": 1933,
		"name": "Borchówka  Las",
		"latitude": 51.83949,
		"longitude": 19.6024
	},
	{
		"id": 1934,
		"name": "Borchówka  7",
		"latitude": 51.8343,
		"longitude": 19.60697
	},
	{
		"id": 1935,
		"name": "Borchówka  7",
		"latitude": 51.83451,
		"longitude": 19.60758
	},
	{
		"id": 1936,
		"name": "Boginia działki",
		"latitude": 51.83637,
		"longitude": 19.61713
	},
	{
		"id": 1940,
		"name": "Andrespol",
		"latitude": 51.72638,
		"longitude": 19.63735
	},
	{
		"id": 1941,
		"name": "Andrespol O.S.P.",
		"latitude": 51.72679,
		"longitude": 19.63631
	},
	{
		"id": 1942,
		"name": "Tuszyńska-Urząd Gminy(Andrespol)",
		"latitude": 51.72486,
		"longitude": 19.63778
	},
	{
		"id": 1943,
		"name": "Andrespol-Młynarska",
		"latitude": 51.72896,
		"longitude": 19.63245
	},
	{
		"id": 1944,
		"name": "Borchówka 39",
		"latitude": 51.83593,
		"longitude": 19.59362
	},
	{
		"id": 1945,
		"name": "Borchówka 21",
		"latitude": 51.83388,
		"longitude": 19.58972
	},
	{
		"id": 1946,
		"name": "Stryków Dworzec PKP",
		"latitude": 51.91028,
		"longitude": 19.59426
	},
	{
		"id": 1947,
		"name": "Kopernika-Kolejowa (Stryków)",
		"latitude": 51.90547,
		"longitude": 19.59536
	},
	{
		"id": 1948,
		"name": "Kopernika-Słowackiego (Stryków)",
		"latitude": 51.90275,
		"longitude": 19.60453
	},
	{
		"id": 1949,
		"name": "Kopernika-Kolejowa (Stryków)",
		"latitude": 51.90554,
		"longitude": 19.59509
	},
	{
		"id": 1950,
		"name": "Kopernika-Słowackiego (Stryków)",
		"latitude": 51.90303,
		"longitude": 19.60379
	},
	{
		"id": 1951,
		"name": "pl. Łukasińskiego (Stryków)",
		"latitude": 51.9008,
		"longitude": 19.60077
	},
	{
		"id": 1952,
		"name": "Corning (Smolice)",
		"latitude": 51.89368,
		"longitude": 19.57714
	},
	{
		"id": 1953,
		"name": "Targowy Rynek",
		"latitude": 51.82683,
		"longitude": 19.3063
	},
	{
		"id": 1954,
		"name": "Warszawska 16 (Aleksandrów)",
		"latitude": 51.82221,
		"longitude": 19.30526
	},
	{
		"id": 1955,
		"name": "pl. 500-lecia(Rzgów)",
		"latitude": 51.66251,
		"longitude": 19.49017
	},
	{
		"id": 1956,
		"name": "Rudzka-Łódzka(Rzgów)",
		"latitude": 51.66756,
		"longitude": 19.48653
	},
	{
		"id": 1957,
		"name": "Tuszyńska(Rzgów)",
		"latitude": 51.65178,
		"longitude": 19.49406
	},
	{
		"id": 1958,
		"name": "Tuszyńska-Kamienna(Rzgów)",
		"latitude": 51.65683,
		"longitude": 19.49313
	},
	{
		"id": 1959,
		"name": "Rudzka-Nasienna(Rzgów)",
		"latitude": 51.67522,
		"longitude": 19.47512
	},
	{
		"id": 1960,
		"name": "Grabina 50",
		"latitude": 51.82146,
		"longitude": 19.58861
	},
	{
		"id": 1961,
		"name": "Grabina-Grabina/Lipowa1",
		"latitude": 51.81959,
		"longitude": 19.59671
	},
	{
		"id": 1962,
		"name": "Bukowiec-Bukowiec 61",
		"latitude": 51.82216,
		"longitude": 19.58414
	},
	{
		"id": 1963,
		"name": "Grabina 50",
		"latitude": 51.82125,
		"longitude": 19.58994
	},
	{
		"id": 1964,
		"name": "Kalonka-Kalonka/Centrum Ojca Pio",
		"latitude": 51.82575,
		"longitude": 19.57401
	},
	{
		"id": 1965,
		"name": "Bukowiec-Bukowiec 61",
		"latitude": 51.82213,
		"longitude": 19.58419
	},
	{
		"id": 1966,
		"name": "Rudzka-Łódzka(Rzgów)",
		"latitude": 51.66769,
		"longitude": 19.48613
	},
	{
		"id": 1967,
		"name": "Rudzka-Mała(Rzgów)",
		"latitude": 51.67129,
		"longitude": 19.48108
	},
	{
		"id": 1968,
		"name": "pl. 500-lecia(Rzgów)",
		"latitude": 51.66235,
		"longitude": 19.4901
	},
	{
		"id": 1969,
		"name": "Tuszyńska-Kamienna(Rzgów)",
		"latitude": 51.65675,
		"longitude": 19.49286
	},
	{
		"id": 1970,
		"name": "Tuszyńska-Szkoła(Wiśniowa Góra)",
		"latitude": 51.72064,
		"longitude": 19.63257
	},
	{
		"id": 1971,
		"name": "Tuszyńska-Akacjowa(Wiśniowa Góra)",
		"latitude": 51.70813,
		"longitude": 19.6239
	},
	{
		"id": 1972,
		"name": "Tuszyńska-Hanki Sawickiej(Stróża)",
		"latitude": 51.7026,
		"longitude": 19.61978
	},
	{
		"id": 1973,
		"name": "Tuszyńska-Piekarnicza(Wiśniowa Góra",
		"latitude": 51.71537,
		"longitude": 19.62893
	},
	{
		"id": 1974,
		"name": "Tuszyńska-Szkoła(Wiśniowa Góra)",
		"latitude": 51.72112,
		"longitude": 19.63296
	},
	{
		"id": 1975,
		"name": "Tuszyńska-Jednostka Wojskowa(Wiśnio",
		"latitude": 51.71222,
		"longitude": 19.62678
	},
	{
		"id": 1976,
		"name": "Tuszyńska-Piekarnicza(Wiśniowa Góra",
		"latitude": 51.71585,
		"longitude": 19.6294
	},
	{
		"id": 1977,
		"name": "Tuszyńska-Jednostka Wojskowa(Wiśnio",
		"latitude": 51.71264,
		"longitude": 19.62719
	},
	{
		"id": 1978,
		"name": "Tuszyńska-Akacjowa(Wiśniowa Góra)",
		"latitude": 51.7064,
		"longitude": 19.62272
	},
	{
		"id": 1979,
		"name": "Tuszyńska-Hanki Sawickiej(Stróża)",
		"latitude": 51.70269,
		"longitude": 19.61997
	},
	{
		"id": 1980,
		"name": "Krzywickiego-Małachowskiego",
		"latitude": 51.77074,
		"longitude": 19.49404
	},
	{
		"id": 1984,
		"name": "Limanowskiego-Pułaskiego",
		"latitude": 51.79292,
		"longitude": 19.41802
	},
	{
		"id": 1987,
		"name": "Klonowa-Limanowskiego",
		"latitude": 51.78974,
		"longitude": 19.4297
	},
	{
		"id": 1988,
		"name": "Limanowskiego-Mokra",
		"latitude": 51.79114,
		"longitude": 19.42586
	},
	{
		"id": 1990,
		"name": "Limanowskiego-Mokra",
		"latitude": 51.79133,
		"longitude": 19.42565
	},
	{
		"id": 1991,
		"name": "Złotno-Zaporowa",
		"latitude": 51.77783,
		"longitude": 19.38375
	},
	{
		"id": 1992,
		"name": "Złotno-Podchorążych",
		"latitude": 51.77833,
		"longitude": 19.38722
	},
	{
		"id": 1993,
		"name": "Złotno-Zaporowa",
		"latitude": 51.77774,
		"longitude": 19.38246
	},
	{
		"id": 1994,
		"name": "Złotno-Legnicka",
		"latitude": 51.77706,
		"longitude": 19.37691
	},
	{
		"id": 2000,
		"name": "Konstytucyjna-Małachowskiego",
		"latitude": 51.77167,
		"longitude": 19.49899
	},
	{
		"id": 2001,
		"name": "Małachowskiego-Niciarniana",
		"latitude": 51.77144,
		"longitude": 19.50504
	},
	{
		"id": 2022,
		"name": "Kilińskiego-Narutowicza",
		"latitude": 51.77175,
		"longitude": 19.46318
	},
	{
		"id": 2034,
		"name": "Kościuszki(Brzeziny)",
		"latitude": 51.80106,
		"longitude": 19.74218
	},
	{
		"id": 2035,
		"name": "Kościuszki(Brzeziny)",
		"latitude": 51.80112,
		"longitude": 19.74187
	},
	{
		"id": 2036,
		"name": "św.Anny",
		"latitude": 51.79955,
		"longitude": 19.75132
	},
	{
		"id": 2037,
		"name": "Głowackiego(Brzeziny)",
		"latitude": 51.80387,
		"longitude": 19.762
	},
	{
		"id": 2038,
		"name": "Woj. Polskiego(Brzeziny)",
		"latitude": 51.80549,
		"longitude": 19.75528
	},
	{
		"id": 2039,
		"name": "Traugutta(Brzeziny)",
		"latitude": 51.80087,
		"longitude": 19.7521
	},
	{
		"id": 2040,
		"name": "Paprotnia",
		"latitude": 51.80357,
		"longitude": 19.70409
	},
	{
		"id": 2041,
		"name": "Paprotnia",
		"latitude": 51.80364,
		"longitude": 19.7041
	},
	{
		"id": 2042,
		"name": "Łódzka(Brzeziny)",
		"latitude": 51.80248,
		"longitude": 19.72278
	},
	{
		"id": 2043,
		"name": "Łódzka(Brzeziny)",
		"latitude": 51.80258,
		"longitude": 19.72255
	},
	{
		"id": 2044,
		"name": "Techniczna-Puszkina",
		"latitude": 51.73693,
		"longitude": 19.53361
	},
	{
		"id": 2045,
		"name": "Techniczna 6",
		"latitude": 51.73886,
		"longitude": 19.5379
	},
	{
		"id": 2046,
		"name": "Franciszkańska-Tokarzewskiego",
		"latitude": 51.79098,
		"longitude": 19.46005
	},
	{
		"id": 2049,
		"name": "Franciszkańska-Tokarzewskiego",
		"latitude": 51.79151,
		"longitude": 19.46009
	},
	{
		"id": 2051,
		"name": "Spadochroniarzy-Biegunowa",
		"latitude": 51.77294,
		"longitude": 19.3863
	},
	{
		"id": 2052,
		"name": "Biegunowa-Krakowska",
		"latitude": 51.77418,
		"longitude": 19.39841
	},
	{
		"id": 2053,
		"name": "Biegunowa-Krańcowa",
		"latitude": 51.77252,
		"longitude": 19.3929
	},
	{
		"id": 2054,
		"name": "Fizylierów-Złotno",
		"latitude": 51.77815,
		"longitude": 19.38879
	},
	{
		"id": 2055,
		"name": "Spadochroniarzy-Biegunowa",
		"latitude": 51.77242,
		"longitude": 19.38585
	},
	{
		"id": 2056,
		"name": "Podchorążych-Napoleońska",
		"latitude": 51.77902,
		"longitude": 19.38487
	},
	{
		"id": 2057,
		"name": "Podchorążych-Napoleońska",
		"latitude": 51.77912,
		"longitude": 19.38382
	},
	{
		"id": 2058,
		"name": "Biegunowa-Krańcowa",
		"latitude": 51.77297,
		"longitude": 19.39423
	},
	{
		"id": 2059,
		"name": "Podchorążych-Łucznicza",
		"latitude": 51.78,
		"longitude": 19.37862
	},
	{
		"id": 2060,
		"name": "Podchorążych-Łucznicza",
		"latitude": 51.78,
		"longitude": 19.37802
	},
	{
		"id": 2062,
		"name": "Podchorążych 121",
		"latitude": 51.78213,
		"longitude": 19.36212
	},
	{
		"id": 2063,
		"name": "Podchorążych 121",
		"latitude": 51.7821,
		"longitude": 19.36152
	},
	{
		"id": 2064,
		"name": "Podchorążych-Szczecińska",
		"latitude": 51.78301,
		"longitude": 19.34966
	},
	{
		"id": 2065,
		"name": "Fizylierów-Złotno",
		"latitude": 51.77811,
		"longitude": 19.38863
	},
	{
		"id": 2066,
		"name": "Podchorążych-Molla",
		"latitude": 51.78151,
		"longitude": 19.36863
	},
	{
		"id": 2067,
		"name": "Molla",
		"latitude": 51.7812,
		"longitude": 19.37036
	},
	{
		"id": 2068,
		"name": "Podchorążych-Szczecińska",
		"latitude": 51.78297,
		"longitude": 19.3487
	},
	{
		"id": 2069,
		"name": "Niesięcin-Szczecińska",
		"latitude": 51.77471,
		"longitude": 19.33744
	},
	{
		"id": 2070,
		"name": "Niesięcin-Szczecińska",
		"latitude": 51.77477,
		"longitude": 19.33709
	},
	{
		"id": 2071,
		"name": "Niesięcin-Aleksandrowska",
		"latitude": 51.77428,
		"longitude": 19.32591
	},
	{
		"id": 2072,
		"name": "Niesięcin-Niesięcin",
		"latitude": 51.77434,
		"longitude": 19.31513
	},
	{
		"id": 2075,
		"name": "Rąbień Centrum",
		"latitude": 51.79881,
		"longitude": 19.32268
	},
	{
		"id": 2076,
		"name": "Rąbień Centrum",
		"latitude": 51.7981,
		"longitude": 19.32239
	},
	{
		"id": 2078,
		"name": "Niesięcin-Aleksandrowska",
		"latitude": 51.77425,
		"longitude": 19.32786
	},
	{
		"id": 2080,
		"name": "Konstantynowska-Zajezdnia Muzealna",
		"latitude": 51.75362,
		"longitude": 19.38207
	},
	{
		"id": 2081,
		"name": "Konstantynowska-Zajezdnia Muzealna",
		"latitude": 51.75368,
		"longitude": 19.38189
	},
	{
		"id": 2082,
		"name": "Konstantynowska-Krakowska",
		"latitude": 51.76271,
		"longitude": 19.40835
	},
	{
		"id": 2083,
		"name": "Lutomierska-Włókniarzy",
		"latitude": 51.78965,
		"longitude": 19.422
	},
	{
		"id": 2084,
		"name": "Lutomierska-Włókniarzy",
		"latitude": 51.78932,
		"longitude": 19.42271
	},
	{
		"id": 2085,
		"name": "pl. Jana Pawła II",
		"latitude": 51.75484,
		"longitude": 19.21167
	},
	{
		"id": 2086,
		"name": "plac Wolności (Konstantynów)",
		"latitude": 51.75041,
		"longitude": 19.31345
	},
	{
		"id": 2087,
		"name": "Ozorków (Cegielniana)",
		"latitude": 51.95931,
		"longitude": 19.28058
	},
	{
		"id": 2088,
		"name": "Konstantynów Łódzki-Szkoła",
		"latitude": 51.7485,
		"longitude": 19.35415
	},
	{
		"id": 2089,
		"name": "Konstantynów Łódzki-Szkoła",
		"latitude": 51.74846,
		"longitude": 19.35396
	},
	{
		"id": 2090,
		"name": "Konstantynów Łódzki-Ignacew",
		"latitude": 51.75962,
		"longitude": 19.2648
	},
	{
		"id": 2091,
		"name": "Konstantynów Łódzki-Ignacew",
		"latitude": 51.75959,
		"longitude": 19.26487
	},
	{
		"id": 2092,
		"name": "plac Kościuszki (Konstantynów)",
		"latitude": 51.7475,
		"longitude": 19.32611
	},
	{
		"id": 2093,
		"name": "plac Kościuszki (Konstantynów)",
		"latitude": 51.74765,
		"longitude": 19.32518
	},
	{
		"id": 2094,
		"name": "Konstantynów Łódzki-Konstantynówek",
		"latitude": 51.75422,
		"longitude": 19.29256
	},
	{
		"id": 2095,
		"name": "Mirosławice",
		"latitude": 51.759,
		"longitude": 19.24104
	},
	{
		"id": 2098,
		"name": "Mirosławice",
		"latitude": 51.75896,
		"longitude": 19.24144
	},
	{
		"id": 2099,
		"name": "Konstantynów Łódzki-Konstantynówek",
		"latitude": 51.75414,
		"longitude": 19.29264
	},
	{
		"id": 2100,
		"name": "Musierowicza (Zgierz)",
		"latitude": 51.86323,
		"longitude": 19.40078
	},
	{
		"id": 2101,
		"name": "Gałczyńskiego (Zgierz)",
		"latitude": 51.86361,
		"longitude": 19.40043
	},
	{
		"id": 2102,
		"name": "Przedmieście (Zgierz)",
		"latitude": 51.87026,
		"longitude": 19.39568
	},
	{
		"id": 2103,
		"name": "Przedmieście (Zgierz)",
		"latitude": 51.87011,
		"longitude": 19.39573
	},
	{
		"id": 2104,
		"name": "Zgierz-Proboszczewice I",
		"latitude": 51.87545,
		"longitude": 19.39258
	},
	{
		"id": 2105,
		"name": "Zgierz-Proboszczewice I",
		"latitude": 51.87568,
		"longitude": 19.39248
	},
	{
		"id": 2106,
		"name": "Zgierz-Proboszczewice II",
		"latitude": 51.88261,
		"longitude": 19.38723
	},
	{
		"id": 2107,
		"name": "Zgierz-Proboszczewice II",
		"latitude": 51.88245,
		"longitude": 19.3874
	},
	{
		"id": 2108,
		"name": "LuŹmierz",
		"latitude": 51.89795,
		"longitude": 19.37325
	},
	{
		"id": 2109,
		"name": "LuŹmierz",
		"latitude": 51.89783,
		"longitude": 19.37328
	},
	{
		"id": 2110,
		"name": "Emilia (Rosanów)",
		"latitude": 51.91475,
		"longitude": 19.36475
	},
	{
		"id": 2111,
		"name": "Emilia (Rosanów)",
		"latitude": 51.91453,
		"longitude": 19.3649
	},
	{
		"id": 2112,
		"name": "Emilia (Kania Góra)",
		"latitude": 51.92326,
		"longitude": 19.3604
	},
	{
		"id": 2113,
		"name": "Emilia (Kania Góra)",
		"latitude": 51.92338,
		"longitude": 19.36033
	},
	{
		"id": 2114,
		"name": "Słowik (szkoła)",
		"latitude": 51.92866,
		"longitude": 19.35285
	},
	{
		"id": 2115,
		"name": "Słowik (szkoła)",
		"latitude": 51.92883,
		"longitude": 19.3525
	},
	{
		"id": 2116,
		"name": "Słowik",
		"latitude": 51.93688,
		"longitude": 19.33795
	},
	{
		"id": 2117,
		"name": "Słowik",
		"latitude": 51.93665,
		"longitude": 19.33838
	},
	{
		"id": 2118,
		"name": "Aleksandria",
		"latitude": 51.9413,
		"longitude": 19.3305
	},
	{
		"id": 2119,
		"name": "Aleksandria",
		"latitude": 51.94129,
		"longitude": 19.33071
	},
	{
		"id": 2120,
		"name": "Tartak (Ozorków)",
		"latitude": 51.94723,
		"longitude": 19.32098
	},
	{
		"id": 2121,
		"name": "Tartak (Ozorków)",
		"latitude": 51.94675,
		"longitude": 19.32176
	},
	{
		"id": 2122,
		"name": "Ozorków Las",
		"latitude": 51.9516,
		"longitude": 19.31383
	},
	{
		"id": 2123,
		"name": "Ozorków Las",
		"latitude": 51.95151,
		"longitude": 19.31391
	},
	{
		"id": 2124,
		"name": "Cmentarz (Ozorków)",
		"latitude": 51.95566,
		"longitude": 19.30713
	},
	{
		"id": 2125,
		"name": "Cmentarz (Ozorków)",
		"latitude": 51.95555,
		"longitude": 19.30741
	},
	{
		"id": 2126,
		"name": "Wyszyńskiego (Ozorków)",
		"latitude": 51.96021,
		"longitude": 19.29711
	},
	{
		"id": 2127,
		"name": "Wyszyńskiego (Ozorków)",
		"latitude": 51.96031,
		"longitude": 19.29725
	},
	{
		"id": 2128,
		"name": "Nowy Rynek (Ozorków)",
		"latitude": 51.95805,
		"longitude": 19.28851
	},
	{
		"id": 2129,
		"name": "Nowy Rynek (Ozorków)",
		"latitude": 51.95817,
		"longitude": 19.28822
	},
	{
		"id": 2130,
		"name": "Łódzka-Śniechowskiego (Zgierz)",
		"latitude": 51.85175,
		"longitude": 19.40793
	},
	{
		"id": 2131,
		"name": "Łódzka-Śniechowskiego (Zgierz)",
		"latitude": 51.85158,
		"longitude": 19.4081
	},
	{
		"id": 2132,
		"name": "Stary Rynek(Zgierz)",
		"latitude": 51.85491,
		"longitude": 19.40513
	},
	{
		"id": 2133,
		"name": "Stary Rynek(Zgierz)",
		"latitude": 51.85483,
		"longitude": 19.40535
	},
	{
		"id": 2134,
		"name": "Łęczycka-Al.Armii Krajowej(Zgierz)",
		"latitude": 51.85888,
		"longitude": 19.4048
	},
	{
		"id": 2135,
		"name": "Łęczycka-Łaźnia (Zgierz)",
		"latitude": 51.86,
		"longitude": 19.40396
	},
	{
		"id": 2136,
		"name": "Mirosławice I",
		"latitude": 51.7594,
		"longitude": 19.25261
	},
	{
		"id": 2137,
		"name": "Mirosławice I",
		"latitude": 51.75938,
		"longitude": 19.25287
	},
	{
		"id": 2138,
		"name": "Lutomiersk-Klasztor",
		"latitude": 51.75844,
		"longitude": 19.22231
	},
	{
		"id": 2139,
		"name": "Lutomiersk-Klasztor",
		"latitude": 51.75815,
		"longitude": 19.22188
	},
	{
		"id": 2140,
		"name": "Konstantynów Łódzki-Krzywa",
		"latitude": 51.75671,
		"longitude": 19.27991
	},
	{
		"id": 2141,
		"name": "Konstantynów Łódzki-Krzywa",
		"latitude": 51.75679,
		"longitude": 19.27962
	},
	{
		"id": 2142,
		"name": "Konstantynów Łódzki-Żabiczki",
		"latitude": 51.75568,
		"longitude": 19.28528
	},
	{
		"id": 2143,
		"name": "Konstantynów Łódzki-Żabiczki",
		"latitude": 51.75561,
		"longitude": 19.28551
	},
	{
		"id": 2144,
		"name": "Konstantynów Łódzki-Przedmieście",
		"latitude": 51.75295,
		"longitude": 19.29898
	},
	{
		"id": 2145,
		"name": "Konstantynów Łódzki-Przedmieście",
		"latitude": 51.75291,
		"longitude": 19.29888
	},
	{
		"id": 2146,
		"name": "Konstantynów Łódzki-Sienkiewicza",
		"latitude": 51.75157,
		"longitude": 19.30574
	},
	{
		"id": 2147,
		"name": "Konstantynów Łódzki-Sienkiewicza",
		"latitude": 51.75149,
		"longitude": 19.30595
	},
	{
		"id": 2148,
		"name": "Konstantynów Łódzki-plac Wolności",
		"latitude": 51.74992,
		"longitude": 19.31383
	},
	{
		"id": 2149,
		"name": "Konstantynów Łódzki-plac Wolności",
		"latitude": 51.7501,
		"longitude": 19.31309
	},
	{
		"id": 2150,
		"name": "Konstantynów Łódzki-Daszyńskiego",
		"latitude": 51.74884,
		"longitude": 19.31941
	},
	{
		"id": 2151,
		"name": "Konstantynów Łódzki-Moniuszki",
		"latitude": 51.74876,
		"longitude": 19.31951
	},
	{
		"id": 2152,
		"name": "Konstantynów Łódzki-Krótka",
		"latitude": 51.74658,
		"longitude": 19.33093
	},
	{
		"id": 2153,
		"name": "Konstantynów Łódzki-Krótka",
		"latitude": 51.74655,
		"longitude": 19.3312
	},
	{
		"id": 2154,
		"name": "Konstantynów Łódzki-Gdańska",
		"latitude": 51.74729,
		"longitude": 19.33968
	},
	{
		"id": 2155,
		"name": "Konstantynów Łódzki-Gdańska",
		"latitude": 51.74725,
		"longitude": 19.33999
	},
	{
		"id": 2156,
		"name": "Konstantynów Łódzki-Spółdzielcza",
		"latitude": 51.74817,
		"longitude": 19.34982
	},
	{
		"id": 2157,
		"name": "Konstantynów Łódzki-Spółdzielcza",
		"latitude": 51.74799,
		"longitude": 19.3491
	},
	{
		"id": 2158,
		"name": "Konstantynów Łódzki-Srebrna",
		"latitude": 51.74897,
		"longitude": 19.35843
	},
	{
		"id": 2159,
		"name": "Konstantynów Łódzki-Srebrna",
		"latitude": 51.74906,
		"longitude": 19.35918
	},
	{
		"id": 2160,
		"name": "Konstantynów Łódzki-Cegielniana",
		"latitude": 51.75038,
		"longitude": 19.36547
	},
	{
		"id": 2161,
		"name": "Konstantynów Łódzki-Cegielniana",
		"latitude": 51.75038,
		"longitude": 19.36567
	},
	{
		"id": 2166,
		"name": "Zielony Romanów",
		"latitude": 51.80735,
		"longitude": 19.32105
	},
	{
		"id": 2167,
		"name": "Proboszczewice II mijanka",
		"latitude": 51.87843,
		"longitude": 19.3909
	},
	{
		"id": 2168,
		"name": "Konstantynów Łódzki-Srebrna mijanka",
		"latitude": 51.7487,
		"longitude": 19.35622
	},
	{
		"id": 2169,
		"name": "Konstantynów Łódzki-Gdańska mijanka",
		"latitude": 51.74771,
		"longitude": 19.34492
	},
	{
		"id": 2170,
		"name": "Wyszyńskiego mijanka(Ozorków)",
		"latitude": 51.95721,
		"longitude": 19.29347
	},
	{
		"id": 2171,
		"name": "pl. Wolności",
		"latitude": 51.77644,
		"longitude": 19.45477
	},
	{
		"id": 2175,
		"name": "Narutowicza-P.O.W.",
		"latitude": 51.77148,
		"longitude": 19.46584
	},
	{
		"id": 2176,
		"name": "Starowa Góra-Centralna",
		"latitude": 51.69071,
		"longitude": 19.47666
	},
	{
		"id": 2177,
		"name": "Starowa Góra-Starowa Góra - Central",
		"latitude": 51.69105,
		"longitude": 19.47751
	},
	{
		"id": 2181,
		"name": "Telefoniczna (Zaj.MPK)",
		"latitude": 51.78335,
		"longitude": 19.50283
	},
	{
		"id": 2182,
		"name": "Zgierska-Helenówek",
		"latitude": 51.82985,
		"longitude": 19.42581
	},
	{
		"id": 2183,
		"name": "Zgierska-Helenówek",
		"latitude": 51.82839,
		"longitude": 19.42657
	},
	{
		"id": 2184,
		"name": "1 Maja-plac Kilińskiego (Zgierz)",
		"latitude": 51.85446,
		"longitude": 19.41632
	},
	{
		"id": 2185,
		"name": "Kurak (Zgierz)",
		"latitude": 51.8472,
		"longitude": 19.41237
	},
	{
		"id": 2186,
		"name": "Kurak (Zgierz)",
		"latitude": 51.84636,
		"longitude": 19.41312
	},
	{
		"id": 2190,
		"name": "Piłsudskiego-Przędzalniana",
		"latitude": 51.76094,
		"longitude": 19.48014
	},
	{
		"id": 2198,
		"name": "Stróża-Gajowa",
		"latitude": 51.69619,
		"longitude": 19.61429
	},
	{
		"id": 2199,
		"name": "Stróża-Gajowa",
		"latitude": 51.69628,
		"longitude": 19.6145
	},
	{
		"id": 2200,
		"name": "Stróża-Ludwików",
		"latitude": 51.69186,
		"longitude": 19.61028
	},
	{
		"id": 2201,
		"name": "Konstantynowska-Smulska",
		"latitude": 51.75167,
		"longitude": 19.37202
	},
	{
		"id": 2202,
		"name": "Konstantynowska-Smulska",
		"latitude": 51.75154,
		"longitude": 19.37191
	},
	{
		"id": 2203,
		"name": "Konstantynowska-Krańcowa",
		"latitude": 51.75945,
		"longitude": 19.39898
	},
	{
		"id": 2204,
		"name": "Konstantynowska-Krańcowa",
		"latitude": 51.75944,
		"longitude": 19.39913
	},
	{
		"id": 2208,
		"name": "Natolin",
		"latitude": 51.79259,
		"longitude": 19.61932
	},
	{
		"id": 2209,
		"name": "Natolin",
		"latitude": 51.79282,
		"longitude": 19.61936
	},
	{
		"id": 2210,
		"name": "Natolin - pętla",
		"latitude": 51.79576,
		"longitude": 19.62962
	},
	{
		"id": 2211,
		"name": "Teolin",
		"latitude": 51.79963,
		"longitude": 19.63928
	},
	{
		"id": 2212,
		"name": "Teolin",
		"latitude": 51.80046,
		"longitude": 19.64117
	},
	{
		"id": 2213,
		"name": "Lipiny 67",
		"latitude": 51.80636,
		"longitude": 19.6616
	},
	{
		"id": 2214,
		"name": "Lipiny 67",
		"latitude": 51.80638,
		"longitude": 19.65943
	},
	{
		"id": 2215,
		"name": "Lipiny",
		"latitude": 51.80633,
		"longitude": 19.66738
	},
	{
		"id": 2216,
		"name": "Lipiny",
		"latitude": 51.80651,
		"longitude": 19.66959
	},
	{
		"id": 2217,
		"name": "Stary Imielnik-Stary Imielnik 45A",
		"latitude": 51.84684,
		"longitude": 19.58094
	},
	{
		"id": 2218,
		"name": "Stary Imielnik-Stary Imielnik 45",
		"latitude": 51.84692,
		"longitude": 19.58033
	},
	{
		"id": 2219,
		"name": "Dobieszków-O.Sz. i W",
		"latitude": 51.85198,
		"longitude": 19.59266
	},
	{
		"id": 2220,
		"name": "Dobieszków-Hotel",
		"latitude": 51.85193,
		"longitude": 19.59246
	},
	{
		"id": 2221,
		"name": "Dobieszków-Młyn",
		"latitude": 51.85632,
		"longitude": 19.59838
	},
	{
		"id": 2222,
		"name": "Dobieszków-Młyn",
		"latitude": 51.85548,
		"longitude": 19.59935
	},
	{
		"id": 2223,
		"name": "Dobieszków-Wieś",
		"latitude": 51.85965,
		"longitude": 19.59171
	},
	{
		"id": 2224,
		"name": "Dobieszków-Wieś",
		"latitude": 51.85951,
		"longitude": 19.59188
	},
	{
		"id": 2225,
		"name": "Michałówek-Michałówek",
		"latitude": 51.86384,
		"longitude": 19.58063
	},
	{
		"id": 2226,
		"name": "Michałówek-Michałówek 26",
		"latitude": 51.86356,
		"longitude": 19.58163
	},
	{
		"id": 2227,
		"name": "Michałówek / Dobra",
		"latitude": 51.86691,
		"longitude": 19.57068
	},
	{
		"id": 2228,
		"name": "Stary Imielnik-Stary Imielnik 17",
		"latitude": 51.84643,
		"longitude": 19.57059
	},
	{
		"id": 2229,
		"name": "Stary Imielnik-Stary Imielnik 18",
		"latitude": 51.8464,
		"longitude": 19.57033
	},
	{
		"id": 2230,
		"name": "Zielony Romanów",
		"latitude": 51.80655,
		"longitude": 19.32164
	},
	{
		"id": 2231,
		"name": "Uniwersytecka-Rewolucji 1905 r.",
		"latitude": 51.77542,
		"longitude": 19.47675
	},
	{
		"id": 2233,
		"name": "Lotnisko",
		"latitude": 51.72737,
		"longitude": 19.40077
	},
	{
		"id": 2234,
		"name": "Dąbrowa-Dąbrowa",
		"latitude": 51.81256,
		"longitude": 19.55399
	},
	{
		"id": 2235,
		"name": "Dąbrowa-Dąbrowa",
		"latitude": 51.8126,
		"longitude": 19.55398
	},
	{
		"id": 2236,
		"name": "Kopanka-Kopanka 24a",
		"latitude": 51.82342,
		"longitude": 19.56286
	},
	{
		"id": 2237,
		"name": "Kopanka-Kopanka 24a",
		"latitude": 51.82293,
		"longitude": 19.5627
	},
	{
		"id": 2239,
		"name": "Konstantynowska-CPN",
		"latitude": 51.81109,
		"longitude": 19.31924
	},
	{
		"id": 2240,
		"name": "Konstantynowska-CPN",
		"latitude": 51.81084,
		"longitude": 19.31902
	},
	{
		"id": 2241,
		"name": "Złotno-Huta Jagodnica",
		"latitude": 51.77554,
		"longitude": 19.34934
	},
	{
		"id": 2243,
		"name": "Rudzka-Nasienna(Rzgów)",
		"latitude": 51.67572,
		"longitude": 19.47407
	},
	{
		"id": 2244,
		"name": "Rzgów-Zachodnia-Łódzka",
		"latitude": 51.68319,
		"longitude": 19.47656
	},
	{
		"id": 2245,
		"name": "Stara Gadka  - cmentarz",
		"latitude": 51.67869,
		"longitude": 19.46981
	},
	{
		"id": 2250,
		"name": "Stara Gadka  - cmentarz",
		"latitude": 51.67846,
		"longitude": 19.46955
	},
	{
		"id": 2251,
		"name": "Stara Gadka-Stara Gadka - Uczniowsk",
		"latitude": 51.68312,
		"longitude": 19.46178
	},
	{
		"id": 2252,
		"name": "Stara Gadka-Stara Gadka - Zdrojowa",
		"latitude": 51.68289,
		"longitude": 19.46235
	},
	{
		"id": 2267,
		"name": "Kalonka",
		"latitude": 51.82717,
		"longitude": 19.56506
	},
	{
		"id": 2268,
		"name": "Kalonka",
		"latitude": 51.82723,
		"longitude": 19.56539
	},
	{
		"id": 2275,
		"name": "Kolumny-Stróża Sawickiej  - pętla",
		"latitude": 51.70219,
		"longitude": 19.61927
	},
	{
		"id": 2276,
		"name": "Wiączyń Dolny-Wiączyń Dolny 4",
		"latitude": 51.77571,
		"longitude": 19.61349
	},
	{
		"id": 2277,
		"name": "Wiączyń Dolny-Wiączyń Dolny 4",
		"latitude": 51.77593,
		"longitude": 19.61328
	},
	{
		"id": 2278,
		"name": "Wiączyń Dolny-Wiączyń Dolny 18",
		"latitude": 51.76906,
		"longitude": 19.62208
	},
	{
		"id": 2279,
		"name": "Wiączyń Dolny-Wiączyń Dolny 18",
		"latitude": 51.76924,
		"longitude": 19.62206
	},
	{
		"id": 2280,
		"name": "Wiączyń Dolny-Wiączyń Dolny Gimnazj",
		"latitude": 51.76708,
		"longitude": 19.62474
	},
	{
		"id": 2281,
		"name": "Wiączyń Dolny-Wiączyń Dolny Gimnazj",
		"latitude": 51.76742,
		"longitude": 19.6244
	},
	{
		"id": 2282,
		"name": "Wiączyń Dolny-Wiączyń Dolny 42",
		"latitude": 51.76191,
		"longitude": 19.63145
	},
	{
		"id": 2283,
		"name": "Wiączyń Dolny-Wiączyń Dolny 42",
		"latitude": 51.76183,
		"longitude": 19.63173
	},
	{
		"id": 2295,
		"name": "Lipiny - pętla",
		"latitude": 51.80804,
		"longitude": 19.67294
	},
	{
		"id": 2296,
		"name": "Paprotnia I",
		"latitude": 51.8032,
		"longitude": 19.71215
	},
	{
		"id": 2297,
		"name": "Paprotnia I",
		"latitude": 51.80325,
		"longitude": 19.71175
	},
	{
		"id": 2301,
		"name": "Tuszyńska-Rzemieślnicza(Rzgów)",
		"latitude": 51.65139,
		"longitude": 19.49342
	},
	{
		"id": 2302,
		"name": "Tuszyńska-Centrum Handlowe PTAK",
		"latitude": 51.64656,
		"longitude": 19.49393
	},
	{
		"id": 2303,
		"name": "Tuszyńska-Centrum Handlowe PTAK",
		"latitude": 51.64715,
		"longitude": 19.49395
	},
	{
		"id": 2304,
		"name": "C.T. \"Ptak Outlet\"",
		"latitude": 51.64508,
		"longitude": 19.4875
	},
	{
		"id": 2305,
		"name": "Kalonka II",
		"latitude": 51.82768,
		"longitude": 19.56939
	},
	{
		"id": 2306,
		"name": "Kalonka II",
		"latitude": 51.82769,
		"longitude": 19.56918
	},
	{
		"id": 2308,
		"name": "Zarzewska-pl. Niepodległości",
		"latitude": 51.7414,
		"longitude": 19.46471
	},
	{
		"id": 2309,
		"name": "Sieradzka-pl. Niepodległości",
		"latitude": 51.74125,
		"longitude": 19.46339
	},
	{
		"id": 2331,
		"name": "Karolewska-Włókniarzy (Dw. Łódź Kal",
		"latitude": 51.75726,
		"longitude": 19.43268
	},
	{
		"id": 2332,
		"name": "Karolewska-Włókniarzy (Dw. Łódź Kal",
		"latitude": 51.75707,
		"longitude": 19.43271
	},
	{
		"id": 2337,
		"name": "Św. Franciszka-Zenitowa",
		"latitude": 51.72696,
		"longitude": 19.43176
	},
	{
		"id": 2338,
		"name": "Św. Franciszka-Zwrotnikowa",
		"latitude": 51.72674,
		"longitude": 19.43915
	},
	{
		"id": 2339,
		"name": "Prądzyńskiego-Darniowa",
		"latitude": 51.72293,
		"longitude": 19.43125
	},
	{
		"id": 2340,
		"name": "Prądzyńskiego-Rozwojowa",
		"latitude": 51.723,
		"longitude": 19.42401
	},
	{
		"id": 2353,
		"name": "Piłsudskiego-Targowa",
		"latitude": 51.76081,
		"longitude": 19.4737
	},
	{
		"id": 2364,
		"name": "Tatrzańska-Dąbrowskiego",
		"latitude": 51.73624,
		"longitude": 19.49442
	},
	{
		"id": 2366,
		"name": "Stara Gadka-Skrajna",
		"latitude": 51.68863,
		"longitude": 19.45265
	},
	{
		"id": 2367,
		"name": "Starowa Góra-Zagłoby",
		"latitude": 51.69623,
		"longitude": 19.47864
	},
	{
		"id": 2376,
		"name": "Mickiewicza-Łąkowa",
		"latitude": 51.75638,
		"longitude": 19.44235
	},
	{
		"id": 2377,
		"name": "Mickiewicza-Łąkowa",
		"latitude": 51.75664,
		"longitude": 19.44231
	},
	{
		"id": 2381,
		"name": "Narutowicza-Kopcińskiego",
		"latitude": 51.77307,
		"longitude": 19.48418
	},
	{
		"id": 2393,
		"name": "Sienkiewicza-Nawrot",
		"latitude": 51.7626,
		"longitude": 19.46222
	},
	{
		"id": 2397,
		"name": "Piotrkowska-Brzeźna",
		"latitude": 51.75185,
		"longitude": 19.46013
	},
	{
		"id": 2398,
		"name": "Piotrkowska-Czerwona",
		"latitude": 51.747,
		"longitude": 19.46134
	},
	{
		"id": 2401,
		"name": "Ogrodowa-Cmentarna",
		"latitude": 51.77607,
		"longitude": 19.43762
	},
	{
		"id": 2411,
		"name": "Służbowa-Jurczyńskiego",
		"latitude": 51.76082,
		"longitude": 19.55119
	},
	{
		"id": 2412,
		"name": "Służbowa-Jurczyńskiego",
		"latitude": 51.76069,
		"longitude": 19.5516
	},
	{
		"id": 2416,
		"name": "ŁSSE Nowy Józefów",
		"latitude": 51.74092,
		"longitude": 19.36742
	},
	{
		"id": 2418,
		"name": "Gillette-Nowy Józefów",
		"latitude": 51.74002,
		"longitude": 19.36755
	},
	{
		"id": 2425,
		"name": "Daszyńskiego-Sienkiewicza (Aleksand",
		"latitude": 51.82374,
		"longitude": 19.30348
	},
	{
		"id": 2426,
		"name": "1 Maja-MDK (Aleksandrów)",
		"latitude": 51.82247,
		"longitude": 19.29834
	},
	{
		"id": 2427,
		"name": "1 Maja-MDK (Aleksandrów)",
		"latitude": 51.82085,
		"longitude": 19.29748
	},
	{
		"id": 2428,
		"name": "Wierzbińska-11-go Listopada (Aleksa",
		"latitude": 51.81627,
		"longitude": 19.30191
	},
	{
		"id": 2429,
		"name": "Daszyńskiego-Sienkiewicza (Aleksand",
		"latitude": 51.82382,
		"longitude": 19.30288
	},
	{
		"id": 2430,
		"name": "Pabianicka-Piłsudskiego (Aleksandró",
		"latitude": 51.81303,
		"longitude": 19.31735
	},
	{
		"id": 2431,
		"name": "Pabianicka-Południowa (Aleksandrów)",
		"latitude": 51.81519,
		"longitude": 19.30697
	},
	{
		"id": 2432,
		"name": "Poselska (Aleksandrów)",
		"latitude": 51.80823,
		"longitude": 19.31966
	},
	{
		"id": 2433,
		"name": "Słowiańska-szkoła (Rąbień)",
		"latitude": 51.78962,
		"longitude": 19.32185
	},
	{
		"id": 2434,
		"name": "Słowiańska-szkoła (Rąbień)",
		"latitude": 51.78951,
		"longitude": 19.32166
	},
	{
		"id": 2435,
		"name": "Słowiańska-Szaraka (Rąbień)",
		"latitude": 51.79013,
		"longitude": 19.33252
	},
	{
		"id": 2436,
		"name": "Słowiańska-Szaraka (Rąbień)",
		"latitude": 51.79005,
		"longitude": 19.33271
	},
	{
		"id": 2437,
		"name": "Słowiańska-Wysoka (Rąbień)",
		"latitude": 51.79058,
		"longitude": 19.34267
	},
	{
		"id": 2438,
		"name": "Słowiańska-Wysoka (Rąbień)",
		"latitude": 51.79047,
		"longitude": 19.3429
	},
	{
		"id": 2439,
		"name": "Słowiańska-Szczecińska (Antoniew)",
		"latitude": 51.79009,
		"longitude": 19.35279
	},
	{
		"id": 2440,
		"name": "Słowiańska-Szczecińska (Antoniew)",
		"latitude": 51.78995,
		"longitude": 19.35296
	},
	{
		"id": 2442,
		"name": "MATEK POLSKICH",
		"latitude": 51.70351,
		"longitude": 19.48043
	},
	{
		"id": 2444,
		"name": "Kotoniarska-Szybowa",
		"latitude": 51.7227,
		"longitude": 19.52705
	},
	{
		"id": 2445,
		"name": "Kotoniarska-Szybowa",
		"latitude": 51.72266,
		"longitude": 19.52688
	},
	{
		"id": 2446,
		"name": "Kolumny-Rzgowska",
		"latitude": 51.70934,
		"longitude": 19.48899
	},
	{
		"id": 2447,
		"name": "Kolumny-Rzgowska",
		"latitude": 51.7095,
		"longitude": 19.48939
	},
	{
		"id": 2448,
		"name": "Kolumny-Kolumny 88",
		"latitude": 51.71078,
		"longitude": 19.50123
	},
	{
		"id": 2449,
		"name": "Kolumny-Kolumny 88",
		"latitude": 51.71079,
		"longitude": 19.50233
	},
	{
		"id": 2450,
		"name": "Kolumny-Kolumny 118",
		"latitude": 51.70906,
		"longitude": 19.5084
	},
	{
		"id": 2451,
		"name": "Kolumny-Kolumny 118",
		"latitude": 51.7082,
		"longitude": 19.51223
	},
	{
		"id": 2457,
		"name": "Struga-Piotrkowska",
		"latitude": 51.76548,
		"longitude": 19.45646
	},
	{
		"id": 2459,
		"name": "Marmurowa-Opolska",
		"latitude": 51.80723,
		"longitude": 19.54548
	},
	{
		"id": 2460,
		"name": "Marmurowa-Opolska",
		"latitude": 51.80728,
		"longitude": 19.54569
	},
	{
		"id": 2461,
		"name": "Paprotnia-Moczydła",
		"latitude": 51.8056,
		"longitude": 19.67906
	},
	{
		"id": 2462,
		"name": "Paprotnia-Moczydła",
		"latitude": 51.80573,
		"longitude": 19.67968
	},
	{
		"id": 2463,
		"name": "Rojna-Szczecińska",
		"latitude": 51.7958,
		"longitude": 19.36141
	},
	{
		"id": 2465,
		"name": "plac Niepodległości",
		"latitude": 51.74034,
		"longitude": 19.46302
	},
	{
		"id": 2466,
		"name": "Zgierska-Sikorskiego",
		"latitude": 51.81693,
		"longitude": 19.43376
	},
	{
		"id": 2467,
		"name": "Dąbrowskiego-Dw. Łódź Dąbrowa",
		"latitude": 51.73572,
		"longitude": 19.51032
	},
	{
		"id": 2468,
		"name": "Dąbrowskiego-Dw. Łódź Dąbrowa",
		"latitude": 51.73611,
		"longitude": 19.51043
	},
	{
		"id": 2469,
		"name": "Innowacyjna (Konstantynów)",
		"latitude": 51.74619,
		"longitude": 19.36306
	},
	{
		"id": 2470,
		"name": "ŁSSE ks. Janika (Konstantynów)",
		"latitude": 51.74306,
		"longitude": 19.36066
	},
	{
		"id": 2471,
		"name": "ŁSSE Inwestycyjna (Konstantynów)",
		"latitude": 51.74098,
		"longitude": 19.36224
	},
	{
		"id": 2498,
		"name": "Rojna-Wiernej Rzeki",
		"latitude": 51.79368,
		"longitude": 19.3796
	},
	{
		"id": 2499,
		"name": "Rojna-Wiernej Rzeki",
		"latitude": 51.79373,
		"longitude": 19.37984
	},
	{
		"id": 2515,
		"name": "Zagajnikowa-Okopowa",
		"latitude": 51.79508,
		"longitude": 19.47701
	},
	{
		"id": 2516,
		"name": "Zagajnikowa-Okopowa",
		"latitude": 51.79575,
		"longitude": 19.47652
	},
	{
		"id": 2517,
		"name": "Rewolucji 1905r.-Wschodnia",
		"latitude": 51.77497,
		"longitude": 19.45818
	},
	{
		"id": 2520,
		"name": "Maczka-Pienista",
		"latitude": 51.73371,
		"longitude": 19.40507
	},
	{
		"id": 2525,
		"name": "Wiączyń Dolny 96",
		"latitude": 51.7571,
		"longitude": 19.63157
	},
	{
		"id": 2526,
		"name": "Wiączyń Dolny 96",
		"latitude": 51.75685,
		"longitude": 19.6314
	},
	{
		"id": 2541,
		"name": "Lodowa-Przybyszewskiego",
		"latitude": 51.7511,
		"longitude": 19.52081
	},
	{
		"id": 2547,
		"name": "Ustronna-Zagadkowa",
		"latitude": 51.70817,
		"longitude": 19.46814
	},
	{
		"id": 2548,
		"name": "Ustronna-Zagadkowa",
		"latitude": 51.70809,
		"longitude": 19.46814
	},
	{
		"id": 2549,
		"name": "Siostrzana-Bartoszewskiego",
		"latitude": 51.70544,
		"longitude": 19.46793
	},
	{
		"id": 2550,
		"name": "Siostrzana-Bartoszewskiego",
		"latitude": 51.70532,
		"longitude": 19.46726
	},
	{
		"id": 2552,
		"name": "Pryncypalna-Bartoszewskiego",
		"latitude": 51.71767,
		"longitude": 19.45758
	},
	{
		"id": 2553,
		"name": "Pryncypalna-Bartoszewskiego",
		"latitude": 51.71729,
		"longitude": 19.45629
	},
	{
		"id": 2554,
		"name": "Bartoszewskiego-Pabianicka",
		"latitude": 51.72627,
		"longitude": 19.4483
	},
	{
		"id": 2555,
		"name": "Bartoszewskiego-Pryncypalna",
		"latitude": 51.71783,
		"longitude": 19.45698
	},
	{
		"id": 2556,
		"name": "Bartoszewskiego-Pryncypalna",
		"latitude": 51.71736,
		"longitude": 19.457
	},
	{
		"id": 2557,
		"name": "Bartoszewskiego-Demokratyczna",
		"latitude": 51.71164,
		"longitude": 19.46223
	},
	{
		"id": 2558,
		"name": "Bartoszewskiego-Demokratyczna",
		"latitude": 51.71205,
		"longitude": 19.46247
	},
	{
		"id": 2559,
		"name": "Bartoszewskiego-Siostrzana",
		"latitude": 51.70509,
		"longitude": 19.4677
	},
	{
		"id": 2560,
		"name": "Bartoszewskiego-Siostrzana",
		"latitude": 51.70558,
		"longitude": 19.46761
	},
	{
		"id": 2561,
		"name": "Rzgowska-Bartoszewskiego",
		"latitude": 51.70045,
		"longitude": 19.48004
	},
	{
		"id": 2562,
		"name": "Bartoszewskiego-Rzgowska",
		"latitude": 51.70018,
		"longitude": 19.4786
	},
	{
		"id": 2563,
		"name": "Jana Pawła II-Pabianicka",
		"latitude": 51.72758,
		"longitude": 19.44712
	},
	{
		"id": 2564,
		"name": "Pabianicka-Dw. Łódź Pabianicka",
		"latitude": 51.72609,
		"longitude": 19.44659
	},
	{
		"id": 2565,
		"name": "Przestrzenna-Rudzka",
		"latitude": 51.70304,
		"longitude": 19.43772
	},
	{
		"id": 2567,
		"name": "Rudzka-Stara Gadka  - cmentarz",
		"latitude": 51.67857,
		"longitude": 19.46956
	},
	{
		"id": 2579,
		"name": "Kopcińskiego-Piłsudskiego",
		"latitude": 51.76232,
		"longitude": 19.48502
	},
	{
		"id": 2580,
		"name": "Traktorowa-Rojna",
		"latitude": 51.79201,
		"longitude": 19.3933
	},
	{
		"id": 2581,
		"name": "Traktorowa-Rojna",
		"latitude": 51.79296,
		"longitude": 19.39362
	},
	{
		"id": 2589,
		"name": "Brójecka-Czternastu Straconych",
		"latitude": 51.70804,
		"longitude": 19.54496
	},
	{
		"id": 2590,
		"name": "Brójecka-Czternastu Straconych",
		"latitude": 51.70808,
		"longitude": 19.54497
	},
	{
		"id": 2591,
		"name": "Brójecka-Bronisin",
		"latitude": 51.6911,
		"longitude": 19.52943
	},
	{
		"id": 2592,
		"name": "Bronisin-Brójecka",
		"latitude": 51.69128,
		"longitude": 19.5292
	},
	{
		"id": 2593,
		"name": "Bronisin-Paprociowa",
		"latitude": 51.69895,
		"longitude": 19.52614
	},
	{
		"id": 2594,
		"name": "Bronisin-Paprociowa",
		"latitude": 51.69864,
		"longitude": 19.52623
	},
	{
		"id": 2595,
		"name": "Bronisin-Wiskicka",
		"latitude": 51.70371,
		"longitude": 19.51954
	},
	{
		"id": 2596,
		"name": "Bronisin-Wiskicka",
		"latitude": 51.70362,
		"longitude": 19.5195
	},
	{
		"id": 2597,
		"name": "Wiączyń Dolny 16",
		"latitude": 51.77139,
		"longitude": 19.6192
	},
	{
		"id": 2598,
		"name": "Wiączyń Dolny 16",
		"latitude": 51.77145,
		"longitude": 19.61897
	},
	{
		"id": 2606,
		"name": "Brójecka-Paprociowa",
		"latitude": 51.69759,
		"longitude": 19.53943
	},
	{
		"id": 2607,
		"name": "Brójecka-Paprociowa",
		"latitude": 51.69742,
		"longitude": 19.53907
	},
	{
		"id": 2608,
		"name": "Maczka-Pienista",
		"latitude": 51.73359,
		"longitude": 19.40502
	},
	{
		"id": 2611,
		"name": "Dworzec PKP(Pabianice)",
		"latitude": 51.66038,
		"longitude": 19.32548
	},
	{
		"id": 2612,
		"name": "Myśliwska-Wschodnia(Pabianice)",
		"latitude": 51.66018,
		"longitude": 19.38946
	},
	{
		"id": 2613,
		"name": "Myśliwska-Skargi(Pabianice)",
		"latitude": 51.66084,
		"longitude": 19.38967
	},
	{
		"id": 2614,
		"name": "Myśliwska-Podleśna(Pabianice)",
		"latitude": 51.6551,
		"longitude": 19.38869
	},
	{
		"id": 2615,
		"name": "Myśliwska-Dolna(Pabianice)",
		"latitude": 51.65657,
		"longitude": 19.38902
	},
	{
		"id": 2616,
		"name": "Waltera - Janke pętla(Pabianice)",
		"latitude": 51.65224,
		"longitude": 19.38763
	},
	{
		"id": 2617,
		"name": "Waltera-Janke-Waltera - Janke bl. 2",
		"latitude": 51.65196,
		"longitude": 19.38204
	},
	{
		"id": 2618,
		"name": "Waltera-Janke-Waltera - Janke bl. 2",
		"latitude": 51.65187,
		"longitude": 19.38304
	},
	{
		"id": 2619,
		"name": "Waltera - Janke bl. 221(Pabianice)",
		"latitude": 51.65177,
		"longitude": 19.37716
	},
	{
		"id": 2620,
		"name": "Waltera - Janke bl. 228(Pabianice)",
		"latitude": 51.65168,
		"longitude": 19.37819
	},
	{
		"id": 2621,
		"name": "Nawrockiego-Waltera - Janke(Pabiani",
		"latitude": 51.65197,
		"longitude": 19.37351
	},
	{
		"id": 2622,
		"name": "Waltera-Janke-Nawrockiego (Pabianic",
		"latitude": 51.65152,
		"longitude": 19.37452
	},
	{
		"id": 2623,
		"name": "Nawrockiego-Mokra(Pabianice)",
		"latitude": 51.65459,
		"longitude": 19.37431
	},
	{
		"id": 2624,
		"name": "Nawrockiego-Gawrońska(Pabianice)",
		"latitude": 51.65281,
		"longitude": 19.3736
	},
	{
		"id": 2625,
		"name": "Grota-Roweckiego-Gryzla(Pabianice)",
		"latitude": 51.65638,
		"longitude": 19.37325
	},
	{
		"id": 2626,
		"name": "Grota-Roweckiego-Nawrockiego (Pabia",
		"latitude": 51.65623,
		"longitude": 19.374
	},
	{
		"id": 2627,
		"name": "Grota-Roweckiego-Bugaj(Pabianice)",
		"latitude": 51.65672,
		"longitude": 19.3679
	},
	{
		"id": 2628,
		"name": "Grota-Roweckiego-os.Kopernika(Pabia",
		"latitude": 51.65665,
		"longitude": 19.36745
	},
	{
		"id": 2629,
		"name": "Grota-Roweckiego-Kilińskiego (Pabia",
		"latitude": 51.65734,
		"longitude": 19.35766
	},
	{
		"id": 2630,
		"name": "Grota-Roweckiego-Hala Sportowa(Pabi",
		"latitude": 51.65728,
		"longitude": 19.3575
	},
	{
		"id": 2631,
		"name": "Kilińskiego-Przychodnia(Pabianice)",
		"latitude": 51.65953,
		"longitude": 19.35467
	},
	{
		"id": 2632,
		"name": "Kilińskiego-Moniuszki(Pabianice)",
		"latitude": 51.6594,
		"longitude": 19.3546
	},
	{
		"id": 2633,
		"name": "Kilińskiego-Zamkowa(Pabianice)",
		"latitude": 51.66371,
		"longitude": 19.35475
	},
	{
		"id": 2634,
		"name": "Kilińskiego-SDH(Pabianice)",
		"latitude": 51.66358,
		"longitude": 19.35453
	},
	{
		"id": 2635,
		"name": "Konopnickiej-Zamkowa(Pabianice)",
		"latitude": 51.6644,
		"longitude": 19.34113
	},
	{
		"id": 2636,
		"name": "Moniuszki-Zielona(Pabianice)",
		"latitude": 51.66098,
		"longitude": 19.33872
	},
	{
		"id": 2637,
		"name": "Moniuszki-Niecała(Pabianice)",
		"latitude": 51.65887,
		"longitude": 19.33315
	},
	{
		"id": 2638,
		"name": "Moniuszki-Ostatnia(Pabianice)",
		"latitude": 51.65849,
		"longitude": 19.33207
	},
	{
		"id": 2639,
		"name": "Moniuszki-Szarych Szeregów(Pab.)",
		"latitude": 51.65671,
		"longitude": 19.32875
	},
	{
		"id": 2640,
		"name": "Moniuszki-Wiejska (Pabianice)",
		"latitude": 51.65552,
		"longitude": 19.32665
	},
	{
		"id": 2641,
		"name": "Wiejska-DPS(Pabianice)",
		"latitude": 51.65796,
		"longitude": 19.32424
	},
	{
		"id": 2642,
		"name": "Wiejska-Łaska(Pabianice)",
		"latitude": 51.65853,
		"longitude": 19.32372
	},
	{
		"id": 2643,
		"name": "Parzęczewska-Parzęczewska /Staffa(Z",
		"latitude": 51.86785,
		"longitude": 19.38203
	},
	{
		"id": 2644,
		"name": "Waltera - Janke pętla(Pabianice)",
		"latitude": 51.65234,
		"longitude": 19.38766
	},
	{
		"id": 2658,
		"name": "Dąbrowskiego-Tatrzańska",
		"latitude": 51.73679,
		"longitude": 19.49601
	},
	{
		"id": 2663,
		"name": "Małczewska 37(Brzeziny)",
		"latitude": 51.79421,
		"longitude": 19.7356
	},
	{
		"id": 2664,
		"name": "Fredry-SP nr 1(Brzeziny)",
		"latitude": 51.79712,
		"longitude": 19.74473
	},
	{
		"id": 2666,
		"name": "Piłsudskiego-Muzeum Regionalne(Brze",
		"latitude": 51.79926,
		"longitude": 19.74434
	},
	{
		"id": 2667,
		"name": "Małczewska 28(Brzeziny)",
		"latitude": 51.79452,
		"longitude": 19.73612
	},
	{
		"id": 2668,
		"name": "Małczewska-Leśna(Brzeziny)",
		"latitude": 51.78704,
		"longitude": 19.72089
	},
	{
		"id": 2669,
		"name": "Małczewska-Leśna(Brzeziny)",
		"latitude": 51.78622,
		"longitude": 19.71955
	},
	{
		"id": 2670,
		"name": "Brzezińska-Rokicińska(Andrespol)",
		"latitude": 51.72565,
		"longitude": 19.63909
	},
	{
		"id": 2671,
		"name": "Brzezińska-Sienkiewicza(Andrespol)",
		"latitude": 51.7334,
		"longitude": 19.64483
	},
	{
		"id": 2672,
		"name": "Brzezińska-Sienkiewicza(Andrespol)",
		"latitude": 51.73341,
		"longitude": 19.64472
	},
	{
		"id": 2673,
		"name": "Ogrodowa-Brzezińska(Andrespol)",
		"latitude": 51.73655,
		"longitude": 19.64625
	},
	{
		"id": 2674,
		"name": "Ogrodowa-Brzezińska(Andrespol)",
		"latitude": 51.73661,
		"longitude": 19.6462
	},
	{
		"id": 2675,
		"name": "Ogrodowa-Magdalenki(Andrespol)",
		"latitude": 51.73803,
		"longitude": 19.63847
	},
	{
		"id": 2676,
		"name": "Ogrodowa-Magdalenki(Andrespol)",
		"latitude": 51.73812,
		"longitude": 19.63783
	},
	{
		"id": 2677,
		"name": "Bedoń Kościelna/Kościół",
		"latitude": 51.7371,
		"longitude": 19.63471
	},
	{
		"id": 2678,
		"name": "Brzezińska-Mazowiecka(Andrespol)",
		"latitude": 51.73788,
		"longitude": 19.64935
	},
	{
		"id": 2679,
		"name": "Brzezińska-Słowiańska(Andrespol)",
		"latitude": 51.73795,
		"longitude": 19.64929
	},
	{
		"id": 2680,
		"name": "Małczew I",
		"latitude": 51.78254,
		"longitude": 19.71219
	},
	{
		"id": 2681,
		"name": "Małczew I",
		"latitude": 51.7825,
		"longitude": 19.71231
	},
	{
		"id": 2682,
		"name": "Małczew II",
		"latitude": 51.77834,
		"longitude": 19.70399
	},
	{
		"id": 2683,
		"name": "Małczew II",
		"latitude": 51.77833,
		"longitude": 19.70417
	},
	{
		"id": 2684,
		"name": "Adamów",
		"latitude": 51.77148,
		"longitude": 19.69045
	},
	{
		"id": 2685,
		"name": "Adamów",
		"latitude": 51.77148,
		"longitude": 19.69055
	},
	{
		"id": 2686,
		"name": "Jordanów I",
		"latitude": 51.75885,
		"longitude": 19.67666
	},
	{
		"id": 2687,
		"name": "Jordanów I",
		"latitude": 51.75782,
		"longitude": 19.67535
	},
	{
		"id": 2688,
		"name": "Jordanów II",
		"latitude": 51.75268,
		"longitude": 19.66794
	},
	{
		"id": 2689,
		"name": "Jordanów II",
		"latitude": 51.75259,
		"longitude": 19.66801
	},
	{
		"id": 2690,
		"name": "Jordanów III",
		"latitude": 51.74714,
		"longitude": 19.66084
	},
	{
		"id": 2691,
		"name": "Jordanów III",
		"latitude": 51.74713,
		"longitude": 19.66099
	},
	{
		"id": 2698,
		"name": "Konstantynowska-ZOO",
		"latitude": 51.76441,
		"longitude": 19.4134
	},
	{
		"id": 2699,
		"name": "Narutowicza-Piotrkowska",
		"latitude": 51.77067,
		"longitude": 19.45657
	},
	{
		"id": 2701,
		"name": "Nawrot-Sienkiewicza",
		"latitude": 51.76274,
		"longitude": 19.46307
	},
	{
		"id": 2718,
		"name": "Srebrzyńska-Kasprzaka",
		"latitude": 51.77339,
		"longitude": 19.42681
	},
	{
		"id": 2720,
		"name": "Zgierska-Julianowska",
		"latitude": 51.79653,
		"longitude": 19.44469
	},
	{
		"id": 2721,
		"name": "św. Anny 27-31(Brzeziny)",
		"latitude": 51.79741,
		"longitude": 19.75223
	},
	{
		"id": 2722,
		"name": "Przedwiośnie(Brzeziny)",
		"latitude": 51.80048,
		"longitude": 19.76291
	},
	{
		"id": 2723,
		"name": "Bohaterów Warszawy-Gimnazjum(Brzezi",
		"latitude": 51.80123,
		"longitude": 19.75887
	},
	{
		"id": 2724,
		"name": "Głowackiego(Brzeziny)",
		"latitude": 51.80386,
		"longitude": 19.76266
	},
	{
		"id": 2725,
		"name": "Modrzewskiego-Biedronka(Brzeziny)",
		"latitude": 51.80182,
		"longitude": 19.75596
	},
	{
		"id": 2731,
		"name": "Włókniarzy-Struga",
		"latitude": 51.76105,
		"longitude": 19.43148
	},
	{
		"id": 2732,
		"name": "Tuwima-Wydawnicza",
		"latitude": 51.76747,
		"longitude": 19.48611
	},
	{
		"id": 2736,
		"name": "Boginia chłodnia",
		"latitude": 51.83671,
		"longitude": 19.62691
	},
	{
		"id": 2737,
		"name": "Boginia chłodnia",
		"latitude": 51.8367,
		"longitude": 19.62657
	},
	{
		"id": 2739,
		"name": "Proboszczewice II mijanka",
		"latitude": 51.87843,
		"longitude": 19.3909
	},
	{
		"id": 2740,
		"name": "Wyszyńskiego mijanka(Ozorków)",
		"latitude": 51.95721,
		"longitude": 19.29347
	},
	{
		"id": 2746,
		"name": "Żeromskiego-Kopernika",
		"latitude": 51.76236,
		"longitude": 19.4475
	},
	{
		"id": 2748,
		"name": "Konstantynów Łódzki-Srebrna mijanka",
		"latitude": 51.74874,
		"longitude": 19.35637
	},
	{
		"id": 2749,
		"name": "Konstantynów Łódzki-Gdańska mijanka",
		"latitude": 51.74771,
		"longitude": 19.34492
	},
	{
		"id": 2750,
		"name": "Obywatelska-Obywatelska 106",
		"latitude": 51.737,
		"longitude": 19.43104
	},
	{
		"id": 2752,
		"name": "Wojska Polskiego-Głowackiego",
		"latitude": 51.78708,
		"longitude": 19.47165
	},
	{
		"id": 2758,
		"name": "Politechniki-Targi Łódzkie",
		"latitude": 51.74882,
		"longitude": 19.45026
	},
	{
		"id": 2759,
		"name": "Politechniki-Targi Łódzkie",
		"latitude": 51.74908,
		"longitude": 19.45012
	},
	{
		"id": 2760,
		"name": "Wyszyńskiego-Armii Krajowej",
		"latitude": 51.74634,
		"longitude": 19.39872
	},
	{
		"id": 2761,
		"name": "Wyszyńskiego-Armii Krajowej",
		"latitude": 51.7463,
		"longitude": 19.39875
	},
	{
		"id": 2762,
		"name": "Wyszyńskiego-Retkińska",
		"latitude": 51.74814,
		"longitude": 19.40514
	},
	{
		"id": 2763,
		"name": "Wyszyńskiego-Retkińska",
		"latitude": 51.74808,
		"longitude": 19.40562
	},
	{
		"id": 2765,
		"name": "Włókniarzy-Mickiewicza (Dw. Łódź Ka",
		"latitude": 51.75692,
		"longitude": 19.43434
	},
	{
		"id": 2766,
		"name": "Włókniarzy-Mickiewicza (Dw. Łódź Ka",
		"latitude": 51.75672,
		"longitude": 19.4343
	},
	{
		"id": 2767,
		"name": "Bandurskiego-Wróblewskiego",
		"latitude": 51.75042,
		"longitude": 19.4192
	},
	{
		"id": 2768,
		"name": "Bandurskiego-Wróblewskiego",
		"latitude": 51.75052,
		"longitude": 19.4188
	},
	{
		"id": 2770,
		"name": "Maratońska-Wileńska",
		"latitude": 51.75086,
		"longitude": 19.43071
	},
	{
		"id": 2772,
		"name": "Retkinia",
		"latitude": 51.74218,
		"longitude": 19.38442
	},
	{
		"id": 2773,
		"name": "Retkinia",
		"latitude": 51.74234,
		"longitude": 19.38434
	},
	{
		"id": 2774,
		"name": "Retkinia",
		"latitude": 51.74233,
		"longitude": 19.38397
	},
	{
		"id": 2775,
		"name": "Retkinia",
		"latitude": 51.74231,
		"longitude": 19.38366
	},
	{
		"id": 2776,
		"name": "Włókniarzy-Mickiewicza (Dw. Ł. Kali",
		"latitude": 51.75654,
		"longitude": 19.43454
	},
	{
		"id": 2777,
		"name": "Piotrkowska Centrum",
		"latitude": 51.75928,
		"longitude": 19.45646
	},
	{
		"id": 2778,
		"name": "Piotrkowska Centrum",
		"latitude": 51.75926,
		"longitude": 19.45789
	},
	{
		"id": 2779,
		"name": "Puszkina-Rondo Inwalidów",
		"latitude": 51.76006,
		"longitude": 19.53672
	},
	{
		"id": 2780,
		"name": "Puszkina-Rondo Inwalidów",
		"latitude": 51.76002,
		"longitude": 19.53659
	},
	{
		"id": 2781,
		"name": "Rokicińska-Gogola",
		"latitude": 51.75959,
		"longitude": 19.54319
	},
	{
		"id": 2782,
		"name": "Rokicińska-Gogola",
		"latitude": 51.75955,
		"longitude": 19.54419
	},
	{
		"id": 2783,
		"name": "Rokicińska-Gogola",
		"latitude": 51.75927,
		"longitude": 19.54481
	},
	{
		"id": 2784,
		"name": "Rokicińska-Gogola",
		"latitude": 51.75957,
		"longitude": 19.54379
	},
	{
		"id": 2785,
		"name": "Rokicińska-Książąt Polskich",
		"latitude": 51.75549,
		"longitude": 19.56607
	},
	{
		"id": 2786,
		"name": "Rokicińska-Książąt Polskich",
		"latitude": 51.7554,
		"longitude": 19.5662
	},
	{
		"id": 2787,
		"name": "Hetmańska-Janów",
		"latitude": 51.75213,
		"longitude": 19.57462
	},
	{
		"id": 2788,
		"name": "Hetmańska-Janów",
		"latitude": 51.75212,
		"longitude": 19.57449
	},
	{
		"id": 2789,
		"name": "Hetmańska-Zagłoby",
		"latitude": 51.74733,
		"longitude": 19.57242
	},
	{
		"id": 2790,
		"name": "Hetmańska-Zagłoby",
		"latitude": 51.74724,
		"longitude": 19.57229
	},
	{
		"id": 2791,
		"name": "Hetmańska-Dąbrówki",
		"latitude": 51.7432,
		"longitude": 19.5705
	},
	{
		"id": 2792,
		"name": "Hetmańska-Dąbrówki",
		"latitude": 51.7432,
		"longitude": 19.5705
	},
	{
		"id": 2793,
		"name": "Hetmańska-Zakładowa",
		"latitude": 51.74061,
		"longitude": 19.56941
	},
	{
		"id": 2794,
		"name": "Hetmańska-Zakładowa",
		"latitude": 51.74011,
		"longitude": 19.56895
	},
	{
		"id": 2795,
		"name": "Odnowiciela-Hetmańska",
		"latitude": 51.73748,
		"longitude": 19.56577
	},
	{
		"id": 2796,
		"name": "Odnowiciela-Hetmańska",
		"latitude": 51.7368,
		"longitude": 19.5668
	},
	{
		"id": 2797,
		"name": "al. Ofiar Terroryzmu 11 Września-De",
		"latitude": 51.7338,
		"longitude": 19.569
	},
	{
		"id": 2798,
		"name": "al. Ofiar Terroryzmu 11 Września-De",
		"latitude": 51.7338,
		"longitude": 19.569
	},
	{
		"id": 2799,
		"name": "al. Ofiar Terroryzmu 11 Września-De",
		"latitude": 51.73354,
		"longitude": 19.56913
	},
	{
		"id": 2800,
		"name": "OLECHÓW",
		"latitude": 51.73378,
		"longitude": 19.57592
	},
	{
		"id": 2801,
		"name": "OLECHÓW",
		"latitude": 51.73405,
		"longitude": 19.57661
	},
	{
		"id": 2802,
		"name": "Piłsudskiego-CH Tulipan",
		"latitude": 51.7626,
		"longitude": 19.49605
	},
	{
		"id": 2803,
		"name": "Piłsudskiego-CH Tulipan",
		"latitude": 51.76244,
		"longitude": 19.49767
	},
	{
		"id": 2804,
		"name": "Sienkiewicza-Narutowicza",
		"latitude": 51.77057,
		"longitude": 19.46049
	},
	{
		"id": 2805,
		"name": "cm. Zarzew",
		"latitude": 51.74942,
		"longitude": 19.52021
	},
	{
		"id": 2806,
		"name": "Lodowa-Przybyszewskiego",
		"latitude": 51.75096,
		"longitude": 19.52054
	},
	{
		"id": 2807,
		"name": "Lodowa-Przybyszewskiego",
		"latitude": 51.7513,
		"longitude": 19.5205
	},
	{
		"id": 2808,
		"name": "Ogrodowa-Karskiego",
		"latitude": 51.77694,
		"longitude": 19.44008
	},
	{
		"id": 2810,
		"name": "Kopernika-Łąkowa",
		"latitude": 51.76028,
		"longitude": 19.44333
	},
	{
		"id": 2811,
		"name": "Mickiewicza-Kościuszki",
		"latitude": 51.75891,
		"longitude": 19.45532
	},
	{
		"id": 2813,
		"name": "Zgierska-cm. Radogoszcz",
		"latitude": 51.80701,
		"longitude": 19.43949
	},
	{
		"id": 2814,
		"name": "Zgierska-cm. Radogoszcz",
		"latitude": 51.80694,
		"longitude": 19.43944
	},
	{
		"id": 2815,
		"name": "Bronisin Dworski-Pogodna",
		"latitude": 51.69248,
		"longitude": 19.53381
	},
	{
		"id": 2816,
		"name": "Bronisin Dworski-Pogodna",
		"latitude": 51.69241,
		"longitude": 19.53364
	},
	{
		"id": 2817,
		"name": "Bandurskiego-Dw. Łódź Kaliska",
		"latitude": 51.75576,
		"longitude": 19.43271
	},
	{
		"id": 2818,
		"name": "Kopernika-Żeromskiego",
		"latitude": 51.76182,
		"longitude": 19.44705
	},
	{
		"id": 2819,
		"name": "Żeromskiego-Mickiewicza",
		"latitude": 51.75899,
		"longitude": 19.44799
	},
	{
		"id": 2821,
		"name": "Sienkiewicza (Brzeziny)",
		"latitude": 51.80001,
		"longitude": 19.76495
	},
	{
		"id": 2822,
		"name": "Legionów-Zachodnia",
		"latitude": 51.77662,
		"longitude": 19.45265
	},
	{
		"id": 2823,
		"name": "Pomorska-Edwarda",
		"latitude": 51.77494,
		"longitude": 19.52104
	},
	{
		"id": 2824,
		"name": "Pomorska-Dw. Łódź Stoki",
		"latitude": 51.77603,
		"longitude": 19.51049
	},
	{
		"id": 2832,
		"name": "Rataja",
		"latitude": 51.74499,
		"longitude": 19.62722
	},
	{
		"id": 2833,
		"name": "Gajcego-Rataja",
		"latitude": 51.748,
		"longitude": 19.62336
	},
	{
		"id": 2834,
		"name": "Gajcego-Rataja",
		"latitude": 51.74799,
		"longitude": 19.62352
	},
	{
		"id": 2835,
		"name": "Gajcego-Szelburg-Zarembiny",
		"latitude": 51.74594,
		"longitude": 19.62022
	},
	{
		"id": 2836,
		"name": "Gajcego-Szelburg-Zarembiny",
		"latitude": 51.74596,
		"longitude": 19.62042
	},
	{
		"id": 2837,
		"name": "Gajcego-Dw. Łódź Andrzejów",
		"latitude": 51.74257,
		"longitude": 19.61512
	},
	{
		"id": 2838,
		"name": "Gajcego-Dw. Łódź Andrzejów",
		"latitude": 51.74241,
		"longitude": 19.61506
	},
	{
		"id": 2839,
		"name": "Gajcego-Rokicińska",
		"latitude": 51.74071,
		"longitude": 19.61244
	},
	{
		"id": 2840,
		"name": "Budy-Marmurowa",
		"latitude": 51.80109,
		"longitude": 19.53778
	},
	{
		"id": 2841,
		"name": "Budy-Marmurowa",
		"latitude": 51.80103,
		"longitude": 19.53764
	},
	{
		"id": 2852,
		"name": "6 Sierpnia-Pogonowskiego",
		"latitude": 51.76754,
		"longitude": 19.44315
	},
	{
		"id": 2854,
		"name": "Pabianicka-Wólczańska",
		"latitude": 51.73631,
		"longitude": 19.45899
	},
	{
		"id": 2857,
		"name": "Zakładowa-Cynarskiego",
		"latitude": 51.73949,
		"longitude": 19.57452
	},
	{
		"id": 2858,
		"name": "Zakładowa-Cynarskiego",
		"latitude": 51.73961,
		"longitude": 19.57434
	},
	{
		"id": 2859,
		"name": "Pabianicka-Wólczańska",
		"latitude": 51.73639,
		"longitude": 19.45947
	},
	{
		"id": 2860,
		"name": "Okólna-Łagiewnicka",
		"latitude": 51.84658,
		"longitude": 19.46923
	},
	{
		"id": 2861,
		"name": "Kilińskiego-Dw. Łódź Chojny",
		"latitude": 51.72775,
		"longitude": 19.48032
	},
	{
		"id": 2862,
		"name": "Kilińskiego-Dw. Łódź Chojny",
		"latitude": 51.72778,
		"longitude": 19.4804
	},
	{
		"id": 2863,
		"name": "Niższa-Śląska",
		"latitude": 51.72897,
		"longitude": 19.49007
	},
	{
		"id": 2864,
		"name": "Niższa-Śląska",
		"latitude": 51.72888,
		"longitude": 19.48999
	},
	{
		"id": 2865,
		"name": "Poronińska-Dw. Łódź Stoki",
		"latitude": 51.77638,
		"longitude": 19.50973
	},
	{
		"id": 2866,
		"name": "CKD stomatologia",
		"latitude": 51.77568,
		"longitude": 19.50863
	},
	{
		"id": 2871,
		"name": "Pomorska-Edwarda",
		"latitude": 51.77506,
		"longitude": 19.52085
	},
	{
		"id": 2881,
		"name": "Transmisyjna-Kosodrzewiny",
		"latitude": 51.75841,
		"longitude": 19.57673
	},
	{
		"id": 2884,
		"name": "Transmisyjna-Kosodrzewiny",
		"latitude": 51.75834,
		"longitude": 19.57669
	},
	{
		"id": 2911,
		"name": "Rąbieńska-Kwiatowa",
		"latitude": 51.78143,
		"longitude": 19.39472
	},
	{
		"id": 2912,
		"name": "Rąbieńska-Kwiatowa",
		"latitude": 51.78164,
		"longitude": 19.3945
	},
	{
		"id": 2913,
		"name": "Marysińska-Okopowa",
		"latitude": 51.79653,
		"longitude": 19.46559
	},
	{
		"id": 2914,
		"name": "Marysińska-Okopowa",
		"latitude": 51.79659,
		"longitude": 19.46545
	},
	{
		"id": 2915,
		"name": "Popiełuszki-Maratońska",
		"latitude": 51.73672,
		"longitude": 19.38632
	},
	{
		"id": 2931,
		"name": "Okulickiego-Zgierska",
		"latitude": 51.82876,
		"longitude": 19.42533
	},
	{
		"id": 2932,
		"name": "Nastrojowa-Plac Słoneczny",
		"latitude": 51.82024,
		"longitude": 19.44254
	},
	{
		"id": 2933,
		"name": "Świtezianki-Nastrojowa",
		"latitude": 51.82417,
		"longitude": 19.43763
	},
	{
		"id": 2934,
		"name": "Świtezianki-Zgierska",
		"latitude": 51.82255,
		"longitude": 19.43113
	},
	{
		"id": 2935,
		"name": "Okulickiego-Zgierska",
		"latitude": 51.82886,
		"longitude": 19.42549
	},
	{
		"id": 2936,
		"name": "11 Listopada-Dw. Łódź Radogoszcz Za",
		"latitude": 51.82081,
		"longitude": 19.4168
	},
	{
		"id": 2937,
		"name": "11 Listopada-Dw. Łódź Radogoszcz Za",
		"latitude": 51.8205,
		"longitude": 19.41723
	},
	{
		"id": 2938,
		"name": "11 Listopada-Pętla",
		"latitude": 51.81845,
		"longitude": 19.41875
	},
	{
		"id": 2939,
		"name": "Świtezianki-Zgierska",
		"latitude": 51.82254,
		"longitude": 19.43143
	},
	{
		"id": 2940,
		"name": "Zielony Romanów",
		"latitude": 51.80769,
		"longitude": 19.32613
	},
	{
		"id": 2941,
		"name": "Romanowska-Romanowska 27",
		"latitude": 51.80693,
		"longitude": 19.3333
	},
	{
		"id": 2942,
		"name": "Romanowska-Romanowska 27",
		"latitude": 51.80713,
		"longitude": 19.33317
	},
	{
		"id": 2943,
		"name": "Romanowska-Aleksandrowska",
		"latitude": 51.81122,
		"longitude": 19.34054
	},
	{
		"id": 2944,
		"name": "Romanowska-Aleksandrowska",
		"latitude": 51.81135,
		"longitude": 19.34028
	},
	{
		"id": 2945,
		"name": "Okulickiego-11 Listopada",
		"latitude": 51.82694,
		"longitude": 19.4186
	},
	{
		"id": 2946,
		"name": "Okulickiego-11 Listopada",
		"latitude": 51.82719,
		"longitude": 19.41859
	},
	{
		"id": 2947,
		"name": "Świtezianki-Nastrojowa",
		"latitude": 51.82461,
		"longitude": 19.43959
	},
	{
		"id": 2969,
		"name": "Moniuszki-Toruńska (Pabianice)",
		"latitude": 51.65969,
		"longitude": 19.33478
	},
	{
		"id": 2970,
		"name": "Moniuszki-Wysoka (Pabianice)",
		"latitude": 51.66011,
		"longitude": 19.33625
	},
	{
		"id": 2976,
		"name": "Przybyszewskiego-Rondo Sybiraków",
		"latitude": 51.7523,
		"longitude": 19.53334
	},
	{
		"id": 2977,
		"name": "Przybyszewskiego-Rondo Sybiraków",
		"latitude": 51.75293,
		"longitude": 19.5333
	},
	{
		"id": 2978,
		"name": "Nowogrodzka-Mazowiecka",
		"latitude": 51.76714,
		"longitude": 19.51202
	},
	{
		"id": 2979,
		"name": "Edwarda-Czechosłowacka",
		"latitude": 51.77004,
		"longitude": 19.516
	},
	{
		"id": 2980,
		"name": "Piątkowska /park (Zgierz)",
		"latitude": 51.86066,
		"longitude": 19.40653
	},
	{
		"id": 2981,
		"name": "Piątkowska /park (Zgierz)",
		"latitude": 51.86051,
		"longitude": 19.40662
	},
	{
		"id": 2982,
		"name": "Łęczycka (Zgierz)",
		"latitude": 51.85983,
		"longitude": 19.40393
	},
	{
		"id": 2983,
		"name": "Łęczycka (Zgierz)",
		"latitude": 51.85983,
		"longitude": 19.40393
	},
	{
		"id": 2989,
		"name": "Łódź Fabryczna",
		"latitude": 51.77001,
		"longitude": 19.46593
	},
	{
		"id": 2990,
		"name": "Łódź Fabryczna",
		"latitude": 51.76994,
		"longitude": 19.46598
	},
	{
		"id": 2991,
		"name": "Łódź Fabryczna",
		"latitude": 51.76992,
		"longitude": 19.46633
	},
	{
		"id": 2992,
		"name": "Łódź Fabryczna",
		"latitude": 51.76989,
		"longitude": 19.46652
	},
	{
		"id": 2993,
		"name": "Łódź Fabryczna",
		"latitude": 51.77002,
		"longitude": 19.46638
	},
	{
		"id": 2994,
		"name": "Łódź Fabryczna",
		"latitude": 51.76989,
		"longitude": 19.46617
	},
	{
		"id": 2995,
		"name": "Łódź Fabryczna",
		"latitude": 51.77019,
		"longitude": 19.4686
	},
	{
		"id": 2996,
		"name": "Łódź Fabryczna",
		"latitude": 51.77014,
		"longitude": 19.46943
	},
	{
		"id": 2997,
		"name": "Łódź Fabryczna",
		"latitude": 51.77011,
		"longitude": 19.4703
	},
	{
		"id": 2998,
		"name": "Łódź Fabryczna",
		"latitude": 51.77007,
		"longitude": 19.47115
	},
	{
		"id": 2999,
		"name": "Łódź Fabryczna",
		"latitude": 51.77037,
		"longitude": 19.46865
	},
	{
		"id": 3000,
		"name": "Łódź Fabryczna",
		"latitude": 51.77029,
		"longitude": 19.4697
	},
	{
		"id": 3001,
		"name": "Łódź Fabryczna",
		"latitude": 51.77029,
		"longitude": 19.47029
	},
	{
		"id": 3002,
		"name": "Łódź Fabryczna",
		"latitude": 51.77002,
		"longitude": 19.472
	},
	{
		"id": 3003,
		"name": "Łódź Fabryczna",
		"latitude": 51.76994,
		"longitude": 19.47204
	},
	{
		"id": 3004,
		"name": "Kilińskiego-Nawrot",
		"latitude": 51.76328,
		"longitude": 19.46722
	},
	{
		"id": 3005,
		"name": "Tramwajowa-Narutowicza",
		"latitude": 51.77219,
		"longitude": 19.47666
	},
	{
		"id": 3006,
		"name": "Kilińskiego-Narutowicza",
		"latitude": 51.77162,
		"longitude": 19.46325
	},
	{
		"id": 3007,
		"name": "Niciarniana-Przybyszewskiego",
		"latitude": 51.75058,
		"longitude": 19.51252
	},
	{
		"id": 3010,
		"name": "Wojska Polskiego-Franciszkańska",
		"latitude": 51.78477,
		"longitude": 19.46088
	},
	{
		"id": 3011,
		"name": "Żeromskiego-Kopernika",
		"latitude": 51.76253,
		"longitude": 19.44762
	},
	{
		"id": 3012,
		"name": "Widzewska-Wiejska",
		"latitude": 51.76005,
		"longitude": 19.51809
	},
	{
		"id": 3013,
		"name": "Północna",
		"latitude": 51.77952,
		"longitude": 19.4583
	},
	{
		"id": 3014,
		"name": "Prądzyńskiego-Pokładowa",
		"latitude": 51.72274,
		"longitude": 19.43753
	},
	{
		"id": 3015,
		"name": "Łódź Fabryczna",
		"latitude": 51.77019,
		"longitude": 19.47192
	},
	{
		"id": 3016,
		"name": "Węglowa-Tramwajowa",
		"latitude": 51.7695,
		"longitude": 19.47602
	},
	{
		"id": 3017,
		"name": "Węglowa-Lindleya",
		"latitude": 51.76948,
		"longitude": 19.47531
	},
	{
		"id": 3018,
		"name": "Piłsudskiego-Niciarniana",
		"latitude": 51.76355,
		"longitude": 19.50759
	},
	{
		"id": 3019,
		"name": "CKD parking",
		"latitude": 51.77259,
		"longitude": 19.50844
	},
	{
		"id": 3020,
		"name": "CKD parking",
		"latitude": 51.77255,
		"longitude": 19.50823
	},
	{
		"id": 3021,
		"name": "CKD szpital",
		"latitude": 51.77438,
		"longitude": 19.50838
	},
	{
		"id": 3022,
		"name": "CKD szpital",
		"latitude": 51.77455,
		"longitude": 19.50799
	},
	{
		"id": 3023,
		"name": "Tęczowa-Centralna",
		"latitude": 51.80637,
		"longitude": 19.48052
	},
	{
		"id": 3024,
		"name": "Bednarska-Unicka",
		"latitude": 51.7346,
		"longitude": 19.46534
	},
	{
		"id": 3025,
		"name": "Bednarska-Unicka",
		"latitude": 51.73464,
		"longitude": 19.46474
	},
	{
		"id": 3026,
		"name": "park Podolski",
		"latitude": 51.74075,
		"longitude": 19.49916
	},
	{
		"id": 3027,
		"name": "Żubardzka-Inowrocławska",
		"latitude": 51.78644,
		"longitude": 19.41921
	},
	{
		"id": 3028,
		"name": "Żubardź",
		"latitude": 51.78874,
		"longitude": 19.41937
	},
	{
		"id": 3029,
		"name": "Ogrodowa-Karskiego",
		"latitude": 51.77696,
		"longitude": 19.43989
	},
	{
		"id": 3030,
		"name": "Karskiego-Ogrodowa",
		"latitude": 51.77771,
		"longitude": 19.4387
	},
	{
		"id": 3031,
		"name": "Ogrodowa-Gdańska",
		"latitude": 51.77838,
		"longitude": 19.44945
	},
	{
		"id": 3032,
		"name": "Ogrodowa-Gdańska",
		"latitude": 51.77825,
		"longitude": 19.44676
	},
	{
		"id": 3033,
		"name": "Telefoniczna-Bystrzycka",
		"latitude": 51.78291,
		"longitude": 19.49461
	},
	{
		"id": 3034,
		"name": "Leszczowa-Dw. Łódź Pabianicka",
		"latitude": 51.72617,
		"longitude": 19.44492
	},
	{
		"id": 3035,
		"name": "Karpacka-Zaolziańska",
		"latitude": 51.72638,
		"longitude": 19.45451
	},
	{
		"id": 3036,
		"name": "Lodowa-Przybyszewskiego",
		"latitude": 51.75255,
		"longitude": 19.52075
	},
	{
		"id": 3037,
		"name": "Przybyszewskiego-Mechaniczna",
		"latitude": 51.75152,
		"longitude": 19.5183
	},
	{
		"id": 3038,
		"name": "Urząd Skarbowy Widzew",
		"latitude": 51.74743,
		"longitude": 19.51667
	},
	{
		"id": 3039,
		"name": "Śląska-Niższa",
		"latitude": 51.72803,
		"longitude": 19.49146
	},
	{
		"id": 3040,
		"name": "Śląska-Dw. Łódź Chojny",
		"latitude": 51.72748,
		"longitude": 19.48116
	},
	{
		"id": 3041,
		"name": "Kruczkowskiego-Śląska",
		"latitude": 51.72826,
		"longitude": 19.49826
	},
	{
		"id": 3042,
		"name": "Maratońska (wew.)-Plocka",
		"latitude": 51.73909,
		"longitude": 19.39727
	},
	{
		"id": 3043,
		"name": "Maratońska (wew.)-Plocka",
		"latitude": 51.73917,
		"longitude": 19.39734
	},
	{
		"id": 3044,
		"name": "Zenitowa-św. Franciszka",
		"latitude": 51.72749,
		"longitude": 19.43052
	},
	{
		"id": 3045,
		"name": "Pustynna-Nowe Sady",
		"latitude": 51.7312,
		"longitude": 19.43173
	},
	{
		"id": 3046,
		"name": "Nowe Sady-Pustynna",
		"latitude": 51.73146,
		"longitude": 19.43369
	},
	{
		"id": 3047,
		"name": "Proletariacka-Wróblewskiego",
		"latitude": 51.74488,
		"longitude": 19.4423
	},
	{
		"id": 3048,
		"name": "Włókniarzy-Zgierska",
		"latitude": 51.81562,
		"longitude": 19.43249
	},
	{
		"id": 3049,
		"name": "Niezapominajki-Stawowa",
		"latitude": 51.81477,
		"longitude": 19.42868
	},
	{
		"id": 3050,
		"name": "Franciszkańska-Organizacji WiN",
		"latitude": 51.78774,
		"longitude": 19.45972
	},
	{
		"id": 3051,
		"name": "Źródłowa-Wojska Polskiego",
		"latitude": 51.78539,
		"longitude": 19.46767
	},
	{
		"id": 3052,
		"name": "Okopowa-Zagajnikowa",
		"latitude": 51.79617,
		"longitude": 19.47543
	},
	{
		"id": 3053,
		"name": "Skrzydlata-Dojazdowa",
		"latitude": 51.81019,
		"longitude": 19.47293
	},
	{
		"id": 3054,
		"name": "Marysińska-Szklana",
		"latitude": 51.79333,
		"longitude": 19.46543
	},
	{
		"id": 3055,
		"name": "Tamka-Styrska",
		"latitude": 51.78068,
		"longitude": 19.48924
	},
	{
		"id": 3056,
		"name": "Zamenhofa-Gdańska",
		"latitude": 51.76163,
		"longitude": 19.45037
	},
	{
		"id": 3057,
		"name": "Sternfelda-Powszechna",
		"latitude": 51.71758,
		"longitude": 19.49576
	},
	{
		"id": 3058,
		"name": "Sternfelda-Powszechna",
		"latitude": 51.71731,
		"longitude": 19.49576
	},
	{
		"id": 3059,
		"name": "Św. Wojciecha-Mieszczańska",
		"latitude": 51.71336,
		"longitude": 19.49146
	},
	{
		"id": 3060,
		"name": "Św. Wojciecha-Mieszczańska",
		"latitude": 51.71336,
		"longitude": 19.49216
	},
	{
		"id": 3061,
		"name": "Żeligowskiego-Zielona",
		"latitude": 51.76954,
		"longitude": 19.43844
	},
	{
		"id": 3062,
		"name": "Hipoteczna-Pojezierska",
		"latitude": 51.79771,
		"longitude": 19.433
	},
	{
		"id": 3063,
		"name": "Hipoteczna-Pojezierska",
		"latitude": 51.79771,
		"longitude": 19.43275
	},
	{
		"id": 3064,
		"name": "Przędzalniana-Fabryczna",
		"latitude": 51.75707,
		"longitude": 19.48229
	},
	{
		"id": 3065,
		"name": "Przędzalniana-Fabryczna",
		"latitude": 51.75783,
		"longitude": 19.48192
	},
	{
		"id": 3067,
		"name": "Piotrkowska-Żwirki",
		"latitude": 51.75569,
		"longitude": 19.45932
	},
	{
		"id": 3068,
		"name": "Piotrkowska-Żwirki",
		"latitude": 51.75615,
		"longitude": 19.45918
	},
	{
		"id": 3069,
		"name": "Piotrkowska-Brzeźna",
		"latitude": 51.75303,
		"longitude": 19.45978
	},
	{
		"id": 3070,
		"name": "Piotrkowska-pl. Katedralny",
		"latitude": 51.74823,
		"longitude": 19.46115
	},
	{
		"id": 3071,
		"name": "Piotrkowska-pl. Katedralny",
		"latitude": 51.74972,
		"longitude": 19.46048
	},
	{
		"id": 3072,
		"name": "Piotrkowska-Czerwona",
		"latitude": 51.74573,
		"longitude": 19.46167
	},
	{
		"id": 3073,
		"name": "Zawiszy-Franciszkańska",
		"latitude": 51.78669,
		"longitude": 19.4577
	},
	{
		"id": 3074,
		"name": "Organizacji WiN-Franciszkańska",
		"latitude": 51.78757,
		"longitude": 19.45746
	},
	{
		"id": 3075,
		"name": "Bednarska-Pabianicka",
		"latitude": 51.73603,
		"longitude": 19.45967
	},
	{
		"id": 3076,
		"name": "Armii Krajowej-Batalionów Chłopskic",
		"latitude": 51.74205,
		"longitude": 19.40156
	},
	{
		"id": 3077,
		"name": "Armii Krajowej-Batalionów Chłopskic",
		"latitude": 51.74255,
		"longitude": 19.40089
	},
	{
		"id": 3078,
		"name": "Radwańska-Inżynierska",
		"latitude": 51.75121,
		"longitude": 19.44269
	},
	{
		"id": 3079,
		"name": "Franciszkańska-Organizacji WiN",
		"latitude": 51.78811,
		"longitude": 19.45944
	},
	{
		"id": 3080,
		"name": "Astrów-Inflancka",
		"latitude": 51.80122,
		"longitude": 19.466
	},
	{
		"id": 3081,
		"name": "Karolew",
		"latitude": 51.74736,
		"longitude": 19.42123
	},
	{
		"id": 3082,
		"name": "Młynek",
		"latitude": 51.72356,
		"longitude": 19.52021
	},
	{
		"id": 3083,
		"name": "Uniwersytecka-Narutowicza",
		"latitude": 51.77322,
		"longitude": 19.47404
	},
	{
		"id": 3084,
		"name": "Uniwersytecka-Narutowicza",
		"latitude": 51.77277,
		"longitude": 19.474
	},
	{
		"id": 3085,
		"name": "Wieńcowa-Wieśniacza",
		"latitude": 51.72659,
		"longitude": 19.60806
	},
	{
		"id": 3086,
		"name": "Wieńcowa-Wieśniacza",
		"latitude": 51.72662,
		"longitude": 19.60792
	},
	{
		"id": 3087,
		"name": "Skrzydlata-Dojazdowa",
		"latitude": 51.81013,
		"longitude": 19.47271
	},
	{
		"id": 3088,
		"name": "Paderewskiego-Zaolziańska",
		"latitude": 51.7292,
		"longitude": 19.45677
	},
	{
		"id": 3089,
		"name": "Czahary-Prądzyńskiego",
		"latitude": 51.72381,
		"longitude": 19.42329
	},
	{
		"id": 3090,
		"name": "Lodowa-Przybyszewskiego",
		"latitude": 51.75247,
		"longitude": 19.52044
	},
	{
		"id": 3091,
		"name": "Sienkiewicza-Tuwima",
		"latitude": 51.76566,
		"longitude": 19.46142
	},
	{
		"id": 3092,
		"name": "Sienkiewicza-Nawrot",
		"latitude": 51.76259,
		"longitude": 19.46221
	},
	{
		"id": 3093,
		"name": "Konstantynów Łódzki-1-go Maja",
		"latitude": 51.74257,
		"longitude": 19.32682
	},
	{
		"id": 3094,
		"name": "Konstantynów Łódzki-1-go Maja",
		"latitude": 51.74236,
		"longitude": 19.3286
	},
	{
		"id": 3095,
		"name": "Konstantynów Łódzki-Kolejowa",
		"latitude": 51.74096,
		"longitude": 19.33344
	},
	{
		"id": 3096,
		"name": "Konstantynów Łódzki-Kolejowa",
		"latitude": 51.74066,
		"longitude": 19.33354
	},
	{
		"id": 3097,
		"name": "plac Wolności (Konstantynów)",
		"latitude": 51.75053,
		"longitude": 19.31371
	},
	{
		"id": 3098,
		"name": "Konstantynów Łódzki-plac Kościuszki",
		"latitude": 51.74785,
		"longitude": 19.32456
	},
	{
		"id": 3099,
		"name": "Konstantynów Łódzki-plac Kościuszki",
		"latitude": 51.74784,
		"longitude": 19.32422
	},
	{
		"id": 3100,
		"name": "Konstantynów Łódzki-Daszyńskiego",
		"latitude": 51.74887,
		"longitude": 19.31953
	},
	{
		"id": 3101,
		"name": "Konstantynów Łódzki-Moniuszki",
		"latitude": 51.74876,
		"longitude": 19.3195
	},
	{
		"id": 3102,
		"name": "plac Wolności (Konstantynów)",
		"latitude": 51.75046,
		"longitude": 19.31367
	},
	{
		"id": 3103,
		"name": "ŁSSE Langiewicza (Konstantynów)",
		"latitude": 51.74136,
		"longitude": 19.35348
	},
	{
		"id": 3104,
		"name": "ŁSSE Łąkowa (Konstantynów)",
		"latitude": 51.74396,
		"longitude": 19.35074
	},
	{
		"id": 3105,
		"name": "Konstantynów Łódzki-Kolejowa 28",
		"latitude": 51.73677,
		"longitude": 19.33845
	},
	{
		"id": 3106,
		"name": "Kościelna (Konstantynów)",
		"latitude": 51.74667,
		"longitude": 19.36052
	},
	{
		"id": 3108,
		"name": "Mazowiecka-Czechosłowacka",
		"latitude": 51.77166,
		"longitude": 19.5101
	},
	{
		"id": 3109,
		"name": "Zachodnia-Manufaktura",
		"latitude": 51.78072,
		"longitude": 19.45087
	},
	{
		"id": 3110,
		"name": "przejazd techniczny",
		"latitude": 51.79185,
		"longitude": 19.42558
	},
	{
		"id": 3111,
		"name": "Nowa-Nawrot",
		"latitude": 51.76467,
		"longitude": 19.48231
	},
	{
		"id": 3112,
		"name": "Nawrot-Przędzalniana",
		"latitude": 51.7642,
		"longitude": 19.4807
	},
	{
		"id": 3113,
		"name": "Wodna-Tuwima",
		"latitude": 51.7668,
		"longitude": 19.47555
	},
	{
		"id": 3114,
		"name": "Srebrzyńska-Cmentarna",
		"latitude": 51.77551,
		"longitude": 19.43563
	}
];

/***/ })
/******/ ]);