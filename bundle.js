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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    // use this method instead of es6 [...nodeList].forEach
    // which requires polyfill for IE


    Utils.prototype.iterateNodeList = function iterateNodeList(nodeList, fn) {
        for (var i = 0; i < nodeList.length; i++) {
            var node = nodeList[i];
            fn(node, i);
        }
    };

    Utils.prototype.hasClass = function hasClass(el, cls) {
        return !!el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    };

    Utils.prototype.addClass = function addClass(el, cls) {
        if (!this.hasClass(el, cls)) el.className += " " + cls;
    };

    Utils.prototype.removeClass = function removeClass(el, cls) {
        if (this.hasClass(el, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    };

    Utils.prototype.toggleClass = function toggleClass(el, cls) {
        if (this.hasClass(el, cls)) {
            this.removeClass(el, cls);
        } else {
            this.addClass(el, cls);
        }
    };

    return Utils;
}();

exports.default = new Utils();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _seelect = __webpack_require__(3);

var _seelect2 = _interopRequireDefault(_seelect);

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
    function App() {
        _classCallCheck(this, App);

        document.addEventListener("DOMContentLoaded", this.init());
    }

    App.prototype.init = function init() {
        var _this = this;

        console.log('Seelect demo app start');

        this.utils = _utils2.default;

        VK.init({ apiId: 6057159 });

        this.showLogin();

        document.querySelector('#login').addEventListener('click', function (evt) {

            VK.Auth.login(function () {
                _this.afterLogin();
            });
        });
    };

    App.prototype.showLogin = function showLogin() {
        document.querySelector('#login').style.display = 'block';
    };

    App.prototype.afterLogin = function afterLogin() {
        var _this2 = this;

        document.querySelector('#login').style.display = 'none';
        document.querySelector('#seelects').style.display = 'block';

        this.utils.iterateNodeList(document.querySelectorAll('.seelect'), function (el, i) {
            var config = { element: el, uniqueKey: i, debug: true };

            if (el.id == 'withVKSearch') {
                // set vk search for specific seelect
                config.onNotFound = _this2.fetchData;
            }

            new _seelect2.default(config);
        });
    };

    App.prototype.fetchData = function fetchData(seelect, ts) {
        seelect.dataLockToken = ts;

        setTimeout(function () {
            //cleaning lock token
            if (seelect.dataLockToken === ts) {
                console.log('Oops! Data fetching timeout for token ' + seelect.dataLockToken);
                delete seelect.dataLockToken;
            }
        }, 30000);

        VK.api("friends.search", { "q": seelect.inputValue }, function (data) {
            var parsedData = [];
            if (data.response) {
                for (var i = 1; i < data.response.length; i++) {
                    var vkUserSearchData = data.response[i];
                    parsedData.push({
                        value: vkUserSearchData.uid,
                        label: vkUserSearchData.first_name + ' ' + vkUserSearchData.last_name,
                        text: vkUserSearchData.first_name + ' ' + vkUserSearchData.last_name
                    });
                }
            }

            seelect.setData(parsedData, ts);
        });
    };

    return App;
}();

exports.default = new App();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IndexTree = function () {
    function IndexTree(data) {
        _classCallCheck(this, IndexTree);

        this.data = data;
        this.tree = {};

        this.dictionary = [['A', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'], ['А', 'B', 'V', 'G', 'D', 'E', 'ZH', 'Z', 'I', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'KH', 'TS', 'CH', 'SH', 'SHCH', 'IE', 'Y', 'Ь', 'E', 'IU', 'IA'], ['f', ',', 'd', 'u', 'l', 't', ';', 'p', 'b', 'q', 'r', 'k', 'v', 'y', 'j', 'g', 'h', 'c', 'n', 'e', 'a', '[', 'w', 'x', 'i', 'o', ']', 's', 'm', '\'', '.', 'z'], ['F', '<', 'D', 'U', 'L', 'T', ':', 'P', 'B', 'Q', 'R', 'K', 'V', 'Y', 'J', 'G', 'H', 'C', 'N', 'E', 'A', '{', 'W', 'X', 'I', 'O', '}', 'S', 'M', '\"', '>', 'Z'], ['Ф', 'И', 'М', 'П', 'В', 'У', 'ЯР', 'Я', 'Ш', 'Ш', 'Л', 'Д', 'Ь', 'Т', 'Щ', 'З', 'К', 'Ы', 'Е', 'Г', 'А', 'ЛР', 'ЕЫ', 'СР', 'ЫР', 'ЫРСР', 'ШЕ', 'Н', 'Ь', 'У', 'ШГ', 'ШФ']];

        this.init();
    }

    IndexTree.prototype.buildResults = function buildResults() {
        var cont = document.querySelector("#result");

        for (var i = 0; i < this.data.length; i++) {
            var data = this.data[i];
            var el = document.createElement('div');
            el.innerText = data.text;
            el.setAttribute('data-value', data.value);
            cont.appendChild(el);
        }
    };

    IndexTree.prototype._GOSTCyr2Lat = function _GOSTCyr2Lat(char) {
        var result = null;
        if (!char) {
            return null;
        }

        var cyr = ['A', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
        var lat = ['А', 'B', 'V', 'G', 'D', 'E', 'ZH', 'Z', 'I', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'KH', 'TS', 'CH', 'SH', 'SHCH', 'IE', 'Y', 'Ь', 'E', 'IU', 'IA'];

        var indexOfCyrChar = cyr.indexOf(char.toUpperCase());
        var indexOfLatChar = lat.indexOf(char.toUpperCase());

        if (indexOfCyrChar >= 0) {
            result = lat[indexOfCyrChar];
        } else if (indexOfLatChar >= 0) {
            result = lat[indexOfLatChar];
        }

        return result;
    };

    IndexTree.prototype._wrongKeyboard = function _wrongKeyboard(char) {
        var result = null;
        if (!char) {
            return null;
        }

        var wrongCyr = ['f', ',', 'd', 'u', 'l', 't', ';', 'p', 'b', 'q', 'r', 'k', 'v', 'y', 'j', 'g', 'h', 'c', 'n', 'e', 'a', '[', 'w', 'x', 'i', 'o', ']', 's', 'm', '\'', '.', 'z'];
        var wrongCyrCaps = ['F', '<', 'D', 'U', 'L', 'T', ':', 'P', 'B', 'Q', 'R', 'K', 'V', 'Y', 'J', 'G', 'H', 'C', 'N', 'E', 'A', '{', 'W', 'X', 'I', 'O', '}', 'S', 'M', '\"', '>', 'Z'];
        var wrongLat = ['Ф', 'И', 'М', 'П', 'В', 'У', 'ЯР', 'Я', 'Ш', 'Ш', 'Л', 'Д', 'Ь', 'Т', 'Щ', 'З', 'К', 'Ы', 'Е', 'Г', 'А', 'ЛР', 'ЕЫ', 'СР', 'ЫР', 'ЫРСР', 'ШЕ', 'Н', 'Ь', 'У', 'ШГ', 'ШФ'];
        var lat = ['А', 'B', 'V', 'G', 'D', 'E', 'ZH', 'Z', 'I', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'KH', 'TS', 'CH', 'SH', 'SHCH', 'IE', 'Y', 'Ь', 'E', 'IU', 'IA'];
        var cyr = ['A', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];

        var index = -1;
        index = wrongCyr.indexOf(char);
        if (index < 0) {
            index = wrongCyrCaps.indexOf(char);
            if (index < 0) {
                index = wrongLat.indexOf(char.toUpperCase());
            }
        }

        if (index >= 0) {
            result = lat[index];
        }

        return result;
    };

    IndexTree.prototype.getIndices = function getIndices(string) {
        var stringAsArray = string.split(''); //todo: fix for different cases
        var tree = this.tree;
        function getIndicesFor(fn) {
            var depth = 0;
            var subtree = tree;
            while (depth < stringAsArray.length) {
                var sproutCode = fn(stringAsArray[depth]);
                if (subtree.hasOwnProperty(sproutCode)) {
                    subtree = subtree[sproutCode];
                    depth++;
                } else {
                    return [];
                }
            }

            return subtree.indices;
        }

        var indices = getIndicesFor(this._GOSTCyr2Lat);
        var indices2 = getIndicesFor(this._wrongKeyboard);

        var composedIndices = indices.concat(indices2);
        return composedIndices;
    };

    IndexTree.prototype._buildIndexTree = function _buildIndexTree() {
        var tree = {};
        function attachSprout(branch, sprout) {
            // sprout: {code: int, index: int}
            if (!branch.hasOwnProperty(sprout.code)) {
                branch[sprout.code] = {
                    indices: [sprout.index]
                };
            } else if (branch[sprout.code].indices.indexOf(sprout.index) < 0) {
                branch[sprout.code].indices.push(sprout.index);
            }
            return branch[sprout.code];
        }

        function getSproutCodes() {
            var wrongCyr = ['f', ',', 'd', 'u', 'l', 't', ';', 'p', 'b', 'q', 'r', 'k', 'v', 'y', 'j', 'g', 'h', 'c', 'n', 'e', 'a', '[', 'w', 'x', 'i', 'o', ']', 's', 'm', '\'', '.', 'z'];
            var wrongCyrCaps = ['F', '<', 'D', 'U', 'L', 'T', ':', 'P', 'B', 'Q', 'R', 'K', 'V', 'Y', 'J', 'G', 'H', 'C', 'N', 'E', 'A', '{', 'W', 'X', 'I', 'O', '}', 'S', 'M', '\"', '>', 'Z'];
            var wrongLat = ['Ф', 'И', 'М', 'П', 'В', 'У', 'ЯР', 'Я', 'Ш', 'Ш', 'Л', 'Д', 'Ь', 'Т', 'Щ', 'З', 'К', 'Ы', 'Е', 'Г', 'А', 'ЛР', 'ЕЫ', 'СР', 'ЫР', 'ЫРСР', 'ШЕ', 'Н', 'Ь', 'У', 'ШГ', 'ШФ'];
            var lat = ['А', 'B', 'V', 'G', 'D', 'E', 'ZH', 'Z', 'I', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'KH', 'TS', 'CH', 'SH', 'SHCH', 'IE', 'Y', 'Ь', 'E', 'IU', 'IA'];
            var cyr = ['A', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];

            var sproutCodes = [];
        }

        for (var i = 0; i < this.data.length; i++) {
            var terms = this.data[i].text.split(' ');
            for (var j = 0; j < terms.length; j++) {
                var arrayOfChars = terms[j].split('');
                var subTree = tree;
                for (var k = 0; k < arrayOfChars.length; k++) {
                    var code = this._GOSTCyr2Lat(terms[j][k]);
                    subTree = attachSprout(subTree, { code: code, index: i });
                }
            }
        }
        this.tree = tree;
    };

    IndexTree.prototype.init = function init() {
        this._buildIndexTree();
    };

    return IndexTree;
}();

exports.default = IndexTree;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _indexTree = __webpack_require__(2);

var _indexTree2 = _interopRequireDefault(_indexTree);

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Seelect = function () {
    function Seelect(config) {
        _classCallCheck(this, Seelect);

        this.utils = _utils2.default;
        this.config = config; // let config overrides atributes
        this.selectElement = config.element;
        this.selectElement.style.display = 'none';

        this.id = 'seelect-container';

        this.data = [];
        this.settings = {};

        this.inputValue = '';
        this.selected = [];

        this.dictionary = { //todo: make this configurable, would be useful for i18n or other cases
            selectValue: 'Выберите значение'
        };

        this.init();
    }

    Seelect.prototype.init = function init() {
        try {
            this._generateId();
            this._setup();
            this._collectData();
            this._buildDOMElements();
            if (!this.settings.disableAutocomplete) {
                this._enableAutocomplete();
            }
            this._attachEvents();
            window.__SEELECT_INITED = true; //make global flag to show that at least one seelect is inited
        } catch (e) {
            console.error(e);
            console.log('Error initializing Seelect!');
        }
    };

    Seelect.prototype.getSelectedValues = function getSelectedValues() {
        return this.selected;
    };

    Seelect.prototype.select = function select(value, el) {
        var _this = this;

        if (this.settings.isMultiselect) {
            if (!this.selected.filter(function (obj) {
                return obj.value == value;
            }).length) {
                this.selected.push(this.data.filter(function (obj) {
                    return obj.value == value;
                })[0]);
                this._updateSelected();
                this.utils.addClass(el, 'selected');
            }
        } else {
            this.selected = this.data.filter(function (obj) {
                return obj.value == value;
            });
            this._updateSelected();
            this.utils.iterateNodeList(this.dropdownElement.querySelectorAll('li'), function (ele) {
                _this.utils.removeClass(ele, 'selected');
            });
            this.utils.addClass(el, 'selected');
        }
    };

    Seelect.prototype.deselect = function deselect(value) {
        this.selected = this.selected.filter(function (obj) {
            return obj.value != value;
        });
        this._updateSelected();
        var resultsEl = this.dropdownElement.querySelector('li[data-value="' + value + '"]');
        this.utils.removeClass(resultsEl, 'selected');
    };

    Seelect.prototype.setData = function setData(data, ts) {
        //ts - optional parameter, for dirty async operations, updating data
        if (this.dataLockToken && ts && ts !== this.dataLockToken) return false;

        this.data = data;
        this.indexTree = new _indexTree2.default(this.data);
        this._buildResults();
        if (ts) {
            delete this.dataLockToken;
        }
    };

    Seelect.prototype._setPlaceholderVisibilty = function _setPlaceholderVisibilty() {
        if (this.selected.length) {
            this.placeholderElement.style.display = 'none';
        } else {
            this.placeholderElement.style.display = 'block';
        }
    };

    Seelect.prototype._setup = function _setup() {
        this.settings.debug = !!this.config.debug;
        this.settings.isMultiselect = this.config.hasOwnProperty('isMultiselect') ? this.config.isMultiselect : this.selectElement.hasAttribute('multiple');
        this.settings.disableAutocomplete = this.config.hasOwnProperty('disableAutocomplete') ? this.config.disableAutocomplete : this.selectElement.hasAttribute('data-disable-autocomplete');
        this.settings.useIcons = this.config.hasOwnProperty('useIcons') ? this.config.useIcons : this.selectElement.hasAttribute('data-use-icons');
        if (this.config.onNotFound) {
            this.settings.onNotFound = this.config.onNotFound;
        }
    };

    Seelect.prototype._collectData = function _collectData() {
        var _this2 = this;

        this.data = [];
        this.utils.iterateNodeList(this.selectElement.querySelectorAll('option'), function (opt) {
            var el = {
                value: opt.getAttribute('value'),
                label: opt.getAttribute('label') || opt.textContent,
                text: opt.textContent
            };

            if (_this2.settings.useIcons) {
                el.icon = opt.getAttribute('data-icon');
            }

            _this2.data.push(el);
        });

        // building tree of indices for data
        this.indexTree = new _indexTree2.default(this.data);

        if (this.settings.debug) {
            console.log(this.indexTree);
        }
    };

    /*
    Generating unique id
     */


    Seelect.prototype._generateId = function _generateId() {
        var prefix = 'seelect-';
        var postfix = this.config.uniqueKey; //todo
        this.id = prefix + 'container-' + postfix;
    };

    Seelect.prototype._buildResults = function _buildResults() {
        this.dropdownElement.style.visibility = 'hidden';
        while (this.dropdownElement.lastChild) {
            this.dropdownElement.removeChild(this.dropdownElement.lastChild);
        }

        for (var i = 0; i < this.data.length; i++) {
            var data = this.data[i];
            var el = document.createElement('li');
            el.innerText = data.text;
            el.setAttribute('data-value', data.value);

            if (this.settings.useIcons) {
                el.style.backgroundImage = 'url(' + data.icon + ')';
                this.utils.addClass(el, 'with-icon');
            }

            this.dropdownElement.appendChild(el);
        }

        if (this.data.length !== 0) {
            this.dropdownElement.style.visibility = 'visible';
        }
        this._setPlaceholderVisibilty();
    };

    Seelect.prototype._autocomplete = function _autocomplete() {
        var cont = this.selectElement.parentNode.querySelector('.seelect-container .seelect-dd');
        var lis = cont.getElementsByTagName('li');
        for (var i = 0; i < lis.length; i++) {
            if (this.indices.indexOf(i) >= 0 || !this.indices.length) {
                lis[i].style.display = 'block';
            } else {
                lis[i].style.display = 'none';
            }
        }
    };

    Seelect.prototype._enableAutocomplete = function _enableAutocomplete() {
        var _this3 = this;

        var input = this.selectElement.parentNode.querySelector('.seelect-container .seelect-input');

        input.addEventListener('keyup', function (evt) {

            if (evt.target.value === _this3.input) {
                return false; // not changed
            }

            _this3.inputValue = evt.target.value;
            if (_this3.inputValue === '') {
                _this3.indices = [];
            } else {
                _this3.indices = _this3.indexTree.getIndices(_this3.inputValue);
            }

            _this3._autocomplete();

            if (_this3.settings.onNotFound && _this3.inputValue !== '' && _this3.indices.length === 0) {
                var ts = Date.now(); //todo: change on Promise, and cancel promise on new search request
                _this3.settings.onNotFound(_this3, ts);
            }
        });
    };

    Seelect.prototype._attachEvents = function _attachEvents() {
        var _this4 = this;

        this.containerElement.addEventListener('click', function (evt) {

            if (window.__SEELECT_INITED) {
                var seelectsList = document.querySelectorAll('.seelect-container');
                _this4.utils.iterateNodeList(seelectsList, function (el) {
                    if (el !== _this4.containerElement) {
                        _this4.utils.removeClass(el, 'active');
                    }
                });
            }

            _this4.utils.toggleClass(_this4.containerElement, 'active');
            if (!_this4.settings.disableAutocomplete) {
                _this4.inputElement.focus();
            }
        });

        if (!this.settings.disableAutocomplete) {
            this.inputElement.addEventListener('click', function (evt) {
                evt.stopPropagation();
            });
        }

        this.dropdownElement.addEventListener('click', function (evt) {
            if (evt.target.tagName === 'LI') {
                var value = evt.target.getAttribute('data-value');
                if (_this4.isValueSelected(value)) {
                    _this4.deselect(value);
                } else {
                    _this4.select(value, evt.target);
                }
            }
        });

        this.selectedElement.addEventListener('click', function (evt) {

            var value = evt.target.getAttribute('data-value');
            if (value) {
                evt.stopPropagation();
                _this4.deselect(value);
            }
        });
    };

    Seelect.prototype.isValueSelected = function isValueSelected(value) {
        return !!this.selected.filter(function (obj) {
            return obj.value == value;
        }).length;
    };

    /*
     Building new DOM for selects
     */


    Seelect.prototype._buildDOMElements = function _buildDOMElements() {
        var containerElement = document.createElement('div');
        containerElement.id = this.id;
        containerElement.className = 'seelect-container';
        this.containerElement = containerElement;

        var selectedElement = document.createElement('div');
        selectedElement.className = 'seelect-selected';
        containerElement.appendChild(selectedElement);
        this.selectedElement = selectedElement;

        var placeholder = document.createElement('span');
        placeholder.className = 'seelect-placeholder';
        placeholder.innerText = this.dictionary.selectValue;
        this.placeholderElement = placeholder;
        this.selectedElement.appendChild(this.placeholderElement);

        this.selectedElement.appendChild(document.createElement('div'));

        if (!this.settings.disableAutocomplete) {
            var inputElement = document.createElement('input');
            inputElement.className = 'seelect-input';
            containerElement.appendChild(inputElement);
            this.inputElement = inputElement;
        }

        var dropdownElement = document.createElement('ul');
        dropdownElement.className = 'seelect-dd';
        this.dropdownElement = dropdownElement;
        containerElement.appendChild(dropdownElement);

        this._buildResults();

        if (this.settings.debug) {
            var debugElement = document.createElement('pre');
            debugElement.innerHTML = JSON.stringify(this.settings, undefined, 2);
            this.debugElement = debugElement;
            this.selectElement.parentNode.insertBefore(debugElement, this.selectElement);
        }
        this.selectElement.parentNode.insertBefore(containerElement, this.selectElement);
    };

    Seelect.prototype._updateSelected = function _updateSelected() {
        var cont = document.createElement('div');
        var selectedValuesDiv = this.selectedElement.querySelector('div');
        this.selectedElement.removeChild(selectedValuesDiv);

        this.selected.map(function (data) {
            var el = document.createElement('div');
            el.innerText = data.text;
            el.setAttribute('data-value', data.value);
            el.className = 'seelected-item';
            cont.appendChild(el);
        });

        this._setPlaceholderVisibilty();

        this.selectedElement.appendChild(cont);
    };

    return Seelect;
}();

exports.default = Seelect;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map