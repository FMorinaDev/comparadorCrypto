<script setup>
import { ref, reactive, onMounted } from "vue";
import Alerta from "./components/Alerta.vue";
import Spinner from "./components/Spinner.vue";
const monedas = ref([
  { codigo: 'USD', texto: 'Dolar de Estados Unidos'},
  { codigo: 'EUR', texto: 'Euro'},
  { codigo: 'GBP', texto: 'Libra Esterlina'},
  { codigo: 'ARS', texto: 'Peso Argentino'},
  { codigo: 'MXN', texto: 'Peso Mexicano'},
])
const cargando = ref(false);
const criptomonedas = ref([]);
const cotizar = reactive({
  moneda: '',
  criptomoneda: ''
})
const cotizacion = ref({});
const error = ref('');
onMounted(()=>{
  try {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD';
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(({Data}) => {
      criptomonedas.value = Data;
    })
  } catch (error) {
    console.error('Error al obtener las criptomonedas:', error);
  }
})
const obtenerCotizacion = async() =>{
  try {
    cargando.value = true;
    const { criptomoneda, moneda} = cotizar;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    const respuesta = await fetch(url);
    const data = await respuesta.json();
    cotizacion.value = data.DISPLAY[criptomoneda][moneda];
  } catch (error) {
    console.error('Error al obtener la cotización:', error);
  }finally{
    cargando.value = false;
  }
}
const cotizarCripto = () =>{
  if (Object.values(cotizar).includes('')) {
    error.value = 'Todos los campos son obligatorios';
    setTimeout(() => {
      error.value = '';
    }, 1500);
    return;
  }
  obtenerCotizacion();
}
</script>

<template>
  <div class="contenedor">
    <h1 class="titulo">Cotizador de <span>Criptomonedas</span></h1>
    <div class="contenido">
      <Alerta v-if="error">{{error}}</Alerta>
      <form class="formulario">
        <div class="campo">
            <label for="moneda">Moneda:</label>
            <select  id="moneda" v-model="cotizar.moneda">
              <option value="">--Selecciona--</option>
              <option v-for="moneda in monedas" :key="moneda.codigo" :value="moneda.codigo">{{moneda.texto}}</option>
            </select>
        </div>
        <div class="campo">
            <label for="cripto">Criptomoneda:</label>
            <select  id="cripto" v-model="cotizar.criptomoneda">
              <option value="">--Selecciona--</option>
              <option v-for="{CoinInfo} in criptomonedas" :key="CoinInfo.Id" :value="CoinInfo.Name">{{CoinInfo.FullName}}</option>
            </select>
        </div>
        <input type="submit" value="Cotizar" @click.prevent="cotizarCripto">
      </form>
      <Spinner v-if="cargando"/>
      <div class="contenedor-resultado" v-if="cotizacion.IMAGEURL">
        <h2>Cotización</h2>
        <div class="resultado">
          <img :src="`https://cryptocompare.com${cotizacion.IMAGEURL}`" alt="imagen crypto">
          <div>
            <p>El precio es de: <span>{{cotizacion.PRICE}}</span></p>
            <p>Precio más alto del día: <span>{{cotizacion.HIGHDAY}}</span></p>
            <p>Precio más bajo del día: <span>{{cotizacion.LOWDAY}}</span></p>
            <p>Variacion ultimas 24HS: <span>{{cotizacion.CHANGEPCT24HOUR}}%</span></p>
            <p>Última actualización: <span>{{cotizacion.LASTUPDATE}}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>
<style scoped>

</style>
