import { InputHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import s from './Input.module.css';

export type InputVariant = 'default' | 'search' | 'counter';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	variant?: InputVariant;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ variant = 'default', className, type = 'text', ...rest }, ref) => {
		const cls = classNames(s['input'], s[`input_type_${variant}`], className);

		return <input ref={ref} type={type} className={cls} {...rest} />;
	}
);

Input.displayName = 'Input';
