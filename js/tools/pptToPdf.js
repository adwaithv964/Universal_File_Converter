console.log("✅ pptToPdf.js loaded");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>PPT to PDF</h2>
    <div class="file-input-container">
      <input type="file" id="pptFile" accept=".ppt,.pptx" onchange="toggleRemoveButton(this)" />
      <button class="remove-file-btn" onclick="clearFileInput('pptFile')" style="display: none;">×</button>
    </div>
    <button onclick="convertPptToPdf()">Convert</button>
    <p id="status">PPT to PDF conversion is not yet implemented.</p>
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

async function convertPptToPdf() {
  const file = document.getElementById('pptFile').files[0];
  const status = document.getElementById('status');
  if (!file) {
    alert("Please upload a PPT file");
    return;
  }

  try {
    if (!file.name.match(/\.(ppt|pptx)$/i)) {
      throw new Error("Please upload a valid PPT file (.ppt or .pptx).");
    }

    status.textContent = "PPT to PDF conversion is a placeholder. Implement using a server-side solution.";
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
    status.textContent = "Conversion failed.";
  }
}