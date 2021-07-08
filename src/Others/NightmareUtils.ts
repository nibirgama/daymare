// @ts-nocheck
const { nightmare, rootPath } = window

export class NightmareUtils {
    static loginUser = (username: string, password: string, onDone: () => void) => {

        console.log("==========================");
        console.log(rootPath)
        console.log("==========================");

        console.log("===========================WINDOW");
        console.log(window)
        console.log("==========================");

        console.log("==========================Nightmare");
        console.log(nightmare);
        console.log("==========================");
        nightmare
            .goto("https://www.linkedin.com/login")
            // .wait(`body`)
            // .type(`input[name="session_key"]`, username)
            // .type(`input[name="session_password"]`, password)
            // .click(`button[class='btn__primary--large from__button--floating']`)
            // .wait(`body`)
            // .wait(20000)
            .then(() => {
                // console.log(success);

                onDone()
            })
            .catch((e) => {
                console.log(e)
            })

    }

    static searchPeople = (query: string, onDone: () => void) => {
        console.log("Search")
        nightmare
            .goto(`https://www.linkedin.com/search/results/people/?keywords=${query}`)
            .wait('body')
            .evaluate(() => {
                let lis = document.getElementsByClassName('reusable-search__result-container')
                let arr = []
                for (var i = 0; i < lis.length; i++) {
                    const obj = {
                        img: lis[i]?.getElementsByTagName('img')[0]?.src ?? null,
                        name: lis[i]?.getElementsByClassName('entity-result__title-text  t-16')[0]?.getElementsByTagName('span')[0]?.children[0]?.innerText ?? null,
                        connection: lis[i]?.getElementsByClassName('entity-result__title-text  t-16')[0]?.getElementsByTagName('span')[3]?.innerText?.replace("• ", "")?.replace("\n", "") ?? null,
                        designation: lis[i]?.getElementsByClassName('entity-result__primary-subtitle t-14 t-black')[0]?.innerText ?? null,
                        country: lis[i]?.getElementsByClassName('entity-result__secondary-subtitle t-14')[0]?.innerText ?? null,
                    }
                    arr.push(obj)
                }
                return arr;
            })
            .then((jsonArr) => {
                console.log(JSON.stringify(jsonArr))
                fs.writeFileSync('leads.txt', JSON.stringify(jsonArr))
                onDone()
            })
            .catch((e) => {
                console.log(e)
            })

    }

    static showMessages = (url: string, onDone: () => void) => {
        console.log("showMessages")
        nightmare
            .goto(url)
            .wait(`a[class="message-anywhere-button pvs-profile-actions__action artdeco-button "]`)
            .click(`a[class="message-anywhere-button pvs-profile-actions__action artdeco-button "]`)
            // .wait('ul[class="msg-s-message-list-content list-style-none full-width"]')
            .wait(5000)
            .evaluate(() => {
                let lis = document.getElementsByClassName('msg-s-message-list-content list-style-none full-width')[0]?.getElementsByTagName('li')
                let arr = []
                let lastNameFoundIndex = -1
                let lastTimeFoundIndex = -1
                for (var i = 0; i < lis?.length; i++) {
                    let obj = {
                        time: lis[i]?.getElementsByTagName('time')[0]?.innerText ?? null,
                        message: lis[i]?.getElementsByClassName('msg-s-event-listitem__body t-14 t-black--light t-normal')[0]?.innerText ?? null,
                        name: lis[i]?.getElementsByClassName('msg-s-message-group__name t-14 t-black t-bold hoverable-link-text')[0]?.innerText ?? null
                    }

                    if (obj.name) {
                        lastNameFoundIndex = i
                    } else {
                        if (lastNameFoundIndex > -1) {
                            obj.name = arr[lastNameFoundIndex].name
                        }
                    }


                    if (obj.time) {
                        lastTimeFoundIndex = i
                    } else {
                        if (lastTimeFoundIndex > -1) {
                            obj.time = arr[lastNameFoundIndex].time
                        }
                    }
                    arr.push(obj)
                }
                return arr;
            })
            .then((jsonArr) => {
                console.log(JSON.stringify(jsonArr))
                fs.writeFileSync('messages.txt', JSON.stringify(jsonArr))
                onDone()
            })
            .catch((e) => {
                console.log(e)
            })

    }

    static sendMessage = (url: string, message: string, onDone: () => void) => {
        console.log("sendMessage")
        nightmare
            .goto(url)
            .wait(`a[class="message-anywhere-button pvs-profile-actions__action artdeco-button "]`)
            .click(`a[class="message-anywhere-button pvs-profile-actions__action artdeco-button "]`)
            .wait('ul[class="msg-s-message-list-content list-style-none full-width"]')
            .type(`div[class="msg-form__msg-content-container   msg-form__message-texteditor relative flex-grow-1 display-flex"]`, message)
            .wait(5000)
            .click(`button[class="msg-form__send-button artdeco-button artdeco-button--1"]`)
            .then(() => {
                onDone()
            })
            .catch((e) => {
                console.log(e)
            })

    }

    static showConnectedList = (onDone: () => void) => {
        nightmare
            .goto("https://www.linkedin.com/mynetwork/invite-connect/connections/")
            .wait('body')
            .evaluate(() => {
                let lis = document.getElementsByClassName('mn-connection-card artdeco-list ember-view')
                let arr = []
                for (var i = 0; i < lis.length; i++) {
                    const obj = {
                        img: lis[0].getElementsByTagName('img')[0].src ?? null,
                        name: lis[0].getElementsByTagName('img')[0].title ?? null,
                        designation: lis[0].getElementsByClassName('mn-connection-card__occupation t-14 t-black--light t-normal')[0].innerText ?? null,
                        time: lis[0].getElementsByTagName('time')[0].innerText ?? null
                    }
                    arr.push(obj)
                }

            })
            .then((arr) => {
                console.log(JSON.stringify(jsonArr))
                fs.writeFileSync('connections.txt', JSON.stringify(jsonArr))
                onDone()
            })
            .catch((e) => {
                console.log(e)
            })
    }

    static sendConnectionRequest = (url: string, onDone: () => void) => {
        nightmare
            .goto(url)
            .wait('body')
            .click(`button[class="pvs-profile-actions__action artdeco-button artdeco-button--2 artdeco-button--primary ember-view"]`) // Connect
            .wait(`button[class="ml1 artdeco-button artdeco-button--3 artdeco-button--primary ember-view"]`)
            .click(`button[class="ml1 artdeco-button artdeco-button--3 artdeco-button--primary ember-view"]`) // Send
            .wait(`button[class="pvs-profile-actions__action artdeco-button artdeco-button--2 artdeco-button--primary artdeco-button--disabled ember-view"]`)
            .then(() => {
                console.log("Connect req sent")
                onDone()
            })
            .catch((e) => {
                console.log(e)
            })
    }

    static searchInSalesNavigator = (keyword: string, onDone: () => void) => {
        nightmare
            .goto(`https://www.linkedin.com/sales/search/people?doFetchHeroCard=true&keywords=${keyword}`)
            .wait('body')
            .evaluate(() => {
                let lis = document.getElementsByClassName('pv5 ph2 search-results__result-item')
                for (var i = 0; i < lis.length; i++) {
                    const obj = {
                        img: lis[0].getElementsByTagName('img')[0].src ?? null,
                        name: lis[0].getElementsByClassName('result-lockup__name')[0].innerText ?? null,
                        link: lis[0].getElementsByTagName('a')[1].href ?? null,
                        connection: lis[0].getElementsByClassName('label-16dp block')[0].innerText ?? null,
                        designation: lis[0].getElementsByClassName('result-lockup__highlight-keyword')[0].innerText ?? null,
                    }
                }
            })
            .then(() => {

            })
    }

    static followUser = (url: string, onDone: () => void) => {
        nightmare
            .goto(url)
            .wait('body')
            .then(() => {

            })
    }
}