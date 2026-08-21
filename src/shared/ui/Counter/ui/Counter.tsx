import { forwardRef } from 'react';
import classNames from 'classnames';
import s from './Counter.module.css';
import { Button } from '../../Button';

export type CounterProps = {
	className?: string;
	children: React.ReactNode;
};

/**
 * Wrapper for counter +/- buttons (pill container).
 * Usage:
 *   <Counter>
 *     <CounterAction variant="minus">-</CounterAction>
 *     <Input variant="counter" value={count} onChange={...} />
 *     <CounterAction variant="plus">+</CounterAction>
 *   </Counter>
 */
export const Counter = forwardRef<HTMLDivElement, CounterProps>(
	({ className, children }, ref) => {
		return (
			<div ref={ref} className={classNames(s['button-count'], className)}>
				{children}
			</div>
		);
	}
);

Counter.displayName = 'Counter';

export type CounterActionProps =
	React.ButtonHTMLAttributes<HTMLButtonElement> & {
		variant: 'minus' | 'plus';
	};

export const CounterAction = forwardRef<HTMLButtonElement, CounterActionProps>(
	({ variant, className, children, ...rest }, ref) => {
		return (
			<Button
				ref={ref}
				variant={variant === 'minus' ? 'counter-minus' : 'counter-plus'}
				className={className}
				{...rest}>
				{children}
			</Button>
		);
	}
);

CounterAction.displayName = 'CounterAction';
