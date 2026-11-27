// 広い画面で左に固定した目次に、いま読んでいる条を示す（狭い画面では目次は本文の前の囲みで、示す必要がない）
(() => {
  const links = [...document.querySelectorAll('.toc a[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window) || !matchMedia('(min-width:1120px)').matches) return;
  const byId = new Map(links.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
  const heads = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  const visible = new Set();
  const mark = () => {
    // 画面の上にいちばん近い見出し（見えていなければ、最後に通り過ぎた見出し）を今の条とする
    let cur = heads.find((h) => visible.has(h));
    if (!cur) cur = heads.filter((h) => h.getBoundingClientRect().top < 120).pop() ?? heads[0];
    for (const a of links) a.removeAttribute('aria-current');
    byId.get(cur.id)?.setAttribute('aria-current', 'true');
  };
  const io = new IntersectionObserver((es) => {
    for (const e of es) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
    mark();
  }, { rootMargin: '-72px 0px -60% 0px' });
  heads.forEach((h) => io.observe(h));
  mark();
})();
