/* Reads the admin-managed blocks from the static index.html (initial database content). */
const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim();
const all = (re, s) => [...s.matchAll(re)];
const one = (re, s) => { const m = s.match(re); return m ? decode(m[1]) : ''; };

export function extractHome(html) {
  const bubbles = all(/<button type="button" class="kpi"[^>]*><span class="kpi-value[^"]*">([\s\S]*?)<\/span><span class="kpi-label">([\s\S]*?)<\/span><\/button>\s*<ul class="kpi-tags"[^>]*>([\s\S]*?)<\/ul>/g, html)
    .map(m => ({ value: decode(m[1]), label: decode(m[2]),
      tags: all(/<use href="#([^"]+)"><\/use><\/svg><span>([\s\S]*?)<\/span>/g, m[3]).map(t => ({ label: decode(t[2]), icon: t[1] })) }));

  const timeline = all(/<article class="tl-item reveal">([\s\S]*?)<\/article>/g, html).map((m, position) => {
    const h3 = m[1].match(/<h3(?: title="([^"]*)")?>([\s\S]*?)<\/h3>/);
    const title = decode(h3[2]), org = one(/class="org">([\s\S]*?)<\/span>/, m[1]);
    return { position, kind: /MBA|Superior|Graduação|Formação|Curso/i.test(title + ' ' + org) ? 'formacao' : 'trabalho',
      period: one(/tl-when num">([\s\S]*?)<\/span>/, m[1]), title, org: org || null,
      description: one(/<p>([\s\S]*?)<\/p>/, m[1]) || null, title_full: h3[1] ? decode(h3[1]) : null };
  });

  const services = all(/<article class="service[^"]*"[^>]*>[\s\S]*?<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<ul>([\s\S]*?)<\/ul>/g, html)
    .map(m => ({ title: decode(m[1]), text: decode(m[2]), items: all(/<li>([\s\S]*?)<\/li>/g, m[3]).map(i => decode(i[1])) }));

  const skillsBlock = html.match(/<div class="skills"[^>]*>([\s\S]*?)<\/div>/)[1];
  const skills = all(/<span class="chip[^>]*>([\s\S]*?)<\/span>/g, skillsBlock).map(m => decode(m[1]));

  const social = (label) => { const m = html.match(new RegExp(`<a class="chip glass" href="([^"]*)"[^>]*aria-label="${label}"`)); return m && m[1] !== '#' ? decode(m[1]) : ''; };
  const contact = { email: one(/id="emailAddr">([\s\S]*?)<\/a>/, html), linkedin: social('LinkedIn'), github: social('GitHub'), dribbble: social('Dribbble') };

  return { bubbles, timeline, services, skills, contact };
}
