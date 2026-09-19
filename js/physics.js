const Phy = (function () {
  const SUPER = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁺": "+", "⁻": "-" };
  const TO_SUPER = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻", "+": "⁺" };

  const PREFIXES = [
    { id: "tera", name: "tera", symbol: "T", exp: 12 },
    { id: "giga", name: "giga", symbol: "G", exp: 9 },
    { id: "mega", name: "mega", symbol: "M", exp: 6 },
    { id: "kilo", name: "kilo", symbol: "k", exp: 3 },
    { id: "hekto", name: "hekto", symbol: "h", exp: 2 },
    { id: "deka", name: "deka", symbol: "da", exp: 1 },
    { id: "none", name: "(ingen)", symbol: "–", exp: 0 },
    { id: "deci", name: "deci", symbol: "d", exp: -1 },
    { id: "centi", name: "centi", symbol: "c", exp: -2 },
    { id: "milli", name: "milli", symbol: "m", exp: -3 },
    { id: "mikro", name: "mikro", symbol: "µ", exp: -6 },
    { id: "nano", name: "nano", symbol: "n", exp: -9 },
    { id: "piko", name: "piko", symbol: "p", exp: -12 }
  ];

  const LINE = PREFIXES.filter(function (p) {
    return [12, 9, 6, 3, 0, -3, -6, -9, -12].indexOf(p.exp) !== -1;
  });

  function tenHtml(exp) {
    return "10<sup>" + exp + "</sup>";
  }

  function tenText(exp) {
    const sign = exp < 0 ? "⁻" : "";
    const digits = String(Math.abs(exp))
      .split("")
      .map(function (d) {
        return TO_SUPER[d] || d;
      })
      .join("");
    return "10" + sign + digits;
  }

  function superToInt(s) {
    var out = "";
    for (var i = 0; i < s.length; i += 1) out += SUPER[s[i]] !== undefined ? SUPER[s[i]] : s[i];
    return parseInt(out, 10);
  }

  function prefixById(id) {
    return PREFIXES.find(function (p) {
      return p.id === id;
    });
  }

  function prefixBySymbol(sym) {
    const s = String(sym).replace("μ", "µ").replace("u", "µ");
    return PREFIXES.find(function (p) {
      return p.symbol === s || (p.symbol === "µ" && (s === "u" || s === "μ"));
    });
  }

  function nearly(a, b, rel) {
    rel = rel == null ? 0.012 : rel;
    if (!isFinite(a) || !isFinite(b)) return false;
    if (a === b) return true;
    const scale = Math.max(Math.abs(a), Math.abs(b), 1e-15);
    return Math.abs(a - b) <= rel * scale + 1e-12;
  }

  function parseNumber(raw) {
    if (raw == null) return null;
    var s = String(raw).trim();
    if (!s) return null;
    s = s.replace(/\s+/g, "");
    s = s.replace(/,/g, ".");
    s = s.replace(/[·×xX]/g, "*");
    s = s.replace(/\*10\^([+-]?\d+)/g, "e$1");
    s = s.replace(/10\^([+-]?\d+)/g, function (_, e) {
      return "1e" + e;
    });
    s = s.replace(/\*10([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+)/g, function (_, sup) {
      return "e" + superToInt(sup);
    });
    s = s.replace(/10([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+)/g, function (_, sup) {
      return "1e" + superToInt(sup);
    });
    s = s.replace(/\*1e/g, "e");
    if (/^[+-]?\d*\.?\d+e[+-]?\d+$/i.test(s) || /^[+-]?\d*\.?\d+$/.test(s)) {
      const n = parseFloat(s);
      return isFinite(n) ? n : null;
    }
    const m = s.match(/^([+-]?\d*\.?\d+)\*([+-]?\d*\.?\d+(?:e[+-]?\d+)?)$/i);
    if (m) return parseFloat(m[1]) * parseFloat(m[2]);
    return null;
  }

  function countSigFigs(raw) {
    var s = String(raw).trim();
    const sci = s.match(/^([0-9,.\s]+)\s*[×xX*·]?\s*10/i) || s.match(/^([0-9,.\s]+)[eE]/);
    if (sci) s = sci[1];
    s = s.replace(/\s+/g, "").replace(",", ".");
    if (!s) return 0;
    const neg = s.charAt(0) === "-";
    if (neg) s = s.slice(1);
    if (s.indexOf(".") !== -1) {
      s = s.replace(/^0+/, "");
      if (s.charAt(0) === ".") {
        s = s.replace(/^\./, "").replace(/^0+/, "");
        return s.length;
      }
      return s.replace(".", "").length;
    }
    s = s.replace(/^0+/, "");
    if (!s) return 0;
    const stripped = s.replace(/0+$/, "");
    return stripped.length ? stripped.length : 1;
  }

  function roundSig(n, sig) {
    if (n === 0) return 0;
    if (!isFinite(n) || sig < 1) return n;
    const d = Math.floor(Math.log10(Math.abs(n)));
    const f = Math.pow(10, sig - 1 - d);
    return Math.round(n * f) / f;
  }

  function formatSv(n, sig) {
    if (!isFinite(n)) return "";
    var x = sig ? roundSig(n, sig) : n;
    var s;
    if (Math.abs(x) !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 1e-3)) {
      s = x.toExponential(sig ? sig - 1 : 4).replace(".", ",").replace("e", " × 10^");
      s = s.replace(" × 10^", " × 10<sup>") + "</sup>";
      s = s.replace("+", "");
      return s;
    }
    s = String(sig ? roundSig(n, sig) : x);
    if (s.indexOf("e") !== -1) return formatSv(n, sig || 4);
    return s.replace(".", ",");
  }

  function formatPlain(n, sig) {
    const x = sig ? roundSig(n, sig) : n;
    if (!isFinite(x)) return "";
    var s = String(x);
    if (Math.abs(x) >= 1e6 || (Math.abs(x) > 0 && Math.abs(x) < 1e-3)) {
      s = x.toExponential(sig ? sig - 1 : 6);
    }
    return s.replace(".", ",");
  }

  const UNIT_TABLE = [];

  function addUnit(aliases, dim, si, label) {
    aliases.forEach(function (a) {
      UNIT_TABLE.push({ alias: a, dim: dim, si: si, label: label || aliases[0] });
    });
  }

  addUnit(["m", "meter", "metre"], "L", 1, "m");
  addUnit(["km"], "L", 1000, "km");
  addUnit(["cm"], "L", 0.01, "cm");
  addUnit(["mm"], "L", 0.001, "mm");
  addUnit(["nm"], "L", 1e-9, "nm");
  addUnit(["s", "sek", "sekund", "sekunder"], "T", 1, "s");
  addUnit(["min", "minut", "minuter"], "T", 60, "min");
  addUnit(["h", "tim", "timme", "timmar"], "T", 3600, "h");
  addUnit(["dygn", "dagn"], "T", 86400, "dygn");
  addUnit(["vecka", "veckor"], "T", 604800, "vecka");
  addUnit(["m/s", "m/sek", "ms-1", "m·s-1", "m s-1"], "V", 1, "m/s");
  addUnit(["km/h", "km/tim", "kmh", "km/timme"], "V", 1 / 3.6, "km/h");
  addUnit(["m/s2", "m/s²", "ms-2"], "A", 1, "m/s²");
  addUnit(["kg"], "M", 1, "kg");
  addUnit(["g"], "M", 0.001, "g");
  addUnit(["mg"], "M", 1e-6, "mg");
  addUnit(["kg/m3", "kg/m³"], "D", 1, "kg/m³");
  addUnit(["g/cm3", "g/cm³", "g/cm^3"], "D", 1000, "g/cm³");
  addUnit(["n", "newton"], "F", 1, "N");
  addUnit(["j", "joule"], "E", 1, "J");
  addUnit(["w", "watt"], "P", 1, "W");
  addUnit(["pa", "pascal"], "Pr", 1, "Pa");
  addUnit(["hz", "hertz"], "f", 1, "Hz");
  addUnit(["a", "ampere"], "I", 1, "A");
  addUnit(["ohm", "Ω", "ohm"], "R", 1, "Ω");
  addUnit(["f", "farad"], "C", 1, "F");
  addUnit(["tesla"], "B", 1, "T");
  addUnit(["v", "volt"], "U", 1, "V");
  addUnit(["mhz"], "f", 1e6, "MHz");
  addUnit(["khz"], "f", 1e3, "kHz");
  addUnit(["ghz"], "f", 1e9, "GHz");
  addUnit(["mw"], "P", 1e6, "MW");
  addUnit(["kw"], "P", 1e3, "kW");
  addUnit(["gw"], "P", 1e9, "GW");
  addUnit(["tw"], "P", 1e12, "TW");
  addUnit(["kv"], "U", 1e3, "kV");
  addUnit(["mv"], "U", 1e6, "MV");
  addUnit(["ma"], "I", 0.001, "mA");
  addUnit(["µa", "ua", "μa"], "I", 1e-6, "µA");
  addUnit(["µs", "us", "μs"], "T", 1e-6, "µs");
  addUnit(["ms"], "T", 0.001, "ms");
  addUnit(["ns"], "T", 1e-9, "ns");
  addUnit(["ng"], "M", 1e-12, "ng");
  addUnit(["µg", "ug", "μg"], "M", 1e-9, "µg");
  addUnit(["cm3", "cm³"], "Vol", 1e-6, "cm³");
  addUnit(["m3", "m³"], "Vol", 1, "m³");
  addUnit(["l", "liter"], "Vol", 0.001, "l");
  addUnit(["ml"], "Vol", 1e-6, "ml");

  UNIT_TABLE.sort(function (a, b) {
    return b.alias.length - a.alias.length;
  });

  function parseUnit(raw) {
    if (!raw) return null;
    var s = String(raw)
      .trim()
      .toLowerCase()
      .replace(/μ/g, "µ")
      .replace(/\s+/g, "")
      .replace("per", "/")
      .replace("⁻", "-")
      .replace("²", "2")
      .replace("³", "3");
    if (s === "t" || s === "tesla") return { dim: "B", si: 1, label: "T" };
    for (var i = 0; i < UNIT_TABLE.length; i += 1) {
      if (UNIT_TABLE[i].alias === s) return UNIT_TABLE[i];
    }
    const pref = PREFIXES.filter(function (p) {
      return p.exp !== 0 && p.symbol !== "–";
    }).sort(function (a, b) {
      return b.symbol.length - a.symbol.length;
    });
    for (var p = 0; p < pref.length; p += 1) {
      const sym = pref[p].symbol.toLowerCase() === "µ" ? "µ" : pref[p].symbol.toLowerCase();
      if (s.indexOf(sym) === 0 && s.length > sym.length) {
        const rest = s.slice(sym.length);
        const base = parseUnit(rest);
        if (base) {
          return {
            dim: base.dim,
            si: base.si * Math.pow(10, pref[p].exp),
            label: pref[p].symbol + (base.label || rest)
          };
        }
      }
    }
    return null;
  }

  function splitQuantity(raw) {
    var s = String(raw).trim();
    if (!s) return null;
    const m = s.match(/^([+-]?\s*(?:\d+(?:[.,]\d+)?|\.\d+)(?:\s*(?:[eE][+-]?\d+|[×xX*·]\s*10(?:\^[+-]?\d+|[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+)))?)\s*(.*)$/);
    if (!m) {
      const n = parseNumber(s);
      return n == null ? null : { value: n, unitRaw: "" };
    }
    return { value: parseNumber(m[1]), unitRaw: m[2].trim() };
  }

  function parseQuantity(raw) {
    const parts = splitQuantity(raw);
    if (!parts || parts.value == null) return null;
    const unit = parts.unitRaw ? parseUnit(parts.unitRaw) : null;
    return {
      value: parts.value,
      unitRaw: parts.unitRaw,
      unit: unit,
      si: unit ? parts.value * unit.si : parts.value,
      dim: unit ? unit.dim : null,
      sig: countSigFigs(parts.value.toString().replace(".", ","))
    };
  }

  function sameDim(a, b) {
    if (!a || !b) return false;
    return a.dim === b.dim;
  }

  function gradeQuantity(userRaw, expectedSi, dim, options) {
    options = options || {};
    const parsed = parseQuantity(userRaw);
    const result = { ok: false, parsed: parsed, reason: "" };
    if (!parsed) {
      result.reason = "Kunde inte tolka svaret. Skriv tal och enhet, till exempel 5 m/s.";
      return result;
    }
    if (options.requireUnit !== false) {
      if (!parsed.unit) {
        result.reason = "Svaret saknar enhet.";
        return result;
      }
      if (dim && parsed.dim !== dim) {
        result.reason = "Enheten har fel storhet.";
        return result;
      }
    }
    const rel = options.rel == null ? 0.012 : options.rel;
    if (!nearly(parsed.si, expectedSi, rel)) {
      result.reason = "Det numeriska värdet stämmer inte.";
      return result;
    }
    if (options.sig) {
      const written = splitQuantity(userRaw);
      const sig = written ? countSigFigs(written.value != null ? String(userRaw) : userRaw) : countSigFigs(userRaw);
      const numPart = String(userRaw).replace(/[a-zA-ZµμΩ\/²³\s]+$/g, "");
      const got = countSigFigs(numPart);
      if (got !== options.sig && !nearly(roundSig(parsed.si, options.sig), parsed.si, 1e-12)) {
        result.reason = "Storleken är nära, men antalet värdesiffror stämmer inte.";
        return result;
      }
      if (got && Math.abs(got - options.sig) > 0) {
        const rounded = roundSig(expectedSi / (parsed.unit ? parsed.unit.si : 1), options.sig);
        if (!nearly(parsed.value, rounded, 0.02)) {
          result.reason = "Avrunda till " + options.sig + " värdesiffror.";
          return result;
        }
      }
    }
    result.ok = true;
    return result;
  }

  function expandPrefix(coeff, prefix, unit) {
    const p = typeof prefix === "string" ? prefixById(prefix) || prefixBySymbol(prefix) : prefix;
    const si = coeff * Math.pow(10, p.exp);
    return {
      display: formatPlain(coeff, 3) + " " + (p.symbol === "–" ? "" : p.symbol) + unit,
      si: si,
      unit: unit,
      exp: p.exp
    };
  }

  function choosePrefix(siValue) {
    const cands = PREFIXES.filter(function (p) {
      return p.id !== "hekto" && p.id !== "deka" && p.id !== "deci" && p.id !== "centi";
    });
    var best = prefixById("none");
    var bestCoeff = siValue;
    cands.forEach(function (p) {
      const c = siValue / Math.pow(10, p.exp);
      if (c >= 1 && c < 1000) {
        best = p;
        bestCoeff = c;
      }
    });
    return { prefix: best, coeff: bestCoeff };
  }

  function kmhToMs(v) {
    return v / 3.6;
  }

  function msToKmh(v) {
    return v * 3.6;
  }

  function evalCalc(expr) {
    var s = String(expr).trim().replace(/,/g, ".").replace(/×/g, "*").replace(/÷/g, "/").replace(/\^/g, "**");
    if (!s) return null;
    if (!/^[0-9+\-*/().eE\s*]+$/.test(s)) return null;
    try {
      const n = Function('"use strict"; return (' + s + ");")();
      return isFinite(n) ? n : null;
    } catch (e) {
      return null;
    }
  }

  function normText(value) {
    return String(value)
      .toLowerCase()
      .replace(/μ/g, "µ")
      .replace(/ohm/g, "ω")
      .replace(/[–—]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  }

  return {
    PREFIXES: PREFIXES,
    LINE: LINE,
    tenHtml: tenHtml,
    tenText: tenText,
    prefixById: prefixById,
    prefixBySymbol: prefixBySymbol,
    parseNumber: parseNumber,
    parseQuantity: parseQuantity,
    parseUnit: parseUnit,
    countSigFigs: countSigFigs,
    roundSig: roundSig,
    formatSv: formatSv,
    formatPlain: formatPlain,
    nearly: nearly,
    gradeQuantity: gradeQuantity,
    expandPrefix: expandPrefix,
    choosePrefix: choosePrefix,
    kmhToMs: kmhToMs,
    msToKmh: msToKmh,
    evalCalc: evalCalc,
    normText: normText,
    sameDim: sameDim
  };
})();
