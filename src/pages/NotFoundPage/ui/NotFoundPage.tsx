import s from './NotFoudPage.module.css';
import { Button } from '../../../shared/ui/Button';

export const NotFoundPage = () => {
	return (
		<div className={s.NotFoundPage}>
			<h1>Страница на найдена</h1>
			<Button onClick={() => (window.location.href = '/')}>
				Перейти на главную
			</Button>
		</div>
	);
};
