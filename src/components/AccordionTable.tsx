import { SetStateAction, useState } from "react";

import { CleanedTradeData } from '@/utils/cleanData';
import Link from "next/link";
interface AccordionTableProps {
  data: CleanedTradeData[];
}

const AccordionTable = ({ data }: AccordionTableProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Symbol
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Open Time
            </th>
            <th scope="col" className="px-6 py-3">
              Open Price
            </th>
            <th scope="col" className="px-6 py-3">
              Close Price
            </th>
            <th scope="col" className="px-6 py-3">
              Lots
            </th>
            <th scope="col" className="px-6 py-3">
              PnL
            </th>
            <th scope="col" className="px-6 py-3">
              Positions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((trade, index) => (
            <>
              <tr onClick={() => toggleAccordion(index)} key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {trade.symbol}
                </th>
                <td className="px-6 py-4">
                  {trade.openingDate}
                </td>
                <td className="px-6 py-4">
                  {trade.openingTime}
                </td>
                <td className="px-6 py-4">
                  {trade.entryPrice}
                </td>
                <td className="px-6 py-4">
                  {trade.closingPrice}
                </td>
                <td className="px-6 py-4">
                  {trade.closingQuantity}
                </td>
                <td className="px-6 py-4">
                  {trade.net}
                </td>

              </tr>
              {openIndex === index && (
                <tr>
                  <td colSpan={3} className="p-2 border bg-gray-50">
                    {trade.entryPrice}
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccordionTable;