const TWEAK_DEFAULTS = {
  "accent": "#7dd9b5",
  "showToasts": true
} ;
const CORAL_FOR = {
  "#7dd9b5": "oklch(0.72 0.14 30)",

  "#e3c277": "oklch(0.72 0.14 20)",

  "#a99cef": "oklch(0.74 0.14 25)",

  "#e6a3a8": "oklch(0.78 0.12 60)"
};
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => {
    document.documentElement.style.setProperty("--vl-accent", t.accent);
    document.documentElement.style.setProperty("--vl-coral", CORAL_FOR[t.accent] || "oklch(0.72 0.14 30)");
  }, [t.accent]);
  return React.createElement(React.Fragment, null, React.createElement(DesignCanvas, {
    defaultZoom: 0.72,
    title: "Kirmy \u2014 privacy-first browser"
  }, React.createElement(DCSection, {
    id: "desktop",
    title: "Desktop \xB7 macOS-style window"
  }, React.createElement(DCArtboard, {
    id: "desktop-main",
    label: "Privacy dashboard \xB7 1280\xD7800",
    width: 1280,
    height: 800
  }, React.createElement(DesktopBrowser, {
    showToasts: t.showToasts
  }))), React.createElement(DCSection, {
    id: "mobile",
    title: "Mobile \xB7 390\xD7844"
  }, React.createElement(DCArtboard, {
    id: "mobile-main",
    label: "Privacy dashboard",
    width: 390,
    height: 844
  }, React.createElement(MobileBrowser, null)))), React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, React.createElement(TweakSection, {
    title: "Accent"
  }, React.createElement(TweakColor, {
    label: "Signature colour",
    value: t.accent,
    onChange: v => setTweak("accent", v),
    options: ["#7dd9b5", "#e3c277", "#a99cef", "#e6a3a8"]
  })), React.createElement(TweakSection, {
    title: "Behaviour"
  }, React.createElement(TweakToggle, {
    label: "Show blocked toasts",
    value: t.showToasts,
    onChange: v => setTweak("showToasts", v)
  }))));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
