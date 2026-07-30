const fs = require('fs');
const pdf = require('pdf-parse');

async function extractPdfText(pdfPath, outputPath) {
  try {
    let dataBuffer = fs.readFileSync(pdfPath);
    let data = await pdf(dataBuffer);
    fs.writeFileSync(outputPath, data.text);
    console.log(`Successfully extracted text to ${outputPath}`);
  } catch (err) {
    console.error('Error extracting PDF:', err);
  }
}

extractPdfText('./dist/LessonPDF/Lesson_08.pdf', './lessonMD/lesson_08.txt');
