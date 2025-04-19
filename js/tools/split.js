console.log("✅ split.js loaded");
console.log("📚 PDFLib available?", typeof PDFLib !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>Split PDF</h2>
    <input type="file" id="pdfFile" accept="application/pdf" />
    <button onclick="splitPDF()">Split</button>
    <div id="splitLinks"></div>
    <p id="status"></p>
  `;
}

async function splitPDF() {
  const file = document.getElementById('pdfFile').files[0];
  const splitLinks = document.getElementById('splitLinks');
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
    const numPages = pdfDoc.getPageCount();

    splitLinks.innerHTML = '';
    for (let i = 0; i < numPages; i++) {
      const newPdf = await PDFLib.PDFDocument.create();
      const [page] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(page);

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `page-${i + 1}.pdf`;
      link.textContent = `Download Page ${i + 1}`;
      link.style.display = 'block';
      link.style.margin = '5px 0';
      splitLinks.appendChild(link);
    }

    status.textContent = "Split complete! Click the links to download.";
  } catch (error) {
    console.error("Error splitting PDF:", error);
    alert("Failed to split PDF: " + error.message);
    status.textContent = "Split failed.";
  }
}