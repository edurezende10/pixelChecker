
function tikTokValidation(eventParams, eventName) {
    function objetoVazio(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) return true;
        }
        return false;
    }
    let typeCurrency = ['AED', 'ARS', 'AUD', 'BDT', 'BHD', 'BIF', 'BOB', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CZK', 'DKK', 'DZD', 'EGP', 'EUR', 'GBP', 'GTQ', 'HKD', 'HNL', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KES', 'KHR', 'KRW', 'KWD', 'KZT', 'MAD', 'MOP', 'MXN', 'MYR', 'NGN', 'NIO', 'NOK', 'NZD', 'OMR', 'PEN', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'UAH', 'USD', 'VES', 'VND', 'ZAR']

    let erros = {}

    let regras = {
        contents() {

            if (eventParams.hasOwnProperty('contents') === true) {
                eventParams.contents.forEach((param,index) => {
                   
                   if (param.hasOwnProperty('content_id') === false) {
                        let productPosition = `contents-content_id${++index}`
                        erros[productPosition] =`Produto ${ index} não possui content_id`;
                    }else{
                        content_id.push(param.content_id)
                    } 
                });


            }
        },
        currency() {
            regrasParametros.currency(eventParams)
            if (eventParams.hasOwnProperty('currency') === false && eventParams.hasOwnProperty('value') === true) {
                erros.currency = 'possui value e não possui currency';

            }

            if (eventParams.hasOwnProperty('currency') === true) {
                let selectCurrency = eventParams.currency;

                let typeCurrencyValid = typeCurrency.find((item) => item === selectCurrency)
                if (!typeCurrencyValid) {
                    erros.typeCurrency = 'Tipo de moeda incorreta';
                }
            } 

        },
        content_id() {
            if (eventParams.hasOwnProperty('contents') === false&&eventParams.hasOwnProperty('content_id') === false) {
                erros.content_id = 'Não possui content_id';
            }
            if (eventParams.hasOwnProperty('content_id') === true) {
                content_id.push(eventParams.content_id)
            }
        },
        value() {
            if (eventParams.hasOwnProperty('value') === false) {
                if (eventParams.hasOwnProperty('currency') === true) {
                    erros.value = 'Possui currency e não possui value';
                }
            }
            if (eventParams.hasOwnProperty('value') === true && typeof eventParams.value !== 'number') {
                erros.value = 'não é do tipo number';
            }

        }


    }
    if (objetoVazio(eventParams)) {
        for (let prop in regras) {
            regras[prop](eventParams)
        }
    }
    
    console.log(erros)
    console.log(content_id)



}
module.exports = tikTokValidation;

