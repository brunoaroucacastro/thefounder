const assert=require('node:assert/strict');
const {C,act,until,launch}=require('./modern-support.cjs');
const {boot}=require('./workshop-ui.cjs');
let purchases=0,reviews=0,posts=0,both=0,last;
for(let seed=1;seed<=30;seed++){
 const base=launch({price:65});
 base.id='social-test-'+seed;
 base.stock=500;
 base.inventoryBook=500*C.unitCost(base);
 let s=C.enableSocial(base);
 // Reopen an actual launch through its production transition.
 s.phase='launching';
 s.job={type:'launching',duration:.1,elapsed:0,next:'selling'};
 s=until(s,'selling');
 assert.equal(s.social.posts.filter(p=>p.origin==='company').length,1);
 assert.equal(Object.keys(s.social.purchases).length,0);
 s=until(s,'recap');
 const events=Object.values(s.social.purchases);
 assert.equal(events.length,s.sold);
 purchases+=events.length;
 reviews+=events.filter(e=>e.reviewed).length;
 posts+=events.filter(e=>e.posted).length;
 both+=events.filter(e=>e.reviewed&&e.posted).length;
 for(const post of s.social.posts.filter(p=>p.origin==='consumer')){
  const experience=s.social.purchases[post.purchaseId];
  assert(experience.posted);
  assert.equal(post.sentiment,experience.sentiment);
  const review=s.reviews.find(r=>r.purchaseId===post.purchaseId);
  if(review)assert.equal(review.stars,experience.stars);
 }
 assert.equal(new Set(s.social.posts.map(p=>p.id)).size,s.social.posts.length);
 assert.deepEqual(C.load(JSON.stringify(s)).social,s.social);
 last=s;
}
assert(purchases>1000);
assert(reviews/purchases>.075&&reviews/purchases<.13);
assert(posts/purchases>.02&&posts/purchases<.05);
assert(both>0&&both<posts);
last.resultSeenId=(last.learningWindow?.id||last.cycle)+'|'+last.summary.revenue+'|'+last.sales.windowStart;
const a=boot(new Map([['the-founder-contract-v1',JSON.stringify(last)]]),'0.43');
assert.equal(Number(a.el('nexus-unread').textContent),last.social.posts.length);
a.el('nexus').listeners.click();
assert(a.el('social-modal').innerHTML.includes('NEXUS'));
assert(a.el('social-modal').innerHTML.includes('Publicação da empresa'));
assert.equal(a.state().social.lastSeen,last.social.posts.length);
assert(a.el('nexus-unread').hidden);
console.log({purchases,reviews,posts,both});
console.log('PASS: compras, satisfação compartilhada, frequência, feed e novidades persistentes.');
