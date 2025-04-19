console.log("✅ merge.js loaded");
console.log("📚 PDFLib available?", typeof PDFLib !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>Merge PDFs</h2>
    <div class="file-input-container">
      <input type="file" id="pdfFiles" accept="application/pdf" multiple onchange="toggleRemoveButton(this)" />
      <button class="remove-file-btn" onclick="clearFileInput('pdfFiles')" style="display: none;">×</button>
    </div>
    <button onclick="mergePDFs()">Merge</button>
    <a id="downloadLink" style="display:none">Download Merged PDF</a>
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

async function mergePDFs() {
  const files = document.getElementById('pdfFiles').files;
  const status = document.getElementById('status');
  if (files.length < 2) {
    alert("Please upload at least two PDFs");
    return;
  }

  try {
    status.textContent = "Processing...";
    const mergedPdf = await PDFLib.PDFDocument.create();

    for (let file of files) {
      if (!file.type.startsWith('application/pdf')) {
        throw new Error(`File "${file.name}" is not a PDF. Please upload only PDF files.`);
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
      status.textContent = `Processed ${file.name}`;
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.getElementById('downloadLink');
    link.href = url;
    link.download = "merged.pdf";
    link.style.display = "block";
    status.textContent = "Merge complete! Click the link to download.";
  } catch (error) {
    console.error("Error merging PDFs:", error);
    alert("Failed to merge PDFs: " + error.message);
    status.textContent = "Merge failed.";
  }
}