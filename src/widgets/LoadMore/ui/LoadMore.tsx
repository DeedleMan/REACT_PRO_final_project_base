import { Alert, Stack } from '@mui/material';
import { Spinner } from '@shared/ui/Spinner';

type TLoadMoreProps = {
	isEndOfList: boolean;
	isFetching: boolean;
	ref?: React.RefObject<HTMLDivElement>;
};

export const LoadMore = ({ isEndOfList, isFetching, ref }: TLoadMoreProps) => {
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
};
