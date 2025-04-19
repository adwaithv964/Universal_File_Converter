console.log("✅ edit.js loaded");
console.log("📚 PDFLib available?", typeof PDFLib !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>Edit PDF</h2>
    <input type="file" id="pdfFile" accept="application/pdf" />
    <input type="text" id="textToAdd" placeholder="Text to add" />
    <button onclick="editPDF()">Add Text</button>
    <a id="downloadLink" style="display:none">Download Edited PDF</a>
    <p id="status"></p>
  `;
}

async function editPDF() {
  const file = document.getElementById('pdfFile').files[0];
  const text = document.getElementById('textToAdd').value;
  const status = document.getElementById('status');
  if (!file) {
    alert("Please upload a PDF");
    return;
  }
  if (!text) {
    alert("Please enter some text to add");
    return;
  }

  try {
    if (!file.type.startsWith('application/pdf')) {
      throw new Error("Please upload a valid PDF file.");
    }

    status.textContent = "Processing...";
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const firstPage = pdfDoc.getPage(0);
    const { height } = firstPage.getSize();

    firstPage.drawText(text, {
      x: 50,
      y: height - 50,
      size: 12,
      color: PDFLib.rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.getElementById('downloadLink');
    link.href = url;
    link.download = "edited.pdf";
    link.style.display = "block";
    status.textContent = "Edit complete! Click the link to download.";
  } catch (error) {
    console.error("Error editing PDF:", error);
    alert("Failed to edit PDF: " + error.message);
    status.textContent = "Edit failed.";
  }
}