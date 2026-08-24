import s from './ProductCartCounter.module.css';
import classNames from 'classnames';
import { useCount } from '../../hooks/useCount';
import { useAddToCart } from '@shared/hooks/useAddToCart';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { Counter, CounterAction } from '@shared/ui/Counter';

type ProductCartCounterProps = {
	product: Product;
};
export const ProductCartCounter = ({ product }: ProductCartCounterProps) => {
	const { count, handleCount, handleCountMinus, handleCountPlus } = useCount();
	const { addProductToCart } = useAddToCart();

	return (
		<div className={classNames('product__btn-wrap')}>
			<Counter>
				<CounterAction variant='minus' onClick={handleCountMinus}>
					-
				</CounterAction>
				<Input
					type='number'
					variant='counter'
					className={s['button-count__num']}
					value={count}
					onChange={handleCount}
				/>
				<CounterAction variant='plus' onClick={handleCountPlus}>
					+
				</CounterAction>
			</Counter>
			<Button
				onClick={() => addProductToCart({ ...product, count })}
				variant='primary'>
				В корзину
			</Button>
		</div>
	);
};
