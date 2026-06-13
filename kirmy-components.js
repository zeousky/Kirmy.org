function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

const {
  useState,
  useEffect,
  useRef,
  useMemo
} = React;

const ShieldIcon = ({
  size = 14,
  color = "currentColor",
  glow = false
}) => React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 16 16",
  fill: "none",
  style: {
    filter: glow ? `drop-shadow(0 0 6px ${color})` : "none",
    transition: "filter .3s"
  }
}, React.createElement("path", {
  d: "M8 1.2 L13.2 3.2 V8 C13.2 11.2 10.8 13.6 8 14.6 C5.2 13.6 2.8 11.2 2.8 8 V3.2 Z",
  stroke: color,
  strokeWidth: "1.2",
  strokeLinejoin: "round",
  fill: "none"
}), React.createElement("path", {
  d: "M5.4 8 L7.2 9.8 L10.6 6.4",
  stroke: color,
  strokeWidth: "1.2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
const KirmyWordmark = ({
  size = 14,
  color = "currentColor"
}) => React.createElement("div", {
  style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "Geist, sans-serif",
    fontWeight: 600,
    fontSize: size,
    letterSpacing: "-0.01em",
    color
  }
}, React.createElement(ShieldIcon, {
  size: size + 2,
  color: color
}), " kirmy");

const TrackerCounter = ({
  count,
  color
}) => {
  const [display, setDisplay] = useState(count);
  const [pulse, setPulse] = useState(false);
  const prev = useRef(count);
  useEffect(() => {
    if (count !== prev.current) {
      setPulse(true);
      const start = prev.current;
      const diff = count - start;
      const t0 = performance.now();
      const dur = 600;
      let raf;
      const tick = t => {
        const k = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        setDisplay(Math.round(start + diff * eased));
        if (k < 1) raf = requestAnimationFrame(tick);else {
          prev.current = count;
          setTimeout(() => setPulse(false), 400);
        }
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }
  }, [count]);
  return React.createElement("span", {
    style: {
      fontFamily: "Geist Mono, monospace",
      fontWeight: 500,
      color,
      transform: pulse ? "scale(1.08)" : "scale(1)",
      transition: "transform .25s cubic-bezier(.34,1.56,.64,1)",
      display: "inline-block"
    }
  }, display.toLocaleString());
};

const TrackerBar = ({
  label,
  value,
  max,
  color,
  delay = 0
}) => {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setW(value / max * 100), delay);
    return () => clearTimeout(id);
  }, [value, max, delay]);
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginBottom: 14
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 12,
      color: "var(--vl-muted)"
    }
  }, React.createElement("span", {
    style: {
      fontFamily: "Geist, sans-serif"
    }
  }, label), React.createElement("span", {
    style: {
      fontFamily: "Geist Mono, monospace",
      color: "var(--vl-text)"
    }
  }, value)), React.createElement("div", {
    style: {
      height: 6,
      background: "var(--vl-surface-2)",
      borderRadius: 999,
      overflow: "hidden"
    }
  }, React.createElement("div", {
    style: {
      height: "100%",
      width: `${w}%`,
      background: color,
      borderRadius: 999,
      transition: "width 1.2s cubic-bezier(.22,1,.36,1)",
      boxShadow: `0 0 12px ${color}66`
    }
  })));
};

const initialTabs = [{
  id: 1,
  title: "Privacy report — kirmy",
  url: "kirmy://privacy",
  favicon: "shield",
  trackers: 247
}, {
  id: 2,
  title: "Manifesto · v 0.4.2",
  url: "kirmy.org/manifesto",
  favicon: "doc",
  trackers: 0
}, {
  id: 3,
  title: "Decentralised search",
  url: "search.kirmy",
  favicon: "search",
  trackers: 3
}, {
  id: 4,
  title: "Source · github",
  url: "github.com/kirmy-browser",
  favicon: "code",
  trackers: 12
}];
const Favicon = ({
  kind,
  size = 12
}) => {
  const c = "var(--vl-accent)";
  if (kind === "shield") return React.createElement(ShieldIcon, {
    size: size,
    color: c
  });
  if (kind === "doc") return React.createElement("div", {
    style: {
      width: size,
      height: size,
      border: `1.2px solid ${c}`,
      borderRadius: 2
    }
  });
  if (kind === "search") return React.createElement("div", {
    style: {
      width: size,
      height: size,
      border: `1.2px solid ${c}`,
      borderRadius: "50%"
    }
  });
  if (kind === "code") return React.createElement("div", {
    style: {
      fontFamily: "Geist Mono, monospace",
      fontSize: size,
      color: c,
      lineHeight: 1
    }
  }, "<>");
  return React.createElement("div", {
    style: {
      width: size,
      height: size,
      background: c,
      borderRadius: 2
    }
  });
};
const DesktopBrowser = ({
  showToasts = true
}) => {
  const [tabs, setTabs] = useState(initialTabs);
  const [activeId, setActiveId] = useState(1);
  const [urlFocus, setUrlFocus] = useState(false);
  const [loadKey, setLoadKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [blockedTotal, setBlockedTotal] = useState(247);
  const [toast, setToast] = useState(null);
  const [sidebarHover, setSidebarHover] = useState(null);
  const closingRef = useRef(new Set());
  const active = tabs.find(t => t.id === activeId) || tabs[0];

  useEffect(() => {
    const id = setInterval(() => {
      const samples = ["doubleclick.net", "facebook.net", "googletagmanager", "hotjar.com", "segment.io", "amplitude.com"];
      const s = samples[Math.floor(Math.random() * samples.length)];
      setBlockedTotal(b => b + 1);
      if (showToasts) {
        setToast({
          id: Date.now(),
          text: s
        });
        setTimeout(() => setToast(t => t && t.text === s ? null : t), 2400);
      }
    }, 4200);
    return () => clearInterval(id);
  }, [showToasts]);
  const switchTab = id => {
    if (id === activeId) return;
    setActiveId(id);
    setLoadKey(k => k + 1);
    setLoading(true);
    setTimeout(() => setLoading(false), 900);
  };
  const newTab = () => {
    const id = Date.now();
    setTabs(t => [...t, {
      id,
      title: "New tab",
      url: "",
      favicon: "shield",
      trackers: 0
    }]);
    setActiveId(id);
    setLoadKey(k => k + 1);
  };
  const closeTab = (id, e) => {
    e.stopPropagation();
    closingRef.current.add(id);

    setTabs(ts => ts.map(t => t.id === id ? {
      ...t,
      _closing: true
    } : t));
    setTimeout(() => {
      setTabs(ts => ts.filter(t => t.id !== id));
      closingRef.current.delete(id);
      setActiveId(curr => {
        if (curr !== id) return curr;
        const remaining = tabs.filter(t => t.id !== id);
        return remaining.length ? remaining[0].id : null;
      });
    }, 220);
  };
  return React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: "var(--vl-bg)",
      color: "var(--vl-text)",
      fontFamily: "Geist, sans-serif",
      borderRadius: 12,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }
  }, React.createElement("div", {
    style: {
      height: 40,
      background: "var(--vl-bg)",
      borderBottom: "1px solid var(--vl-line)",
      display: "flex",
      alignItems: "flex-end",
      paddingLeft: 12,
      gap: 8,
      flexShrink: 0
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      paddingBottom: 12,
      marginRight: 8
    }
  }, ["#ff5f57", "#febc2e", "#28c840"].map((c, i) => React.createElement("div", {
    key: i,
    style: {
      width: 11,
      height: 11,
      borderRadius: "50%",
      background: c,
      opacity: 0.85
    }
  }))), React.createElement("div", {
    style: {
      display: "flex",
      gap: 2,
      alignItems: "flex-end",
      flex: 1,
      overflow: "hidden"
    }
  }, tabs.map(tab => {
    const isActive = tab.id === activeId;
    const closing = tab._closing;
    return React.createElement("div", {
      key: tab.id,
      onClick: () => switchTab(tab.id),
      style: {
        height: 30,
        maxWidth: closing ? 0 : 200,
        minWidth: closing ? 0 : 60,
        padding: closing ? "0" : "0 10px",
        borderRadius: "8px 8px 0 0",
        background: isActive ? "var(--vl-surface)" : "transparent",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        color: isActive ? "var(--vl-text)" : "var(--vl-muted)",
        cursor: "pointer",
        position: "relative",
        transition: "max-width .22s cubic-bezier(.34,1.56,.64,1), min-width .22s, padding .22s, background .15s, color .15s",
        overflow: "hidden",
        whiteSpace: "nowrap",
        opacity: closing ? 0 : 1
      },
      onMouseEnter: e => !isActive && (e.currentTarget.style.background = "var(--vl-surface-1)"),
      onMouseLeave: e => !isActive && (e.currentTarget.style.background = "transparent")
    }, React.createElement(Favicon, {
      kind: tab.favicon
    }), React.createElement("span", {
      style: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        flex: 1
      }
    }, tab.title), React.createElement("button", {
      onClick: e => closeTab(tab.id, e),
      style: {
        width: 16,
        height: 16,
        borderRadius: 4,
        border: "none",
        background: "transparent",
        color: "var(--vl-muted)",
        cursor: "pointer",
        fontSize: 14,
        lineHeight: 1,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      onMouseEnter: e => e.currentTarget.style.background = "var(--vl-surface-2)",
      onMouseLeave: e => e.currentTarget.style.background = "transparent"
    }, "\xD7"));
  }), React.createElement("button", {
    onClick: newTab,
    style: {
      width: 28,
      height: 28,
      borderRadius: 6,
      border: "none",
      background: "transparent",
      color: "var(--vl-muted)",
      fontSize: 16,
      cursor: "pointer",
      marginBottom: 1,
      transition: "background .15s, color .15s"
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = "var(--vl-surface-1)";
      e.currentTarget.style.color = "var(--vl-text)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "var(--vl-muted)";
    }
  }, "+"))), React.createElement("div", {
    style: {
      height: 2,
      position: "relative",
      overflow: "hidden",
      background: "var(--vl-surface)"
    }
  }, loading && React.createElement("div", {
    key: loadKey,
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(90deg, transparent, var(--vl-accent), transparent)",
      animation: "vlSweep .9s linear"
    }
  })), React.createElement("div", {
    style: {
      height: 48,
      background: "var(--vl-surface)",
      borderBottom: "1px solid var(--vl-line)",
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      gap: 8,
      flexShrink: 0
    }
  }, React.createElement(ToolbarBtn, {
    label: "\u2190"
  }), React.createElement(ToolbarBtn, {
    label: "\u2192",
    disabled: true
  }), React.createElement(ToolbarBtn, {
    label: "\u21BB",
    onClick: () => {
      setLoadKey(k => k + 1);
      setLoading(true);
      setTimeout(() => setLoading(false), 900);
    }
  }), React.createElement("div", {
    style: {
      flex: 1,
      height: 32,
      background: urlFocus ? "var(--vl-surface-2)" : "var(--vl-surface-1)",
      border: `1px solid ${urlFocus ? "var(--vl-accent)" : "transparent"}`,
      boxShadow: urlFocus ? "0 0 0 3px color-mix(in oklab, var(--vl-accent) 18%, transparent)" : "none",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      padding: "0 10px",
      gap: 10,
      fontSize: 13,
      transition: "all .2s cubic-bezier(.22,1,.36,1)",
      cursor: "text"
    },
    onClick: () => setUrlFocus(true),
    onBlur: () => setUrlFocus(false),
    tabIndex: 0
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "3px 8px",
      background: "color-mix(in oklab, var(--vl-accent) 15%, transparent)",
      borderRadius: 6,
      color: "var(--vl-accent)",
      fontSize: 11,
      fontFamily: "Geist Mono, monospace"
    }
  }, React.createElement(ShieldIcon, {
    size: 11,
    color: "var(--vl-accent)",
    glow: true
  }), React.createElement(TrackerCounter, {
    count: blockedTotal,
    color: "var(--vl-accent)"
  }), React.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, "blocked")), React.createElement("span", {
    style: {
      fontFamily: "Geist Mono, monospace",
      color: "var(--vl-muted)"
    }
  }, "kirmy://"), React.createElement("span", {
    style: {
      fontFamily: "Geist Mono, monospace",
      color: "var(--vl-text)",
      flex: 1
    }
  }, active ? active.url.replace(/^kirmy:\/\//, "") : ""), React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      color: "var(--vl-muted)"
    }
  }, React.createElement("span", {
    style: {
      fontSize: 12
    }
  }, "\u2606"))), React.createElement(ToolbarBtn, {
    label: "\u2325"
  }), React.createElement(ToolbarBtn, {
    label: "\u22EF"
  }), React.createElement("div", {
    style: {
      width: 26,
      height: 26,
      borderRadius: "50%",
      background: "linear-gradient(135deg, var(--vl-accent), color-mix(in oklab, var(--vl-accent) 40%, var(--vl-coral)))",
      border: "1.5px solid var(--vl-surface-2)"
    }
  })), React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      minHeight: 0
    }
  }, React.createElement("div", {
    style: {
      width: 44,
      background: "var(--vl-bg)",
      borderRight: "1px solid var(--vl-line)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "12px 0",
      gap: 4
    }
  }, ["⌂", "★", "↓", "⌚", "⚙"].map((g, i) => React.createElement("button", {
    key: i,
    onMouseEnter: () => setSidebarHover(i),
    onMouseLeave: () => setSidebarHover(null),
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      border: "none",
      background: sidebarHover === i ? "var(--vl-surface-1)" : "transparent",
      color: sidebarHover === i ? "var(--vl-accent)" : "var(--vl-muted)",
      fontSize: 14,
      cursor: "pointer",
      transform: sidebarHover === i ? "scale(1.08)" : "scale(1)",
      transition: "all .18s cubic-bezier(.34,1.56,.64,1)"
    }
  }, g))), React.createElement("div", {
    style: {
      flex: 1,
      position: "relative",
      overflow: "hidden",
      background: "var(--vl-bg)"
    }
  }, React.createElement("div", {
    key: `${activeId}-${loadKey}`,
    style: {
      position: "absolute",
      inset: 0,
      animation: "vlFadeUp .45s cubic-bezier(.22,1,.36,1) both",
      overflow: "auto"
    }
  }, React.createElement(PrivacyDashboard, {
    blockedTotal: blockedTotal
  })))), React.createElement("div", {
    style: {
      position: "absolute",
      right: 18,
      bottom: 18,
      pointerEvents: "none",
      zIndex: 5
    }
  }, toast && React.createElement("div", {
    key: toast.id,
    style: {
      background: "var(--vl-surface-2)",
      border: "1px solid var(--vl-line)",
      borderLeft: `2px solid var(--vl-accent)`,
      borderRadius: 8,
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 12,
      color: "var(--vl-text)",
      fontFamily: "Geist, sans-serif",
      boxShadow: "0 12px 32px rgba(0,0,0,.4)",
      animation: "vlToast 2.4s cubic-bezier(.22,1,.36,1) both",
      minWidth: 240
    }
  }, React.createElement(ShieldIcon, {
    size: 14,
    color: "var(--vl-accent)",
    glow: true
  }), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      color: "var(--vl-muted)",
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: "0.08em"
    }
  }, "Tracker blocked"), React.createElement("div", {
    style: {
      fontFamily: "Geist Mono, monospace"
    }
  }, toast.text)))));
};
const ToolbarBtn = ({
  label,
  onClick,
  disabled
}) => React.createElement("button", {
  onClick: onClick,
  disabled: disabled,
  style: {
    width: 30,
    height: 30,
    borderRadius: 6,
    border: "none",
    background: "transparent",
    color: disabled ? "var(--vl-muted-2)" : "var(--vl-muted)",
    fontSize: 14,
    cursor: disabled ? "default" : "pointer",
    transition: "background .15s, color .15s, transform .1s"
  },
  onMouseEnter: e => {
    if (!disabled) {
      e.currentTarget.style.background = "var(--vl-surface-1)";
      e.currentTarget.style.color = "var(--vl-text)";
    }
  },
  onMouseLeave: e => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.color = disabled ? "var(--vl-muted-2)" : "var(--vl-muted)";
  },
  onMouseDown: e => !disabled && (e.currentTarget.style.transform = "scale(0.92)"),
  onMouseUp: e => e.currentTarget.style.transform = "scale(1)"
}, label);

const PrivacyDashboard = ({
  blockedTotal
}) => {
  const trackers = [{
    label: "Ad networks",
    value: 142,
    color: "var(--vl-accent)"
  }, {
    label: "Analytics",
    value: 68,
    color: "color-mix(in oklab, var(--vl-accent) 70%, var(--vl-coral))"
  }, {
    label: "Social embeds",
    value: 24,
    color: "var(--vl-coral)"
  }, {
    label: "Fingerprinters",
    value: 13,
    color: "color-mix(in oklab, var(--vl-coral) 60%, white)"
  }];
  return React.createElement("div", {
    style: {
      padding: "32px 40px 60px",
      maxWidth: 880,
      margin: "0 auto"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 28
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--vl-muted)",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      marginBottom: 6
    }
  }, "Last 7 days"), React.createElement("h1", {
    style: {
      fontSize: 38,
      fontWeight: 600,
      margin: 0,
      letterSpacing: "-0.02em",
      lineHeight: 1.05,
      color: "var(--vl-text)"
    }
  }, React.createElement(TrackerCounter, {
    count: blockedTotal,
    color: "var(--vl-accent)"
  }), " ", React.createElement("span", {
    style: {
      color: "var(--vl-muted)",
      fontWeight: 400
    }
  }, "trackers stopped")), React.createElement("p", {
    style: {
      color: "var(--vl-muted)",
      fontSize: 13,
      marginTop: 8,
      maxWidth: 480,
      lineHeight: 1.5
    }
  }, "Nothing here leaves your machine. This page is the only one that knows what got blocked \u2014 and it forgets after 30 days.")), React.createElement("div", {
    style: {
      width: 88,
      height: 88,
      borderRadius: "50%",
      background: "color-mix(in oklab, var(--vl-accent) 12%, transparent)",
      border: "1px solid color-mix(in oklab, var(--vl-accent) 35%, transparent)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative"
    }
  }, React.createElement("div", {
    style: {
      position: "absolute",
      inset: -4,
      borderRadius: "50%",
      border: "1px solid var(--vl-accent)",
      opacity: 0.4,
      animation: "vlPulse 2.4s ease-out infinite"
    }
  }), React.createElement(ShieldIcon, {
    size: 36,
    color: "var(--vl-accent)",
    glow: true
  }))), React.createElement("div", {
    style: {
      background: "var(--vl-surface)",
      border: "1px solid var(--vl-line)",
      borderRadius: 12,
      padding: 24,
      marginBottom: 18
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 18
    }
  }, React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 13,
      fontWeight: 600,
      color: "var(--vl-text)"
    }
  }, "What we blocked"), React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--vl-muted)",
      fontFamily: "Geist Mono, monospace"
    }
  }, "247 total")), trackers.map((t, i) => React.createElement(TrackerBar, _extends({
    key: t.label
  }, t, {
    max: 150,
    delay: i * 120
  })))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 12
    }
  }, React.createElement(ToggleCard, {
    title: "Strict mode",
    desc: "Block all known trackers + 3rd-party cookies",
    on: true
  }), React.createElement(ToggleCard, {
    title: "Fingerprint shield",
    desc: "Randomise canvas + audio signatures",
    on: true
  }), React.createElement(ToggleCard, {
    title: "Tor relay",
    desc: "Route private windows through Tor",
    on: false
  })));
};
const ToggleCard = ({
  title,
  desc,
  on: initial
}) => {
  const [on, setOn] = useState(initial);
  return React.createElement("div", {
    style: {
      background: "var(--vl-surface)",
      border: "1px solid var(--vl-line)",
      borderRadius: 12,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      transition: "border-color .2s"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 8
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--vl-text)"
    }
  }, title), React.createElement("button", {
    onClick: () => setOn(!on),
    style: {
      width: 32,
      height: 18,
      borderRadius: 999,
      background: on ? "var(--vl-accent)" : "var(--vl-surface-2)",
      border: "none",
      cursor: "pointer",
      position: "relative",
      transition: "background .2s"
    }
  }, React.createElement("div", {
    style: {
      position: "absolute",
      top: 2,
      left: on ? 16 : 2,
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: on ? "var(--vl-bg)" : "var(--vl-muted)",
      transition: "left .25s cubic-bezier(.34,1.56,.64,1), background .2s"
    }
  }))), React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--vl-muted)",
      lineHeight: 1.4
    }
  }, desc));
};

const MobileBrowser = () => {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [blocked, setBlocked] = useState(247);
  const [pageKey, setPageKey] = useState(0);
  const [tabSheetOpen, setTabSheetOpen] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setBlocked(b => b + 1), 5200);
    return () => clearInterval(id);
  }, []);
  const triggerRefresh = () => {
    setPulling(true);
    setTimeout(() => {
      setRefreshing(true);
      setPulling(false);
      setTimeout(() => {
        setRefreshing(false);
        setPageKey(k => k + 1);
      }, 1200);
    }, 200);
  };
  return React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: "var(--vl-bg)",
      color: "var(--vl-text)",
      fontFamily: "Geist, sans-serif",
      borderRadius: 36,
      overflow: "hidden",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      border: "8px solid #0a0a0a",
      boxSizing: "border-box"
    }
  }, React.createElement("div", {
    style: {
      height: 44,
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--vl-text)",
      fontFamily: "Geist, sans-serif",
      flexShrink: 0
    }
  }, React.createElement("span", null, "9:41"), React.createElement("div", {
    style: {
      width: 90,
      height: 28,
      background: "#0a0a0a",
      borderRadius: 16,
      marginTop: 4
    }
  }), React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      fontFamily: "Geist Mono, monospace",
      fontSize: 11
    }
  }, React.createElement("span", null, "5G"), React.createElement("span", null, "100"))), React.createElement("div", {
    style: {
      padding: "8px 16px 12px",
      flexShrink: 0
    }
  }, React.createElement("div", {
    style: {
      height: 42,
      background: "var(--vl-surface)",
      borderRadius: 14,
      padding: "0 12px",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, React.createElement("div", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 8,
      background: "color-mix(in oklab, var(--vl-accent) 15%, transparent)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(ShieldIcon, {
    size: 14,
    color: "var(--vl-accent)",
    glow: true
  })), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--vl-muted)",
      fontFamily: "Geist Mono, monospace",
      lineHeight: 1
    }
  }, "kirmy://"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--vl-text)",
      fontFamily: "Geist Mono, monospace",
      lineHeight: 1.3,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, "privacy")), React.createElement("div", {
    style: {
      fontSize: 10,
      color: "var(--vl-accent)",
      fontFamily: "Geist Mono, monospace",
      padding: "3px 6px",
      background: "color-mix(in oklab, var(--vl-accent) 12%, transparent)",
      borderRadius: 6
    }
  }, React.createElement(TrackerCounter, {
    count: blocked,
    color: "var(--vl-accent)"
  })))), React.createElement("div", {
    style: {
      flex: 1,
      position: "relative",
      overflow: "hidden"
    }
  }, React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      height: pulling || refreshing ? 50 : 0,
      width: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "height .25s",
      zIndex: 2
    }
  }, React.createElement("div", {
    style: {
      animation: refreshing ? "vlSpin 1.1s linear infinite" : "none",
      opacity: pulling || refreshing ? 1 : 0,
      transition: "opacity .2s"
    }
  }, React.createElement(ShieldIcon, {
    size: 22,
    color: "var(--vl-accent)",
    glow: true
  }))), React.createElement("div", {
    key: pageKey,
    style: {
      position: "absolute",
      inset: 0,
      overflowY: "auto",
      animation: "vlFadeUp .4s cubic-bezier(.22,1,.36,1) both",
      padding: "8px 16px 90px"
    },
    onClick: e => {

      const now = Date.now();
      if (e.currentTarget._last && now - e.currentTarget._last < 350) triggerRefresh();
      e.currentTarget._last = now;
    }
  }, React.createElement(MobilePrivacyContent, {
    blocked: blocked
  }))), React.createElement("div", {
    style: {
      height: 64,
      background: "var(--vl-surface)",
      borderTop: "1px solid var(--vl-line)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      padding: "0 12px",
      flexShrink: 0,
      position: "relative",
      zIndex: 3
    }
  }, [{
    icon: "←",
    action: null
  }, {
    icon: "→",
    action: null,
    disabled: true
  }, {
    icon: "◯",
    action: triggerRefresh
  }, {
    icon: "▢",
    action: () => setTabSheetOpen(true),
    badge: 4
  }, {
    icon: "⋯",
    action: null
  }].map((b, i) => React.createElement("button", {
    key: i,
    onClick: b.action || (() => {}),
    style: {
      width: 44,
      height: 44,
      borderRadius: 12,
      background: "transparent",
      border: "none",
      color: b.disabled ? "var(--vl-muted-2)" : "var(--vl-text)",
      fontSize: 18,
      cursor: "pointer",
      position: "relative",
      transition: "background .15s, transform .1s"
    },
    onMouseDown: e => e.currentTarget.style.background = "var(--vl-surface-1)",
    onMouseUp: e => e.currentTarget.style.background = "transparent",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, b.icon, b.badge && React.createElement("span", {
    style: {
      position: "absolute",
      top: 6,
      right: 6,
      fontSize: 8,
      fontFamily: "Geist Mono, monospace",
      color: "var(--vl-bg)",
      background: "var(--vl-accent)",
      borderRadius: 4,
      padding: "0 3px",
      lineHeight: "10px"
    }
  }, b.badge)))), React.createElement("div", {
    style: {
      height: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, React.createElement("div", {
    style: {
      width: 120,
      height: 4,
      background: "var(--vl-text)",
      borderRadius: 999,
      opacity: 0.85
    }
  })), tabSheetOpen && React.createElement("div", {
    onClick: () => setTabSheetOpen(false),
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,.55)",
      zIndex: 10,
      animation: "vlFade .2s both",
      display: "flex",
      alignItems: "flex-end"
    }
  }, React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      background: "var(--vl-surface)",
      borderRadius: "20px 20px 0 0",
      padding: "16px 16px 100px",
      animation: "vlSheetUp .35s cubic-bezier(.22,1,.36,1) both",
      maxHeight: "85%",
      overflowY: "auto"
    }
  }, React.createElement("div", {
    style: {
      width: 38,
      height: 4,
      background: "var(--vl-line)",
      borderRadius: 999,
      margin: "0 auto 16px"
    }
  }), React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16
    }
  }, React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 15,
      fontWeight: 600
    }
  }, "4 tabs"), React.createElement("button", {
    onClick: () => setTabSheetOpen(false),
    style: {
      background: "transparent",
      border: "none",
      color: "var(--vl-accent)",
      fontSize: 13,
      cursor: "pointer",
      fontFamily: "Geist, sans-serif"
    }
  }, "Done")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10
    }
  }, initialTabs.map((t, i) => React.createElement("div", {
    key: t.id,
    style: {
      background: "var(--vl-bg)",
      borderRadius: 12,
      padding: 12,
      border: i === 0 ? "1.5px solid var(--vl-accent)" : "1px solid var(--vl-line)",
      aspectRatio: "3/4",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      animation: `vlPop .35s cubic-bezier(.34,1.56,.64,1) ${i * 60}ms both`
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center",
      fontSize: 11
    }
  }, React.createElement(Favicon, {
    kind: t.favicon,
    size: 10
  }), React.createElement("span", {
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, t.title)), React.createElement("div", {
    style: {
      flex: 1,
      background: "var(--vl-surface-1)",
      borderRadius: 8,
      padding: 8,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, React.createElement("div", {
    style: {
      height: 4,
      width: "70%",
      background: "var(--vl-muted-2)",
      borderRadius: 2
    }
  }), React.createElement("div", {
    style: {
      height: 4,
      width: "90%",
      background: "var(--vl-muted-2)",
      borderRadius: 2,
      opacity: 0.5
    }
  }), React.createElement("div", {
    style: {
      height: 4,
      width: "60%",
      background: "var(--vl-muted-2)",
      borderRadius: 2,
      opacity: 0.5
    }
  }), React.createElement("div", {
    style: {
      marginTop: "auto",
      display: "flex",
      gap: 4
    }
  }, React.createElement(ShieldIcon, {
    size: 10,
    color: "var(--vl-accent)"
  }), React.createElement("span", {
    style: {
      fontSize: 9,
      fontFamily: "Geist Mono, monospace",
      color: "var(--vl-accent)"
    }
  }, t.trackers, " blocked")))))))));
};
const MobilePrivacyContent = ({
  blocked
}) => React.createElement("div", null, React.createElement("div", {
  style: {
    background: "var(--vl-surface)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    position: "relative",
    overflow: "hidden"
  }
}, React.createElement("div", {
  style: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: "50%",
    background: "radial-gradient(circle, color-mix(in oklab, var(--vl-accent) 20%, transparent) 0%, transparent 70%)"
  }
}), React.createElement("div", {
  style: {
    fontSize: 10,
    color: "var(--vl-muted)",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 6
  }
}, "This week"), React.createElement("div", {
  style: {
    fontSize: 34,
    fontWeight: 600,
    letterSpacing: "-0.02em",
    lineHeight: 1,
    marginBottom: 4
  }
}, React.createElement(TrackerCounter, {
  count: blocked,
  color: "var(--vl-accent)"
})), React.createElement("div", {
  style: {
    fontSize: 13,
    color: "var(--vl-muted)"
  }
}, "trackers stopped cold"), React.createElement("div", {
  style: {
    position: "absolute",
    bottom: 16,
    right: 16
  }
}, React.createElement("div", {
  style: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "1px solid var(--vl-accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "color-mix(in oklab, var(--vl-accent) 10%, transparent)"
  }
}, React.createElement(ShieldIcon, {
  size: 20,
  color: "var(--vl-accent)",
  glow: true
})))), React.createElement("div", {
  style: {
    background: "var(--vl-surface)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  }
}, React.createElement("div", {
  style: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 12
  }
}, "Top blocked"), [{
  name: "doubleclick.net",
  count: 84,
  color: "var(--vl-accent)"
}, {
  name: "googletagmanager",
  count: 52,
  color: "color-mix(in oklab, var(--vl-accent) 60%, var(--vl-coral))"
}, {
  name: "facebook.net",
  count: 31,
  color: "var(--vl-coral)"
}].map((row, i) => React.createElement("div", {
  key: row.name,
  style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 0",
    borderBottom: i < 2 ? "1px solid var(--vl-line)" : "none"
  }
}, React.createElement("div", {
  style: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: row.color,
    boxShadow: `0 0 8px ${row.color}`
  }
}), React.createElement("div", {
  style: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Geist Mono, monospace"
  }
}, row.name), React.createElement("div", {
  style: {
    fontSize: 12,
    fontFamily: "Geist Mono, monospace",
    color: "var(--vl-muted)"
  }
}, row.count)))), React.createElement("div", {
  style: {
    background: "var(--vl-surface)",
    borderRadius: 16,
    padding: 16
  }
}, React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}, React.createElement("div", null, React.createElement("div", {
  style: {
    fontSize: 13,
    fontWeight: 600
  }
}, "Tor relay"), React.createElement("div", {
  style: {
    fontSize: 11,
    color: "var(--vl-muted)",
    marginTop: 2
  }
}, "Route this tab through 3 hops")), React.createElement(MobileToggle, {
  initial: true
}))));
const MobileToggle = ({
  initial
}) => {
  const [on, setOn] = useState(initial);
  return React.createElement("button", {
    onClick: () => setOn(!on),
    style: {
      width: 44,
      height: 26,
      borderRadius: 999,
      background: on ? "var(--vl-accent)" : "var(--vl-surface-2)",
      border: "none",
      cursor: "pointer",
      position: "relative",
      transition: "background .2s"
    }
  }, React.createElement("div", {
    style: {
      position: "absolute",
      top: 3,
      left: on ? 21 : 3,
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: on ? "var(--vl-bg)" : "var(--vl-muted)",
      transition: "left .25s cubic-bezier(.34,1.56,.64,1)"
    }
  }));
};
Object.assign(window, {
  DesktopBrowser,
  MobileBrowser
});
