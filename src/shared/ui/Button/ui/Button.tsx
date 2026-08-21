import { ButtonHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import s from './Button.module.css';

export type ButtonVariant =
	| 'primary'
	| 'secondary'
	| 'light'
	| 'border'
	| 'cart'
	| 'submit-form'
	| 'wide'
	| 'box'
	| 'trash'
	| 'like'
	| 'search'
	| 'counter-minus'
	| 'counter-plus'
	| 'back';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	submitFormType?: 'pramary' | 'secondary';
	isActive?: boolean;
	fullWidth?: boolean;
	maxContent?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = 'primary',
			submitFormType,
			isActive,
			fullWidth,
			maxContent,
			className,
			children,
			disabled,
			type = 'button',
			...rest
		},
		ref
	) => {
		const cls = classNames(
			s['button'],
			s[`button_type_${variant}`],
			{
				[s['button_max-content']]: maxContent,
				[s['button_full-width']]: fullWidth,
				[s['button_type_like__is-active']]: variant === 'like' && isActive,
				[s['form__btn']]: variant === 'submit-form',
				[s[`button_type_submit-form_${submitFormType}`]]:
					variant === 'submit-form' && submitFormType,
			},
			className
		);

		return (
			<button
				ref={ref}
				type={type}
				disabled={disabled}
				className={cls}
				{...rest}>
				{children}
			</button>
		);
	}
);

Button.displayName = 'Button';
