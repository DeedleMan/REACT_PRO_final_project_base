import { forwardRef } from 'react';
import s from './ReviewItem.module.css';
import { Rating } from '../../Rating';

export type ReviewItemProps = {
	name: string;
	date: string;
	rating: number;
	text: string;
};

export const ReviewItem = forwardRef<HTMLDivElement, ReviewItemProps>(
	({ name, date, rating, text }, ref) => {
		return (
			<div ref={ref} className={s['review']}>
				<div className={s['review__header']}>
					<div className={s['review__name']}>{name}</div>
					<div className={s['review__date']}>{date}</div>
				</div>
				<Rating rating={rating} />
				<p className={s['review__text']}>{text}</p>
			</div>
		);
	}
);

ReviewItem.displayName = 'ReviewItem';
