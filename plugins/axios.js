export default function ({$axios}) {
  //take the data field from all requests
  $axios.interceptors.response.use((response) => response.data);
}
