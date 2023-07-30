<script setup>
import { ref, reactive} from "vue";
import Alerta from "./components/Alerta.vue";
import Spinner from "./components/Spinner.vue";
import Cotizacion from "./components/Cotizacion.vue";
import useCrypto from "./composables/useCrypto";

const { monedas, criptomonedas, cotizacion, cargando, error } = useCrypto();

const cotizar = reactive({
  moneda: '',
  criptomoneda: ''
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
      <Cotizacion :cotizacion="cotizacion" v-if="cotizacion.IMAGEURL"/>
    </div>
  </div>  
</template>
<style scoped>

</style>
