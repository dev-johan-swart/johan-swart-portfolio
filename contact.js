document.addEventListener('DOMContentLoaded', () => {
  const openBtns = [
    document.getElementById('openContact'),
    document.getElementById('openContactFloat')
  ];

  const closeBtn = document.getElementById('closeContact');
  const overlay = document.getElementById('contactOverlay');

  function openContact() {
    document.body.classList.add('contact-open');
  }

  function closeContact() {
    document.body.classList.remove('contact-open');
  }

  openBtns.forEach(btn => btn?.addEventListener('click', openContact));
  closeBtn?.addEventListener('click', closeContact);
  overlay?.addEventListener('click', closeContact);

  // ESC key support (bonus, very professional)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeContact();
  });

  /* FORM */
  const form = document.getElementById('contact-form');
  const msg  = document.getElementById('msg');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      msg.textContent = 'Sending…';

      try {
        const res = await fetch('https://formspree.io/f/xvzqbbed', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });

        if (!res.ok) throw new Error();

        msg.style.color = 'lime';
        msg.textContent = 'Message sent successfully!';
        form.reset();

        setTimeout(closeContact, 2000);
      } catch {
        msg.style.color = 'red';
        msg.textContent = 'Something went wrong. Please email me directly.';
      }
    });
  }
});

