console.log("✅ pdfAnnotator.js loaded");
console.log("📚 PDFLib available?", typeof PDFLib !== "undefined");
console.log("📚 fabric.js available?", typeof fabric !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>PDF Annotator</h2>
    <div class="file-input-container">
      <input type="file" id="pdfFile" accept="application/pdf" onchange="toggleRemoveButton(this)" />
      <button class="remove-file-btn" onclick="clearFileInput('pdfFile')" style="display: none;">×</button>
    </div>
    <canvas id="annotationCanvas" style="border: 1px solid #ccc; width: 400px; height: 200px;"></canvas>
    <button onclick="annotatePDF()">Annotate and Download</button>
    <a id="downloadLink" style="display:none">Download Annotated PDF</a>
    <p id="status"></p>
  `;

  const canvas = new fabric.Canvas('annotationCanvas');
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.width = 2;
  canvas.freeDrawingBrush.color = '#ff0000';
  window.annotationCanvas = canvas;
}

function clearFileInput(inputId) {
  const input = document.getElementById(inputId);
  input.value = '';
  const removeBtn = input.nextElementSibling;
  removeBtn.style.display = 'none';
}

function toggleRemoveButton(input) {
  const removeBtn = input.nextElementSibling;
  removeBtn.style.display = input.files.length > 0 ? 'flex' : 'none';
}

async function annotatePDF() {
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

    const canvas = window.annotationCanvas;
    if (canvas.isEmpty()) {
      throw new Error("Please draw an annotation");
    }

    status.textContent = "Processing...";
    const annotationDataUrl = canvas.toDataURL('image/png');
    const base64String = annotationDataUrl.replace(/^data:image\/png;base64,/, '');
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const firstPage = pdfDoc.getPage(0);
    const { width, height } = firstPage.getSize();

    const annotationImage = await pdfDoc.embedPng(bytes);
    firstPage.drawImage(annotationImage, {
      x: width - 150,
      y: 50,
      width: 100,
      height: 50,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.getElementById('downloadLink');
    link.href = url;
    link.download = "annotated.pdf";
    link.style.display = "block";
    status.textContent = "Annotation complete! Click the link to download.";
  } catch (error) {
    console.error("Error annotating PDF:", error);
    alert("Failed to annotate PDF: " + error.message);
    status.textContent = "Annotation failed.";
  }
}