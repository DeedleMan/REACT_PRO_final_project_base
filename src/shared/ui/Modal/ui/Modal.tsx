import { useEffect, useRef, useCallback, HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import s from './Modal.module.css';
import { Button } from '@shared/ui/Button';

export type ModalProps = HTMLAttributes<HTMLDivElement> & {
	isOpen?: boolean;
	children?: React.ReactNode;
	title?: string;
	onClose?: () => void;
};

const ESC_KEY = 'Escape';

export const Modal = ({
	isOpen,
	onClose,
	children,
	title,
	className,
	...props
}: ModalProps) => {
	const modalRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLElement | null>(null);
	const closeBtnRef = useRef<HTMLButtonElement>(null);

	// Запомниаем триггер
	useEffect(() => {
		if (isOpen) {
			triggerRef.current = document.activeElement as HTMLElement;
		}
	}, [isOpen]);

	const handleClose = useCallback(() => {
		onClose?.();
		// Восстанавливаем фокус на триггер
		if (triggerRef.current) {
			(triggerRef.current as HTMLElement).focus();
		}
	}, [onClose]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === ESC_KEY && onClose) {
				handleClose();
			}
		},
		[onClose, handleClose]
	);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown);
			// Фокус на крестик
			const timer = setTimeout(() => {
				closeBtnRef.current?.focus();
			}, 0);
			return () => {
				document.removeEventListener('keydown', handleKeyDown);
				clearTimeout(timer);
			};
		}
	}, [isOpen, handleKeyDown]);

	if (!isOpen) {
		return null;
	}

	return createPortal(
		<div
			className={classNames(s['overlay'])}
			role='presentation'
			onClick={(e) => e.target === e.currentTarget && handleClose()}>
			<div
				ref={modalRef}
				className={classNames(s['content'], className)}
				role='dialog'
				aria-modal='true'
				{...props}>
				<div className={s['header']}>
					{title && <h2 className={s['title']}>{title}</h2>}
					<Button
						ref={closeBtnRef}
						type='button'
						className={s['close-btn']}
						onClick={handleClose}
						aria-label='Закрыть'>
						X
					</Button>
				</div>
				<div className={s['body']}>{children}</div>
			</div>
		</div>,
		document.getElementById('modal-root') as HTMLElement
	);
};
