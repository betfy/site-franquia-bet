// Script de automatização de processos para sites da Franquia Bet.
// Autor: Weliton Almeida - 63 99108-0146

// ? INTERCEPTAÇÃO DE REQUISIÇÕES FETCH E XMLHTTPREQUESTS
console.log('Interceptação de requisições iniciada.');
initRequestsInterceptor();

// Interceptação de Requisições Fetch e XMLHttpRequests
function initRequestsInterceptor() {
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch(...args);
    const clonedResponse = response.clone();

    clonedResponse
      .json()
      .then((data) => {
        console.log('Fetch request URL:', args[0]);
        console.log('Fetch response data:', data);
      })
      .catch((error) => {
        console.error('Error parsing fetch response as JSON:', error);
      });

    return response;
  };

  // Intercept XMLHttpRequest requests
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (...args) {
    this._requestUrl = args[1];
    return originalOpen.apply(this, args);
  };

  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener('load', function () {
      try {
        const response = JSON.parse(this.responseText);
        console.log('XHR request URL:', this._requestUrl);
        console.log('XHR response data:', response);
      } catch (e) {
        console.error('Error parsing XHR response as JSON:', e);
      }
    });
    return originalSend.apply(this, args);
  };
}

// ! EXECUÇÃO APÓS O CARREGAMENTO DO DOM
document.addEventListener('DOMContentLoaded', () => {
  const depositCouponCode = 'GANHA25';
  const siteMinimumDeposit = 2;
  
  // ? UTILIZAÇÃO DE CUPOM DE DEPÓSITO
  if (isInitialPage()) {
    console.log('Script de cupom de depósito iniciado.');
    initModalBannerPopUpObserver();
  }
  // ? EVENTOS PERSONALIZADOS DO GTM (Google Tag Manager)
  console.log('Monitoramento de Eventos GTM iniciado.');
  initRegistrationStartedObserver();
  initDepositStartedObserver();

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function isInitialPage() {
    return (
      document.querySelector('#__next main.container') &&
      !document.querySelector('#__next #page-wrapper')
    );
  }

  function initModalBannerPopUpObserver() {
    const modalBannerPopUpObserver = new MutationObserver((mutations) => {
      let executed = false;
      mutations.forEach((mutation) => {
        if (executed) return;
        const modal = document.querySelector('.modal-content');
        if (modal) {
          console.log('Modal detectado. Analisando conteúdo...');
          const modalHeader = modal.querySelector('.modal-header');
          const modalBody = modal.querySelector('.modal-body');
          // Se não houver header e body modal é o Banner PopUp
          if (!modalHeader && !modalBody) {
            console.log('Desconectando bannerPopUpObserver...');
            modalBannerPopUpObserver.disconnect();
            addButtonBannerPopUp();
            executed = true;
          }
        }
      });
    });
    modalBannerPopUpObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
    const pageChangeObserver = new MutationObserver((mutations) => {
      let executed = false;
      mutations.forEach((mutation) => {
        if (executed) return;
        if (!isInitialPage()) {
          console.log('Desconectando bannerPopUpObserver...');
          modalBannerPopUpObserver.disconnect();
          pageChangeObserver.disconnect();
          executed = true;
        }
      });
    });
    pageChangeObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function addButtonBannerPopUp() {
    let button = document.createElement('button');
    button.innerHTML = '<b>Resgatar Bônus</b>';
    button.classList.add('col-6', 'btn', 'btn-success');
    button.style.position = 'absolute';
    button.style.bottom = '20px';
    button.style.left = '50%';
    button.style.transform = 'translateX(-50%)';
    document.querySelector('.modal-content').appendChild(button);

    button.addEventListener('click', buttonBannerPopUpClicked);
    console.log("Botão 'Resgatar Bônus' adicionado ao banner pop-up.");
  }

  function buttonBannerPopUpClicked() {
    console.log("Botão 'Resgatar Bônus' clicado...");
    let closeButton = document.querySelector('.modal-content a');
    if (closeButton) {
      closeButton.click();
      setTimeout(() => {
        const depositButtonInitialPage = isMobile()
          ? document.querySelector("[class^='NavBar_DepositButton__']")
          : document.querySelector('#__next .navbar .btn-primary');
        if (depositButtonInitialPage) {
          console.log('Botão de depósito/login encontrado e clicado...');
          depositButtonInitialPage.click();
          initDepositFormObserver();
        }
      }, 200);
    }
  }

  function initDepositFormObserver() {
    const depositFormObserver = new MutationObserver((mutations) => {
      let executed = false;
      mutations.forEach((mutation) => {
        if (executed) return;
        const depositButton = isMobile()
          ? document.querySelector('.home-m-wrapper .btn-primary.btn-block')
          : document.querySelector('.home-wrapper .btn-primary.btn-block');
        const clonedDepositButton = isMobile()
          ? document.querySelector('.home-m-wrapper .btn-primary.clone')
          : document.querySelector('.home-wrapper .btn-primary.clone');
        if (depositButton && !clonedDepositButton) {
          console.log(
            'Formulário de depósito detectado. Clonando botão de depósito...',
          );
          replaceDepositFormButton(depositButton);
          depositFormObserver.disconnect();
          executed = true;
        }
      });
    });
    depositFormObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function replaceDepositFormButton(originalDepositButton) {
    const clonedDepositButton = document.createElement('span');
    clonedDepositButton.innerHTML = originalDepositButton.innerHTML;
    clonedDepositButton.className = originalDepositButton.className + ' clone';
    originalDepositButton.classList.add('d-none');
    originalDepositButton.parentNode.insertBefore(
      clonedDepositButton,
      originalDepositButton.nextSibling,
    );
    console.log('Botão de depósito clonado com sucesso.');
    addDepositButtonEventListener(originalDepositButton, clonedDepositButton);
  }

  function addDepositButtonEventListener(originalButton, clonedButton) {
    clonedButton.addEventListener('click', () => {
      const couponCheckBox = isMobile()
        ? document.querySelector('.home-m-wrapper #cupom')
        : document.querySelector('.home-wrapper #cupom');
      const depositInput = isMobile()
        ? document.querySelector(
            ".home-m-wrapper .input-group input[placeholder='Informe o valor']",
          )
        : document.querySelector(
            ".home-wrapper .input-group input[placeholder='Informe o valor']",
          );
      if (depositInput) {
        const depositValue = parseFloat(depositInput.value);
        let couponInput = isMobile()
          ? document.querySelector(
              ".home-m-wrapper .input-group input[placeholder='Informe o código do cupom']",
            )
          : document.querySelector(
              ".home-wrapper .input-group input[placeholder='Informe o código do cupom']",
            );
        if (!depositValue) {
          console.log('Valor de depósito não informado. Clicando no input...');
          depositInput.focus();
          depositInput.click();
        } else if (depositValue < siteMinimumDeposit) {
          console.log(
            'Valor de depósito menor que o mínimo. Clicando no botão original...',
          );
          originalButton.click();
        } else if (
          depositInput.value &&
          (!couponCheckBox.checked || couponInput?.value !== depositCouponCode)
        ) {
          console.log('Abrindo modal de alerta...');
          showAlertModalUseCoupon(
            // Usar Cupom
            () => {
              console.log('Modal de alerta fechado com aceitação.');
              clonedButton.remove();
              originalButton.classList.remove('d-none');
              !couponCheckBox.checked && couponCheckBox.click();
              setTimeout(() => {
                couponInput = isMobile()
                  ? document.querySelector(
                      ".home-m-wrapper .input-group input[placeholder='Informe o código do cupom']",
                    )
                  : document.querySelector(
                      ".home-wrapper .input-group input[placeholder='Informe o código do cupom']",
                    );
                couponInput?.focus();
                couponInput?.click();
              }, 200);
            },
            // Dispensar Cupom
            () => {
              console.log('Modal de alerta fechado com cancelamento.');
              clonedButton.remove();
              originalButton.classList.remove('d-none');
              couponCheckBox.checked && couponCheckBox.click();
              originalButton.click();
            },
          );
        } else {
          console.log('Clicando no botão original.');
          clonedButton.remove();
          originalButton.classList.remove('d-none');
          originalButton.click();
        }
      }
    });
  }

  function showAlertModalUseCoupon(onAccept, onCancel) {
    const alertModal = document.createElement('div');
    alertModal.className =
      'alertify ajs-movable ajs-closable ajs-pinnable ajs-pulse';
    alertModal.style.display = 'block';
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
    <div class="ajs-content">Utilize o cupom ${depositCouponCode} para receber o seu bônus!</div>
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
    // Botão Usar Cupom
    alertModal.querySelector('.ajs-ok').addEventListener('click', () => {
      alertModal.remove();
      if (onAccept) onAccept();
    });
    // Botão Dispensar
    alertModal.querySelector('.ajs-cancel').addEventListener('click', () => {
      alertModal.remove();
      if (onCancel) onCancel();
    });
    // Botão Fechar
    alertModal.querySelector('.ajs-close').addEventListener('click', () => {
      alertModal.remove();
    });
  }

  // =============================================================

  // ? EVENTOS PERSONALIZADOS DO GTM (Google Tag Manager)

  function sendEventToDataLayer(eventName) {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }
    const existingEvent = window.dataLayer.find(
      (event) => event.event === eventName,
    );
    if (!existingEvent) {
      window.dataLayer.push({
        event: eventName,
      });
      console.log(`Evento '${eventName}' adicionado ao DataLayer.`);
    } else {
      console.log(`Evento '${eventName}' já existe no DataLayer.`);
    }
  }

  function initRegistrationStartedObserver() {
    const modalRegistrationStartedObserver = new MutationObserver(
      (mutations) => {
        let executed = false;
        mutations.forEach((mutation) => {
          if (executed) return;
          const modal = document.querySelector('.modal-content');
          if (modal) {
            console.log('Modal detectado. Analisando conteúdo...');
            const modalTitle = modal.querySelector(
              '.modal-header .modal-title',
            );
            const modalButton = modal.querySelector(
              '.modal-body button.btn-primary',
            );
            if (
              modalTitle?.textContent.includes('Criar Conta') &&
              modalButton?.textContent.includes('Registrar')
            ) {
              console.log(
                "Cadastro iniciado. Evento 'registration_started' disparado.",
              );
              sendEventToDataLayer('registration_started');
              modalRegistrationStartedObserver.disconnect();
              executed = true;
              initRegistrationCompletedObserver();
            }
          }
        });
      },
    );
    modalRegistrationStartedObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function initRegistrationCompletedObserver() {
    const alertRegistrationCompletedObserver = new MutationObserver(
      (mutations) => {
        let executed = false;
        mutations.forEach((mutation) => {
          if (executed) return;
          const alert = document.querySelector('.alertify .ajs-dialog');
          if (alert) {
            console.log('Alerta detectado. Analisando conteúdo...');
            const alertBody = alert.querySelector('.ajs-body');
            if (alertBody?.textContent.includes('Cadastro Realizado')) {
              console.log(
                "Cadastro concluído. Evento 'registration_completed' disparado.",
              );
              sendEventToDataLayer('registration_completed');
              alertRegistrationCompletedObserver.disconnect();
              executed = true;
            }
          }
        });
      },
    );
    alertRegistrationCompletedObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function initDepositStartedObserver() {
    const modalDepositStartedObserver = new MutationObserver((mutations) => {
      let executed = false;
      mutations.forEach((mutation) => {
        if (executed) return;
        const modal = document.querySelector('.modal-content');
        if (modal) {
          console.log('Modal detectado. Analisando conteúdo...');
          const modalTitle = modal.querySelector('.modal-header .modal-title');
          const modalText = modal.querySelector('.modal-body .text-center');
          if (
            modalTitle?.textContent.includes('Pagar') &&
            modalText?.textContent.includes('Leia o QR Code')
          ) {
            console.log(
              "Depósito iniciado. Evento 'deposit_started' disparado.",
            );
            sendEventToDataLayer('deposit_started');
            modalDepositStartedObserver.disconnect();
            executed = true;
            initDepositCompletedObserver();
          }
        }
      });
    });
    modalDepositStartedObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function initDepositCompletedObserver() {
    // Implementar a lógica para detectar o término do depósito
    // const depositCompletedObserver = new MutationObserver((mutations) => {
    //   let executed = false;
    //   mutations.forEach((mutation) => {
    //     if (executed) return;
    //     // Lógica para detectar o evento de depósito concluído
    //   });
    // });
    // depositCompletedObserver.observe(document.body, {
    //   childList: true,
    //   subtree: true,
    // });
  }
});
