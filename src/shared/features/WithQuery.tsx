import { Alert, AlertTitle, Button, Container } from '@mui/material';
import { FC, ComponentType } from 'react';
import { getMessageFromError } from '@shared/utils';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Spinner } from '@shared/ui/Spinner';

interface WithQueryProps {
	isLoading: boolean;
	isError: boolean;
	refetch?: () => void;
	error?: FetchBaseQueryError | SerializedError | undefined;
}

export const WithQuery = <T extends object>(
	WrappedComponent: ComponentType<T>
) => {
	const ReturnedComponent: FC<WithQueryProps & T> = (props) => {
		const { isError, isLoading, refetch, error, ...propsForWrappedComponent } =
			props;

		if (isError) {
			return (
				<Container>
					<Alert
						action={<Button onClick={refetch}>Retry</Button>}
						severity='error'>
						<AlertTitle>
							{getMessageFromError(
								error,
								'Неизвестная ошибка при получение данных'
							)}
						</AlertTitle>
					</Alert>
				</Container>
			);
		}

		if (isLoading) {
			return <Spinner />;
		}

		return <WrappedComponent {...(propsForWrappedComponent as T)} />;
	};

	ReturnedComponent.displayName = `withQuery${WrappedComponent.displayName}`;

	return ReturnedComponent;
};
