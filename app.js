import currCodeAndCountry from './currenciesCodeCountry.js'


let currenciesApiData = []; 
let mainCurrenciesApiData = [];
let restCurrenciesApiData = [];
let mainCountriesCode = ['USD','CHF','UAH','GBP','EUR'];
let polandData = {currency: 'polski złoty', code: 'PLN', mid: 1, country: 'poland', src: 'https://countryflagsapi.com/png/poland'}
let currFullData;
const LOCAL_STORAGE_DATA = 'countryData'
const LOCAL_STORAGE_HOUR = 'hourData'
const d = new Date();
let hour = d.getHours();
const bottomRatesContainer = document.querySelector('.bottom_rates');
const countryChoose = document.querySelectorAll('.country_choose');
const countryList = document.querySelectorAll('.countryList')
const countryListMain = document.querySelectorAll('.countryList_main');
const countryListRest = document.querySelectorAll('.countryList_rest');
const inputRateSearch = document.querySelectorAll('.inputRateSearch');
let lastIndex = null;

const dataFirstIndex = {
    liValue: 'USD',
    index: 0,
    inputValue: 0
}

const dataSecondIndex = {
    liValue: 'PLN',
    index: 1,
    inputValue: 5000
}

const liArrayActiveFirst = {
    main: [],
    rest: []
}

const liArrayActiveSecond = {
    main: [],
    rest: []
}

window.addEventListener('DOMContentLoaded', init());

function init() {
    isLocalStorage();
}

function renderStuff() {
    filterMainCurrency()
    renderBottomRates()
    renderCountryList()

    timerGetRates()
    initListeners()
}

function isLocalStorage() {
    const storage = localStorage.getItem(LOCAL_STORAGE_DATA);
    const timeStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_HOUR))

    // is local storage
    if(storage && timeStorage == hour) {
        currenciesApiData = JSON.parse(storage)
        currFullData = currenciesApiData
        renderStuff();
        fullFillArrays()

    } else {
        getData()
        fullFillArrays()
    }
}

function getData() {
    fetch(
        `http://api.nbp.pl/api/exchangerates/tables/a/`
        )
    .then(resp => resp.json())
    .then(data => {
        currenciesApiData = data[0].rates
            currenciesApiData.push(polandData)
            connectData()

            localStorage.setItem(LOCAL_STORAGE_DATA, JSON.stringify(currFullData))
            localStorage.setItem(LOCAL_STORAGE_HOUR, JSON.stringify(hour))

            renderStuff()
    });
}

function connectData() {
    currFullData = currenciesApiData

    currFullData.forEach( el =>{
        currCodeAndCountry.forEach((elSM, index) => {
            if(el.code == elSM.code) {
                currFullData[index].country = currCodeAndCountry[index].country.toLowerCase()
                currFullData[index].src = `https://countryflagsapi.com/png/${currFullData[index].country}`
            }
        })
    })
}

function filterMainCurrency() {
    currenciesApiData.forEach(el => {
        if(mainCountriesCode.includes(el.code)) {
            mainCurrenciesApiData.push(el)
        }
    })

    currenciesApiData.forEach(el => {
        if(!mainCountriesCode.includes(el.code)) {
            restCurrenciesApiData.push(el)
        }
    })
}

function fullFillArrays() {
    liArrayActiveFirst.main = new Array(mainCurrenciesApiData.length).fill(0)
    liArrayActiveSecond.main = new Array(mainCurrenciesApiData.length).fill(0)
    liArrayActiveFirst.rest = new Array(restCurrenciesApiData.length).fill(0)
    liArrayActiveSecond.rest = new Array(restCurrenciesApiData.length).fill(0)
}

function initListeners() {
    countryChooseBtn()
    countryInputFilter()
}

function clearCurrencyInput() {
    inputRateSearch.forEach(el => el.value = '');
    renderCountryList()
}


function countryChooseBtn()
{
        document.addEventListener('click', e => {

            let ul = e.target.closest('ul')  
            let li = e.target.closest('li')          
            let divTarget = e.target.closest('.country_choose')

            if(e.target.classList.contains('inputRateSearch')) return
            clearCurrencyInput();

            if(divTarget) {
                let dataSetDivTarget = divTarget.dataset.index
                countryChooseClickIndex(dataSetDivTarget)
            }

            if(li) {
                cuntryChooseClickLi(li)
                let whichArr = ul.classList.contains('countryList_main') ? 'main' : 'rest'  // która lista
                let whichInput = lastIndex // który input
                let liIndex = li.dataset.index
                //teraz zrobimy funkcje na umieszczenie tego gówna w tamtych tablicach.
                setActiveToArray(whichInput, whichArr, liIndex)
            }

            
            if(divTarget) {
                let indexTarget = divTarget.dataset.index

                if(!countryList[indexTarget].classList.contains('isVisible')) {

                    countryList.forEach(el => {
                        el.classList.remove('isVisible')
                    })
                    countryList[indexTarget].classList.add('isVisible')
                } else {
                    countryList.forEach(el => {
                        el.classList.remove('isVisible')
                    })
                }

            } else { 
                countryList.forEach(el => {
                    el.classList.remove('isVisible')
                })
            }   
        })
}

function setActiveToArray(upDown, mainRest, liIndex) {

    // console.log(upDown);
    let activeArrays = [liArrayActiveFirst,liArrayActiveSecond];
    // let mainOrRest = mainRest = 'main' ? 'main' : 'rest'

    // console.log(activeArrays[upDown].mainOrRest)
    console.log(liIndex);
    if(upDown == 0) {
        if(mainRest == 'main') {
            activeArrays[upDown].main[liIndex] = 1
            console.log(activeArrays[upDown].main[liIndex]);
        }

        if(mainRest !== 'main') {
            console.log(activeArrays[upDown].rest[liIndex]);

        }
    } 
    if(upDown == 1) {
        if(mainRest == 'main') {
            console.log(activeArrays[upDown].main[liIndex]);

        }

        if(mainRest !== 'main') {
            console.log(activeArrays[upDown].rest[liIndex]);

        }
    }
    // console.log(elo);
}




function cuntryChooseClickLi(li) {
    let curValue = li.querySelector('.countryList__countryName--shortName').innerHTML

    if(lastIndex == 0) {
        dataFirstIndex.liValue = curValue;
    } else {
        dataSecondIndex.liValue = curValue;
    }
    console.log(dataFirstIndex, dataSecondIndex);
    
    if(dataFirstIndex.liValue !== dataSecondIndex.liValue) {
        renderInputCountry(lastIndex)
    } else {
        switchValues()
    }
}

function renderInputCountry(indexNumb) {
    // let dataIndexAll = [dataFirstIndex, dataSecondIndex]

    // dataIndexAll.forEach( (el, index) => {
    //     let renderData = `
    //         <div class="country_choose--flag">
    //             <img class="inputIMG topIMG" src="https://countryflagsapi.com/png/${el.liValue.toLocaleLowerCase()}" alt="${el.liValue} flag">
    //             <h3 class="top">${el.liValue.toUpperCase()}</h3>
    //         </div>
    //         <i class="fa-solid fa-chevron-down"></i>

    //     `

    //     countryChoose[index].innerHTML = renderData;
    // })

    let dataIndexAll = [dataFirstIndex, dataSecondIndex]
    let code = dataIndexAll[indexNumb].liValue
    let countryData = currFullData.filter( el => {
        return el.code === code
    })
    let country = countryData[0]

    countryChoose[indexNumb].innerHTML = `

             <div class="country_choose--flag">
                 <img class="inputIMG topIMG" src="https://countryflagsapi.com/png/${country.country}" alt="${country.country} flag">
                 <h3 class="top">${country.code.toUpperCase()}</h3>
            </div>
           <i class="fa-solid fa-chevron-down"></i>
    `
}

function switchValues() {
    console.log('swichValues');
}

function countryChooseClickIndex(index) {
    // index == 0 ? dataFirstIndex.index = index : dataSecondIndex.index = index
    lastIndex = index
}

function countryInputFilter() {
    inputRateSearch.forEach( input => {
        input.addEventListener('keyup', e =>{
            let letter = input.value;

            let renderedMainArray = mainCurrenciesApiData.filter( e => {
                return e.currency.includes(letter)
            })

            let renderedRestArray = restCurrenciesApiData.filter( e => {
                return e.currency.includes(letter)
            })


            renderMainCountryList(renderedMainArray)
            renderRestCountryList(renderedRestArray)
        })
    })
}

function renderCountryList() {
    renderMainCountryList();
    renderRestCountryList();
}

function renderMainCountryList(defaultArr = mainCurrenciesApiData) {
    countryListMain.forEach( (el, index)  => {
        countryListMain[index].innerHTML = ' '

        defaultArr.forEach( (liElement, indexS) => {
            let liEl= `            
            <li data-index="${indexS}">
                <img class="countryList__subtitles_img" src="${liElement.src}" alt="${liElement.country} flag">

                <div class="countryList__countryName">
                    <span class="countryList__countryName--shortName">${liElement.code}</span>

                    <span class="countryList__countryName--rateName">${liElement.currency}</span>
                </div>
            </li> 
            `        

            countryListMain[index].innerHTML += liEl
        })
    })
}

function renderRestCountryList(defaultArr = restCurrenciesApiData) {
    countryListRest.forEach( (el, index)  => {
        countryListRest[index].innerHTML = ' '

        defaultArr.forEach( (liElement, indexS) => {
            let liEl= `            
            <li data-index="${indexS}">
                <img class="countryList__subtitles_img" src="${liElement.src}" alt="${liElement.country} flag">

                <div class="countryList__countryName">
                    <span class="countryList__countryName--shortName">${liElement.code}</span>

                    <span class="countryList__countryName--rateName">${liElement.currency}</span>
                </div>
            </li> 
            `
            countryListRest[index].innerHTML += liEl
        })
    })
}

function renderBottomRates() {
    mainCurrenciesApiData.forEach(el => {
        let liEl = `
        <div class="single__rates">
        <img src="https://countryflagsapi.com/png/${el.country}" alt="${el.country} flag">
        <div class="single__rates--country">
            <h3>${el.code}</h3>
            <p>${el.mid}</p>
        </div>
    </div>
        `
        bottomRatesContainer.innerHTML += liEl;
    })
}

function timerGetRates() {
    setInterval(() => {
        window.location.reload()
    }, 3600000);
}


// <li>
// <img class="countryList__subtitles_img" src="https://countryflagsapi.com/png/usa" alt="Europe flag">

// <div class="countryList__countryName">
//     <span class="countryList__countryName--shortName">USD</span>

//     <span class="countryList__countryName--rateName">Amerykański Dolar</span>
// </div>
// </li>