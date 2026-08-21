import './styles/normalize.css';
import './styles/styles.css';
import { Outlet } from 'react-router-dom';
import { Header } from '../widgets/Header';
import { Sort } from '../features/ui/Sort';
import { Footer } from '../widgets/Footer';
import { ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../shared/store/utils';
import {
	productsActions,
	productsSelectors,
} from '../shared/store/slices/products';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
	const dispatch = useAppDispatch();
	const sort = useAppSelector(productsSelectors.getSort);

	const handleSortChange = (newSort: Sort) => {
		dispatch(productsActions.setSort(newSort));
	};

	return (
		<>
			<Header />
			<Sort value={sort} onChange={handleSortChange} />
			<Outlet />
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				pauseOnHover
				theme='colored'
			/>
			<Footer />
		</>
	);
};
