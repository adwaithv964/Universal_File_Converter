console.log("✅ ocr.js loaded");
console.log("📚 pdf.js available?", typeof pdfjsLib !== "undefined");
console.log("📚 Tesseract available?", typeof Tesseract !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>PDF OCR</h2>
    <input type="file" id="pdfFile" accept="application/pdf" />
    <button onclick="performOCR()">Perform OCR</button>
    <div id="ocrOutput"></div>
    <p id="status"></p>
  `;
}

async function performOCR() {
  const file = document.getElementById('pdfFile').files[0];
  const ocrOutput = document.getElementById('ocrOutput');
  const status = document.getElementById('status');
  if (!file) {
    alert("Please upload a PDF");
    return;
  }

  try {
    if (!file.type.startsWith('application/pdf')) {
      throw new Error("Please upload a valid PDF file.");
    }

    status.textContent = "Processing...";
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.0 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;

    const { data: { text } } = await Tesseract.recognize(canvas, 'eng');
    ocrOutput.textContent = text;
    status.textContent = "OCR complete!";
  } catch (error) {
    console.error("Error performing OCR:", error);
    alert("Failed to perform OCR: " + error.message);
    status.textContent = "OCR failed.";
  }
}