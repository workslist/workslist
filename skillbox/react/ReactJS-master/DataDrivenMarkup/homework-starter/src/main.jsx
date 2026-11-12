import ReactDOM from 'react-dom/client';

import { products } from './products';
import { GoodsList } from './GoodsList';

import './style/normalize.css';
import './style/main.css';

const reactRoot = ReactDOM.createRoot(document.getElementById('root'));

// TODO: Реализовать компонент ProductList
// reactRoot.render(<ProductList products={products} />);

reactRoot.render(<GoodsList products={products} />);

