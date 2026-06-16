/* ============================================
   AKINDO — Auth Guard (SDK Modular v12)
   Atualiza UI do header com estado do usuário
   e protege páginas que exigem login
   ============================================ */

import { auth } from "../firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

/* Atualiza o ícone de conta no header */
onAuthStateChanged(auth, (user) => {
  const accountLink = document.querySelector("a[href='login.html'], a[href='../html/login.html']");
  if (!accountLink) return;

  if (user) {
    // Usuário logado: mostra inicial do nome e opção de sair
    const initial = (user.displayName || user.email || "U")[0].toUpperCase();
    accountLink.setAttribute("aria-label", `Conta de ${user.displayName || user.email}`);
    accountLink.innerHTML = `
      <span style="
        width:28px; height:28px; border-radius:50%;
        background:var(--navy-900); color:var(--off-white);
        display:flex; align-items:center; justify-content:center;
        font-size:12px; font-weight:700; font-family:var(--font-body);
      ">${initial}</span>
    `;
    accountLink.href = "#";
    accountLink.addEventListener("click", async (e) => {
      e.preventDefault();
      if (confirm(`Sair da conta de ${user.displayName || user.email}?`)) {
        await signOut(auth);
        window.location.href = "login.html";
      }
    });
  }
});

/* Redireciona para login se página exige autenticação */
export function requireAuth() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      sessionStorage.setItem("akindo_redirect", window.location.pathname.split("/").pop());
      window.location.href = "login.html";
    }
  });
}
