// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }

})

const electron = require('electron')

process.once('loaded', () => {
    const electronPath = require('electron').remote.app.getPath('exe');

    const Nightmare = require('nightmare')
    const nightmare = Nightmare({
        show: true,
        electronPath: electronPath
    })

    window.nightmare = nightmare
    window.electronPath = electronPath

    // nightmare
    //     .goto('https://duckduckgo.com')
    //     .type('#search_form_input_homepage', 'github nightmare')
    //     .click('#search_button_homepage')
    //     .wait('#r1-0 a.result__a')
    //     .evaluate(() => document.querySelector('#r1-0 a.result__a').href)
    //     .end()
    //     .then(console.log)
    //     .catch(error => {
    //         console.error('Search failed:', error)
    //     })

});
