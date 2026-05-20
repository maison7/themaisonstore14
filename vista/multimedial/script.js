const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartClose = document.getElementById("cartClose");
const cartBody = document.getElementById("cartBody");
const cartFoot = document.getElementById("cartFoot");
const cartBadge = document.getElementById("cartBadge");

const addButtons = document.querySelectorAll(".btn-add");

let carrito = [];

// ABRIR CARRITO
cartToggle.addEventListener("click", () => {
  cartPanel.classList.add("open");
  overlay.classList.add("active");
});

// CERRAR CARRITO
function cerrarCarrito() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("active");
}

cartClose.addEventListener("click", cerrarCarrito);
overlay.addEventListener("click", cerrarCarrito);

// BOTONES + Y -
const qtyInput = document.getElementById("qtyInput");
const qtyPlus = document.getElementById("qtyPlus");
const qtyMinus = document.getElementById("qtyMinus");

if (qtyPlus) {
  qtyPlus.addEventListener("click", () => {
    let valor = parseInt(qtyInput.value);

    if (valor < 40) {
      qtyInput.value = valor + 1;
    }
  });
}

if (qtyMinus) {
  qtyMinus.addEventListener("click", () => {
    let valor = parseInt(qtyInput.value);

    if (valor > 10) {
      qtyInput.value = valor - 1;
    }
  });
}

// AGREGAR PRODUCTOS
addButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    let cantidad = 1;
    let precio = 2500;
    let nombre = "Sobre Panini";

    // PACK 50
    if (btn.dataset.qty == "50") {
      cantidad = 50;
      precio = 100000;
      nombre = "Pack 50 sobres";
    }

    // PACK VARIABLE
    else if (btn.id === "btnAddMedium") {
      cantidad = parseInt(qtyInput.value);
      precio = cantidad * 2000;
      nombre = `${cantidad} sobres`;
    }

    agregarAlCarrito(nombre, cantidad, precio);
  });
});

// FUNCION AGREGAR
function agregarAlCarrito(nombre, cantidad, precio) {

  const existente = carrito.find(item => item.nombre === nombre);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      nombre,
      cantidad,
      precio,
      unidades: 1
    });
  }

  actualizarCarrito();

  cartPanel.classList.add("open");
  overlay.classList.add("active");
}

// ACTUALIZAR HTML DEL CARRITO
function actualizarCarrito() {

  cartBody.innerHTML = "";

  if (carrito.length === 0) {

    cartBody.innerHTML = `
      <p class="cart-empty">
        No hay productos en el carrito.
      </p>
    `;

    cartFoot.innerHTML = "";
    cartBadge.textContent = "0";

    return;
  }

  let total = 0;
  let totalItems = 0;

  carrito.forEach((item, index) => {

    total += item.precio * item.unidades;
    totalItems += item.unidades;

    cartBody.innerHTML += `
      <div class="cart-item">

        <div class="cart-item-info">
          <div class="cart-item-name">
            ${item.nombre}
          </div>

          <div class="cart-item-price">
            $${(item.precio * item.unidades).toLocaleString("es-AR")}
          </div>
        </div>

        <div class="cart-item-qty">

          <button class="cart-qty-btn" onclick="cambiarCantidad(${index}, -1)">
            −
          </button>

          <span class="cart-qty-num">
            ${item.unidades}
          </span>

          <button class="cart-qty-btn" onclick="cambiarCantidad(${index}, 1)">
            +
          </button>

        </div>

        <button class="cart-remove" onclick="eliminarItem(${index})">
          Eliminar
        </button>

      </div>
    `;
  });

  cartBadge.textContent = totalItems;

  const mensaje = generarMensajeWhatsApp(total);

  cartFoot.innerHTML = `
    <div class="cart-grand-row">
      <span class="cart-grand-label">
        Total
      </span>

      <span class="cart-grand-value">
        $${total.toLocaleString("es-AR")}
      </span>
    </div>

    <a
      href="${mensaje}"
      target="_blank"
      class="cart-checkout-btn"
      style="display:flex;align-items:center;justify-content:center;text-decoration:none;"
    >
      Finalizar pedido
    </a>

    <p class="cart-payment-note">
      Te redirigiremos a WhatsApp para coordinar el pago.
    </p>
  `;
}

// SUMAR O RESTAR
function cambiarCantidad(index, cambio) {

  carrito[index].unidades += cambio;

  if (carrito[index].unidades <= 0) {
    carrito.splice(index, 1);
  }

  actualizarCarrito();
}

// ELIMINAR
function eliminarItem(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// GENERAR LINK WHATSAPP
function generarMensajeWhatsApp(total) {

  let texto = "Hola! Quiero hacer este pedido:%0A%0A";

  carrito.forEach(item => {
    texto += `• ${item.unidades}x ${item.nombre} - $${(item.precio * item.unidades).toLocaleString("es-AR")}%0A`;
  });

  texto += `%0ATotal: $${total.toLocaleString("es-AR")}`;

  return `https://wa.me/5491136282125?text=${texto}`;
}