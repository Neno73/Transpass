import React from "react";

const ProductShowcase: React.FC = () => {
  return (
    <article className="flex flex-col items-end self-stretch px-20 my-auto min-w-60 w-[399px]">
      <div className="flex relative flex-col justify-center items-start py-44 max-w-full rounded-none aspect-[0.675] w-[293px] max-md:py-24 max-md:pr-5">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b2f90990a40f272ebc9a22676fa996298d1f66154786a398f75ff91c4c9660c3?placeholderIfAbsent=true&apiKey=fcd905b1f3504ca5a0609931dddb1d64"
          alt="Product showcase"
          className="object-cover absolute inset-0 size-full"
        />
        <div className="flex relative gap-2 py-3 pr-14 pl-5 mb-0 bg-violet-200 border border-indigo-200 border-solid shadow-sm rounded-[50px] max-md:pr-5 max-md:mb-2.5">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d8fc82e0f5ab5cc1c51be5799b50fc078b33c17c0f5b5ec31e998d124ba2a0bb?placeholderIfAbsent=true&apiKey=fcd905b1f3504ca5a0609931dddb1d64"
            alt="Product thumbnail"
            className="object-contain shrink-0 aspect-square w-[58px]"
          />
          <div className="flex flex-col items-start my-auto">
            <h3 className="self-stretch text-sm text-center text-indigo-900">
              Premium wool jumper
            </h3>
            <p className="text-xs text-center text-gray-600">by LEAP CONCEPT</p>
            <div className="flex gap-0.5 mt-2.5">
              <span className="flex shrink-0 h-3 bg-white rounded-full w-[13px]" />
              <span className="flex shrink-0 h-3 bg-gray-600 rounded-full w-[13px]" />
              <span className="flex shrink-0 h-3 rounded-full bg-sky-950 w-[13px]" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductShowcase;