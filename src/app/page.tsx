import ReadXL from "@/components/ReadXL";
import TradeList from "@/components/TradeList";
import { cleanTradeData, convertKeysToCamelCase } from "@/utils/cleanData";
import Image from "next/image";

export default function Home() {
 
  return (
    <div className="container mx-auto p-4">
      <ReadXL />
      {/* <TradeList trades={""} /> */}
    </div>
  );
}
