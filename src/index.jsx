import 'preact/debug';
import { h, render } from 'preact';
import { Form } from './components/form.jsx';

render(<Form />, document.getElementById('form'));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('worker.js');
}
