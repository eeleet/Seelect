export default class IndexTree {
    constructor(data) {
        this.data = data;
        this.tree = {};
        this.init();
    }

    buildResults() {
        let cont = document.querySelector("#result");

        for (let i = 0; i < this.data.length; i++) {
            const data = this.data[i];
            let el = document.createElement('div');
            el.innerText = data.text;
            el.setAttribute('data-value', data.value);
            cont.appendChild(el);
        }
    }

    _GOSTCyr2Lat(char) {
        let result = null;
        if(!char) {
            return null;
        }

        const cyr = ['A', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', ' К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
        const lat = ['А', 'B', 'V', 'G', 'D', 'E', 'ZH', 'Z', 'I', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'KH', 'TS', 'CH', 'SH', 'SHCH', 'IE', 'Y', 'Ь', 'E', 'IU', 'IA'];

        const indexOfCyrChar = cyr.indexOf(char.toUpperCase());
        const indexOfLatChar = lat.indexOf(char.toUpperCase());

        if (indexOfCyrChar >= 0) {
            result = lat[indexOfCyrChar];
        } else if (indexOfLatChar >= 0) {
            result = lat[indexOfLatChar]
        }

        return result;
    }

    _wrongKeyboard(char) {
        let result = null;
        if(!char) {
            return null;
        }

        const wrongCyr = ['f',',','d','u','l','t',';','p','b','q','r','k','v','y','j','g','h','c','n','e','a','[','w','x','i','o',']','s','m','\'','.','z'];
        const wrongCyrCaps = ['F','<','D','U','L','T',':','P','B','Q','R','K','V','Y','J','G','H','C','N','E','A','{','W','X','I','O','}','S','M','\"','>','Z'];
        const wrongLat = ['Ф', 'И', 'М', 'П', 'В', 'У', 'ЯР', 'Я', 'Ш', 'Ш', 'Л', 'Д', 'Ь', 'Т', 'Щ', 'З', 'К', 'Ы', 'Е', 'Г', 'А', 'ЛР', 'ЕЫ', 'СР', 'ЫР', 'ЫРСР', 'ШЕ', 'Н', 'Ь', 'У', 'ШГ', 'ШФ'];
        const lat = ['А', 'B', 'V', 'G', 'D', 'E', 'ZH', 'Z', 'I', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'KH', 'TS', 'CH', 'SH', 'SHCH', 'IE', 'Y', 'Ь', 'E', 'IU', 'IA'];
        const cyr = ['A', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', ' К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];

        let index = -1;
        index = wrongCyr.indexOf(char);
        if(index < 0) {
            index = wrongCyrCaps.indexOf(char);
            if(index < 0) {
                index = wrongLat.indexOf(char.toUpperCase());
            }
        }

        if(index >= 0) {
            result = lat[index];
        }

        return result;
    }



    getIndicies(string) {
        let stringAsArray = string.split(''); //todo: fix for different cases
        const tree = this.tree;
        function getIndiciesFor(fn) {
            let depth = 0;
            let subtree = tree;
            while(depth < stringAsArray.length) {
                const sproutCode = fn(stringAsArray[depth]);
                if(subtree.hasOwnProperty(sproutCode)) {
                    subtree = subtree[sproutCode];
                    depth++;
                } else {
                    return [];
                }
            }

            return subtree.indicies;
        }

        const indicies = getIndiciesFor(this._GOSTCyr2Lat);
        const indicies2 = getIndiciesFor(this._wrongKeyboard);

        const composedIndicies = indicies.concat(indicies2);
        return composedIndicies;

    }

    _buildIndexTree() {
        let tree = {};
        function attachSprout(branch, sprout) { // sprout: {code: int, index: int}
            if (!branch.hasOwnProperty(sprout.code)) {
                branch[sprout.code] = {
                    indicies: [sprout.index]
                }
            }
            else if (branch[sprout.code].indicies.indexOf(sprout.index) < 0) {
                branch[sprout.code].indicies.push(sprout.index);
            }
            return branch[sprout.code];
        }

        function getSproutCodes() {
            const wrongCyr = ['f',',','d','u','l','t',';','p','b','q','r','k','v','y','j','g','h','c','n','e','a','[','w','x','i','o',']','s','m','\'','.','z'];
            const wrongCyrCaps = ['F','<','D','U','L','T',':','P','B','Q','R','K','V','Y','J','G','H','C','N','E','A','{','W','X','I','O','}','S','M','\"','>','Z'];
            const wrongLat = ['Ф', 'И', 'М', 'П', 'В', 'У', 'ЯР', 'Я', 'Ш', 'Ш', 'Л', 'Д', 'Ь', 'Т', 'Щ', 'З', 'К', 'Ы', 'Е', 'Г', 'А', 'ЛР', 'ЕЫ', 'СР', 'ЫР', 'ЫРСР', 'ШЕ', 'Н', 'Ь', 'У', 'ШГ', 'ШФ'];
            const lat = ['А', 'B', 'V', 'G', 'D', 'E', 'ZH', 'Z', 'I', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'KH', 'TS', 'CH', 'SH', 'SHCH', 'IE', 'Y', 'Ь', 'E', 'IU', 'IA'];
            const cyr = ['A', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', ' К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];

            let sproutCodes = [];

        }

        for (let i = 0; i < this.data.length; i++) {
            const terms = this.data[i].text.split(' ');
            for (let j = 0; j < terms.length; j++) {
                let arrayOfChars = terms[j].split('');
                let subTree = tree;
                for (let k = 0; k < arrayOfChars.length; k++) {
                    const code = this._GOSTCyr2Lat(terms[j][k]);
                    subTree = attachSprout(subTree, {code: code, index: i});
                }
            }
        }
        this.tree = tree;
    }

    init() {
        this._buildIndexTree();
    }
}



