import { useState, useCallback } from 'react';
import classNames from 'classnames';
import s from './ReviewList.module.css';
import { ReviewForm } from '../ReviewForm/ReviewForm';
import { ReviewItem } from '@shared/ui/ReviewItem';

// Тип для оптимистичного отзыва (до подтверждения сервером)
type OptimisticReview = {
	id: string;
	text: string;
	rating: number;
	name: string;
	date: string;
	status: 'pending' | 'confirmed';
};

type ReviewListProps = {
	product: Product;
};

export const ReviewList = ({ product }: ReviewListProps) => {
	const [optimisticReviews, setOptimisticReviews] = useState<
		OptimisticReview[]
	>([]);

	const handleAddReview = useCallback(
		(data: { text: string; rating: number }) => {
			const newReview: OptimisticReview = {
				id: `optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}`,
				text: data.text,
				rating: data.rating,
				name: 'Вы',
				date: new Date().toLocaleDateString('ru-RU'),
				status: 'pending',
			};

			setOptimisticReviews((prev) => [...prev, newReview]);
		},
		[]
	);

	return (
		<div className={classNames(s['product__reviews'])}>
			{/* Реальные отзывы */}
			{product.reviews.map((review) => (
				<ReviewItem
					key={review.id}
					name={review.user.name}
					date={new Date(review.createdAt).toLocaleDateString('ru-RU')}
					rating={review.rating}
					text={review.text}
				/>
			))}

			{/* Оптимистичные отзывы (мгновенно отображаются) */}
			{optimisticReviews.map((review) => (
				<ReviewItem
					key={review.id}
					name={review.name}
					date={review.date}
					rating={review.rating}
					text={review.text}
					className={
						review.status === 'pending'
							? `${s['review']} ${s['review--optimistic']}`
							: `${s['review']} ${s['review--confirmed']}`
					}
				/>
			))}

			<h2>Отзыв о товаре {product.name}</h2>
			<ReviewForm onSubmit={handleAddReview} />
		</div>
	);
};
