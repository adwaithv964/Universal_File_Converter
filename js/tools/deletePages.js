console.log("✅ deletePages.js loaded");
console.log("📚 PDFLib available?", typeof PDFLib !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>Delete PDF Pages</h2>
    <div class="file-input-container">
      <input type="file" id="pdfFile" accept="application/pdf" onchange="toggleRemoveButton(this)" />
      <button class="remove-file-btn" onclick="clearFileInput('pdfFile')" style="display: none;">×</button>
    </div>
    <input type="text" id="pagesToDelete" placeholder="e.g., 2,4-6" />
    <button onclick="deletePages()">Delete Pages</button>
    <a id="downloadLink" style="display:none">Download Modified PDF</a>
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

async function deletePages() {
  const file = document.getElementById('pdfFile').files[0];
  const pagesInput = document.getElementById('pagesToDelete').value;
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
    const totalPages = pdfDoc.getPageCount();
    const pagesToDelete = [];

    pagesInput.split(',').forEach(range => {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        for (let i = start; i <= end; i++) pagesToDelete.push(i - 1);
      } else {
        pagesToDelete.push(Number(range) - 1);
      }
    });

    pagesToDelete.sort((a, b) => b - a);
    pagesToDelete.forEach(pageNum => {
      if (pageNum >= 0 && pageNum < totalPages) pdfDoc.removePage(pageNum);
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.getElementById('downloadLink');
    link.href = url;
    link.download = "modified.pdf";
    link.style.display = "block";
    status.textContent = "Deletion complete! Click the link to download.";
  } catch (error) {
    console.error("Error deleting pages:", error);
    alert("Failed to delete pages: " + error.message);
    status.textContent = "Deletion failed.";
  }
}