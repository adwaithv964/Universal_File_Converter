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
    <div class="file-input-container">
      <input type="file" id="pdfFile" accept="application/pdf" onchange="toggleRemoveButton(this)" />
      <button class="remove-file-btn" onclick="clearFileInput('pdfFile')" style="display: none;">×</button>
    </div>
    <button onclick="performOCR()">Perform OCR</button>
    <p id="status"></p>
    <pre id="ocrResult"></pre>
  `;
}

function clearFileInput(inputId) {
  const input = document.getElementById(inputId);
  input.value = '';
  const removeBtn = input.nextElementSibling;
  removeBtn.style.display = 'none';
}

function toggleRemoveButton(input) {
  const removeBtn = input.nextElementSibling;
  removeBtn.style.display = input.files.length > 0 ? 'flex' : 'none';
}

async function performOCR() {
  const file = document.getElementById('pdfFile').files[0];
  const status = document.getElementById('status');
  const ocrResult = document.getElementById('ocrResult');
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

    const imgData = canvas.toDataURL('image/png');
    const { data: { text } } = await Tesseract.recognize(imgData, 'eng');
    
    ocrResult.textContent = text;
    status.textContent = "OCR complete!";
  } catch (error) {
    console.error("Error performing OCR:", error);
    alert("Failed to perform OCR: " + error.message);
    status.textContent = "OCR failed.";
  }
}