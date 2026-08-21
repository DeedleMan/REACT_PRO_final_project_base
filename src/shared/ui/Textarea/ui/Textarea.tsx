import { TextareaHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import s from './Textarea.module.css';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...rest }, ref) => {
		const cls = classNames(s['input'], s['textarea'], className);

		return <textarea ref={ref} className={cls} {...rest} />;
	}
);

Textarea.displayName = 'Textarea';
