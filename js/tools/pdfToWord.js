console.log("✅ pdfToWord.js loaded");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>PDF to Word</h2>
    <input type="file" id="pdfFile" accept="application/pdf" />
    <button onclick="convertPDFToWord()">Convert</button>
    <p id="status">PDF to Word conversion is not yet implemented.</p>
  `;
}

async function convertPDFToWord() {
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

    status.textContent = "PDF to Word conversion is a placeholder. Implement using a server-side solution or a library like pdf2docx.";
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
    status.textContent = "Conversion failed.";
  }
}