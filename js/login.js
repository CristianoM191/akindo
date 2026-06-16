/* ============================================
   AKINDO — Login (Firebase SDK Modular v12)
   ============================================ */

import { auth } from "../firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const tabLogin   = document.querySelector("#tab-login");
  const tabSignup  = document.querySelector("#tab-signup");
  const formLogin  = document.querySelector("#form-login");
  const formSignup = document.querySelector("#form-signup");
  const message    = document.querySelector("#form-message");
  const googleBtn  = document.querySelector("#google-login");

  /* -------- Abas -------- */
  function setTab(tab) {
    const isLogin = tab === "login";
    tabLogin .classList.toggle("is-active",  isLogin);
    tabSignup.classList.toggle("is-active", !isLogin);
    formLogin .hidden =  !isLogin;
    formSignup.hidden =   isLogin;
    hideMessage();
  }
  tabLogin ?.addEventListener("click", () => setTab("login"));
  tabSignup?.addEventListener("click", () => setTab("signup"));

  /* -------- Mensagens -------- */
  function showMessage(text, type = "error") {
    message.textContent = text;
    message.className   = `form-message is-visible is-${type}`;
  }
  function hideMessage() {
    message.className = "form-message";
  }

  /* -------- Tradução de erros Firebase -------- */
  function translateError(code) {
    const map = {
      "auth/invalid-email":          "E-mail inválido.",
      "auth/user-not-found":         "Nenhuma conta encontrada com este e-mail.",
      "auth/wrong-password":         "Senha incorreta.",
      "auth/invalid-credential":     "E-mail ou senha incorretos.",
      "auth/email-already-in-use":   "Este e-mail já está cadastrado.",
      "auth/weak-password":          "A senha precisa ter pelo menos 6 caracteres.",
      "auth/missing-password":       "Digite sua senha.",
      "auth/network-request-failed": "Sem conexão. Verifique sua internet.",
      "auth/popup-closed-by-user":   "Login com Google cancelado.",
      "auth/popup-blocked":          "Popup bloqueado pelo navegador. Permita popups para este site.",
      "auth/unauthorized-domain":    "Domínio não autorizado no Firebase. Veja o guia FIREBASE-SETUP.html.",
      "auth/configuration-not-found":"Configuração inválida. Verifique firebase-config.js.",
      "auth/too-many-requests":      "Muitas tentativas. Aguarde alguns minutos.",
    };
    return map[code] ?? "Não foi possível concluir. Tente novamente.";
  }

  /* -------- Loading -------- */
  function setLoading(form, on) {
    const btn = form.querySelector("button[type='submit']");
    if (!btn) return;
    btn.dataset.loading = on ? "true" : "false";
    btn.disabled = on;
  }

  /* -------- Redirecionamento pós-login -------- */
  function redirectAfterLogin() {
    const dest = sessionStorage.getItem("akindo_redirect") || "homepage.html";
    sessionStorage.removeItem("akindo_redirect");
    window.location.href = dest;
  }

  /* -------- Login por e-mail/senha -------- */
  formLogin?.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideMessage();

    const email    = formLogin.querySelector("#login-email").value.trim();
    const password = formLogin.querySelector("#login-password").value;

    if (!email || !password) { showMessage("Preencha e-mail e senha."); return; }

    setLoading(formLogin, true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showMessage("Login realizado com sucesso.", "success");
      setTimeout(redirectAfterLogin, 600);
    } catch (err) {
      showMessage(translateError(err.code));
    } finally {
      setLoading(formLogin, false);
    }
  });

  /* -------- Cadastro por e-mail/senha -------- */
  formSignup?.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideMessage();

    const name     = formSignup.querySelector("#signup-name").value.trim();
    const email    = formSignup.querySelector("#signup-email").value.trim();
    const password = formSignup.querySelector("#signup-password").value;

    if (!name || !email || !password) { showMessage("Preencha todos os campos."); return; }
    if (password.length < 6)          { showMessage("A senha precisa ter pelo menos 6 caracteres."); return; }

    setLoading(formSignup, true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      showMessage("Conta criada com sucesso!", "success");
      setTimeout(redirectAfterLogin, 600);
    } catch (err) {
      showMessage(translateError(err.code));
    } finally {
      setLoading(formSignup, false);
    }
  });

  /* -------- Login com Google -------- */
  googleBtn?.addEventListener("click", async () => {
    hideMessage();

    if (window.location.protocol === "file:") {
      showMessage(
        "Login com Google não funciona ao abrir via file://. " +
        "Use o Live Server do VS Code ou acesse pelo GitHub Pages."
      );
      return;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      await signInWithPopup(auth, provider);
      showMessage("Login com Google realizado.", "success");
      setTimeout(redirectAfterLogin, 600);
    } catch (err) {
      showMessage(translateError(err.code));
    }
  });

  /* -------- Se já logado, redireciona -------- */
  onAuthStateChanged(auth, (user) => {
    if (user) redirectAfterLogin();
  });
});

window.addEventListener("load", () => {
    document
        .getElementById("page-loader")
        ?.classList.add("hidden");
});