  document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggle = document.getElementById("sidebarToggle");
  
    // Load state from localStorage
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState === "true") {
      sidebar.classList.add("collapsed");
    }
  
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
  
      // Save new state
      const isCollapsed = sidebar.classList.contains("collapsed");
      localStorage.setItem("sidebarCollapsed", isCollapsed);
    });
  });
  