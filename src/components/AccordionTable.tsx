import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye } from "react-icons/fa";  

interface TradeData {
  symbol: string;
  openingDate: string;
  openingTime: string;
  entryPrice: number;
  closingPrice: number;
  closingQuantity: number;
  net: number;
  positions: number;
}

interface AccordionTableProps {
  data: TradeData[];
}

const AccordionTable = ({ data }: AccordionTableProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full border-collapse shadow-lg rounded-xl overflow-hidden bg-gray-900 text-white">
        <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <tr>
            {["Symbol", "Date", "Open Time", "Open Price", "Close Price", "Lots", "PnL", "Positions", "Actions"].map((heading) => (
              <th key={heading} className="px-6 py-3 text-left uppercase text-sm font-semibold">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((trade, index) => (
            <React.Fragment key={index}>
              <tr
                onClick={() => toggleAccordion(index)}
                className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition-all duration-300 border-b border-gray-700"
              >
                <td className="px-6 py-4 font-medium">{trade.symbol}</td>
                <td className="px-6 py-4">{trade.openingDate}</td>
                <td className="px-6 py-4">{trade.openingTime}</td>
                <td className="px-6 py-4">{trade.entryPrice}</td>
                <td className="px-6 py-4">{trade.closingPrice}</td>
                <td className="px-6 py-4">{trade.closingQuantity}</td>
                <td className={`px-6 py-4 font-semibold ${trade.net > 0 ? "text-green-400" : "text-red-500"}`}>
                  {trade.net}
                </td>
                <td className="px-6 py-4">{trade.positions}</td>
                <td className="px-6 py-4">
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center gap-2">
                    <FaEye /> View
                  </button>
                </td>
              </tr>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-700"
                  >
                    <td colSpan={9} className="p-4 text-gray-300">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold">Entry Price:</p>
                          <p>{trade.entryPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Exit Price:</p>
                          <p>{trade.closingPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Trade Type:</p>
                          <p>{trade.net > 0 ? "Profit Trade" : "Loss Trade"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Profit/Loss:</p>
                          <p className={trade.net > 0 ? "text-green-400" : "text-red-500"}>{trade.net}</p>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccordionTable;
