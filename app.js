
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
const statusList = document.getElementById('statusList');
const toast = document.getElementById('toast');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

function logStatus(msg) {
  const li = document.createElement('li');
  li.textContent = msg;
  statusList?.appendChild(li);
  console.log('[Avanti]', msg);
}

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 2000);
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.hidden = false;
  logStatus('Install prompt captured.');
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    logStatus('User choice: ' + outcome);
    deferredPrompt = null;
    installBtn.hidden = true;
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./service-worker.js');
      logStatus('Service worker registered: ' + (reg.scope || ''));
      showToast('Ready for offline use');
    } catch (err) {
      logStatus('SW registration failed: ' + err);
    }
  });
} else {
  logStatus('Service workers not supported in this browser.');
}
