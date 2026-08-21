import { ReactComponent as TrashIcon } from '../../../../../shared/assets/icons/trash.svg';
import { Link } from 'react-router-dom';
import s from '../../CartPage.module.css';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { cartActions, CartCounter } from '@entities/cart';
import { Button } from '../../../../../shared/ui/Button';
import { Price } from '../../../../../shared/ui/Price';

type CartItemProps = {
	product: CartProduct;
};
export const CartItem = ({ product }: CartItemProps) => {
	const dispatch = useDispatch();
	const { id, name, images, price, discount } = product;

	const handleDelete = () => {
		dispatch(cartActions.deleteCartProduct(id));
	};
	return (
		<div className={classNames(s['cart-item'])}>
			<div className={classNames(s['cart-item__desc'])}>
				<img
					src={images}
					alt={name}
					className={classNames(s['cart-item__image'])}
				/>

				<div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
					<div style={{ display: 'flex', gap: '20px', flexGrow: 1 }}>
						<Link
							className={classNames(s['cart-item__title'])}
							to={`/products/${id}`}>
							<h2>{name}</h2>
						</Link>

						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<CartCounter productId={id} />

							<div className={classNames(s['cart-item__price'])}>
								<Price
									price={price}
									discountPrice={discount}
									size='big'
									align='right'
								/>
							</div>
						</div>
						<Button variant='trash'>
							<TrashIcon onClick={handleDelete} />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
