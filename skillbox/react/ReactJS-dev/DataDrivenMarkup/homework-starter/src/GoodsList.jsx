// Стили карточки товаров

import {GoodsCard} from "./GoodsCard";

export const GoodsList = ({products}) => {
    return (
        <ul className="goods list-reset">
            {products.map((item) => (
                <li className="item goods__item" key={item.id}>
                    <GoodsCard 
                        id={item.id}
                        title={item.title}
                        price={item.price}
                        discount={item.discount}
                        imageUrl={item.imageUrl}
                    />                    
                </li>
            ))}
        </ul>
    );
}