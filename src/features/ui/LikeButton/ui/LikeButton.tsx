import classNames from 'classnames';
import s from './LikeButton.module.css';
import { ReactComponent as LikeSvg } from '@shared/assets/icons/like.svg';
import { Button } from '@shared/ui/Button';

type TLikeButtonProps = {
	isActive: boolean;
	onClick: () => void;
};

export const LikeButton = ({ isActive, onClick }: TLikeButtonProps) => {
	return (
		<Button
			variant='like'
			isActive={isActive}
			onClick={onClick}
			className={classNames(s['card__favorite'], {
				[s['card__favorite_is-active']]: isActive,
			})}>
			<LikeSvg />
		</Button>
	);
};
