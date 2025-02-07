import * as XLSX from "xlsx";

export const getJsonDataFromExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
        console.error('No file selected');
        return;
    }

    console.log('Reading file:', file.name);
    const reader = new FileReader();

    const fileLoadPromise = new Promise<any[]>((resolve, reject) => {
        reader.onload = (e) => {
            const binaryStr = e.target?.result;
            if (!binaryStr) {
                console.error('Failed to read file contents');
                reject("Failed to read the file.");
                return;
            }

            try {
                console.log('Parsing Excel file...');
                const workbook = XLSX.read(binaryStr, { 
                    type: "binary", 
                    cellDates: true,
                    dateNF: 'yyyy-mm-dd hh:mm:ss'  // Standardize date format
                });

                console.log('Available sheets:', workbook.SheetNames);
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Convert sheet to JSON with specific options
                const jsonData = XLSX.utils.sheet_to_json(sheet, {
                    raw: false,  // Convert all numbers to strings
                    dateNF: 'yyyy-mm-dd hh:mm:ss',  // Date format
                    defval: ''  // Default value for empty cells
                });

                console.log('Parsed data sample:', jsonData.slice(0, 2));
                console.log('Total rows:', jsonData.length);

                if (jsonData.length === 0) {
                    console.error('No data found in Excel file');
                    reject('No data found in Excel file');
                    return;
                }

                // Map the column names to expected format
                const mappedData = jsonData.map(row => {
                    const entry: any = {};
                    Object.entries(row).forEach(([key, value]) => {
                        const lowerKey = key.toLowerCase().trim();
                        
                        // Map column names based on your Excel format
                        if (lowerKey.includes('symbol')) entry.symbol = value;
                        else if (lowerKey.includes('direction') || lowerKey.includes('type')) entry.openingDirection = value;
                        else if (lowerKey.includes('entry') && lowerKey.includes('price')) entry.entryPrice = value;
                        else if (lowerKey.includes('closing') && lowerKey.includes('price')) entry.closingPrice = value;
                        else if (lowerKey.includes('quantity') || lowerKey.includes('volume')) entry.closingQuantity = value;
                        else if (lowerKey.includes('opening') && lowerKey.includes('time')) entry.openingTime = value;
                        else if (lowerKey.includes('closing') && lowerKey.includes('time')) entry.closingTime = value;
                        else if (lowerKey.includes('net') || lowerKey.includes('profit')) entry.net$ = value;
                    });
                    return entry;
                });

                // Validate required fields
                const requiredFields = ['symbol', 'openingDirection', 'entryPrice', 'closingPrice', 'closingQuantity', 'openingTime', 'closingTime', 'net$'];
                const missingFields = mappedData.some(row => 
                    requiredFields.some(field => !row[field])
                );

                if (missingFields) {
                    console.error('Some rows are missing required fields');
                    console.log('Sample row:', mappedData[0]);
                    reject('Some rows are missing required fields. Please check your Excel format.');
                    return;
                }

                resolve(mappedData);
            } catch (error) {
                console.error('Error parsing Excel file:', error);
                reject(error);
            }
        };

        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            reject(error);
        };
    });

    try {
        reader.readAsBinaryString(file);
        return await fileLoadPromise;
    } catch (error) {
        console.error('Error in getJsonDataFromExcel:', error);
        throw error;
    }
};
