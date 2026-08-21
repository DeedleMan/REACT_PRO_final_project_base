import { ReactNode, forwardRef } from 'react';
import classNames from 'classnames';
import s from './PageHeader.module.css';

export type PageHeaderProps = {
	title: string;
	subtitle?: string;
	children?: ReactNode;
	className?: string;
};

export const PageHeader = forwardRef<HTMLHeadingElement, PageHeaderProps>(
	({ title, subtitle, children, className }, ref) => {
		return (
			<div className={className}>
				<h1 className={classNames(s['page-header'])} ref={ref}>
					{title}
				</h1>
				{subtitle && <p className={s['page-header__subtitle']}>{subtitle}</p>}
				{children}
			</div>
		);
	}
);

PageHeader.displayName = 'PageHeader';
