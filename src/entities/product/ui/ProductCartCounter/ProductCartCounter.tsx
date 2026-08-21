import s from './ProductCartCounter.module.css';
import classNames from 'classnames';
import { useCount } from '../../hooks/useCount';
import { useAddToCart } from '@shared/hooks/useAddToCart';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';

type ProductCartCounterProps = {
	product: Product;
};
export const ProductCartCounter = ({ product }: ProductCartCounterProps) => {
	const { count, handleCount, handleCountMinus, handleCountPlus } = useCount();
	const { addProductToCart } = useAddToCart();

	return (
		<div className={classNames('product__btn-wrap')}>
			<div className={s['button-count']}>
				<Button variant='counter-minus' onClick={handleCountMinus}>
					-
				</Button>
				<Input
					type='number'
					variant='counter'
					className={s['button-count__num']}
					value={count}
					onChange={handleCount}
				/>
				<Button variant='counter-plus' onClick={handleCountPlus}>
					+
				</Button>
			</div>
			<Button
				onClick={() => addProductToCart({ ...product, count })}
				variant='primary'>
				В корзину
			</Button>
		</div>
	);
};
