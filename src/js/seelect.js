import IndexTree from './index-tree'
import Utils from './utils'

export default class Seelect {
    constructor(config) {
        this.utils = Utils;
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
        }

        this.init();
    }

    init() {
        try {
            this._generateId();
            this._setup();
            this._collectData();
            this._buildDOMElements();
            if(!this.settings.disableAutocomplete) {
                this._enableAutocomplete();
            }
            this._attachEvents();
            window.__SEELECT_INITED = true;
        }
        catch(e) {
            console.error(e);
            console.log('Error initializing Seelect!');
        }
    }

    getSelectedValues() {
        return this.selected;
    }

    select(value, el) {
        if(this.settings.isMultiselect) {
            if(!this.selected.filter((obj) => { return obj.value == value;}).length) {
                this.selected.push(this.data.filter((obj) => { return obj.value == value;})[0]);
                this._updateSelected();
                this.utils.addClass(el, 'selected');
            }
        } else {
            this.selected = this.data.filter((obj) => { return obj.value == value;});
            this._updateSelected();
            this.utils.iterateNoteList(this.dropdownElement.querySelectorAll('li'),(ele)=> {this.utils.removeClass(ele, 'selected'); })
            this.utils.addClass(el, 'selected');
        }
    }

    deselect(value) {
        this.selected = this.selected.filter((obj) => { return obj.value != value; });
        this._updateSelected();
        let resultsEl = this.dropdownElement.querySelector('li[data-value="' + value + '"]');
        this.utils.removeClass(resultsEl, 'selected');
    }

    setData(data, ts) { //ts - optional parameter, for dirty async operations, updating data
        if(this.dataLockToken && ts && ts !== this.dataLockToken)
            return false;

        this.data = data;
        this.indexTree = new IndexTree(this.data);
        this._buildResults();
        if(ts) {
            delete this.dataLockToken;
        }
    }

    _setPlaceholderVisibilty() {
        if(this.selected.length) {
            this.placeholderElement.style.display = 'none';
        }
        else {
            this.placeholderElement.style.display = 'block';
        }
    }

    _setup() {
        this.settings.debug = !!this.config.debug;
        this.settings.isMultiselect = this.config.hasOwnProperty('isMultiselect') ? this.config.isMultiselect : this.selectElement.hasAttribute('multiple');
        this.settings.disableAutocomplete = this.config.hasOwnProperty('disableAutocomplete') ? this.config.disableAutocomplete : this.selectElement.hasAttribute('data-disable-autocomplete');
        this.settings.useIcons = this.config.hasOwnProperty('useIcons') ? this.config.useIcons : this.selectElement.hasAttribute('data-use-icons');
        if(this.config.onNotFound) {
            this.settings.onNotFound = this.config.onNotFound;
        }
    }

    _collectData() {
        this.data = [];
        this.utils.iterateNoteList(this.selectElement.querySelectorAll('option'), (opt) => {
            const el = {
                value: opt.getAttribute('value'),
                label: opt.getAttribute('label') || opt.textContent,
                text: opt.textContent
            };

            if(this.settings.useIcons) {
                el.icon = opt.getAttribute('data-icon');
            }

            this.data.push(el);
        });

        // building tree of indices for data
        this.indexTree = new IndexTree(this.data);

        if(this.settings.debug) {
            console.log(this.indexTree);
        }
    }

    /*
    Generating unique id
     */
    _generateId() {
        const prefix = 'seelect-';
        const postfix = this.config.uniqueKey; //todo
        this.id = prefix + 'container-' + postfix;
    }

    _buildResults() {
        this.dropdownElement.style.visibility = 'hidden';
        while(this.dropdownElement.lastChild) {
            this.dropdownElement.removeChild(this.dropdownElement.lastChild);
        }

        for (let i = 0; i < this.data.length; i++) {
            const data = this.data[i];
            let el = document.createElement('li');
            el.innerText = data.text;
            el.setAttribute('data-value', data.value);

            if(this.settings.useIcons) {
                el.style.backgroundImage = `url(${data.icon})`;
                this.utils.addClass(el, 'with-icon');
            }

            this.dropdownElement.appendChild(el);
        }

        if(this.data.length !== 0) {
            this.dropdownElement.style.visibility = 'visible';
        }
        this._setPlaceholderVisibilty();
    }

    _autocomplete() {
        let cont = this.selectElement.parentNode.querySelector('.seelect-container .seelect-dd');
        let lis = cont.getElementsByTagName('li');
        for(let i = 0; i < lis.length; i++) {
            if(this.indices.indexOf(i) >= 0 || !this.indices.length) {
                lis[i].style.display = 'block';
            } else {
                lis[i].style.display = 'none';
            }
        }
    }

    _enableAutocomplete() {
        let input = this.selectElement.parentNode.querySelector('.seelect-container .seelect-input');

        input.addEventListener('keyup', (evt) => {

            if(evt.target.value === this.input) {
                return false; // not changed
            }

            this.inputValue = evt.target.value;
            if(this.inputValue === '') {
                this.indices = [];
            } else {
                this.indices = this.indexTree.getIndices(this.inputValue);
            }

            this._autocomplete();

            if(this.settings.onNotFound && this.inputValue !== '' && this.indices.length === 0) {
                let ts = Date.now(); //todo: change on Promise, and cancel promise on new search request
                this.settings.onNotFound(this, ts);
            }
        })
    }

    _attachEvents() {
        this.containerElement.addEventListener('click', (evt) => {

            if(window.__SEELECT_INITED) {
                let seelectsList = document.querySelectorAll('.seelect-container');
                this.utils.iterateNoteList(seelectsList, (el) => {
                    if(el !== this.containerElement) {
                        this.utils.removeClass(el, 'active');
                    }
                })
            }

            this.utils.toggleClass(this.containerElement, 'active');
            if(!this.settings.disableAutocomplete) {
                this.inputElement.focus();
            }
        });

        if(!this.settings.disableAutocomplete) {
            this.inputElement.addEventListener('click', (evt) => {
                evt.stopPropagation();
            });
        }

        this.dropdownElement.addEventListener('click', (evt) => {
            if(evt.target.tagName === 'LI') {
                let value = evt.target.getAttribute('data-value');
                if(this.isValueSelected(value))  {
                    this.deselect(value);
                } else {
                    this.select(value, evt.target);
                }
            }
        });

        this.selectedElement.addEventListener('click', (evt) => {

            const value = evt.target.getAttribute('data-value');
            if(value) {
                evt.stopPropagation();
                this.deselect(value)
            }
        });

    }

    isValueSelected(value) {
        return !!this.selected.filter((obj) => { return obj.value == value }).length;
    }

    /*
     Building new DOM for selects
     */
    _buildDOMElements() {
        let containerElement = document.createElement('div');
        containerElement.id = this.id;
        containerElement.className = 'seelect-container';
        this.containerElement = containerElement;

        let selectedElement = document.createElement('div');
        selectedElement.className = 'seelect-selected';
        containerElement.appendChild(selectedElement);
        this.selectedElement = selectedElement;

        let placeholder = document.createElement('span');
        placeholder.className = 'seelect-placeholder';
        placeholder.innerText = this.dictionary.selectValue;
        this.placeholderElement = placeholder;
        this.selectedElement.appendChild(this.placeholderElement);

        this.selectedElement.appendChild(document.createElement('div'));

        if(!this.settings.disableAutocomplete) {
            let inputElement = document.createElement('input');
            inputElement.className = 'seelect-input';
            containerElement.appendChild(inputElement);
            this.inputElement = inputElement;
        }


        let dropdownElement = document.createElement('ul');
        dropdownElement.className = 'seelect-dd';
        this.dropdownElement = dropdownElement;
        containerElement.appendChild(dropdownElement);

        this._buildResults();

        if(this.settings.debug) {
            let debugElement = document.createElement('pre');
            debugElement.innerHTML = JSON.stringify(this.settings, undefined, 2);
            this.debugElement = debugElement;
            this.selectElement.parentNode.insertBefore(debugElement, this.selectElement);
        }
        this.selectElement.parentNode.insertBefore(containerElement, this.selectElement);

    }

    _updateSelected() {
        let cont = document.createElement('div');
        const selectedValuesDiv = this.selectedElement.querySelector('div');
        this.selectedElement.removeChild(selectedValuesDiv)

        this.selected.map((data) => {
            let el = document.createElement('div');
            el.innerText = data.text;
            el.setAttribute('data-value', data.value);
            el.className = 'seelected-item';
            cont.appendChild(el);
        })

        this._setPlaceholderVisibilty();

        this.selectedElement.appendChild(cont);
    }
}