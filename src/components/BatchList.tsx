import { Overview } from '@/utils/aggregatedOverview';
import { CleanedTradeData } from '@/utils/cleanData';
import { database } from '@/utils/firebase.config';
import { ref, remove } from 'firebase/database';
import Link from 'next/link';
import React from 'react';
import { Button } from './AddDataModal';

interface BatchListProps {
    batches: Overview[];
    className?: string;
}

const BatchList: React.FC<BatchListProps> = ({ className, batches }) => {
     // Function to handle deletion
  const handleDelete = async (id:any) => {
    try {
      // Reference to the specific batch in Firebase
      const batchRef = ref(database, `trades/${id}`);

      // Remove the batch entry from Firebase
      await remove(batchRef);

    } catch (error) {
      console.error("Error deleting batch: ", error);
    }
  };

    return (
        <div className={`mt-4 ${className}`}>
            <ul className="flex flex-wrap -mx-4">
                {batches.map((index, batch) => (
                    <li key={batch} className="w-full md:w-1/3 px-4 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg" role="region" aria-labelledby={`batch-${batch}-title`}>
                            <h2 id={`batch-${batch}-title`} className="text-xl font-semibold mb-2 text-indigo-600">Trade Summary</h2>

                            <p className="text-gray-700"><strong>Total Lots:</strong> {index.totalLots}</p>
                            <p className="text-gray-700"><strong>Total Pips:</strong> {index.totalPips}</p>
                            <p className="text-gray-700"><strong>Total Profit:</strong> <span className={index.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}>${index.totalProfit.toFixed(2)}</span></p>
                            <p className="text-gray-700"><strong>Total Trades:</strong> {index.totalTrades}</p>
                            <Link href={`/batch/${index.id}`} className='text-green-500'>
                                <Button>View Details</Button>
                            </Link>
                            <Button onClick={() => handleDelete(index.id)}>Delete</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BatchList;