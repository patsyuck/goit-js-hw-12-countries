import debounce from 'lodash.debounce'
import fetchCountries from './fetchCountries.js'
import listMenu from '../templates/list.hbs'
import { alert, defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js'
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js'
defaultModules.set(PNotifyMobile, {})
const inputCountry = document.querySelector('input#country')
const resultArea = document.querySelector(".result")

function alertNoName() {
    alert({
        text: `Знайдено дуже багато країн. 
        Будь ласка, зробіть Ваш запит більш специфічним.`
    })
}

function alertBezimenniy(len) {
    alert({
        text: `Знайдено ${len} країн(и). 
        Будь ласка, конкретизуйте Ваш запит.`
    })
}

function alertBezNazvaniya() {
    alert({
        text: `Ваш запит успішно виконаний.`
    })
}

function alertDaYaPrikaluyus() {
    alert({
        text: `Запит порожній або некоректний. 
        Будь ласка, введіть правильну назву країни англійською мовою.`
    })
}

function branch11plus() {
    alertNoName()
    resultArea.innerHTML = ''
}

function branch2plus(data, len) {
    alertBezimenniy(len)
    const countries = {items: data.map(item => item.name)}
    resultArea.innerHTML = listMenu(countries)
}

function branch1(data) {
    alertBezNazvaniya()
    const lang = {items: data[0].languages.map(item => item.name)}
    resultArea.innerHTML = `<h1>${data[0].name}</h1>
    <div class="container">
    <ul class="list-main">
        <li class="item-main"><b>Capital:</b> ${data[0].capital}</li>
        <li class="item-main"><b>Population:</b> ${data[0].population}</li>
        <li class="item-main"><b>Languages:</b>`+ listMenu(lang) +`</li>
    </ul>
    <img class="flag" src="${data[0].flag}" /></div>`
}

function branch0() {
    alertDaYaPrikaluyus()
    resultArea.innerHTML = ''
}

function branches(data) {
    const len = data.length
    if (len > 10) {
        branch11plus()
    } else if (len > 1) {
        branch2plus(data, len)
    } else {
        branch1(data)
    }
}

function handleCountriesData() {
    fetchCountries(inputCountry.value)
    .then(response => {
        if (response.ok)
            return response.json()
        throw new Error("Error fetching data.")
    })
        .then(data => {branches(data)})
    .catch(err => {branch0()})
}

inputCountry.addEventListener('input', debounce(handleCountriesData, 500))