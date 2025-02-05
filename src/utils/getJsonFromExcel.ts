import * as XLSX from "xlsx";

export const getJsonDataFromExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    const fileLoadPromise = new Promise<any[]>((resolve, reject) => {
        reader.onload = (e) => {
            const binaryStr = e.target?.result;
            if (!binaryStr) {
                reject("Failed to read the file.");
                return;
            }
            try {
                let jsonData: any[] = [];
                const workbook = XLSX.read(binaryStr, { type: "binary", cellDates: true });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                jsonData = XLSX.utils.sheet_to_json(sheet);

                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
    });

    reader.readAsBinaryString(file);

    // Wait for the promise to resolve and return the data
    return await fileLoadPromise;
};
