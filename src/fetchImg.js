import axios from 'axios';

export default class ImgFetching {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.hits = 0;
  };

  async fetchImg() {
    const BASEURL = 'https://pixabay.com/api/';
    const KEY = '33080528-fff048daf9c61a3271b838112';
    const PARAMETERS = `?key=${KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
    return await axios.get(`${BASEURL}${PARAMETERS}`);
  };

  plusPage() {
    this.page += 1;
  };

  resetPage() {
    this.page = 1;
  };
;
  get query() {
    return this.searchQuery;
  };

  set query(newQuery) {
    return this.searchQuery = newQuery;
  };
}