console.log("✅ rotate.js loaded");
console.log("📚 PDFLib available?", typeof PDFLib !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>Rotate PDF</h2>
    <input type="file" id="pdfFile" accept="application/pdf" />
    <select id="rotationAngle">
      <option value="90">90°</option>
      <option value="180">180°</option>
      <option value="270">270°</option>
    </select>
    <button onclick="rotatePDF()">Rotate</button>
    <a id="downloadLink" style="display:none">Download Rotated PDF</a>
    <p id="status"></p>
  `;
}

async function rotatePDF() {
  const file = document.getElementById('pdfFile').files[0];
  const angle = parseInt(document.getElementById('rotationAngle').value);
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
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    pages.forEach(page => page.setRotation(page.getRotation().angle + angle));

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.getElementById('downloadLink');
    link.href = url;
    link.download = "rotated.pdf";
    link.style.display = "block";
    status.textContent = "Rotation complete! Click the link to download.";
  } catch (error) {
    console.error("Error rotating PDF:", error);
    alert("Failed to rotate PDF: " + error.message);
    status.textContent = "Rotation failed.";
  }
}