console.log("✅ wordToPdf.js loaded");

function initializeTool() {
  const toolContainer = document.getElementById('tool-container');
  if (!toolContainer) {
    console.error("tool-container element not found");
    return;
  }

  toolContainer.innerHTML = `
    <h2>Word to PDF</h2>
    <div class="file-input-container">
      <input type="file" id="wordFile" accept=".doc,.docx" onchange="toggleRemoveButton(this)" />
      <button class="remove-file-btn" onclick="clearFileInput('wordFile')" style="display: none;">×</button>
    </div>
    <button onclick="convertWordToPdf()">Convert</button>
    <p id="status">Word to PDF conversion is not yet implemented.</p>
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

async function convertWordToPdf() {
  const file = document.getElementById('wordFile').files[0];
  const status = document.getElementById('status');
  if (!file) {
    alert("Please upload a Word document");
    return;
  }

  try {
    if (!file.name.match(/\.(doc|docx)$/i)) {
      throw new Error("Please upload a valid Word document (.doc or .docx).");
    }

    status.textContent = "Word to PDF conversion is a placeholder. Implement using a server-side solution or a library like docxtopdf.";
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
    status.textContent = "Conversion failed.";
  }
}