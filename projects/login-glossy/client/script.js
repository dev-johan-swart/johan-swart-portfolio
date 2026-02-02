// client/script.js - shared utilities
function showLoading(){
    document.querySelectorAll('#loading').forEach(el => el.classList.add('show'));
  }
  function hideLoading(){
    document.querySelectorAll('#loading').forEach(el => el.classList.remove('show'));
  }
  function showMsg(txt, isError){
    const el = document.querySelector('#msg') || document.createElement('div');
    el.id = 'msg';
    el.className = isError ? 'alert' : '';
    el.textContent = txt;
    const container = document.querySelector('.card');
    if (!document.querySelector('#msg')) container.appendChild(el);
  }
  function clearMsg(){
    const el = document.querySelector('#msg');
    if (el) el.remove();
  }
  