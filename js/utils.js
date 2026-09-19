function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function uniqueIds(ids) {
  return ids.filter(function (id, index) {
    return ids.indexOf(id) === index;
  });
}

function on(root, selector, eventName, handler) {
  root.querySelectorAll(selector).forEach(function (node) {
    node.addEventListener(eventName, handler);
  });
}

function setPressed(button, pressed) {
  if (!button) return;
  button.setAttribute("aria-pressed", pressed ? "true" : "false");
}

function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short", year: "numeric" });
}

function percent(score, total) {
  if (!total) return 0;
  return Math.round((score / total) * 100);
}

function isTextMatch(userValue, accepted) {
  const n = Phy.normText(userValue);
  if (!n) return false;
  return accepted.some(function (item) {
    return Phy.normText(item) === n;
  });
}
