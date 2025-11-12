// /* eslint-disable react/prop-types */
// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import SelectImage from "./selectImage";
// import CustomButton from "../CustomButton";
// import { type VariationRequestType } from "@/src/types";

// interface SelectColorProps {
//   variant: VariationRequestType;
//   addVariantToState: (value: VariationRequestType) => void;
//   removeVariantFromState: (value: VariationRequestType) => void;
//   isProductCreated: boolean;
// }

// const SelectColor: React.FC<SelectColorProps> = ({
//   variant,
//   addVariantToState,
//   removeVariantFromState,
//   isProductCreated,
// }) => {
//   const [isCheckBox, setIsCheckBox] = useState(false);
//   const isFile = files !== null && files !== undefined;

//   useEffect(() => {
//     if (isProductCreated) {
//       setIsCheckBox(false);
//       setFiles(null);
//     }
//   }, [isProductCreated]);

//   const handleCheckBox = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const checkboxStatus = e.target.checked;
//       setIsCheckBox(checkboxStatus);

//       if (!checkboxStatus) {
//         clearImage();
//       }
//     },
//     []
//   );

//   const clearImage = (): void => {
//     setFiles(null);
//     removeVariantFromState(variant);
//   };

//   return (
//     <div className="grid grid-cols-1 overflow-y-auto border-b-[1.2px] border-slate-200 items-center p-2">
//       {/* Checkbox & Label */}
//       <div className="flex flex-row gap-2 items-center h-[60px]">
//         <input
//           id={variant.color}
//           type="checkbox"
//           checked={isCheckBox}
//           onChange={handleCheckBox}
//           className="cursor-pointer"
//         />
//         <label htmlFor={variant.color} className="font-medium cursor-pointer">
//           {variant.color}
//         </label>
//       </div>
//       <>
//         {isCheckBox && files === null && (
//           <div className="col-span-2 text-center">
//             <SelectImage
//               variant={variant}
//               handleFileChange={handleFileChange}
//             />
//           </div>
//         )}
//         {isFile && (
//           <div className="flex flex-row gap-2 text-sm col-span-2 items-center justify-between">
//             {files?.map((file) => (
//               <div key={file.name} className="truncate w-48">
//                 {file.name}
//               </div>
//             ))}
//             <div className="w-70px">
//               <CustomButton
//                 label="Cancel"
//                 small
//                 outline
//                 onClick={() => {
//                   clearImage();
//                 }}
//               />
//             </div>
//           </div>
//         )}
//       </>
//     </div>
//   );
// };

// export default SelectColor;
