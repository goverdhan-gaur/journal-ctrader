export interface TradeData {
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
    symbol: string;
    entryPrice: number;
    openingDirection: string;
    openingDate: string; 
    openingTime: string;
    closingQuantity: number;
    closingPrice: number;
    closingDate: string;
    closingTime: string;
    pips: number;
    net: number;
    balance: number;
}


// Change keys to camelcase
// change the keys to camelcase
const toCamelCase = (str: string) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
};
/* eslint-disable  @typescript-eslint/no-explicit-any */
export const convertKeysToCamelCase = (data: any[]) => {
    return data.map(item => {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const newItem: any = {};
        Object.keys(item).forEach(key => {
            const newKey = toCamelCase(key);
            newItem[newKey] = item[key];
        });
        return newItem;
    });
};

// Clean the trade data (sepoerate date)
function extractDateTime(dateTime: string | Date): { date: string, time: string } {
    let date = '';
    let time = '';
    if (typeof dateTime === 'string') {
        [date, time] = dateTime.split(' ');
        return { date, time };
    }
    if (dateTime instanceof Date) {
        date = dateTime.toISOString().split('T')[0];
        time = dateTime.toTimeString().split(' ')[0];
        return { date, time };
    }
    return { date, time };
}

export async function cleanTradeData(data: TradeData[]): Promise<CleanedTradeData[]> {
    // Simulate an async operation (e.g., API call or data processing)
    return new Promise((resolve) => {
        setTimeout(() => {
            const cleanedData = data.map(item => {
                const { date: closingDate, time: closingTime } = extractDateTime(item.closingTime);
                const { date: openingDate, time: openingTime } = extractDateTime(item.openingTime);

                return {
                    symbol: item.symbol,
                    openingDirection: item.openingDirection,
                    openingDate,
                    openingTime,
                    closingQuantity: item.closingQuantity,
                    closingDate,
                    closingTime,
                    entryPrice: item.entryPrice,
                    closingPrice: item.closingPrice,
                    net: item.net$,
                    pips: item.pips/10,
                    balance: item.balance$
                };
            });

            resolve(cleanedData); // Return cleaned data
        }, 1000); // Simulate a delay (1 second)
    });
}