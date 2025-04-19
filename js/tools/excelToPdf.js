console.log("✅ excelToPdf.js loaded");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>Excel to PDF</h2>
    <input type="file" id="excelFile" accept=".xls,.xlsx" />
    <button onclick="convertExcelToPdf()">Convert</button>
    <p id="status">Excel to PDF conversion is not yet implemented.</p>
  `;
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