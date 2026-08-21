import { useState, ChangeEvent } from 'react';
import s from './ReviewForm.module.css';
import { Rating } from '@shared/ui/Rating';
import { Button } from '@shared/ui/Button';
import { Textarea } from '@shared/ui/Textarea';

export const ReviewForm = () => {
	const [reviewText, setReviewText] = useState('');
	const [rating, setRating] = useState(0);

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setReviewText(e.target.value);
	};

	const handleClick = () => {
		console.log('Отправка: ', { reviewText, rating });
	};

	return (
		<form className={s['form']}>
			<Rating isEdit rating={rating} onChange={setRating} />
			<Textarea
				name='text'
				id='text'
				placeholder='Напишите текст отзыва'
				value={reviewText}
				onChange={handleChange}
			/>
			<Button
				type='submit'
				variant='submit-form'
				submitFormType='pramary'
				onClick={handleClick}>
				Отправить отзыв
			</Button>
		</form>
	);
};
