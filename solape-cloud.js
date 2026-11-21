const cloud = (() => {
  const url = window.SOLAPE_SUPABASE_URL.replace(/\/+$/, '');
  const key = window.SOLAPE_SUPABASE_PUBLISHABLE_KEY;
  const path = '/rest/v1/solape_app_state?id=eq.1';
  let token, row, queue = Promise.resolve();
  async function request(route, method = 'GET', data) {
    const response = await fetch(url + route, { method, cache: 'no-store',
      headers: {apikey: key, ...(token && {Authorization: 'Bearer ' + token}),
        'Content-Type': 'application/json', Prefer: 'return=representation'},
      body: JSON.stringify(data) });
    if (!response.ok) throw Error('Supabase devolvió HTTP ' + response.status);
    return response.json();
  }
  async function open() {
    const form = document.querySelector('#access');
    const status = document.querySelector('#access-status');
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) || !key.startsWith('sb_publishable_')) {
      form.hidden = true;
      status.textContent = 'Configura la URL y la clave pública de Solape.';
      return false;
    }
    return new Promise(resolve => {
      form.onsubmit = async event => {
        event.preventDefault();
        const button = form.querySelector('button');
        button.disabled = true;
        try {
          token = null;
          const session = await request('/auth/v1/token?grant_type=password', 'POST', {
            email: form.elements.email.value.trim(), password: form.elements.password.value
          });
          token = session.access_token;
          [row] = await request(path + '&select=data,revision');
          if (!row) throw Error('La cuenta no tiene acceso o falta la migración.');
          form.reset();
          form.parentElement.hidden = true;
          document.querySelector('.shell').hidden = false;
          resolve(true);
        } catch (error) { status.textContent = error.message; }
        finally { button.disabled = false; }
      };
    });
  }
  function save(name, value) {
    const snapshot = JSON.parse(JSON.stringify(value));
    queue = queue.then(async () => {
      const [updated] = await request(path + '&revision=eq.' + row.revision, 'PATCH', {
        data: {...row.data, [name]: snapshot}, revision: row.revision + 1
      });
      if (!updated) throw Error('Otra sesión guardó cambios. Vuelve a entrar y reintenta.');
      row = updated;
    });
    queue.catch(error => {
      document.querySelector('.shell').inert = true;
      const banner = document.querySelector('#sync-error');
      banner.hidden = false;
      banner.querySelector('span').textContent = 'No se confirmó el guardado. ' + error.message;
    });
    return queue;
  }
  return {open, save, get: (name, fallback) => row.data[name] ?? fallback};
})();
