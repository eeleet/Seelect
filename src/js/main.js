import Seelect from './seelect';
import Utils from './utils'

class App {
    constructor() {
        document.addEventListener("DOMContentLoaded", this.init());
    }


    init() {
        console.log('Seelect demo app start');

        this.utils = Utils;

        VK.init({apiId: 6057159});

        this.showLogin();

        document.querySelector('#login').addEventListener('click', (evt) => {

            VK.Auth.login(() => {
                this.afterLogin();
            })
        })
    }

    showLogin() {
        document.querySelector('#login').style.display = 'block';
    }

    afterLogin() {
        document.querySelector('#login').style.display = 'none';
        document.querySelector('#seelects').style.display = 'block';

        this.utils.iterateNoteList(document.querySelectorAll('.seelect'), (el, i) => {
            const config = {element: el, uniqueKey: i, debug: true};

            if(el.id == 'withVKSearch') { // set vk search for specific seelect
                config.onNotFound = this.fetchData;
            }

            new Seelect(config);
        });
    }

    fetchData(seelect, ts) {
        seelect.dataLockToken = ts;

        setTimeout(() => { //cleaning lock token
            if(seelect.dataLockToken === ts) {
                console.log(`Oops! Data fetching timeout for token ${seelect.dataLockToken}`);
                delete seelect.dataLockToken;
            }
        }, 30000);

        VK.api("friends.search", {"q": seelect.inputValue}, (data) => {
            let parsedData = [];
            if(data.response) {
                for(let i = 1; i < data.response.length; i++) {
                    const vkUserSearchData = data.response[i];
                    parsedData.push({
                        value: vkUserSearchData.uid,
                        label: `${vkUserSearchData.first_name} ${vkUserSearchData.last_name}`,
                        text: `${vkUserSearchData.first_name} ${vkUserSearchData.last_name}`,
                    })
                }
            }

            seelect.setData(parsedData, ts);
        });
    }
}

export default new App()