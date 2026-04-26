const $cards = $(".card");
const $style = $(".hover");

/* --------------------------
   DESKTOP (MOUSE)
-------------------------- */
$cards.on("mousemove", function (e) {
  var $card = $(this);

  var l = e.offsetX;
  var t = e.offsetY;

  var h = $card.height();
  var w = $card.width();

  var lp = Math.abs(Math.floor((100 / w) * l) - 100);
  var tp = Math.abs(Math.floor((100 / h) * t) - 100);

  var bg = `background-position: ${lp}% ${tp}%;`;
  var style = `.card.active:before { ${bg} }`;

  $cards.removeClass("active");
  $card.addClass("active");
  $style.html(style);
}).on("mouseout", function () {
  $cards.removeClass("active");
});

/* --------------------------
   3D ROTATION
-------------------------- */
const resetTransform = (el, perspective = 800) => {
  el.style.transform = `translate3d(0%, 0%, -${perspective / 2}px) rotateX(0deg) rotateY(0deg)`;
};

const onMove = (x, y, el) => {
  const { offsetWidth, offsetHeight } = el;
  const { left, top } = el.getBoundingClientRect();

  const cardX = left + offsetWidth / 2;
  const cardY = top + offsetHeight / 2;

  const angle = 25;
  const rotX = (cardY - y) / angle;
  const rotY = (cardX - x) / -angle;

  el.style.transform = `translate3d(0%, 0%, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
};

const perspective =
  getComputedStyle($cards[0].parentElement)
    .getPropertyValue("perspective")
    .replace("px", "") || 800;

/* --------------------------
   MOUSE EVENTS
-------------------------- */
const onMouseMove = (ev) => onMove(ev.pageX, ev.pageY, ev.target);

const onHover = (ev) => {
  ev.target.addEventListener("mousemove", onMouseMove);
};

const onOut = (ev) => {
  resetTransform(ev.target, perspective);
  ev.target.removeEventListener("mousemove", onMouseMove);
};

/* --------------------------
   TOUCH EVENTS (MOBILE)
-------------------------- */
const onTouchMove = (ev, el) => {
  const touch = ev.touches[0];

  onMove(touch.clientX, touch.clientY, el);

  // HOLO dinámico
  const rect = el.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  const lp = Math.abs(Math.floor((100 / rect.width) * x) - 100);
  const tp = Math.abs(Math.floor((100 / rect.height) * y) - 100);

  const bg = `background-position: ${lp}% ${tp}%;`;
  const style = `.card.active:before { ${bg} }`;

  $style.html(style);
};

const onTouchStart = (ev) => {
  const el = ev.currentTarget;

  $cards.removeClass("active");
  $(el).addClass("active");

  el.addEventListener("touchmove", moveHandler);
};

const moveHandler = (e) => {
  onTouchMove(e, e.currentTarget);
};

const onTouchEnd = (ev) => {
  const el = ev.currentTarget;

  resetTransform(el, perspective);
  $cards.removeClass("active");

  el.removeEventListener("touchmove", moveHandler);
};

/* --------------------------
   INIT
-------------------------- */
[...$cards.toArray()].forEach((card) => {
  // desktop
  card.addEventListener("mouseover", onHover);
  card.addEventListener("mouseout", onOut);

  // mobile
  card.addEventListener("touchstart", onTouchStart);
  card.addEventListener("touchend", onTouchEnd);
});