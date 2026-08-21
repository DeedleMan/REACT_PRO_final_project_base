import { FC, ComponentType } from 'react';
import { useAppSelector } from '../store/utils';
import { userSelectors } from '../store/slices/user';
import { Navigate, useLocation } from 'react-router-dom';

interface WithProtectionProps {
	redirectPath?: string;
}

export const WithProtection = <P extends object>(
	WrappedComponent: FC<P> | ComponentType<P>,
	{ redirectPath = '/signin' }: WithProtectionProps = {}
) => {
	const WithProtectionComponent: FC<P> = (props) => {
		const isAuth = useAppSelector(userSelectors.getAccessToken);
		const location = useLocation();

		if (!isAuth) {
			return <Navigate to={redirectPath} state={{ from: location.pathname }} />;
		}

		return <WrappedComponent {...(props as P)} />;
	};

	return WithProtectionComponent;
};
