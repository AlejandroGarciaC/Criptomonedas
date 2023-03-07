const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

//Crear un promise
const obtenerCriptomonedas = criptomonedas => new Promise (resolve => {
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change',leerValor);

});

async function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(resultado => obtenerCriptomonedas(resultado.Data))
    //     .then(criptomonedas => selectCriptomonedas(criptomonedas))

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);

    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    })
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e){
    e.preventDefault();

    //Validar
    const {moneda, criptomoneda} = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return
    }

    //Consultar la API con los resultados
    consultarAPI();
}

function mostrarAlerta(mensaje){
    const existe = document.querySelector('.error');
    if (!existe) {
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
    
}

function consultarAPI(){

    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    mostrarSpinner();

        setTimeout(() => {
            fetch(url)
            .then(respuesta => respuesta.json())
            .then(cotizacion => {
                mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]);
            })
        }, 3000);
        

        // try {
        //     const respuesta = await fetch(url);
        //     const cotizacion = await respuesta.json();
        //     mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda])
        // } catch (error) {
        //     console.log(error);
        // }
    
    
}

function mostrarCotizacion(cotizacion){
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    limpiarHTML();
    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML =`El precio más alto del día: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML =`El precio más bajo del día: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML =`Variacion Últimas 24 Horas : <span>${CHANGEPCT24HOUR}</span>%`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML =`Última Actualización: <span>${LASTUPDATE}</span>%`;

    
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
}

function limpiarHTML(){
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('DIV');
    spinner.classList.add('loader');

    spinner.innerHTML = `
        
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        
    `

    resultado.appendChild(spinner);
}