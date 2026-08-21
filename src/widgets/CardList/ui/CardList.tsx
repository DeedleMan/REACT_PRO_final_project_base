import { Card } from '../../../entities/product';
import { PageHeader } from '../../../shared/ui/PageHeader';
import s from './CardList.module.css';

type CardListProps = {
	title: string;
	products: Product[];
};
export const CardList = ({ title, products }: CardListProps) => {
	if (!products.length) {
		return <PageHeader title='Товар не найден' />;
	}

	return (
		<div className={s['card-list']}>
			<div className={s['card-list__header']}>
				<h2 className={s['card-list__title']}>{title}</h2>
			</div>
			<div className={s['card-list__items']}>
				{products.map((product) => (
					<Card key={product.id} product={product} />
				))}
			</div>
		</div>
	);
};
