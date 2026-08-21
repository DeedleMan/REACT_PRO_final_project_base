import { ReactNode, forwardRef } from 'react';
import classNames from 'classnames';
import s from './Badge.module.css';

export type BadgeVariant = 'new' | 'sale' | 'discount';

export type BadgeProps = {
	children: ReactNode;
	variant?: BadgeVariant;
	className?: string;
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({ variant = 'discount', className, children }, ref) => {
		return (
			<span
				ref={ref}
				className={classNames(
					s['badge'],
					s[`badge_type_${variant}`],
					className
				)}>
				{children}
			</span>
		);
	}
);

Badge.displayName = 'Badge';
