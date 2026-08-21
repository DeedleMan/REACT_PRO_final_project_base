import { useCount } from '@entities/cart/hooks/useCount';
import s from './CartCounter.module.css';
import classNames from 'classnames';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';

type TCartCounter = {
	productId: string;
};
export const CartCounter = ({ productId }: TCartCounter) => {
	const { count, stock, handleSetCount, handleIncrement, handleDecrement } =
		useCount(productId);

	return (
		<>
			<div className={classNames(s['button-count'])}>
				<Button onClick={handleDecrement} variant='counter-minus'>
					-
				</Button>
				<Input
					onChange={handleSetCount}
					type='number'
					variant='counter'
					className={classNames(s['button-count__num'])}
					value={count}
				/>
				<Button
					onClick={handleIncrement}
					variant='counter-plus'
					disabled={count >= stock}>
					+
				</Button>
			</div>
		</>
	);
};
