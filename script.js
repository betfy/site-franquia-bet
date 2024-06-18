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
            observeCoupon();
            depositButton.click();
          }
        }, 300);
      });
    }

    function observeCoupon() {
      const observerCoupon = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          const couponCheckbox = document.querySelector("#cupom");
          if (couponCheckbox && !couponCheckbox.checked) {
            couponCheckbox.click();
            setTimeout(function () {
              const couponInput = document.querySelector(".d-block.mt-2 .form-control");
              if (couponInput) {
                couponInput.focus();
                couponInput.click();
                observerCoupon.disconnect();
                setTimeout(function () {
                  simulateTyping(couponInput, couponCode, function() {
                    const depositInput = document.querySelector(".input-group input[placeholder='Informe o valor']");
                    if (depositInput) {
                      depositInput.focus();
                      depositInput.click();
                    }
                  });
                }, 300);
              }
            }, 300);
          }
        });
      });
      observerCoupon.observe(document.body, { childList: true, subtree: true });
    }

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
          input.dispatchEvent(new Event('change', { bubbles: true }));
          if (callback) callback();
        }
      }, 100);
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
