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
    <div class="file-input-container">
      <input type="file" id="jpgFiles" accept="image/jpeg" multiple onchange="toggleRemoveButton(this)" />
      <button class="remove-file-btn" onclick="clearFileInput('jpgFiles')" style="display: none;">×</button>
    </div>
    <button onclick="convertJpgToPdf()">Convert</button>
    <a id="downloadLink" style="display:none">Download PDF</a>
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

async function convertJpgToPdf() {
  const files = document.getElementById('jpgFiles').files;
  const status = document.getElementById('status');
  if (files.length === 0) {
    alert("Please upload at least one JPG");
    return;
  }

  try {
    status.textContent = "Processing...";
    const pdfDoc = await PDFLib.PDFDocument.create();

    for (let file of files) {
      if (!file.type.startsWith('image/jpeg')) {
        throw new Error(`File "${file.name}" is not a JPEG image. Please upload only JPEG files.`);
      }

      const imgData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsDataURL(file);
      });

      const base64String = imgData.replace(/^data:image\/jpeg;base64,/, '');
      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const img = await pdfDoc.embedJpg(bytes);
      const maxWidth = 595;
      const maxHeight = 842;
      let width = img.width;
      let height = img.height;
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