import { WithProtection } from '@shared/features/WithProtection';
import { LoadMore } from '@widgets/LoadMore';
import { CardList } from '@widgets/CardList';
import { useGetProductsQuery } from '@entities/product';
import { productsSelectors } from '@shared/store/slices/products';
import { useAppSelector } from '@shared/store/utils';
import { Spinner } from '@shared/ui/Spinner';
import { Alert, AlertTitle, Button, Container } from '@mui/material';
import { getMessageFromError } from '@shared/utils';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useRef } from 'react';

export const HomePage = WithProtection(() => {
	const { searchText, page, perPage, sort } = useAppSelector(
		productsSelectors.getProductsState
	);

	const { data, isLoading, isError, error, isFetching } = useGetProductsQuery({
		searchText,
		sort,
		page,
		perPage,
	});

	const products = data?.products || [];
	const productsCount = data?.length || 0;
	const isEndOfList = products.length >= productsCount;
	const ref = useRef<HTMLDivElement>(null);

	if (isLoading) {
		return <Spinner />;
	}

	if (isError) {
		return (
			<Container>
				<Alert
					action={
						<Button onClick={() => window.location.reload()}>Retry</Button>
					}
					severity='error'>
					<AlertTitle>
						{getMessageFromError(
							error as FetchBaseQueryError | SerializedError | undefined,
							'Неизвестная ошибка при получение данных'
						)}
					</AlertTitle>
				</Alert>
			</Container>
		);
	}

	return (
		<>
			<CardList title='Лакомства' products={products} />
			{isFetching && (
				<LoadMore isEndOfList={isEndOfList} isFetching={isFetching} ref={ref} />
			)}
		</>
	);
});
