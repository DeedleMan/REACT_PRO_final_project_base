import classNames from 'classnames';
import s from './Card.module.css';
import { Price } from '../Price/Price';
import { Link } from 'react-router-dom';
import { LikeButton } from '@features/ui/LikeButton';
import { useAppSelector } from '@shared/store/utils';
import { cartSelectors, CartCounter } from '@entities/cart';
import { useAddToCart } from '@shared/hooks/useAddToCart';
import { Button } from '@shared/ui/Button';
import { Badge } from '@shared/ui/Badge';

type CardProps = {
	product: Product;
};
export const Card = ({ product }: CardProps) => {
	const { discount, price, name, tags, id, images, likes } = product;
	const cartProducts = useAppSelector(cartSelectors.getCartProducts);
	const isProductInCart = cartProducts.some((p) => p.id === id);
	const { addProductToCart } = useAddToCart();

	const isLiked = likes.some((l) => l.userId === 'current-user-id');

	return (
		<article className={s['card']}>
			<div
				className={classNames(
					s['card__sticky'],
					s['card__sticky_type_top-left']
				)}>
				<Badge variant='discount'>{discount}</Badge>
				{tags.length > 0 &&
					tags.map((t) => (
						<Badge key={t} variant='new'>
							{t}
						</Badge>
					))}
			</div>
			<div
				className={classNames(
					s['card__sticky'],
					s['card__sticky_type_top-right']
				)}>
				<LikeButton isActive={isLiked} onClick={() => false} />
			</div>
			<Link className={s['card__link']} to={`/products/${id}`}>
				<img
					src={images}
					alt={name}
					className={s['card__image']}
					loading='lazy'
				/>
				<div className={s['card__desc']}>
					<Price price={price} discountPrice={discount} />
					<h3 className={s['card__name']}>{name}</h3>
				</div>
			</Link>
			{isProductInCart ? (
				<CartCounter productId={id} />
			) : (
				<Button
					onClick={() => addProductToCart({ ...product, count: 1 })}
					disabled={isProductInCart}
					variant='cart'>
					В корзину
				</Button>
			)}
		</article>
	);
};
