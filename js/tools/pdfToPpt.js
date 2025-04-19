console.log("✅ pdfToPpt.js loaded");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>PDF to PPT</h2>
    <input type="file" id="pdfFile" accept="application/pdf" />
    <button onclick="convertPDFToPpt()">Convert</button>
    <p id="status">PDF to PPT conversion is not yet implemented.</p>
  `;
}

async function convertPDFToPpt() {
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

    status.textContent = "PDF to PPT conversion is a placeholder. Implement using a library like jsPPTX to create PPT slides from PDF content.";
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
    status.textContent = "Conversion failed.";
  }
}