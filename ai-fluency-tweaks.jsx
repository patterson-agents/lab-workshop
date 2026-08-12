/* Tweaks for the TechDays: AI Fluency - Agentic Agents deck. */
const { useEffect: useEffectETA } = React;

const ETA_ACCENTS = [
  "#00A8E1",  // Patterson sky
  "#147EC2",  // blue
  "#00817D",  // teal
  "#7BC24D",  // green
  "#522E91",  // purple
];

const ETA_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#00A8E1",
  "type_scale": 1.0,
  "show_grid": false,
  "grid_opacity": 0.5,
  "speaker": "Daniel Bodnar"
}/*EDITMODE-END*/;

function applyEtaTweaks(t) {
  const r = document.documentElement;
  r.setAttribute('data-theme', t.theme);
  r.style.setProperty('--accent-raw', t.accent);
  r.style.setProperty('--type-scale', String(t.type_scale));
  r.style.setProperty('--grid-opacity', String(t.grid_opacity));
  r.classList.toggle('no-grain', !t.show_grid);
  document.querySelectorAll('[data-tweak]').forEach(el => {
    const k = el.getAttribute('data-tweak');
    if (k && t[k] != null) el.textContent = t[k];
  });
}

function EtaTweaks() {
  const [t, setTweak] = useTweaks(ETA_DEFAULTS);
  useEffectETA(() => { applyEtaTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks" width={290}>
      <TweakSection title="Theme">
        <TweakRadio value={t.theme} onChange={v => setTweak('theme', v)}
          options={[{value:'light',label:'Light'},{value:'dark',label:'Navy'}]} />
      </TweakSection>

      <TweakSection title="Accent">
        <TweakColor value={t.accent} onChange={v => setTweak('accent', v)} options={ETA_ACCENTS} />
      </TweakSection>

      <TweakSection title="Type scale">
        <TweakSlider label="scale" value={t.type_scale} onChange={v=>setTweak('type_scale',v)} min={0.8} max={1.2} step={0.01} unit="x" />
      </TweakSection>

      <TweakSection title="Blueprint grid">
        <TweakToggle label="Show grid" value={t.show_grid} onChange={v=>setTweak('show_grid',v)} />
        <TweakSlider label="opacity" value={t.grid_opacity} onChange={v=>setTweak('grid_opacity',v)} min={0} max={1} step={0.05} />
      </TweakSection>

      <TweakSection title="Presenter">
        <TweakText label="name" value={t.speaker} onChange={v=>setTweak('speaker',v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

applyEtaTweaks(ETA_DEFAULTS);
const etaRoot = document.createElement('div');
etaRoot.id = 'tweaks-root';
document.body.appendChild(etaRoot);
ReactDOM.createRoot(etaRoot).render(<EtaTweaks />);
