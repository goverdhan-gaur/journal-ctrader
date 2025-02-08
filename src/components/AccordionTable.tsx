import { SetStateAction, useState } from "react";
import { CleanedTradeData } from '@/utils/cleanData';
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
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <>
              <tr
                key={'accordian' + index}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => toggleAccordion(index)}
              >
                <td className="p-2 border text-center">{index + 1}</td>
                <td className="p-2 border">{item.balance}</td>
                <td className="p-2 border text-center">{openIndex === index ? "▼" : "▶"}</td>
              </tr>
              {openIndex === index && (
                <tr>
                  <td colSpan={3} className="p-2 border bg-gray-50">
                    {item.entryPrice}
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