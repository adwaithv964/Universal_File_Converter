console.log("✅ unlock.js loaded");
console.log("📚 PDFLib available?", typeof PDFLib !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>Unlock PDF</h2>
    <input type="file" id="pdfFile" accept="application/pdf" />
    <input type="password" id="password" placeholder="Enter PDF password" />
    <button onclick="unlockPDF()">Unlock</button>
    <a id="downloadLink" style="display:none">Download Unlocked PDF</a>
    <p id="status"></p>
  `;
}

async function unlockPDF() {
  const file = document.getElementById('pdfFile').files[0];
  const password = document.getElementById('password').value;
  const status = document.getElementById('status');
  if (!file) {
    alert("Please upload a PDF");
    return;
  }
  if (!password) {
    alert("Please enter the PDF password");
    return;
  }

  try {
    if (!file.type.startsWith('application/pdf')) {
      throw new Error("Please upload a valid PDF file.");
    }

    status.textContent = "Processing...";
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer, { password });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.getElementById('downloadLink');
    link.href = url;
    link.download = "unlocked.pdf";
    link.style.display = "block";
    status.textContent = "Unlock complete! Click the link to download.";
  } catch (error) {
    console.error("Error unlocking PDF:", error);
    alert("Failed to unlock PDF: " + error.message);
    status.textContent = "Unlock failed.";
  }
}