import { useState, useEffect } from "react";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Ic = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IPlus  = ({ s=18 }) => <Ic size={s} d="M12 5v14M5 12h14" />;
const IEdit  = ({ s=14 }) => <Ic size={s} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const ITrash = ({ s=14 }) => <Ic size={s} d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />;
const IBook  = ({ s=44 }) => <Ic size={s} d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />;
const IX     = ({ s=16 }) => <Ic size={s} d="M18 6 6 18M6 6l12 12" />;
const IClock = ({ s=13 }) => <Ic size={s} d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" />;
const IWarn  = ({ s=38 }) => <Ic size={s} d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />;
const ISpark = ({ s=15 }) => <Ic size={s} d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />;
const IImg   = ({ s=13 }) => <Ic size={s} d="M21 15l-5-5L5 21M3 3h18v18H3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />;
const ITimer = ({ s=13 }) => <Ic size={s} d="M10 2h4M12 14l-3-3M12 2v2M5.6 5.6l1.4 1.4M18.4 5.6l-1.4 1.4M2 12h2M20 12h2M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />;
const IEye   = ({ s=13 }) => <Ic size={s} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
const IFile  = ({ s=13 }) => <Ic size={s} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6" />;

// ── Seed data ─────────────────────────────────────────────────────────────────
let _n = 10;
const uid = () => String(++_n);

const SEED = [
  { id:"1", title_ar:"سلطة الأفوكادو الصحية", content_ar:"مكونات صحية ولذيذة تجمع بين الأفوكادو الطازج والطماطم الكرزية مع رذاذ الليمون وزيت الزيتون البكر الممتاز. طريقة التحضير سهلة وسريعة لا تأخذ أكثر من ١٥ دقيقة وتناسب الجميع.", cooking_time_ar:"١٥ دقيقة", image_url:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80", type:"recipe", publisher:null },
  { id:"2", title_ar:"فوائد الغذاء النباتي للصحة", content_ar:"تعرف على أهم الفوائد الصحية للنظام الغذائي النباتي وكيف يمكنك تطبيقه في حياتك اليومية. الأبحاث الحديثة تؤكد أن التغذية النباتية تقلل خطر الأمراض المزمنة وتحسن جودة الحياة بشكل ملحوظ.", cooking_time_ar:"٥ دقائق قراءة", image_url:"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80", type:"blog", publisher:"د. أحمد محمد" },
  { id:"3", title_ar:"عصير الخضروات المنعش", content_ar:"مزيج رائع من الجزر والزنجبيل والتفاح الأخضر مع لمسة من الكركم المضاد للالتهابات. يمنحك طاقة صباحية رائعة ويقوي جهاز المناعة بشكل ملحوظ.", cooking_time_ar:"١٠ دقائق", image_url:"https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80", type:"recipe", publisher:null },
];

// ── Tiny helpers ──────────────────────────────────────────────────────────────
const Spin = ({ dark }) => (
  <div style={{ width:15, height:15, border:`2px solid ${dark?"rgba(0,0,0,.15)":"rgba(255,255,255,.2)"}`, borderTopColor:dark?"#000":"#fff", borderRadius:"50%", animation:"spin .7s linear infinite", flexShrink:0 }} />
);

const Field = ({ label, icon, error, children }) => (
  <div>
    <div style={{ display:"flex", alignItems:"center", gap:5, color:"rgba(255,255,255,.32)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".09em", marginBottom:7 }}>
      {icon}{label}
    </div>
    {children}
    {error && <div style={{ marginTop:5, fontSize:12, color:"#f87171" }}>{error}</div>}
  </div>
);

const inp = err => ({
  width:"100%", padding:"11px 14px", boxSizing:"border-box",
  background: err?"rgba(239,68,68,.07)":"rgba(255,255,255,.05)",
  border:`1px solid ${err?"rgba(239,68,68,.45)":"rgba(255,255,255,.1)"}`,
  borderRadius:13, color:"#fff", fontSize:14, outline:"none",
  fontFamily:"Tajawal, sans-serif", resize:"none",
});

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return ()=>clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:999999, padding:"12px 24px", background:type==="success"?"linear-gradient(135deg,#22c55e,#16a34a)":"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", borderRadius:14, fontWeight:800, fontSize:14, boxShadow:"0 12px 40px rgba(0,0,0,.55)", whiteSpace:"nowrap", animation:"toastIn .3s ease-out" }}>
      {msg}
    </div>
  );
}

// ── Recipe Modal ──────────────────────────────────────────────────────────────
const EMPTY = { title_ar:"", content_ar:"", cooking_time_ar:"", image_url:"", type:"blog", publisher:"" };

function RecipeModal({ open, item, onClose, onSave }) {
  const [form, setForm]     = useState(EMPTY);
  const [errs, setErrs]     = useState({});
  const [saving, setSaving] = useState(false);
  const [imgOk, setImgOk]   = useState(false);

  useEffect(() => {
    if (!open) return;
    if (item) {
      setForm({ title_ar:item.title_ar||"", content_ar:item.content_ar||"", cooking_time_ar:item.cooking_time_ar||"", image_url:item.image_url||"", type:item.type||"blog", publisher:item.publisher||"" });
      setImgOk(!!item.image_url);
    } else {
      setForm(EMPTY);
      setImgOk(false);
    }
    setErrs({});
  }, [open, item]);

  const set = (k, v) => setForm(p => ({ ...p, [k]:v }));

  const validate = () => {
    const e = {};
    if (!form.title_ar.trim())   e.title_ar   = "العنوان مطلوب";
    if (!form.content_ar.trim()) e.content_ar  = "المحتوى مطلوب";
    if (!form.image_url.trim())  e.image_url   = "رابط الصورة مطلوب";
    if (form.type==="blog" && !form.publisher.trim()) e.publisher = "اسم الناشر مطلوب";
    return e;
  };

  const submit = async e => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrs(v); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 550));
    onSave({ ...form, ...(item?.id ? {id:item.id} : {}), publisher: form.type==="blog" ? form.publisher : null });
    setSaving(false);
  };

  if (!open) return null;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:99999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} dir="rtl">
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.9)", backdropFilter:"blur(20px)" }} onClick={()=>!saving&&onClose()} />

      <div style={{ position:"relative", width:"100%", maxWidth:640, maxHeight:"90vh", overflowY:"auto", background:"linear-gradient(145deg,#161616,#0c0c0c)", border:"1px solid rgba(255,255,255,.08)", borderRadius:28, boxShadow:"0 40px 100px rgba(0,0,0,.9)", animation:"modalIn .3s cubic-bezier(.4,0,.2,1)" }}>
        {/* ambient glow */}
        <div style={{ position:"absolute", top:0, right:0, width:280, height:280, background:"radial-gradient(circle,rgba(255,186,0,.06),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />

        {/* Header */}
        <div style={{ position:"sticky", top:0, zIndex:10, background:"rgba(6,6,6,.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,.06)", padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", borderRadius:"28px 28px 0 0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, background:"linear-gradient(135deg,#ffba00,#f97316)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <ISpark s={20} />
            </div>
            <div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:18 }}>{item?"تعديل المحتوى":"إضافة محتوى جديد"}</div>
              <div style={{ color:"rgba(255,255,255,.22)", fontSize:10, letterSpacing:".12em", textTransform:"uppercase", marginTop:1 }}>{item?"EDIT CONTENT":"NEW CONTENT"}</div>
            </div>
          </div>
          <button onClick={()=>!saving&&onClose()} style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", color:"rgba(255,255,255,.45)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.color="rgba(255,255,255,.45)";}}>
            <IX s={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ padding:"22px 24px", display:"flex", flexDirection:"column", gap:18 }}>

          {/* Type toggle */}
          <Field label="نوع المحتوى" icon={<IFile s={13}/>}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {["blog","recipe"].map(t => (
                <button key={t} type="button" onClick={()=>set("type",t)} style={{
                  padding:"14px", borderRadius:14, fontWeight:900, fontSize:15, cursor:"pointer", border:"2px solid transparent", fontFamily:"Tajawal,sans-serif",
                  background: form.type===t ? (t==="blog"?"linear-gradient(135deg,#f97316,#ea580c)":"linear-gradient(135deg,#ffba00,#d97706)") : "rgba(255,255,255,.04)",
                  color: form.type===t ? (t==="blog"?"#fff":"#000") : "rgba(255,255,255,.38)",
                  borderColor: form.type===t ? "transparent" : "rgba(255,255,255,.07)",
                  transform: form.type===t?"scale(1.02)":"scale(1)", transition:"all .2s",
                  boxShadow: form.type===t ? (t==="blog"?"0 8px 24px rgba(249,115,22,.3)":"0 8px 24px rgba(255,186,0,.3)") : "none",
                }}>
                  {t==="blog"?"📝 تدوينة":"🍳 وصفة"}
                </button>
              ))}
            </div>
          </Field>

          {/* Image */}
          <Field label="رابط صورة الغلاف *" icon={<IImg s={13}/>} error={errs.image_url}>
            <input type="url" value={form.image_url} disabled={saving}
              onChange={e=>{set("image_url",e.target.value);setErrs(p=>({...p,image_url:""}));setImgOk(false);}}
              placeholder="https://images.unsplash.com/photo-..." style={inp(errs.image_url)} />
            {form.image_url && (
              <div style={{ marginTop:8, borderRadius:12, overflow:"hidden", border:"1px solid rgba(255,255,255,.08)" }}>
                <img src={form.image_url} alt="preview"
                  onLoad={()=>setImgOk(true)} onError={()=>setImgOk(false)}
                  style={{ width:"100%", height:155, objectFit:"cover", display:imgOk?"block":"none" }} />
                {!imgOk && <div style={{ height:155, display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,.2)", fontSize:13 }}>جاري تحميل الصورة...</div>}
              </div>
            )}
          </Field>

          {/* Title */}
          <Field label="العنوان *" icon={<IFile s={13}/>} error={errs.title_ar}>
            <input type="text" value={form.title_ar} disabled={saving}
              onChange={e=>{set("title_ar",e.target.value);setErrs(p=>({...p,title_ar:""}));}}
              placeholder="أدخل عنواناً جذاباً..." style={inp(errs.title_ar)} />
          </Field>

          {/* Time */}
          <Field label={form.type==="blog"?"وقت القراءة":"وقت التحضير"} icon={<ITimer s={13}/>}>
            <input type="text" value={form.cooking_time_ar} disabled={saving}
              onChange={e=>set("cooking_time_ar",e.target.value)}
              placeholder="مثال: ١٥ دقيقة" style={inp(false)} />
          </Field>

          {/* Publisher – blog only */}
          {form.type==="blog" && (
            <Field label="اسم الناشر *" icon={<IFile s={13}/>} error={errs.publisher}>
              <input type="text" value={form.publisher} disabled={saving}
                onChange={e=>{set("publisher",e.target.value);setErrs(p=>({...p,publisher:""}));}}
                placeholder="مثال: د. أحمد محمد" style={inp(errs.publisher)} />
            </Field>
          )}

          {/* Content */}
          <Field label="المحتوى *" icon={<IBook s={13}/>} error={errs.content_ar}>
            <textarea value={form.content_ar} rows={6} disabled={saving}
              onChange={e=>{set("content_ar",e.target.value);setErrs(p=>({...p,content_ar:""}));}}
              placeholder="اكتب محتوى مفيد وجذاب..." style={{ ...inp(errs.content_ar), lineHeight:1.75 }} />
          </Field>

          {/* Actions */}
          <div style={{ display:"flex", gap:10, paddingTop:18, borderTop:"1px solid rgba(255,255,255,.06)" }}>
            <button type="button" onClick={onClose} disabled={saving}
              style={{ flex:1, padding:13, borderRadius:13, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:"rgba(255,255,255,.55)", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"Tajawal,sans-serif" }}>
              إلغاء
            </button>
            <button type="submit" disabled={saving}
              style={{ flex:2, padding:13, borderRadius:13, background:"linear-gradient(135deg,#ffba00,#f97316)", border:"none", color:"#000", fontWeight:900, fontSize:15, cursor:saving?"not-allowed":"pointer", opacity:saving?.7:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"Tajawal,sans-serif", transition:"opacity .2s" }}>
              {saving ? <><Spin dark/> جاري الحفظ...</> : item?"💾 حفظ التعديلات":"🚀 نشر المحتوى"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ id, onClose, onConfirm }) {
  const [busy, setBusy] = useState(false);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:99999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} dir="rtl">
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.9)", backdropFilter:"blur(20px)" }} onClick={onClose} />
      <div style={{ position:"relative", background:"linear-gradient(145deg,#181010,#0e0808)", border:"1px solid rgba(239,68,68,.25)", borderRadius:28, padding:"36px 32px", maxWidth:400, width:"100%", textAlign:"center", boxShadow:"0 40px 80px rgba(239,68,68,.2)", animation:"modalIn .3s ease-out" }}>
        <div style={{ position:"relative", width:88, height:88, margin:"0 auto 24px" }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(239,68,68,.2)", borderRadius:"50%", filter:"blur(18px)" }} />
          <div style={{ position:"relative", width:88, height:88, background:"rgba(239,68,68,.1)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid rgba(239,68,68,.3)" }}>
            <IWarn s={42} />
          </div>
        </div>
        <h3 style={{ fontSize:23, fontWeight:900, color:"#fff", marginBottom:10 }}>هل أنت متأكد؟</h3>
        <p style={{ color:"rgba(255,255,255,.45)", marginBottom:28, lineHeight:1.65, fontSize:15 }}>سيتم حذف هذا المحتوى نهائياً ولن تتمكن من استرجاعه.</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} disabled={busy}
            style={{ flex:1, padding:14, borderRadius:13, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:"rgba(255,255,255,.6)", fontWeight:700, cursor:"pointer", fontFamily:"Tajawal,sans-serif" }}>
            إلغاء
          </button>
          <button disabled={busy} onClick={async()=>{setBusy(true);await new Promise(r=>setTimeout(r,500));onConfirm(id);}}
            style={{ flex:1, padding:14, borderRadius:13, background:"linear-gradient(135deg,#dc2626,#b91c1c)", border:"none", color:"#fff", fontWeight:900, cursor:busy?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"Tajawal,sans-serif" }}>
            {busy?<><Spin/> جاري الحذف...</>:"🗑️ حذف نهائياً"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({ recipe, onClose }) {
  if (!recipe) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:99999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} dir="rtl">
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.9)", backdropFilter:"blur(20px)" }} onClick={onClose} />
      <div style={{ position:"relative", background:"linear-gradient(145deg,#161616,#0a0a0a)", border:"1px solid rgba(255,255,255,.09)", width:"100%", maxWidth:760, maxHeight:"90vh", overflow:"hidden", borderRadius:28, boxShadow:"0 40px 100px rgba(0,0,0,.9)", animation:"modalIn .3s ease-out" }}>
        <div style={{ position:"sticky", top:0, zIndex:10, background:"rgba(6,6,6,.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"16px 22px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ padding:"6px 14px", borderRadius:9, fontWeight:900, fontSize:12, background:recipe.type==="blog"?"rgba(249,115,22,.18)":"rgba(255,186,0,.18)", color:recipe.type==="blog"?"#f97316":"#ffba00", border:`1px solid ${recipe.type==="blog"?"rgba(249,115,22,.3)":"rgba(255,186,0,.3)"}` }}>
            {recipe.type==="blog"?"📝 تدوينة":"🍳 وصفة"}
          </span>
          <button onClick={onClose} style={{ width:34, height:34, borderRadius:9, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", color:"rgba(255,255,255,.5)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <IX s={16}/>
          </button>
        </div>
        <div style={{ overflowY:"auto", maxHeight:"calc(90vh - 68px)", padding:"28px 32px" }}>
          <div style={{ borderRadius:18, overflow:"hidden", marginBottom:26, border:"1px solid rgba(255,255,255,.07)", position:"relative" }}>
            <img src={recipe.image_url} alt={recipe.title_ar} style={{ width:"100%", height:290, objectFit:"cover", display:"block" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.6),transparent)" }} />
          </div>
          <h1 style={{ fontSize:34, fontWeight:900, color:"#fff", marginBottom:14, lineHeight:1.25 }}>{recipe.title_ar}</h1>
          {recipe.type==="blog" && recipe.publisher && (
            <div style={{ color:"rgba(255,255,255,.55)", fontWeight:700, fontSize:14, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              ✍️ الناشر: <span style={{ color:"#f97316" }}>{recipe.publisher}</span>
            </div>
          )}
          {recipe.cooking_time_ar && (
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px", background:"rgba(255,186,0,.09)", border:"1px solid rgba(255,186,0,.25)", borderRadius:10, marginBottom:22, color:"rgba(255,255,255,.8)", fontWeight:700, fontSize:14 }}>
              <IClock s={14}/> {recipe.cooking_time_ar}
            </div>
          )}
          <p style={{ color:"rgba(255,255,255,.72)", fontSize:16, lineHeight:1.9, whiteSpace:"pre-line" }}>{recipe.content_ar}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function RecipesDashboard() {
  const [recipes, setRecipes] = useState(SEED);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState({ open:false, item:null });
  const [delId,   setDelId]   = useState(null);
  const [preview, setPreview] = useState(null);
  const [toast,   setToast]   = useState(null);

  const toast$ = (msg, type="success") => setToast({ msg, type });

  useEffect(()=>{ const t=setTimeout(()=>setLoading(false), 850); return()=>clearTimeout(t); }, []);

  const handleSave = r => {
    if (r.id) {
      setRecipes(p => p.map(x => x.id===r.id ? {...x,...r} : x));
      toast$("✨ تم التحديث بنجاح");
    } else {
      setRecipes(p => [{ ...r, id:uid(), is_active:true }, ...p]);
      toast$("🎉 تم الإضافة بنجاح");
    }
    setModal({ open:false, item:null });
  };

  const handleDelete = id => {
    setRecipes(p => p.filter(r => r.id!==id));
    setDelId(null);
    toast$("🗑️ تم الحذف");
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#080808 0%,#101010 60%,#0c0c0c 100%)", fontFamily:"Tajawal,sans-serif" }} dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes modalIn { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes glow    { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        .rcard { transition:transform .38s cubic-bezier(.4,0,.2,1), box-shadow .38s, border-color .38s; }
        .rcard:hover { transform:translateY(-5px) scale(1.012) !important; box-shadow:0 28px 64px rgba(255,186,0,.14) !important; border-color:rgba(255,186,0,.38) !important; }
        .rcard:hover .rimg  { transform:scale(1.1) !important; }
        .rcard:hover .ract  { opacity:1 !important; transform:translateY(0) !important; }
        .rbtn:hover { transform:scale(1.18) !important; }
        .fadd:hover { transform:scale(1.05) !important; box-shadow:0 14px 44px rgba(255,186,0,.55) !important; }
      `}</style>

      {/* bg glows */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-8%", right:"-8%", width:660, height:660, background:"rgba(255,186,0,.035)", borderRadius:"50%", filter:"blur(130px)", animation:"glow 5s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"-8%", left:"-8%", width:560, height:560, background:"rgba(249,115,22,.035)", borderRadius:"50%", filter:"blur(110px)", animation:"glow 5s ease-in-out infinite", animationDelay:"1.8s" }} />
      </div>

      <div style={{ position:"relative", maxWidth:1200, margin:"0 auto", padding:"52px 22px 110px" }}>

        {/* ── Header ── */}
        <header style={{ marginBottom:56, animation:"fadeUp .5s ease-out" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"7px 16px", background:"rgba(255,186,0,.1)", border:"1px solid rgba(255,186,0,.22)", borderRadius:999, marginBottom:18 }}>
            <ISpark s={14}/>
            <span style={{ fontSize:12, fontWeight:800, color:"#ffba00", letterSpacing:".04em" }}>محرر المحتوى</span>
          </div>
          <h1 style={{ fontSize:"clamp(34px,5.5vw,60px)", fontWeight:900, background:"linear-gradient(135deg,#ffba00 0%,#fff 42%,#f97316 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.18, marginBottom:14 }}>
            إدارة المدونات والوصفات
          </h1>
          <p style={{ fontSize:16, color:"rgba(255,255,255,.38)", fontWeight:500, maxWidth:480 }}>
            شارك عملاءك محتوى صحي ووصفات مفيدة من خلال منصة متكاملة
          </p>

          {/* Stats */}
          <div style={{ display:"flex", gap:14, marginTop:26, flexWrap:"wrap" }}>
            {[
              { label:"إجمالي المحتوى", val:recipes.length,                              c:"#ffba00" },
              { label:"الوصفات",         val:recipes.filter(r=>r.type==="recipe").length, c:"#4ade80" },
              { label:"التدوينات",        val:recipes.filter(r=>r.type==="blog").length,   c:"#f97316" },
            ].map(s => (
              <div key={s.label} style={{ padding:"12px 22px", background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.07)", borderRadius:16 }}>
                <div style={{ fontSize:28, fontWeight:900, color:s.c, lineHeight:1 }}>{s.val}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.35)", fontWeight:600, marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* ── Loading ── */}
        {loading ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"120px 0", gap:18 }}>
            <div style={{ width:70, height:70, border:"4px solid rgba(255,186,0,.15)", borderTopColor:"#ffba00", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
            <p style={{ color:"rgba(255,255,255,.4)", fontWeight:700, fontSize:16 }}>جاري تحميل المحتوى...</p>
          </div>

        ) : recipes.length === 0 ? (
          <div style={{ background:"rgba(255,255,255,.02)", border:"2px dashed rgba(255,255,255,.07)", borderRadius:40, padding:"100px 24px", textAlign:"center", animation:"fadeUp .5s ease-out" }}>
            <div style={{ width:90, height:90, background:"rgba(255,186,0,.09)", border:"1px solid rgba(255,186,0,.18)", borderRadius:24, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
              <IBook s={46}/>
            </div>
            <h3 style={{ fontSize:28, fontWeight:900, color:"#fff", marginBottom:10 }}>لا يوجد محتوى بعد</h3>
            <p style={{ color:"rgba(255,255,255,.38)", fontSize:15, maxWidth:360, margin:"0 auto 28px", lineHeight:1.65 }}>ابدأ رحلتك في إنشاء محتوى مميز وشاركه مع عملائك</p>
            <button onClick={()=>setModal({open:true,item:null})}
              style={{ padding:"14px 34px", background:"linear-gradient(135deg,#ffba00,#f97316)", border:"none", borderRadius:16, color:"#000", fontWeight:900, fontSize:16, cursor:"pointer", fontFamily:"Tajawal,sans-serif", boxShadow:"0 8px 28px rgba(255,186,0,.4)" }}>
              ➕ أضف أول محتوى
            </button>
          </div>

        ) : (
          /* ── Cards grid ── */
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:24 }}>
            {recipes.map((r, i) => (
              <article key={r.id} className="rcard"
                style={{ background:"linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.022))", border:"1px solid rgba(255,255,255,.09)", borderRadius:24, overflow:"hidden", cursor:"pointer", animation:`fadeUp .4s ease-out ${i*.08}s both`, position:"relative" }}
                onClick={()=>setPreview(r)}
              >
                {/* Image zone */}
                <div style={{ height:208, overflow:"hidden", position:"relative" }}>
                  <img className="rimg" src={r.image_url} alt={r.title_ar}
                    style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform .7s ease" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.82) 0%,rgba(0,0,0,.08) 55%,transparent 100%)" }} />

                  {/* Type badge – top right */}
                  <div style={{ position:"absolute", top:12, right:12, padding:"5px 12px", borderRadius:8, fontWeight:900, fontSize:12, backdropFilter:"blur(10px)", background:r.type==="blog"?"rgba(249,115,22,.88)":"rgba(255,186,0,.9)", color:r.type==="blog"?"#fff":"#000" }}>
                    {r.type==="blog"?"📝 تدوينة":"🍳 وصفة"}
                  </div>

                  {/* Action buttons – top left, appear on hover */}
                  <div className="ract"
                    style={{ position:"absolute", top:12, left:12, display:"flex", gap:7, opacity:0, transform:"translateY(-6px)", transition:"all .28s ease" }}
                    onClick={e=>e.stopPropagation()}
                  >
                    <button className="rbtn"
                      onClick={()=>setModal({open:true,item:r})}
                      title="تعديل"
                      style={{ width:35, height:35, borderRadius:10, background:"rgba(0,0,0,.7)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,.18)", color:"#ffba00", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"transform .2s", boxShadow:"0 4px 16px rgba(0,0,0,.5)" }}>
                      <IEdit s={14}/>
                    </button>
                    <button className="rbtn"
                      onClick={()=>setDelId(r.id)}
                      title="حذف"
                      style={{ width:35, height:35, borderRadius:10, background:"rgba(0,0,0,.7)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,.18)", color:"#f87171", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"transform .2s", boxShadow:"0 4px 16px rgba(0,0,0,.5)" }}>
                      <ITrash s={14}/>
                    </button>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding:"17px 19px 20px" }}>
                  <h3 style={{ fontSize:17, fontWeight:900, color:"#fff", marginBottom:7, lineHeight:1.38, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                    {r.title_ar}
                  </h3>
                  <p style={{ fontSize:13, color:"rgba(255,255,255,.36)", lineHeight:1.62, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", marginBottom:14 }}>
                    {r.content_ar}
                  </p>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    {r.cooking_time_ar
                      ? <div style={{ display:"flex", alignItems:"center", gap:6, color:"rgba(255,255,255,.4)", fontSize:13, fontWeight:600 }}><IClock s={13}/>{r.cooking_time_ar}</div>
                      : <div/>
                    }
                    <button onClick={e=>{e.stopPropagation();setPreview(r);}}
                      style={{ display:"flex", alignItems:"center", gap:5, color:"rgba(255,255,255,.26)", fontSize:12, fontWeight:700, background:"none", border:"none", cursor:"pointer", fontFamily:"Tajawal,sans-serif", transition:"color .2s" }}
                      onMouseEnter={e=>e.currentTarget.style.color="#ffba00"}
                      onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.26)"}>
                      <IEye s={13}/> معاينة
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ── FAB ── */}
      <button className="fadd"
        onClick={()=>setModal({open:true,item:null})}
        style={{ position:"fixed", bottom:30, left:30, zIndex:9000, display:"flex", alignItems:"center", gap:10, padding:"14px 24px", background:"linear-gradient(135deg,#ffba00,#f97316)", border:"none", borderRadius:20, color:"#000", fontWeight:900, fontSize:15, cursor:"pointer", boxShadow:"0 8px 32px rgba(255,186,0,.42)", fontFamily:"Tajawal,sans-serif", transition:"transform .3s, box-shadow .3s" }}>
        <IPlus s={20}/> إضافة محتوى
      </button>

      {/* ── Modals ── */}
      <RecipeModal open={modal.open} item={modal.item} onClose={()=>setModal({open:false,item:null})} onSave={handleSave}/>
      {delId   && <DeleteModal  id={delId}  onClose={()=>setDelId(null)}  onConfirm={handleDelete}/>}
      {preview && <PreviewModal recipe={preview} onClose={()=>setPreview(null)}/>}
      {toast   && <Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
    </div>
  );
}