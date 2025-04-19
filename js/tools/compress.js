console.log("✅ compress.js loaded");
console.log("📚 PDFLib available?", typeof PDFLib !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>Compress PDF</h2>
    <input type="file" id="pdfFile" accept="application/pdf" />
    <button onclick="compressPDF()">Compress</button>
    <a id="downloadLink" style="display:none">Download Compressed PDF</a>
    <p id="sizeInfo"></p>
  `;
}

async function compressPDF() {
  const file = document.getElementById('pdfFile').files[0];
  const sizeInfo = document.getElementById('sizeInfo');
  if (!file) {
    alert("Please upload a PDF");
    return;
  }

  try {
    // Log original file size
    const originalSize = (file.size / (1024 * 1024)).toFixed(2); // Size in MB
    sizeInfo.textContent = `Original size: ${originalSize} MB`;

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

    // Remove metadata to reduce size
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');

    // Attempt to optimize by enabling object streams and removing duplicates
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true, // Enable object streams for potential size reduction
      updateFieldAppearances: false, // Disable field appearance updates
    });

    const blob = new Blob([compressedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Log compressed file size
    const compressedSize = (blob.size / (1024 * 1024)).toFixed(2); // Size in MB
    sizeInfo.textContent += ` | Compressed size: ${compressedSize} MB`;

    const link = document.getElementById('downloadLink');
    link.href = url;
    link.download = "compressed.pdf";
    link.style.display = "block";
  } catch (error) {
    console.error("Error compressing PDF:", error);
    alert("Failed to compress PDF: " + error.message);
    sizeInfo.textContent = "Compression failed.";
  }
}