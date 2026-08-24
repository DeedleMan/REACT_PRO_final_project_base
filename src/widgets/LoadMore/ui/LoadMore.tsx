import { memo, forwardRef } from 'react';
import { Alert, Stack } from '@mui/material';
import { Spinner } from '@shared/ui/Spinner';

export type TLoadMoreProps = {
	isEndOfList: boolean;
	isFetching: boolean;
};

// Сравнение только по isEndOfList — isFetching не нужно сравнивать,
// он меняется часто, но UI-состояние только при isEndOfList
const areEqual = (prev: TLoadMoreProps, next: TLoadMoreProps) => {
	return prev.isEndOfList === next.isEndOfList;
};

export const LoadMore = memo(
	forwardRef<HTMLDivElement, TLoadMoreProps>(
		({ isEndOfList, isFetching }, ref) => {
			return (
				<Stack
					ref={ref}
					direction='row'
					justifyContent='center'
					alignItems='center'
					sx={{ my: 5 }}>
					{isFetching && <Spinner />}
					{isEndOfList && <Alert severity='success'>End of list!</Alert>}
				</Stack>
			);
		}
	),
	areEqual
);

LoadMore.displayName = 'LoadMore';
