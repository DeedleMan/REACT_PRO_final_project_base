import { WithProtection } from '@shared/features/WithProtection';
import { ButtonBack } from '@shared/ui/ButtonBack';
import { CardList } from '@widgets/CardList';
import { useGetProductsQuery } from '@entities/product';
import { productsSelectors } from '@shared/store/slices/products';
import { userSelectors } from '@shared/store/slices/user';
import { useAppSelector } from '@shared/store/utils';
import { isLiked, getMessageFromError } from '@shared/utils';
import { Spinner } from '@shared/ui/Spinner';
import { Alert, AlertTitle, Button, Container } from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const FavoritesPage = WithProtection(() => {
	const { searchText, sort } = useAppSelector(
		productsSelectors.getProductsState
	);
	const user = useAppSelector(userSelectors.getUser);

	const { data, isLoading, isError, error } = useGetProductsQuery({
		searchText,
		sort,
		page: 1,
	});

	let products = data?.products || [];
	if (user?.id) {
		products = products.filter((product) => isLiked(product.likes, user.id));
	}

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
			<br />
			<ButtonBack />
			<CardList title='Избранные' products={products} />
		</>
	);
});
