import debounce from 'lodash.debounce'
import fetchCountries from './fetchCountries.js'
import listMenu from '../templates/list.hbs'
import { alert, defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js'
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js'
defaultModules.set(PNotifyMobile, {})
const inputCountry = document.querySelector('input#country')
const resultArea = document.querySelector(".result")

function handleCountriesData() {
    fetchCountries(inputCountry.value)
    .then(response => {
        if (response.ok)
            return response.json()
        throw new Error("Error fetching data.")
    })
        .then(data => {
            const len = data.length
            if (len > 10) {
                alert({
                    text: `Знайдено дуже багато країн. 
                    Будь ласка, зробіть Ваш запит більш специфічним.`
                })
                resultArea.innerHTML = ''
            } else if (len > 1) {
                alert({
                    text: `Знайдено ${len} країн(и). 
                    Будь ласка, конкретизуйте Ваш запит.`
                })
                const countries = {items: data.map(item => item.name)}
                resultArea.innerHTML = listMenu(countries)
            } else {
                alert({
                    text: `Ваш запит успішно виконаний.`
                })
                const lang = {items: data[0].languages.map(item => item.name)}
                resultArea.innerHTML = 
                `<h1>${data[0].name}</h1>
                <div class="container">
                <ul class="list-main">
                    <li class="item-main"><b>Capital:</b> ${data[0].capital}</li>
                    <li class="item-main"><b>Population:</b> ${data[0].population}</li>
                    <li class="item-main"><b>Languages:</b>`
                        + listMenu(lang) +
                    `</li>
                </ul>
                <img class="flag" src="${data[0].flag}" />
                </div>`
            }
        })
    .catch(err => {
        alert({
            text: `Запит порожній або некоректний. 
            Будь ласка, введіть правильну назву країни англійською мовою.`
        })
        resultArea.innerHTML = ''
    })
}

inputCountry.addEventListener('input', debounce(handleCountriesData, 500))