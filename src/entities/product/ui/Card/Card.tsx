import { memo } from 'react';
import classNames from 'classnames';
import s from './Card.module.css';
import { Price } from '../Price/Price';
import { Link } from 'react-router-dom';
import { LikeButton } from '@features/ui/LikeButton';
import { CartCounter } from '@entities/cart';
import { useToggleLike } from '@shared/hooks/useToggleLike';
import { Button } from '@shared/ui/Button';
import { Badge } from '@shared/ui/Badge';
import { useAppSelector } from '@shared/store/utils';
import { userSelectors } from '@entities/user';

export type CardProps = {
	product: Product;
	isProductInCart: boolean;
	onAddToCart: (productId: string) => void;
};

export const Card = memo(
	({ product, isProductInCart, onAddToCart }: CardProps) => {
		const { discount, price, name, tags, id, images, likes } = product;
		const user = useAppSelector(userSelectors.getUser);
		const isLiked = likes.some((l) => l.userId === user?.id);
		const { toggleLike } = useToggleLike(id, isLiked);

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
					<LikeButton isActive={isLiked} onClick={toggleLike} />
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
					<Button onClick={() => onAddToCart(id)} variant='cart'>
						В корзину
					</Button>
				)}
			</article>
		);
	}
);

Card.displayName = 'Card';
