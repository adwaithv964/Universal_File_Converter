console.log("✅ pdfToJpg.js loaded");
console.log("📚 pdf.js available?", typeof pdfjsLib !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>PDF to JPG</h2>
    <input type="file" id="pdfFile" accept="application/pdf" />
    <button onclick="convertPDFToJpg()">Convert</button>
    <div id="jpgLinks"></div>
    <p id="status"></p>
  `;
}

async function convertPDFToJpg() {
  const file = document.getElementById('pdfFile').files[0];
  const jpgLinks = document.getElementById('jpgLinks');
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
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    jpgLinks.innerHTML = '';
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

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `page-${i}.jpg`;
      link.textContent = `Download Page ${i} as JPG`;
      link.style.display = 'block';
      link.style.margin = '5px 0';
      jpgLinks.appendChild(link);
    }

    status.textContent = "Conversion complete! Click the links to download.";
  } catch (error) {
    console.error("Error converting PDF to JPG:", error);
    alert("Failed to convert PDF to JPG: " + error.message);
    status.textContent = "Conversion failed.";
  }
}