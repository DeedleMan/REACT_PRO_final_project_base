import classNames from 'classnames';
import s from './Price.module.css';

export type PriceVariant = {
	price: number;
	discountPrice?: number;
	size?: 'big' | 'small';
	align?: 'left' | 'right';
};

export const Price = ({
	price,
	discountPrice,
	size = 'small',
	align = 'left',
}: PriceVariant) => {
	const showDiscount = discountPrice !== undefined && discountPrice < price;

	return (
		<div className={classNames(s['price-wrap'], s[`price-${size}`])}>
			{showDiscount && (
				<span className={classNames(s['price_old'], s[`price_${align}`])}>
					{`${price}₽`}
				</span>
			)}
			<span className={classNames(s['price_discount'], s['price'])}>
				{`${showDiscount ? price - discountPrice : price}₽`}
			</span>
		</div>
	);
};
