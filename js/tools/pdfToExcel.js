console.log("✅ pdfToExcel.js loaded");
console.log("📚 pdf.js available?", typeof pdfjsLib !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>PDF to Excel</h2>
    <div class="file-input-container">
      <input type="file" id="pdfFile" accept="application/pdf" onchange="toggleRemoveButton(this)" />
      <button class="remove-file-btn" onclick="clearFileInput('pdfFile')" style="display: none;">×</button>
    </div>
    <button onclick="convertPDFToExcel()">Convert</button>
    <a id="downloadLink" style="display:none">Download Excel (CSV)</a>
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

async function convertPDFToExcel() {
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
    let csvContent = "data:text/csv;charset=utf-8,";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map(item => item.str).join(",");
      csvContent += text + "\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.getElementById('downloadLink');
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "converted.csv");
    link.style.display = "block";
    status.textContent = "Conversion complete! Click the link to download.";
  } catch (error) {
    console.error("Error converting PDF to Excel:", error);
    alert("Failed to convert PDF to Excel: " + error.message);
    status.textContent = "Conversion failed.";
  }
}