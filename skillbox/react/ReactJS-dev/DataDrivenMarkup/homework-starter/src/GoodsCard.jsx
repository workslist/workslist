// Карточка товара

// Обработка больших чисел
function priseView(price) {
    let number = price;
    return new Intl.NumberFormat('ru-RU').format(number);
}

// Вычесление и обработка скидки
function discountPrice(price, discount) {
    let one = null;

    if (discount) {
        one = price - (price * discount);
        
    return priseView(one);
    } else {
        return price;
    }
}

export const GoodsCard = ({title, price, discount, imageUrl}) => {

    let priceBefore = null;
    let symbol = null;
    let classDis = "wrap goods__wrap";

    if (discount) {
        priceBefore = price;
        symbol = '₽';
        classDis = "wrap goods__wrap goods__wrap-discount";
    }

    return ( 
        <div className="box goods__box"> 
            <img className="img goods__img" src={imageUrl} alt={title} />
            <div className="price goods__price">
                <div className={classDis}>
                    <span className="full goods__full">{discountPrice(price, discount)}</span>
                    <span className="full goods__full goods__full-symbol">₽</span>
                </div>
                <div className="wrap goods__wrap">
                    <span className="discount goods__discount">{priceBefore}</span>
                    <span className="full goods__discount goods__discount-symbol">{symbol}</span>
                </div>
            </div>
            <h2 className="title goods__title">{title}</h2>
        </div>
     );
}
