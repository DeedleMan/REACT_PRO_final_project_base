import {
	useSetLikeProductMutation,
	useDeleteLikeProductMutation,
} from '@entities/product/api/productsApi';

export const useToggleLike = (productId: string, isLiked: boolean) => {
	const [setLike] = useSetLikeProductMutation();
	const [deleteLike] = useDeleteLikeProductMutation();

	const toggleLike = async () => {
		await (isLiked
			? deleteLike({ id: productId })
			: setLike({ id: productId })
		).unwrap();
	};

	return { toggleLike };
};
