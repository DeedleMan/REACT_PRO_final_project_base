import { ReactNode, forwardRef } from 'react';
import classNames from 'classnames';
import s from './Layout.module.css';

export type PageLayoutProps = {
	children: ReactNode;
	className?: string;
};

export const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
	({ children, className }, ref) => {
		return (
			<div ref={ref} className={classNames(s['page-layout'], className)}>
				{children}
			</div>
		);
	}
);

PageLayout.displayName = 'PageLayout';
