document.getElementById("year").textContent = new Date().getFullYear();
// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Add a little interactivity: show a welcome toast on first visit
(function () {
  if (!localStorage.getItem("asius_welcome_shown")) {
    const toast = document.createElement("div");
    toast.textContent = "👋 Welcome to asius.in! Explore secure user & todo management.";
    toast.style.position = "fixed";
    toast.style.bottom = "32px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#1a73e8";
    toast.style.color = "#fff";
    toast.style.padding = "14px 28px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 2px 12px rgba(0,0,0,0.13)";
    toast.style.fontSize = "1.08em";
    toast.style.zIndex = "9999";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s";
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "1";
    }, 200);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, 3500);

    localStorage.setItem("asius_welcome_shown", "1");
  }
})();

// Add keyboard shortcut: Press "?" to show features
document.addEventListener("keydown", function (e) {
  if ((e.key === "?" || e.key === "/") && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    const features = [
      "✅ Secure Authentication: JWT & refresh tokens",
      "🔐 Role-based Access: User & Admin support",
      "📝 Todo Management: Create, update, and track your tasks",
      "💻 Modern Stack: Node.js, Express, MongoDB",
      "🔒 Robust Security: Helmet, rate limiting, CORS, and more",
      "🚀 Fast & Responsive: Clean UI, mobile-friendly"
    ];
    alert("asius.in Features:\n\n" + features.join("\n"));
  }
});
