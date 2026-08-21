import s from './CartPage.module.css';
import classNames from 'classnames';
import { useAppSelector } from '@shared/store/utils';
import { cartSelectors } from '@entities/cart';
import { CartList } from './CartList';
import { CartAmount } from './CartAmount';
import { PageHeader } from '@shared/ui/PageHeader';

export const CartPage = () => {
	const products = useAppSelector(cartSelectors.getCartProducts);

	if (!products.length) {
		return <PageHeader title='Товаров нет в корзине' />;
	}

	return (
		<div className={classNames(s['content'], s['container'])}>
			<div className={classNames(s['content-cart'])}>
				<div className={classNames(s['cart-title'])}>
					<span>{products.length}</span> в корзине
				</div>
				<CartList products={products} />
				<CartAmount />
			</div>
		</div>
	);
};
