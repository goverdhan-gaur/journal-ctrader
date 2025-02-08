import { useState } from 'react';

const useFileProcessing = () => {
    const [isLoading, setIsLoading] = useState(false);

    const processFileData = async (data: any, processFunction: (data: any) => Promise<void>) => {
        setIsLoading(true);
        try {
            await processFunction(data);
        } catch (error) {
            console.error('Error processing file:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, processFileData };
};

export default useFileProcessing;
