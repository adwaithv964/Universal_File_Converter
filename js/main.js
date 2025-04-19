function loadTool(toolName) {
    const toolContainer = document.getElementById("tool-container");
    if (!toolContainer) {
      console.error("tool-container element not found");
      return;
    }
  
    // Clear the tool container and show a loading message
    toolContainer.innerHTML = `<p>🔄 Loading ${toolName}.js...</p>`;
  
    // Remove any previously loaded tool script
    const existingScript = document.getElementById("toolScript");
    if (existingScript) existingScript.remove();
  
    // Dynamically load the selected tool script
    const script = document.createElement("script");
    script.src = `js/tools/${toolName}.js`;
    script.id = "toolScript";
    script.onload = () => {
      // After the script is loaded, call its initialize function if it exists
      if (typeof initializeTool === "function") {
        initializeTool();
      } else {
        console.error(`Tool ${toolName} did not define an initializeTool function`);
        toolContainer.innerHTML = `<p>Error: Tool ${toolName} failed to initialize.</p>`;
      }
    };
    script.onerror = () => {
      toolContainer.innerHTML = `<p>Error: Failed to load ${toolName}.js.</p>`;
    };
    document.body.appendChild(script);
  }