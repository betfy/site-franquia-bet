document.addEventListener("DOMContentLoaded", function () {
  const couponCode = "GANHA25";

  if (window.innerWidth <= 768) {
    function createButton() {
      let button = document.createElement("button");
      button.innerHTML = "<b>Resgatar Bônus</b>";
      button.classList.add("col-6", "btn", "btn-primary");
      button.style.position = "absolute";
      button.style.bottom = "20px";
      button.style.left = "50%";
      button.style.transform = "translateX(-50%)";
      document.querySelector(".modal-content").appendChild(button);

      button.addEventListener("click", function () {
        let closeButton = document.querySelector(".modal-content a");
        if (closeButton) closeButton.click();
        observerPopUp.disconnect();
        setTimeout(function () {
          let depositButton = document.querySelector(".NavBar_DepositButton__229mf");
          if (depositButton) {
            observeDepositButton();
            depositButton.click();
          }
        }, 300);
      });
    }

    function observeDepositButton() {
      const observerDepositButton = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          const depositButton = document.querySelector(".d-block.mt-2 .btn-primary.btn-block");
          const couponCheckbox = document.querySelector("#cupom");
          const couponInput = document.querySelector(".d-block.mt-2 .form-control");
          if (depositButton) {
            observerDepositButton.disconnect();
            depositButton.addEventListener("click", function (e) {
              if (!couponCheckbox.checked && !couponInput.value) {
                e.preventDefault();
                showAlertModal();
              }
            }, { once: true });
          }
        });
      });
      observerDepositButton.observe(document.body, { childList: true, subtree: true });
    }

    function showAlertModal() {
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
              <div class="ajs-content">Utilize o cupom ${couponCode} para ganhar o bônus!</div>
            </div>
            <div class="ajs-footer">
              <div class="ajs-auxiliary ajs-buttons"></div>
              <div class="ajs-primary ajs-buttons">
                <button class="ajs-button ajs-ok">OK</button>
              </div>
            </div>
            <div class="ajs-handle"></div>
            <button class="ajs-reset"></button>
          </div>
        </div>
      `;
      document.body.appendChild(alertModal);

      alertModal.querySelector(".ajs-ok").addEventListener("click", function () {
        alertModal.remove();
      });
    }

    const observerPopUp = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        const popUp = document.querySelector(".modal-content");
        if (popUp && !document.querySelector(".modal-content button.btn-primary")) {
          createButton();
        }
      });
    });
    observerPopUp.observe(document.body, { childList: true, subtree: true });
  }
});
