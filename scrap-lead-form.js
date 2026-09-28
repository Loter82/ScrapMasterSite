// Форма заявки на здачу металу (сторінки tsiny-na-metalobrukht.html і
// tsina-na-*.html). Сайт статичний, без власного бекенду, тому пишемо
// напряму в Supabase REST API публічним anon-ключем — доступ обмежений
// RLS-політикою "INSERT only" на таблиці platform_scrap_leads (див.
// supabase/migrations/20260928120000_platform_scrap_leads.sql в
// основному репозиторії SCRAPMASTER2.0). Прочитати чужі заявки цим
// ключем неможливо.
const SCRAP_LEAD_SUPABASE_URL = 'https://xluegyipojihcbjhhwyg.supabase.co';
const SCRAP_LEAD_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdWVneWlwb2ppaGNiamhod3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2Mjg2NzcsImV4cCI6MjA5MjIwNDY3N30.ZwsFKiWGKI1sTDU_y5Qyf6GY0egm1XofQ-SfutqBEAo';

async function submitScrapLead(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  const data = Object.fromEntries(new FormData(form));
  btn.disabled = true;
  btn.textContent = 'Відправка...';
  try {
    const res = await fetch(`${SCRAP_LEAD_SUPABASE_URL}/rest/v1/platform_scrap_leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SCRAP_LEAD_ANON_KEY,
        'Authorization': `Bearer ${SCRAP_LEAD_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name: data.name,
        city: data.city,
        phone: data.phone,
        material: data.material,
        weight_range: data.weight_range,
        source_page: location.pathname.replace(/^\//, '') || 'index.html'
      })
    });
    if (!res.ok) throw new Error('Request failed: ' + res.status);
    if (typeof gtag !== 'undefined') { gtag('event', 'conversion_event_submit_scrap_lead'); }
    form.style.display = 'none';
    document.getElementById('scrapLeadSuccess').style.display = 'block';
  } catch (err) {
    console.error('scrap lead submit failed:', err);
    alert('Не вдалося відправити заявку. Спробуйте ще раз або зателефонуйте нам.');
    btn.disabled = false;
    btn.textContent = 'Відправити заявку';
  }
}
