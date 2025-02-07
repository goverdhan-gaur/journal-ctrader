interface TradeData {
    balance$: number;
    closingQuantity: number;
    closingVolume: number;
    closingPrice: number;
    closingTime: string;
    entryPrice: number;
    net$: number;
    openingDirection: string;
    openingTime: string;
    pips: number;
    symbol: string;
}

export interface CleanedTradeData {
    orderId: string;
    symbol: string;
    direction: string;  
    entryPrice: number;
    closingPrice: number;
    initialQuantity: number;    // Initial position size
    closingQuantity: number;    // Size of the close
    remainingQuantity: number;  // Remaining position size after partial close
    openingTime: string;
    closingTime: string;
    net: number;
    isPartialClose?: boolean;
    parentOrderId?: string;
    relatedOrderIds?: string[]; // For tracking related trades
}

// Change keys to camelcase
const toCamelCase = (str: string) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
};

export const convertKeysToCamelCase = (data: any[]) => {
    return data.map(item => {
        const newItem: any = {};
        Object.keys(item).forEach(key => {
            const newKey = toCamelCase(key);
            newItem[newKey] = item[key];
        });
        return newItem;
    });
};

export async function cleanTradeData(data: any[]): Promise<CleanedTradeData[]> {
    // Simulate an async operation (e.g., API call or data processing)
    return new Promise((resolve) => {
        setTimeout(() => {
            const cleanedData = data.map(item => {
                // Convert numeric strings to numbers
                const entryPrice = parseFloat(item.entryPrice?.toString() || '0');
                const closingPrice = parseFloat(item.closingPrice?.toString() || '0');
                const closingQuantity = parseFloat(item.closingQuantity?.toString() || '0');
                const initialQuantity = parseFloat(item.initialQuantity?.toString() || closingQuantity.toString() || '0');
                const net = parseFloat(item.net$?.toString() || '0');

                // Calculate remaining quantity
                const remainingQuantity = Math.max(0, initialQuantity - closingQuantity);

                return {
                    orderId: item.orderId?.toString() || '',
                    symbol: item.symbol || '',
                    direction: item.openingDirection || '', 
                    entryPrice,
                    closingPrice,
                    initialQuantity,
                    closingQuantity,
                    remainingQuantity,
                    openingTime: item.openingTime || '',
                    closingTime: item.closingTime || '',
                    net,
                    isPartialClose: remainingQuantity > 0,
                    parentOrderId: '',
                    relatedOrderIds: []
                };
            });

            // Sort by opening time for consistent processing
            cleanedData.sort((a, b) => {
                const timeA = new Date(a.openingTime).getTime();
                const timeB = new Date(b.openingTime).getTime();
                return timeA - timeB;
            });

            resolve(cleanedData);
        }, 100); 
    });
}