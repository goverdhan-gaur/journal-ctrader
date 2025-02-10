import * as XLSX from "xlsx";

export const getJsonDataFromExcel = async (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement> | File) => {
    let file: File | null = null;

    if (event instanceof File) {
        file = event;
    } else {
        const input = event.target as HTMLInputElement;
        file = input.files?.[0] || null;
    }

    if (!file) return;

    const reader = new FileReader();
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const fileLoadPromise = new Promise<any[]>((resolve, reject) => {
        reader.onload = (e) => {
            const binaryStr = e.target?.result;
            if (!binaryStr) {
                reject("Failed to read the file.");
                return;
            }
            try {
                /* eslint-disable  @typescript-eslint/no-explicit-any */
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
