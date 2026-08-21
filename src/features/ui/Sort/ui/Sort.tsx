import { ChangeEvent } from 'react';

type TSortProps = {
	value: Sort;
	onChange: (sort: Sort) => void;
	options?: Array<{ title: string; value: Sort }>;
};

export const Sort = ({
	value,
	onChange,
	options = [
		{ title: 'Дешевые', value: 'low-price' },
		{ title: 'Дорогие', value: 'high-price' },
		{ title: 'Новые', value: 'newest' },
		{ title: 'Старые', value: 'oldest' },
	],
}: TSortProps) => {
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		onChange(e.target.value as Sort);
	};

	return (
		<select value={value} onChange={handleChange}>
			{options.map((p) => (
				<option key={p.title} value={p.value}>
					{p.title}
				</option>
			))}
		</select>
	);
};
