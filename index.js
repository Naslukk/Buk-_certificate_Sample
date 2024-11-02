import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path'

async function modify(name) {
    try {

        // Load an existing PDF file
        const existingPdfBytes = fs.readFileSync('certificateSample.pdf');
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Get the first page
        const pages = pdfDoc.getPages();
        const page = pages[0];


        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontSize = 40;                     // Font size
        const fixedY = 300;                      // Fixed Y-position for the name
        const maxWidth = 400;                    // Maximum width for the name

        // Calculate the width of the name in the specified font and size
        const textWidth = font.widthOfTextAtSize(name, fontSize);

        // If the text width exceeds the maxWidth, scale down the font size
        let adjustedFontSize = fontSize;
        if (textWidth > maxWidth) {
            adjustedFontSize = (maxWidth / textWidth) * fontSize;  // Scale down the font size proportionally
        }

        // Recalculate the text width with the adjusted font size
        const adjustedTextWidth = font.widthOfTextAtSize(name, adjustedFontSize);

        // Calculate the center X-position by subtracting half of the text width from half of the page width
        const centeredX = (page.getWidth() - adjustedTextWidth) / 2;


        page.drawText(name, {
            x: centeredX,
            y: fixedY,
            size: adjustedFontSize,
            font: font,
            color: rgb(1, 0, 0)
        });

        // Save the modified PDF to a file
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(`./output/${name}.pdf`, pdfBytes);
        console.log(`${name} saved`);
    } catch (error) {
        console.log(error);
    }
}

const datas = JSON.parse(fs.readFileSync('names.json', 'utf-8'));
datas.forEach(data => {
    modify(data.name);

});