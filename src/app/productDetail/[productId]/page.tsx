import Container from "@/src/components/Container";
import ProductDetailView from "@/src/views/ProductDetailView";
import React from "react";
import getProductById from "@/src/actions/getProductById";
import NullData from "@/src/components/NullData";
import { getCurrentUser } from "@/src/actions/getCurrentUser";

interface ParamProps {
  params: {
    productId: string;
  };
}

const ProductDetail: React.FC<ParamProps> = async ({ params }) => {
  const product = await getProductById(params);
  const user = await getCurrentUser();

  if (!product) {
    return (
      <NullData title="Oops! Product with the given id does not exist"></NullData>
    );
  }

  return (
    <div className="p-8">
      <Container>
        <ProductDetailView product={product} user={user} />
      </Container>
    </div>
  );
};

export default ProductDetail;
