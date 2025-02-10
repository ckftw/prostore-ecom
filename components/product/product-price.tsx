/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";

const ProductPrice = ({ value, className }: { value: number; className?: string }) => {
  const stringValue = value.toFixed(2);
  const [intValue, floatValue] = stringValue.split(".");

  return (
    <div className={cn("flex items-baseline", className)}>
      <span className="text-xs relative -top-[10px]">$</span>
      <span className="text-2xl font-semibold">{intValue}</span>
      <span className="text-sm relative -top-[2px]">.{floatValue}</span>
    </div>
  );
};

export default ProductPrice;
