console.log("✅ pptToPdf.js loaded");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>PPT to PDF</h2>
    <input type="file" id="pptFile" accept=".ppt,.pptx" />
    <button onclick="convertPptToPdf()">Convert</button>
    <p id="status">PPT to PDF conversion is not yet implemented.</p>
  `;
}

async function convertPptToPdf() {
  const file = document.getElementById('pptFile').files[0];
  const status = document.getElementById('status');
  if (!file) {
    alert("Please upload a PPT file");
    return;
  }

  try {
    if (!file.name.match(/\.(ppt|pptx)$/i)) {
      throw new Error("Please upload a valid PPT file (.ppt or .pptx).");
    }

    status.textContent = "PPT to PDF conversion is a placeholder. Implement using a server-side solution.";
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
    status.textContent = "Conversion failed.";
  }
}