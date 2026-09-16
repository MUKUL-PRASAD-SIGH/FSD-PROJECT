const app = document.querySelector('#app');

const opportunities = [
  { id: 1, title: 'Open Source Sprint', company: 'GitHub Campus', type: 'Hackathon', place: 'Remote', date: 'Sep 26', skills: ['React', 'Git'] },
  { id: 2, title: 'Frontend Engineering Intern', company: 'PixelWorks', type: 'Internship', place: 'Bengaluru', date: 'Oct 02', skills: ['JavaScript', 'CSS'] },
  { id: 3, title: 'Build for Bharat', company: 'Tech for India', type: 'Competition', place: 'Hybrid', date: 'Oct 09', skills: ['Node.js', 'MongoDB'] },
  { id: 4, title: 'Cloud Native Challenge', company: 'DevLaunch', type: 'Hackathon', place: 'Remote', date: 'Oct 15', skills: ['Cloud', 'APIs'] },
];

const state = {
  signedIn: false,
  saved: new Set([1]),
  applications: [{ title: 'Frontend Engineering Intern', company: 'PixelWorks', stage: 'Shortlisted' }],
  filter: 'All',
};

const pageNames = {
  dashboard: 'Overview',
  discover: 'Discover',
  applications: 'Applications',
  saved: 'Saved',
  teams: 'Teams',
  analytics: 'Analytics',
  profile: 'Profile',
  admin: 'Admin',
};

function route() {
  const value = location.hash.replace('#/', '') || 'login';
  return pageNames[value] || ['login', 'register'].includes(value) ? value : 'dashboard';
}

function go(page) {
  location.hash = '#/' + page;
}

function tags(items) {
  return '<div class="tag-list">' + items.map((item) => '<span>' + item + '</span>').join('') + '</div>';
}

function opportunityCard(item) {
  const saved = state.saved.has(item.id);
  return '<article class="opportunity-card">' +
    '<div class="card-top"><span class="type-label ' + item.type.toLowerCase() + '">' + item.type + '</span>' +
    '<button class="save-button" data-save="' + item.id + '">' + (saved ? '★' : '☆') + '</button></div>' +
    '<h3>' + item.title + '</h3><p>' + item.company + '</p>' +
    '<div class="card-info"><span>⌖ ' + item.place + '</span><span>◷ ' + item.date + '</span></div>' +
    tags(item.skills) +
    '<div class="card-buttons"><button class="link-button" data-details="' + item.id + '">Details</button>' +
    '<button class="small-button" data-apply="' + item.id + '">Apply</button></div></article>';
}

function input(name, label, type, placeholder, value) {
  return '<label class="form-field"><span>' + label + '</span><input name="' + name + '" type="' + type + '" placeholder="' + placeholder + '" value="' + (value || '') + '"></label>';
}

function authPage(mode) {
  const isRegister = mode === 'register';
  return '<main class="auth-page"><section class="auth-story"><a class="logo" href="#/login"><b>H</b> hack<span>elite</span></a>' +
    '<p class="eyebrow">TECHNICAL OPPORTUNITY HUB</p><h1>Find work worth building.</h1>' +
    '<p>Hackathons, internships, competitions, teams, and application progress in one workspace.</p><div class="art-blocks"><i></i><i></i><i></i></div></section>' +
    '<section class="auth-form-panel"><div class="auth-card"><p class="eyebrow">PHASE 1 ACCESS</p><h2>' + (isRegister ? 'Create an account' : 'Welcome back') + '</h2>' +
    '<p class="muted">' + (isRegister ? 'Start building your opportunity board.' : 'Sign in to continue.') + '</p>' +
    '<form id="authForm" novalidate>' + (isRegister ? input('name', 'Full name', 'text', 'e.g. Alex Taylor') : '') +
    input('email', 'Email address', 'email', 'you@example.com') + input('password', 'Password', 'password', 'At least 6 characters') +
    '<p class="form-error"></p><button class="primary-button">' + (isRegister ? 'Create account' : 'Sign in') + ' →</button></form>' +
    '<button class="text-button" id="demoButton">Explore the demo</button><p class="switch-copy">' +
    (isRegister ? 'Already registered? <a href="#/login">Sign in</a>' : 'New here? <a href="#/register">Create account</a>') + '</p></div></section></main>';
}

function navigation(active) {
  return Object.keys(pageNames).map((item) => '<a href="#/' + item + '" class="' + (active === item ? 'active' : '') + '">' +
    '<span>' + ({ dashboard: '◫', discover: '⌕', applications: '◷', saved: '★', teams: '♧', analytics: '▥', profile: '◉', admin: '⚙' }[item]) + '</span>' + pageNames[item] + '</a>').join('');
}

function layout(active) {
  return '<div class="app-layout"><aside class="sidebar"><a class="logo" href="#/dashboard"><b>H</b> hack<span>elite</span></a><p class="nav-title">WORKSPACE</p><nav>' +
    navigation(active) + '</nav><div class="sidebar-bottom"><button id="logoutButton">Log out ↗</button><small>PHASE 1 · 2026</small></div></aside>' +
    '<main class="workspace"><header><div><p class="eyebrow">' + pageNames[active].toUpperCase() + ' PAGE</p><h1>' + title(active) + '</h1></div>' +
    '<div class="header-actions"><button id="quickAdd" class="outline-button">+ Add opportunity</button><a class="avatar" href="#/profile">ST</a></div></header>' +
    content(active) + '</main><div id="modal"></div></div>';
}

function title(active) {
  return {
    dashboard: 'Build your next opportunity.',
    discover: 'Explore opportunities.',
    applications: 'Keep applications moving.',
    saved: 'Your shortlist.',
    teams: 'Find the right collaborators.',
    analytics: 'Track your progress.',
    profile: 'Your profile.',
    admin: 'Opportunity management.',
  }[active];
}

function dashboard() {
  return '<section class="content"><section class="hero-box"><div><p class="eyebrow">PERSONALISED MATCHES</p><h2>Strong opportunities.<br>Clear next steps.</h2><p>Discover, save, apply, and form teams from one project-focused workspace.</p><a class="yellow-button" href="#/discover">Explore opportunities →</a></div><div class="hero-art"><b>01</b><i>✦</i><em>&lt;/&gt;</em></div></section>' +
    stats() + '<div class="section-head"><div><p class="eyebrow">RECOMMENDED</p><h2>Picked for full-stack builders</h2></div><a href="#/discover">See all →</a></div>' +
    '<section class="card-grid">' + opportunities.slice(0, 3).map(opportunityCard).join('') + '</section>' + dashboardBottom() + '</section>';
}

function stats() {
  return '<section class="stats"><article><small>OPEN OPPORTUNITIES</small><strong>24</strong><p>Across internships and hackathons</p></article><article><small>APPLICATIONS ACTIVE</small><strong>' + String(state.applications.length).padStart(2, '0') + '</strong><p>Keep an eye on upcoming stages</p></article><article><small>SAVED FOR LATER</small><strong>' + String(state.saved.size).padStart(2, '0') + '</strong><p>Review them before deadlines</p></article></section>';
}

function dashboardBottom() {
  return '<section class="split-grid"><article class="box"><p class="eyebrow">APPLICATION ACTIVITY</p><h2>Monthly momentum</h2><div class="chart"><i style="height:34%"></i><i style="height:58%"></i><i style="height:43%"></i><i style="height:82%"></i><i style="height:59%"></i><i class="hot" style="height:94%"></i></div><div class="chart-labels"><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span></div></article><article class="box"><p class="eyebrow">UPCOMING DEADLINES</p><h2>Do not miss out</h2>' + opportunities.slice(0, 3).map((item) => '<div class="deadline"><b>' + item.date + '</b><span>' + item.title + '<small>' + item.type + ' · ' + item.place + '</small></span><button data-apply="' + item.id + '">→</button></div>').join('') + '</article></section>';
}

function discover() {
  const list = state.filter === 'All' ? opportunities : opportunities.filter((item) => item.type === state.filter);
  return '<section class="content"><div class="search-bar"><input id="searchInput" placeholder="Search opportunities, skills, or organisations"><span>⌕</span></div><div class="filters">' +
    ['All', 'Hackathon', 'Internship', 'Competition'].map((item) => '<button data-filter="' + item + '" class="' + (state.filter === item ? 'selected' : '') + '">' + item + '</button>').join('') +
    '</div><div class="section-head"><div><p class="eyebrow">OPPORTUNITY BOARD</p><h2>' + list.length + ' opportunities available</h2></div><button id="quickAdd" class="outline-button">+ Add entry</button></div><section class="card-grid">' + list.map(opportunityCard).join('') + '</section></section>';
}

function applications() {
  return '<section class="content"><div class="section-head"><div><p class="eyebrow">APPLICATION TRACKER</p><h2>Every stage, visible.</h2></div><button id="newApplication" class="primary-button">+ New application</button></div><section class="table-box"><div class="table-head"><span>Opportunity</span><span>Organisation</span><span>Current stage</span><span>Action</span></div>' +
    state.applications.map((item) => '<div class="table-row"><strong>' + item.title + '</strong><span>' + item.company + '</span><span class="stage">' + item.stage + '</span><button class="link-button">Update</button></div>').join('') + '</section></section>';
}

function saved() {
  const items = opportunities.filter((item) => state.saved.has(item.id));
  return '<section class="content"><p class="eyebrow">YOUR SHORTLIST</p><h2>Save first. Decide later.</h2><section class="card-grid">' + (items.length ? items.map(opportunityCard).join('') : '<div class="empty-box">No saved opportunities yet.</div>') + '</section></section>';
}

function teams() {
  return '<section class="content"><div class="section-head"><div><p class="eyebrow">TEAM FORMATION</p><h2>Find people who complement your skills.</h2></div><button id="teamButton" class="primary-button">+ Create team</button></div><section class="team-grid"><article class="team-card"><b>UI</b><h3>Frontend Forge</h3><p>Looking for a backend developer for an education hackathon.</p>' + tags(['React', 'Figma', '1 role open']) + '<button class="small-button">Request to join</button></article><article class="team-card"><b class="yellow">AI</b><h3>Data Detectives</h3><p>Building a campus analytics tool. Need a presentation lead.</p>' + tags(['Python', 'Analytics', '2 roles open']) + '<button class="small-button">Request to join</button></article><article class="team-card create-card"><b>+</b><h3>Create a team</h3><p>List your idea, skills, and open roles.</p><button id="teamButton" class="link-button">Create team →</button></article></section></section>';
}

function analytics() {
  return '<section class="content">' + stats() + '<section class="split-grid"><article class="box"><p class="eyebrow">OPPORTUNITIES BY DOMAIN</p><h2>Where the work is</h2><div class="domain"><span>Web development</span><i><b style="width:82%"></b></i><strong>12</strong></div><div class="domain"><span>AI and data</span><i><b style="width:61%"></b></i><strong>09</strong></div><div class="domain"><span>Cloud engineering</span><i><b style="width:44%"></b></i><strong>06</strong></div></article><article class="box"><p class="eyebrow">ACTIONABLE INSIGHT</p><h2>Try more competitions.</h2><p class="box-copy">Your profile has good JavaScript and React coverage. Adding a completed project can improve internship matches.</p><a class="link-button" href="#/profile">Update profile →</a></article></section></section>';
}

function profile() {
  return '<section class="content narrow"><p class="eyebrow">PROFILE SETTINGS</p><h2>Make your profile more useful.</h2><form id="profileForm" class="standard-form" novalidate>' + input('name', 'Display name', 'text', 'Student', 'Student') + input('email', 'Email address', 'email', 'student@example.com', 'student@example.com') + '<label class="form-field"><span>Skills</span><textarea name="skills">React, JavaScript, Node.js</textarea></label><p class="form-error"></p><button class="primary-button">Save profile →</button></form></section>';
}

function admin() {
  return '<section class="content"><div class="section-head"><div><p class="eyebrow">ADMIN DASHBOARD</p><h2>Manage opportunity records.</h2></div><button id="quickAdd" class="primary-button">+ Add opportunity</button></div><section class="table-box"><div class="table-head"><span>Title</span><span>Organisation</span><span>Type</span><span>Status</span></div>' + opportunities.map((item) => '<div class="table-row"><strong>' + item.title + '</strong><span>' + item.company + '</span><span>' + item.type + '</span><span class="stage">Open</span></div>').join('') + '</section></section>';
}

function content(active) {
  return { dashboard, discover, applications, saved, teams, analytics, profile, admin }[active]();
}

function modal(title, inner) {
  document.querySelector('#modal').innerHTML = '<div class="modal-cover"><section class="modal"><button id="closeModal" class="close">×</button><p class="eyebrow">HACKELITE</p><h2>' + title + '</h2>' + inner + '</section></div>';
  document.querySelector('#closeModal').onclick = closeModal;
}
function closeModal() { document.querySelector('#modal').innerHTML = ''; }
function appForm(item) {
  return '<form id="applicationForm" class="standard-form" novalidate>' + input('title', 'Opportunity', 'text', 'Opportunity title', item ? item.title : '') + input('company', 'Organisation', 'text', 'Organisation name', item ? item.company : '') + '<label class="form-field"><span>Application stage</span><select name="stage"><option>Applied</option><option>In review</option><option>Shortlisted</option></select></label><p class="form-error"></p><button class="primary-button">Save application →</button></form>';
}
function teamForm() {
  return '<form id="teamForm" class="standard-form" novalidate>' + input('team', 'Team name', 'text', 'e.g. Code Collective') + input('idea', 'Project idea', 'text', 'One sentence summary') + '<label class="form-field"><span>Open roles</span><textarea name="roles" placeholder="e.g. Backend developer"></textarea></label><p class="form-error"></p><button class="primary-button">Create team →</button></form>';
}
function adminForm() {
  return '<form id="adminForm" class="standard-form" novalidate>' + input('title', 'Opportunity title', 'text', 'e.g. Design Sprint') + input('company', 'Organisation', 'text', 'e.g. Example Labs') + '<label class="form-field"><span>Type</span><select name="type"><option>Hackathon</option><option>Internship</option><option>Competition</option></select></label>' + input('date', 'Deadline', 'date', '') + '<p class="form-error"></p><button class="primary-button">Create record →</button></form>';
}

function error(form, message) { form.querySelector('.form-error').textContent = message; }
function values(form) { return Object.fromEntries(new FormData(form)); }

function bind() {
  document.querySelectorAll('[data-save]').forEach((button) => button.onclick = () => { const id = Number(button.dataset.save); state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id); render(); });
  document.querySelectorAll('[data-filter]').forEach((button) => button.onclick = () => { state.filter = button.dataset.filter; render(); });
  document.querySelectorAll('[data-details]').forEach((button) => button.onclick = () => { const item = opportunities.find((entry) => entry.id === Number(button.dataset.details)); modal(item.title, '<p class="muted">' + item.company + ' · ' + item.place + ' · Deadline ' + item.date + '</p>' + tags(item.skills) + '<p class="box-copy">A structured opportunity record with skills, deadline, location, and an application workflow.</p><button data-apply="' + item.id + '" class="primary-button">Start application →</button>'); bind(); });
  document.querySelectorAll('[data-apply]').forEach((button) => button.onclick = () => { const item = opportunities.find((entry) => entry.id === Number(button.dataset.apply)); modal('Track an application', appForm(item)); bind(); });
  document.querySelectorAll('#quickAdd').forEach((button) => button.onclick = () => { modal('Add an opportunity', adminForm()); bind(); });
  document.querySelectorAll('#newApplication').forEach((button) => button.onclick = () => { modal('New application', appForm()); bind(); });
  document.querySelectorAll('#teamButton').forEach((button) => button.onclick = () => { modal('Create a team', teamForm()); bind(); });
  document.querySelector('#demoButton')?.addEventListener('click', () => { state.signedIn = true; go('dashboard'); });
  document.querySelector('#logoutButton')?.addEventListener('click', () => { state.signedIn = false; go('login'); });
  document.querySelector('#authForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = values(form);
    const endpoint = route() === 'register' ? 'register' : 'login';

    if (data.name !== undefined && data.name.trim().length < 2) return error(form, 'Enter a name with at least 2 characters.');
    if (!data.email.includes('@')) return error(form, 'Enter a valid email address.');
    if (data.password.length < 6) return error(form, 'Password must contain at least 6 characters.');

    try {
      const response = await fetch('/api/auth/' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) return error(form, result.message || 'Could not complete your request.');
      localStorage.setItem('hackelite-token', result.token);
      state.signedIn = true;
      go('dashboard');
    } catch {
      error(form, 'The API is unavailable. Start the backend with npm start, or use Explore the demo.');
    }
  });
  document.querySelector('#profileForm')?.addEventListener('submit', (event) => { event.preventDefault(); const form = event.currentTarget; const data = values(form); if (data.name.trim().length < 2 || !data.email.includes('@')) return error(form, 'Enter a valid name and email address.'); alert('Profile changes saved.'); });
  document.querySelector('#applicationForm')?.addEventListener('submit', (event) => { event.preventDefault(); const form = event.currentTarget; const data = values(form); if (!data.title.trim() || !data.company.trim()) return error(form, 'Opportunity and organisation are required.'); state.applications.push({ title: data.title, company: data.company, stage: data.stage }); closeModal(); go('applications'); });
  document.querySelector('#teamForm')?.addEventListener('submit', (event) => { event.preventDefault(); const form = event.currentTarget; const data = values(form); if (data.team.trim().length < 3 || data.idea.trim().length < 10 || !data.roles.trim()) return error(form, 'Add a team name, project idea, and open role.'); closeModal(); alert('Team created successfully.'); });
  document.querySelector('#adminForm')?.addEventListener('submit', (event) => { event.preventDefault(); const form = event.currentTarget; const data = values(form); if (!data.title.trim() || !data.company.trim() || !data.date) return error(form, 'Title, organisation, and deadline are required.'); opportunities.unshift({ id: Date.now(), title: data.title, company: data.company, type: data.type, place: 'To be confirmed', date: data.date, skills: ['New'] }); closeModal(); go('admin'); });
}

function render() {
  const active = route();
  app.innerHTML = state.signedIn || !['login', 'register'].includes(active) ? layout(['login', 'register'].includes(active) ? 'dashboard' : active) : authPage(active);
  bind();
}
window.addEventListener('hashchange', render);
render();
