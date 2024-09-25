import '@testing-library/jest-dom';
import Modal from 'react-modal';

// Ensure that the #root element exists in the DOM for tests
const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

// Set the app element for react-modal to #root
Modal.setAppElement('#root');
 
