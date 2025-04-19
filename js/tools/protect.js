console.log("✅ protect.js loaded");
console.log("📚 PDFLib available?", typeof PDFLib !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>Protect PDF</h2>
    <input type="file" id="pdfFile" accept="application/pdf" />
    <input type="password" id="password" placeholder="Password (not applied, see note)" />
    <button onclick="protectPDF()">Protect</button>
    <a id="downloadLink" style="display:none">Download Protected PDF</a>
    <p id="status">Note: Password protection is not supported in this client-side app. Instead, this tool restricts actions like printing and copying. For true password protection, a server-side solution is required (e.g., using qpdf or Ghostscript).</p>
  `;
}

async function protectPDF() {
  const file = document.getElementById('pdfFile').files[0];
  const password = document.getElementById('password').value;
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

    // Set permissions to restrict actions (no password)
    pdfDoc.setPermissions({
      printing: 'none',       // Disable printing
      modifying: false,       // Disable modifying
      copying: false,         // Disable copying text or images
      annotating: false,      // Disable adding annotations
      fillingForms: false,    // Disable filling forms
      contentAccessibility: false, // Disable content extraction for accessibility
      assembling: false,      // Disable assembling (e.g., merging with other PDFs)
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.getElementById('downloadLink');
    link.href = url;
    link.download = "protected.pdf";
    link.style.display = "block";
    status.textContent = "Protection applied (restrictions on printing, copying, etc.). Click the link to download. Note: This does not include password protection.";
  } catch (error) {
    console.error("Error protecting PDF:", error);
    alert("Failed to protect PDF: " + error.message);
    status.textContent = "Protection failed.";
  }
}