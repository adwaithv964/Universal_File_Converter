console.log("✅ wordToPdf.js loaded");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>Word to PDF</h2>
    <input type="file" id="wordFile" accept=".doc,.docx" />
    <button onclick="convertWordToPdf()">Convert</button>
    <p id="status">Word to PDF conversion is not yet implemented.</p>
  `;
}

async function convertWordToPdf() {
  const file = document.getElementById('wordFile').files[0];
  const status = document.getElementById('status');
  if (!file) {
    alert("Please upload a Word document");
    return;
  }

  try {
    if (!file.name.match(/\.(doc|docx)$/i)) {
      throw new Error("Please upload a valid Word document (.doc or .docx).");
    }

    status.textContent = "Word to PDF conversion is a placeholder. Implement using a server-side solution or a library like docxtopdf.";
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
    status.textContent = "Conversion failed.";
  }
}