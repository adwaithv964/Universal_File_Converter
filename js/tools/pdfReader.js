console.log("✅ pdfReader.js loaded");
console.log("📚 pdf.js available?", typeof pdfjsLib !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>PDF Reader</h2>
    <div class="file-input-container">
      <input type="file" id="pdfFile" accept="application/pdf" onchange="toggleRemoveButton(this)" />
      <button class="remove-file-btn" onclick="clearFileInput('pdfFile')" style="display: none;">×</button>
    </div>
    <button onclick="readPDF()">Render PDF</button>
    <canvas id="pdfCanvas"></canvas>
    <p id="status"></p>
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

async function readPDF() {
  const file = document.getElementById('pdfFile').files[0];
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
    const canvas = document.getElementById('pdfCanvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const context = canvas.getContext('2d');
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;

    status.textContent = "PDF rendered successfully.";
  } catch (error) {
    console.error("Error rendering PDF:", error);
    alert("Failed to render PDF: " + error.message);
    status.textContent = "Render failed.";
  }
}