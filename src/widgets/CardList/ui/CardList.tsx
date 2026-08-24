import { memo, useCallback } from 'react';
import { Card } from '../../../entities/product';
import { PageHeader } from '../../../shared/ui/PageHeader';
import s from './CardList.module.css';
import { useAppSelector } from '@shared/store/utils';
import { cartSelectors, cartActions } from '@entities/cart';
import { useDispatch } from 'react-redux';

type CardListProps = {
	title: string;
	products: Product[];
};

export const CardList = memo(({ title, products }: CardListProps) => {
	const dispatch = useDispatch();
	const cartProducts = useAppSelector(cartSelectors.getCartProducts);

	const addToCart = useCallback(
		(productId: string) => {
			const product = products.find((p) => p.id === productId);
			if (product) {
				dispatch(cartActions.addCartProduct({ ...product, count: 1 }));
			}
		},
		[dispatch, products]
	);

	if (!products.length) {
		return <PageHeader title='Товар не найден' />;
	}

	return (
		<div className={s['card-list']}>
			<div className={s['card-list__header']}>
				<h2 className={s['card-list__title']}>{title}</h2>
			</div>
			<div className={s['card-list__items']}>
				{products.map((product) => (
					<Card
						key={product.id}
						product={product}
						isProductInCart={cartProducts.some((p) => p.id === product.id)}
						onAddToCart={addToCart}
					/>
				))}
			</div>
		</div>
	);
});

CardList.displayName = 'CardList';
