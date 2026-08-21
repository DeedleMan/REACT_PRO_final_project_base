import classNames from 'classnames';
import s from './ReviewList.module.css';
import { ReviewForm } from './ReviewForm/ReviewForm';
import { ReviewItem } from '../../../shared/ui/ReviewItem';

type ReviewListProps = {
	product: Product;
};
export const ReviewList = ({ product }: ReviewListProps) => {
	return (
		<div className={classNames(s['product__reviews'])}>
			{product.reviews.map((review) => (
				<ReviewItem
					key={review.id}
					name={review.user.name}
					date={new Date(review.createdAt).toLocaleDateString('ru-RU')}
					rating={review.rating}
					text={review.text}
				/>
			))}

			<h2>Отзыв о товаре {product.name}</h2>
			<ReviewForm />
		</div>
	);
};
