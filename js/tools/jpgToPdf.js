console.log("✅ jpgToPdf.js loaded");
console.log("📚 PDFLib available?", typeof PDFLib !== "undefined");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>JPG to PDF</h2>
    <input type="file" id="jpgFiles" accept="image/jpeg" multiple />
    <button onclick="convertJpgToPdf()">Convert</button>
    <a id="downloadLink" style="display:none">Download PDF</a>
    <p id="status"></p>
  `;
}

async function convertJpgToPdf() {
  const files = document.getElementById('jpgFiles').files;
  const status = document.getElementById('status');
  if (files.length === 0) {
    alert("Please upload at least one JPG");
    return;
  }

  try {
    const pdfDoc = await PDFLib.PDFDocument.create();

    for (let file of files) {
      // Validate file type
      if (!file.type.startsWith('image/jpeg')) {
        throw new Error(`File "${file.name}" is not a JPEG image. Please upload only JPEG files.`);
      }

      // Read the file as a data URL
      const imgData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsDataURL(file);
      });

      // Strip the data URL prefix and decode base64
      const base64String = imgData.replace(/^data:image\/jpeg;base64,/, '');
      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Embed the JPEG data
      const img = await pdfDoc.embedJpg(bytes);

      // Optionally downscale the image to reduce PDF size
      const maxWidth = 595; // A4 width at 72 DPI
      const maxHeight = 842; // A4 height at 72 DPI
      let width = img.width;
      let height = img.height;

      // Downscale if the image exceeds A4 dimensions
      const scale = Math.min(maxWidth / width, maxHeight / height, 1);
      width = width * scale;
      height = height * scale;

      const page = pdfDoc.addPage([width, height]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });

      status.textContent = `Processed ${file.name}`;
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.getElementById('downloadLink');
    link.href = url;
    link.download = "converted.pdf";
    link.style.display = "block";
    status.textContent = "Conversion complete! Click the link to download.";
  } catch (error) {
    console.error("Error converting JPG to PDF:", error);
    alert("Failed to convert JPG to PDF: " + error.message);
    status.textContent = "Conversion failed.";
  }
}