import { ref, onMounted } from "vue";
export default function useCrypto() {
    const criptomonedas = ref([]);
    const cotizacion = ref({});
    const error = ref('');
    const cargando = ref(false);
    const monedas = ref([
        { codigo: 'USD', texto: 'Dolar de Estados Unidos'},
        { codigo: 'EUR', texto: 'Euro'},
        { codigo: 'GBP', texto: 'Libra Esterlina'},
        { codigo: 'ARS', texto: 'Peso Argentino'},
        { codigo: 'MXN', texto: 'Peso Mexicano'},
      ])
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
    return {
        monedas,
        criptomonedas,
        cotizacion,
        error, 
        cargando
    }
}