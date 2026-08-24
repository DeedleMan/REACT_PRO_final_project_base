import { useActionState, useRef, useEffect, useState } from 'react';
import s from './ReviewForm.module.css';
import { Rating } from '@shared/ui/Rating';
import { Button } from '@shared/ui/Button';
import { Textarea } from '@shared/ui/Textarea';

export type ReviewCallbacks = {
	onSubmit: (data: { text: string; rating: number }) => void;
};

export type ReviewState = {
	success: boolean;
	message: string;
};

// Action-функция — имитирует отправку запроса на сервер
async function submitReview(
	_prevState: ReviewState,
	_payload: unknown,
	text: string,
	rating: number,
	callbacks: ReviewCallbacks | undefined
): Promise<ReviewState> {
	if (text?.trim() && rating > 0) {
		// Оптимистичное обновление — мгновенно показываем отзыв
		callbacks?.onSubmit({ text: text.trim(), rating });

		// Имитация асинхронного запроса к API
		await new Promise((resolve) => setTimeout(resolve, 800));

		return { success: true, message: 'Отзыв отправлен!' };
	}
	return { success: false, message: 'Заполните все поля' };
}

const initialState: ReviewState = { success: false, message: '' };

export const ReviewForm = ({ onSubmit }: ReviewCallbacks) => {
	const [rating, setRating] = useState(0);
	const [text, setText] = useState('');
	const [state, formAction, isPending] = useActionState(
		(_prevState: ReviewState, payload: unknown) =>
			submitReview(_prevState, payload, text, rating, { onSubmit }),
		initialState
	);

	const hasSent = useRef(false);

	// Авто-сброс формы только ПОСЛЕ успешной отправки
	useEffect(() => {
		if (state.success && !hasSent.current) {
			hasSent.current = true;
			setRating(0);
			setText('');
		}
	}, [state.success]);

	return (
		<form
			className={s['form']}
			onSubmit={(e) => {
				e.preventDefault();
				if (isPending) return;
				formAction({});
			}}>
			<Rating isEdit rating={rating} onChange={setRating} />
			<Textarea
				name='reviewText'
				id='reviewText'
				placeholder='Напишите текст отзыва'
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<Button
				type='submit'
				variant='submit-form'
				submitFormType='pramary'
				disabled={isPending}>
				{isPending ? 'Отправка...' : 'Отправить отзыв'}
			</Button>
			{state.message && (
				<p
					className={s['form__message']}
					style={{ color: state.success ? '#4caf50' : '#f44336' }}>
					{state.message}
				</p>
			)}
		</form>
	);
};
