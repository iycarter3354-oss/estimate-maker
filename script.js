const fmt = n => '¥' + Math.round(n).toLocaleString('ja-JP');

function addRow() {
  const tbody = document.getElementById('itemsBody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="item-name" placeholder="作業内容" /></td>
    <td><input type="number" class="item-qty" value="1" min="0" /></td>
    <td><input type="number" class="item-price" value="0" min="0" /></td>
    <td><button type="button" class="btn-delete-row" title="削除">✕</button></td>`;
  tr.querySelector('.btn-delete-row').addEventListener('click', () => { tr.remove(); update(); });
  ['item-name','item-qty','item-price'].forEach(c => tr.querySelector('.' + c).addEventListener('input', update));
  tbody.appendChild(tr);
  update();
}

function update() {
  const bind = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };

  bind('p-senderName',   document.getElementById('senderName').value);
  bind('p-senderAddress',document.getElementById('senderAddress').value);
  bind('p-senderPhone',  document.getElementById('senderPhone').value);
  bind('p-senderEmail',  document.getElementById('senderEmail').value);
  bind('p-clientName',   document.getElementById('clientName').value);
  bind('p-clientPerson', document.getElementById('clientPerson').value);
  bind('p-estimateNo',   document.getElementById('estimateNo').value);

  const issueRaw = document.getElementById('issueDate').value;
  const expiryRaw = document.getElementById('expiryDate').value;
  bind('p-issueDate',  issueRaw  ? issueRaw.replace(/-/g, '/') : '');
  bind('p-expiryDate', expiryRaw ? expiryRaw.replace(/-/g, '/') : '');

  const taxRate = parseFloat(document.getElementById('taxRate').value);
  const taxLabel = taxRate === 0.10 ? '消費税（10%）' : taxRate === 0.08 ? '消費税（8%）' : '消費税（非課税）';
  document.getElementById('p-taxLabel').textContent = taxLabel;

  const rows = document.querySelectorAll('#itemsBody tr');
  const pBody = document.getElementById('p-itemsBody');
  pBody.innerHTML = '';
  let subtotal = 0;
  rows.forEach(row => {
    const name  = row.querySelector('.item-name').value;
    const qty   = parseFloat(row.querySelector('.item-qty').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const amount = qty * price;
    subtotal += amount;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${name}</td><td>${qty}</td><td>${fmt(price)}</td><td class="amount-cell">${fmt(amount)}</td>`;
    pBody.appendChild(tr);
  });

  const tax   = subtotal * taxRate;
  const total = subtotal + tax;
  document.getElementById('p-subtotal').textContent = fmt(subtotal);
  document.getElementById('p-tax').textContent      = fmt(tax);
  document.getElementById('p-total').textContent    = fmt(total);
  document.getElementById('p-grandTotal').textContent = fmt(total);

  const notesVal = document.getElementById('notes').value;
  const notesSection = document.getElementById('p-notesSection');
  const notesEl = document.getElementById('p-notes');
  if (notesVal) {
    notesEl.textContent = notesVal;
    notesSection.style.display = '';
  } else {
    notesSection.style.display = 'none';
  }
}

document.getElementById('addRowBtn').addEventListener('click', addRow);
document.getElementById('printBtn').addEventListener('click', () => window.print());

document.getElementById('proSignupBtn').addEventListener('click', () => {
  const email = document.getElementById('proEmail').value;
  const msg = document.getElementById('signupMessage');
  if (!email || !email.includes('@')) {
    msg.textContent = '正しいメールアドレスを入力してください。';
    msg.style.color = '#fc8181';
    return;
  }
  msg.textContent = 'ありがとうございます！案内をお送りします。';
  msg.style.color = '#48bb78';
});

['senderName','senderAddress','senderPhone','senderEmail','clientName','clientPerson','estimateNo','issueDate','expiryDate','taxRate','notes']
  .forEach(id => document.getElementById(id).addEventListener('input', update));

addRow();
document.getElementById('issueDate').value = new Date().toISOString().slice(0,10);
update();
