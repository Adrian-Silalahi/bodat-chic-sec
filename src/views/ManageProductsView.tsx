"use client";

import React, { useCallback } from "react";
import { ProductImage } from "@prisma/client";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { formatRupiah } from "../utils/FormatRupiah";
import Heading from "../components/Heading";
import { MdDelete, MdRemoveRedEye } from "react-icons/md";
import ActionButton from "../components/Products/ActionButton";
import { useRouter } from "next/navigation";
import { deleteProduct } from "../utils/DeleteProduct";
import { ProductWithImages } from "../types";

interface ManageProductsViewProps {
  products: ProductWithImages[];
}

const ManageProductsView: React.FC<ManageProductsViewProps> = ({
  products,
}) => {
  const router = useRouter();
  let rows: any = [];

  if (products) {
    rows = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: formatRupiah(product.price),
      category: product.category,
      brand: product.brand,
      images: product.images,
    }));
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 220 },
    {
      field: "price",
      headerName: "Price(Rp)",
      width: 100,
      renderCell: (params) => (
        <div className="font-bold text-slate-800">{params.row.price}</div>
      ),
    },
    { field: "category", headerName: "Category", width: 100 },
    { field: "brand", headerName: "Brand", width: 100 },
    {
      field: "action",
      headerName: "Actions",
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-center gap-4 w-full">
          <ActionButton
            icon={MdDelete}
            onClick={() => {
              void handleDelete(params.row.id, params.row.images);
            }}
          />
          <ActionButton
            icon={MdRemoveRedEye}
            onClick={() => {
              router.push(`/productDetail/${params.row.id}`);
            }}
          />
        </div>
      ),
    },
  ];

  const handleDelete = useCallback(
    async (id: string, images: ProductImage[]) => {
      await deleteProduct({ id, images, router });
    },
    [],
  );

  return (
    <div className="max-w-[1000px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Products" />
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 9 } },
          }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ManageProductsView;
