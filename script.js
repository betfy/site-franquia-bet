document.addEventListener("DOMContentLoaded", function () {
  let isMobile = window.innerWidth <= 768;
  if (isMobile) {
    function createButton() {
      let button = document.createElement("button");
      button.innerText = "Resgatar Bônus";
      button.classList.add("col-6", "btn", "btn-primary");

      // Estiliza o botão para ficar sobre a imagem
      button.style.position = "absolute";
      button.style.bottom = "20px";
      button.style.left = "50%";
      button.style.transform = "translateX(-50%)"

      // Adiciona o botão ao banner pop-up
      document.querySelector(".modal-content").appendChild(button);

      button.addEventListener("click", function () {
        let depositButton = document.querySelector(".NavBar_DepositButton__229mf");
        let closeButton = document.querySelector(".modal-content a");

        // Fecha o modal
        if (closeButton) {
          closeButton.click();
        }

        // Aguarda um pequeno intervalo para garantir que o modal seja fechado antes de clicar no botão de depósito
        setTimeout(function () {
          if (depositButton) {
            depositButton.click();

            // Observa mudanças no DOM para encontrar o checkbox e preencher o cupom
            const observer = new MutationObserver(function (mutations) {
              mutations.forEach(function (mutation) {
                const couponCheckbox = document.querySelector("#cupom");
                if (couponCheckbox && !couponCheckbox.checked) {
                  couponCheckbox.click();
                  observer.disconnect(); // Encerra o observer assim que o checkbox for clicado

                  setTimeout(function () {
                    const couponInput = document.querySelector(".d-block.mt-2 .form-control");
                    if (couponInput) {
                      // Aguarda a digitação do cupom antes de focar no input do depósito
                      simulateTyping(couponInput, "GANHA25", function() {
                        const depositInput = document.querySelector(".input-group input[placeholder='Informe o valor']");
                        if (depositInput) {
                          depositInput.focus();
                        }
                      });
                    }
                  }, 300); // Ajuste o tempo conforme necessário
                }
              });
            });

            observer.observe(document.body, { childList: true, subtree: true });
          }
        }, 300);  // Intervalo de 300ms, ajuste conforme necessário
      });
    }

    // Função para simular a digitação no input usando eventos de teclado
    function simulateTyping(input, text, callback) {
      input.focus();
      let index = 0;
      const interval = setInterval(() => {
        const event = new KeyboardEvent('keydown', {
          key: text[index],
          keyCode: text.charCodeAt(index),
          which: text.charCodeAt(index),
          bubbles: true
        });
        input.dispatchEvent(event);
        input.value += text[index];
        input.dispatchEvent(new Event('input', { bubbles: true }));
        index++;
        if (index === text.length) {
          clearInterval(interval);
          // Garante que o botão de depósito seja habilitado
          input.dispatchEvent(new Event('change', { bubbles: true }));
          if (callback) callback();
        }
      }, 100); // Intervalo de 100ms entre cada caractere, ajuste conforme necessário
    }

    // Espera o banner pop-up aparecer
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        const popUp = document.querySelector(".modal-content"); // Seleciona o banner pop-up
        if (popUp && !document.querySelector(".modal-content button.btn-primary")) {
          createButton();
          observer.disconnect(); // Encerra o observer assim que o botão for adicionado
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
});
