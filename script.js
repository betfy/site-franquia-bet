document.addEventListener("DOMContentLoaded", function () {
  const couponCode = "GANHA25";
  const minimumDeposit = 2;

  // Verifica se está no mobile e na página inicial
  if (window.innerWidth <= 768 && document.querySelector("main.container") && !document.querySelector("#page-wrapper")) {
    console.log("Script iniciado na página inicial e no mobile.");

    function createButton() {
      console.log("Criando botão 'Resgatar Bônus'.");
      let button = document.createElement("button");
      button.innerHTML = "<b>Resgatar Bônus</b>";
      button.classList.add("col-6", "btn", "btn-primary");
      button.style.position = "absolute";
      button.style.bottom = "20px";
      button.style.left = "50%";
      button.style.transform = "translateX(-50%)";
      document.querySelector(".modal-content").appendChild(button);

      button.addEventListener("click", function () {
        console.log("Botão 'Resgatar Bônus' clicado.");
        let closeButton = document.querySelector(".modal-content a");
        if (closeButton) {
          closeButton.click();
          setTimeout(function () {
            let depositButton = document.querySelector(".NavBar_DepositButton__229mf");
            if (depositButton) {
              console.log("Botão de depósito encontrado e clicado.");
              depositButton.click();
              observeDepositForm();
            }
          }, 300);
        }
      });
    }

    function observeDepositForm() {
      const observerDepositForm = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          const depositButton = document.querySelector(".d-block.mt-2 .btn-primary.btn-block");
          if (depositButton && !document.querySelector(".d-block.mt-2 .btn-primary.btn-block.clone")) {
            console.log("Botão de depósito encontrado no formulário.");
            observerDepositForm.disconnect();
            replaceDepositButton(depositButton);
          }
        });
      });
      observerDepositForm.observe(document.body, { childList: true, subtree: true });
    }

    function replaceDepositButton(originalButton) {
      const clonedButton = document.createElement("span");
      clonedButton.innerHTML = originalButton.innerHTML;
      clonedButton.className = originalButton.className + " clone";
      originalButton.classList.add("d-none");
      originalButton.parentNode.insertBefore(clonedButton, originalButton.nextSibling);

      clonedButton.addEventListener("click", function () {
        const couponCheckbox = document.querySelector("#cupom");
        const depositInput = document.querySelector(".input-group input[placeholder='Informe o valor']");
        const depositValue = parseFloat(depositInput.value);
        let couponInput = document.querySelector(".d-block.mt-2 .form-control");

        if (depositValue < minimumDeposit) {
          console.log("Valor de depósito menor que o mínimo, clicando no botão original.");
          originalButton.click();
        } else if (depositInput.value && (!couponCheckbox.checked || couponInput?.value !== couponCode)) {
          console.log("Abrindo modal de alerta.");
          showAlertModal(() => {
            console.log("Modal de alerta fechado com aceitação.");
            clonedButton.remove();
            originalButton.classList.remove("d-none");
            couponCheckbox.click();
            setTimeout(function () {
              couponInput = document.querySelector(".d-block.mt-2 .form-control");
              couponInput.focus();
              couponInput.click();
              couponInput.value = couponCode;
            }, 300);
          }, () => {
            console.log("Modal de alerta fechado com cancelamento.");
            clonedButton.remove();
            originalButton.classList.remove("d-none");
            originalButton.click();
          });
        } else {
          console.log("Clicando no botão original.");
          originalButton.click();
        }
      });
    }

    function showAlertModal(onAccept, onCancel) {
      const alertModal = document.createElement("div");
      alertModal.className = "alertify ajs-movable ajs-closable ajs-pinnable ajs-pulse";
      alertModal.style.display = "block";
      alertModal.innerHTML = `
        <div class="ajs-dimmer"></div>
        <div class="ajs-modal" tabindex="0">
          <div class="ajs-dialog" tabindex="0">
            <button class="ajs-reset"></button>
            <div class="ajs-commands">
              <button class="ajs-pin"></button>
              <button class="ajs-maximize"></button>
              <button class="ajs-close"></button>
            </div>
            <div class="ajs-header">Atenção</div>
            <div class="ajs-body">
              <div class="ajs-content">Utilize o cupom ${couponCode} para receber o seu bônus!</div>
            </div>
            <div class="ajs-footer">
              <div class="ajs-auxiliary ajs-buttons"></div>
              <div class="ajs-primary ajs-buttons">
                <button class="ajs-button ajs-cancel">Dispensar</button>
              </div>
              <div class="ajs-primary ajs-buttons">
                <button class="ajs-button ajs-ok">Utilizar Cupom</button>
              </div>
            </div>
            <div class="ajs-handle"></div>
            <button class="ajs-reset"></button>
          </div>
        </div>
      `;
      document.body.appendChild(alertModal);

      function closeModal() {
        alertModal.remove();
      }

      alertModal.querySelector(".ajs-ok").addEventListener("click", function () {
        alertModal.remove();
        if (onAccept) onAccept();
      });
      alertModal.querySelector(".ajs-cancel").addEventListener("click", function () {
        closeModal();
        if (onCancel) onCancel();
      });
      alertModal.querySelector(".ajs-close").addEventListener("click", closeModal);
    }

    const observerPopUp = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        const popUp = document.querySelector(".modal-content");
        if (popUp && !document.querySelector(".modal-content button.btn-primary")) {
          console.log("Banner pop-up detectado.");
          createButton();
          observerPopUp.disconnect();
        }
      });
    });
    observerPopUp.observe(document.body, { childList: true, subtree: true });
  } else {
    console.log("Não é a página inicial ou não está no mobile.");
  }
});
