import Form from './form';
import './style.css';

new Form(); // eslint-disable-line no-new

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('worker.js');
}
