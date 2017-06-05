// EXPIREMENTAL
// NOT FINISHED YET

class IndexTree2 {
    constructor(data) {
        this.data = data;
        this.tree = {};

        this.dictionary = [
            ['A', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'],
            ['А', 'B', 'V', 'G', 'D', 'E', 'ZH', 'Z', 'I', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'KH', 'TS', 'CH', 'SH', 'SHCH', 'IE', 'Y', 'Ь', 'E', 'IU', 'IA'],
            ['f', ',', 'd', 'u', 'l', 't', ';', 'p', 'b', 'q', 'r', 'k', 'v', 'y', 'j', 'g', 'h', 'c', 'n', 'e', 'a', '[', 'w', 'x', 'i', 'o', ']', 's', 'm', '\'', '.', 'z'],
            ['F', '<', 'D', 'U', 'L', 'T', ':', 'P', 'B', 'Q', 'R', 'K', 'V', 'Y', 'J', 'G', 'H', 'C', 'N', 'E', 'A', '{', 'W', 'X', 'I', 'O', '}', 'S', 'M', '\"', '>', 'Z'],
            ['Ф', 'И', 'М', 'П', 'В', 'У', 'ЯР', 'Я', 'Ш', 'Ш', 'Л', 'Д', 'Ь', 'Т', 'Щ', 'З', 'К', 'Ы', 'Е', 'Г', 'А', 'ЛР', 'ЕЫ', 'СР', 'ЫР', 'ЫРСР', 'ШЕ', 'Н', 'Ь', 'У', 'ШГ', 'ШФ'],
        ]
        
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

        const cyr = ['A', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
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
        const cyr = ['A', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];

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

    _getCodesForIndex(ind) {
        let codesForIndex = [];
        for(let i = 0; i < this.dictionary.length; i++) {
            let code = this.dictionary[i][ind];
            codesForIndex.push(code);
        }
        return codesForIndex;
    }

    _getCodesForChar(c) {
        const char = c.toUpperCase();
        let indices = [];
        let codes = [];

        for(let i = 0; i < this.dictionary.length; i++) {
            const dict = this.dictionary[i];
            let idx = dict.indexOf(char);
            while (idx != -1) {
                if(indices.indexOf(idx) == -1) {
                    indices.push(idx);
                    let codesForIndex = this._getCodesForIndex(idx);
                    for(let k = 0; k < codesForIndex.length; k++) {
                        let code = codesForIndex[k];
                        if(codes.indexOf(code) == -1) {
                            codes.push(code);
                        }
                    }
                }
                idx = dict.indexOf(char, idx + 1);
            }
        }
        return codes;
    }

    getIndices(string) {
        let chars = string.split(''); //todo: fix for different cases
        const tree = this.tree;

        let depth = 0;
        let subTree = tree;
        while(depth < chars.length) {
            const code = chars[depth].toUpperCase();
            if(subTree.hasOwnProperty(code)) {
                subTree = subTree[code];
                depth++;
            } else {
                return [];
            }
        }

        return subTree.indices;
    }


    _attachSprout(sprout, branch) { // sprout: {code: int, index: int}
        const code = sprout.code.toUpperCase();

        if (!branch.hasOwnProperty(code)) {
            branch[code] = {
                indices: [sprout.index]
            }
        }
        else if (branch[code].indices.indexOf(sprout.index) < 0) {
            branch[code].indices.push(sprout.index);
        }

        return branch[code];
    }

    _buildBranch(word, roots, index) {
        const chars = word.split('');
        let subTrees = roots;
        let newSprouts = [];
        for (let i = 0; i < chars.length; i++) {
            const codes = this._getCodesForChar(chars[i]);
            newSprouts = [];
            for(let j = 0 ; j < subTrees.length; j++) {
                for(let k = 0; k < codes.length; k++) {
                    let code = codes[k];
                    if(code.length > 1) {
                        this._buildBranch(code, [subTrees[j]], index);
                    }
                    else {
                        newSprouts.push(this._attachSprout({code: code, index: index}, subTrees[j]));
                    }
                }
            }

            subTrees = newSprouts;
        }

        return subTrees;

    }

    _buildIndexTree() {
        let tree = {};

        for (let i = 0; i < this.data.length; i++) {
            const terms = this.data[i].text.split(' ');
            for (let j = 0; j < terms.length; j++) {
                let word = terms[j],
                    branch = [tree];
                this._buildBranch(word, branch, i);
            }
        }
        this.tree = tree;
    }

    init() {
        this._buildIndexTree();
    }
}

export default IndexTree2;

