console.log("✅ compress.js loaded");
console.log("📚 PDFLib available?", typeof PDFLib !== "undefined");
console.log("📚 pdf.js available?", typeof pdfjsLib !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>Compress PDF</h2>
    <div class="file-input-container">
      <input type="file" id="pdfFile" accept="application/pdf" onchange="toggleRemoveButton(this)" />
      <button class="remove-file-btn" onclick="clearFileInput('pdfFile')" style="display: none;">×</button>
    </div>
    <button onclick="compressPDF()">Compress</button>
    <a id="downloadLink" style="display:none">Download Compressed PDF</a>
    <p id="sizeInfo"></p>
    <p id="status"></p>
  `;
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

async function compressPDF() {
  const file = document.getElementById('pdfFile').files[0];
  const sizeInfo = document.getElementById('sizeInfo');
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
    const originalSize = (file.size / (1024 * 1024)).toFixed(2);
    sizeInfo.textContent = `Original size: ${originalSize} MB`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const newPdfDoc = await PDFLib.PDFDocument.create();

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;

      const downscaledCanvas = document.createElement('canvas');
      const downscaledContext = downscaledCanvas.getContext('2d');
      downscaledCanvas.width = canvas.width * 0.5;
      downscaledCanvas.height = canvas.height * 0.5;
      downscaledContext.drawImage(canvas, 0, 0, downscaledCanvas.width, downscaledCanvas.height);

      const imgData = downscaledCanvas.toDataURL('image/jpeg', 0.5);
      const img = await newPdfDoc.embedJpg(imgData.replace(/^data:image\/jpeg;base64,/, ''));

      const newPage = newPdfDoc.addPage([downscaledCanvas.width, downscaledCanvas.height]);
      newPage.drawImage(img, {
        x: 0,
        y: 0,
        width: downscaledCanvas.width,
        height: downscaledCanvas.height,
      });
    }

    const compressedPdfBytes = await newPdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([compressedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const compressedSize = (blob.size / (1024 * 1024)).toFixed(2);
    sizeInfo.textContent += ` | Compressed size: ${compressedSize} MB`;

    const link = document.getElementById('downloadLink');
    link.href = url;
    link.download = "compressed.pdf";
    link.style.display = "block";
    status.textContent = "Compression complete! Click the link to download.";
  } catch (error) {
    console.error("Error compressing PDF:", error);
    alert("Failed to compress PDF: " + error.message);
    status.textContent = "Compression failed.";
  }
}