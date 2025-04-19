console.log("✅ summarizer.js loaded");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>AI PDF Summarizer</h2>
    <input type="file" id="pdfFile" accept="application/pdf" />
    <button onclick="summarizePDF()">Summarize</button>
    <p id="status">AI PDF Summarizer is not yet implemented.</p>
  `;
}

async function summarizePDF() {
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

    status.textContent = "AI PDF Summarizer is a placeholder. Implement using an AI backend to summarize PDF content.";
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
    status.textContent = "Operation failed.";
  }
}