console.log("✅ excelToPdf.js loaded");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>Excel to PDF</h2>
    <div class="file-input-container">
      <input type="file" id="excelFile" accept=".xls,.xlsx" onchange="toggleRemoveButton(this)" />
      <button class="remove-file-btn" onclick="clearFileInput('excelFile')" style="display: none;">×</button>
    </div>
    <button onclick="convertExcelToPdf()">Convert</button>
    <p id="status">Excel to PDF conversion is not yet implemented.</p>
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

async function convertExcelToPdf() {
  const file = document.getElementById('excelFile').files[0];
  const status = document.getElementById('status');
  if (!file) {
    alert("Please upload an Excel file");
    return;
  }

  try {
    if (!file.name.match(/\.(xls|xlsx)$/i)) {
      throw new Error("Please upload a valid Excel file (.xls or .xlsx).");
    }

    status.textContent = "Excel to PDF conversion is a placeholder. Implement using a server-side solution or a library like xlsx to parse Excel and PDFLib to create PDF.";
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
    status.textContent = "Conversion failed.";
  }
}