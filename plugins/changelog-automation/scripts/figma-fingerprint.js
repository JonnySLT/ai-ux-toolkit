// ─────────────────────────────────────────────────────────────────────────────
// Canonical fingerprint algorithm — Figma changelog baseline.
//
// Works for ANY Figma file — a design system, a design file (screens/flows), or
// both — via a `scope`:
//   computeFingerprint({ scope: 'design-system' })  // components, variables, styles (default)
//   computeFingerprint({ scope: 'design-file' })     // top-level frames/screens
//   computeFingerprint({ scope: 'all' })             // everything
//
// Buckets returned depend on scope. Every bucket maps entity name → hash string:
//   pages         — always: page name + top-level child count (structural add/remove)
//   components    — design-system / all
//   variables     — design-system / all
//   textStyles    — design-system / all
//   effectStyles  — design-system / all
//   frames        — design-file / all: deep hash of each top-level FRAME/SECTION
//
// The default scope is 'design-system' so existing design-system baselines keep
// hashing identically (backward compatible). Choose 'design-file' for a screens
// file, or 'all' for a file that has both a local component library and screens.
//
// To capture a baseline:
//   const fp = await computeFingerprint({ scope })
//   const json = JSON.stringify({ fp, meta: { scope, capturedAt: Date.now() } })
//   figma.root.setSharedPluginData('changelog', 'baseline', json)
//
// To diff against the baseline (use the SAME scope the baseline was captured with):
//   const stored = figma.root.getSharedPluginData('changelog', 'baseline')
//   const { fp: base } = JSON.parse(stored)
//   computeFingerprint.diff(base, fp) → { added, removed, changed } per bucket
// ─────────────────────────────────────────────────────────────────────────────

async function computeFingerprint(opts) {
  opts = opts || {};
  const scope = opts.scope || 'design-system'; // 'design-system' | 'design-file' | 'all'
  const wantDS = scope === 'design-system' || scope === 'all';
  const wantFrames = scope === 'design-file' || scope === 'all';
  // Meta pages that are never "screens" — excluded from the frames bucket so the
  // sweep never detects its own changelog writes (or annotation docs) as drift.
  const excludePages = opts.excludePages || [/changelog/i, /^annotations?$/i, /^cover$/i];

  // ── Deterministic hash (djb2 xor variant) ──────────────────────────────────
  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(h, 33) ^ str.charCodeAt(i)) | 0;
    }
    return (h >>> 0).toString(36);
  }

  // ── Safe serialisers ────────────────────────────────────────────────────────
  const s = v => (v == null) ? '' : String(v);
  const j = v => { try { return JSON.stringify(v) ?? ''; } catch { return ''; } };
  // p safely reads a property that only exists on certain node types
  const p = (node, prop) => { try { return node[prop]; } catch { return undefined; } };

  // ── Deep node signature — captures any internal change ─────────────────────
  // Recursively encodes geometry, paint, effects, bound variables, text,
  // vectors, layout, and component property definitions for every descendant.
  function nodeSig(node) {
    const parts = [
      s(node.type),
      s(node.name),
      // Geometry
      s(node.x?.toFixed(1)),
      s(node.y?.toFixed(1)),
      s(node.width?.toFixed(1)),
      s(node.height?.toFixed(1)),
      s(node.rotation?.toFixed(2)),
      // Paint / effects
      j(node.fills),
      j(node.strokes),
      j(node.strokeWeight),
      j(node.strokeAlign),
      j(node.effects),
      j(node.opacity),
      s(node.blendMode),
      // Bound variables
      j(node.boundVariables),
      // Auto-layout
      s(node.layoutMode),
      s(node.layoutSizingHorizontal),
      s(node.layoutSizingVertical),
      s(node.primaryAxisAlignItems),
      s(node.counterAxisAlignItems),
      s(node.primaryAxisSizingMode),
      s(node.counterAxisSizingMode),
      s(node.itemSpacing),
      s(node.paddingTop),
      s(node.paddingBottom),
      s(node.paddingLeft),
      s(node.paddingRight),
      // Radii
      s(p(node, 'cornerRadius')),
      j(p(node, 'rectangleCornerRadii')),
      // Text (Text nodes only)
      s(p(node, 'characters')),
      s(p(node, 'fontSize')),
      j(p(node, 'fontName')),
      j(p(node, 'lineHeight')),
      j(p(node, 'letterSpacing')),
      s(p(node, 'textAlignHorizontal')),
      s(p(node, 'textAlignVertical')),
      s(p(node, 'textDecoration')),
      s(p(node, 'textCase')),
      // Vectors (Vector nodes only)
      j(p(node, 'vectorPaths')),
      j(p(node, 'vectorNetwork')),
      // Component properties (Component/ComponentSet/Instance only)
      j(p(node, 'componentPropertyDefinitions')),
      j(p(node, 'componentProperties')),
      // Visibility
      s(node.visible),
      s(node.locked),
      s(node.isMask),
    ];

    const childSigs = node.children ? node.children.map(nodeSig) : [];
    return parts.join('\x00') + '\x01' + childSigs.join('\x02');
  }

  // ── Diff helper (exported for callers) — iterates whatever buckets exist ────
  computeFingerprint.diff = function(base, current) {
    const result = {};
    const buckets = new Set([...Object.keys(base || {}), ...Object.keys(current || {})]);
    for (const bucket of buckets) {
      const b = (base && base[bucket]) || {};
      const c = (current && current[bucket]) || {};
      const allKeys = new Set([...Object.keys(b), ...Object.keys(c)]);
      const added = [], removed = [], changed = [];
      for (const k of allKeys) {
        if (!(k in b)) added.push(k);
        else if (!(k in c)) removed.push(k);
        else if (b[k] !== c[k]) changed.push(k);
      }
      result[bucket] = { added, removed, changed };
    }
    return result;
  };

  const fp = { pages: {} };

  // ── Pages (always) — name + top-level child count (structural add/remove) ───
  for (const page of figma.root.children) {
    fp.pages[page.name] = hash(page.name + ':' + page.children.length);
  }

  // ── Frames / screens (design-file / all) — deep hash of each top-level frame ─
  if (wantFrames) {
    fp.frames = {};
    const isMeta = name => excludePages.some(re => re.test(name));
    for (const page of figma.root.children) {
      if (isMeta(page.name)) continue;
      await figma.setCurrentPageAsync(page);
      for (const node of page.children) {
        if (node.type === 'FRAME' || node.type === 'SECTION') {
          fp.frames[page.name + ' / ' + node.name] = hash(nodeSig(node));
        }
      }
    }
  }

  // ── Design-system assets (design-system / all) ─────────────────────────────
  if (wantDS) {
    fp.components = {}; fp.variables = {}; fp.textStyles = {}; fp.effectStyles = {};

    // Components and component sets — top-level sets + standalone components.
    for (const page of figma.root.children) {
      await figma.setCurrentPageAsync(page);
      const nodes = page.findAll(n =>
        n.type === 'COMPONENT_SET' ||
        (n.type === 'COMPONENT' && n.parent?.type !== 'COMPONENT_SET')
      );
      for (const node of nodes) {
        const key = page.name + '/' + node.name; // page-qualified to avoid collisions
        fp.components[key] = hash(nodeSig(node));
      }
    }

    // Variables
    const vars = await figma.variables.getLocalVariablesAsync();
    for (const variable of vars) {
      fp.variables[variable.name] = hash(j({ type: variable.resolvedType, values: variable.valuesByMode }));
    }

    // Text styles
    for (const style of figma.getLocalTextStyles()) {
      fp.textStyles[style.name] = hash(j({
        fontSize: style.fontSize,
        fontName: style.fontName,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        textDecoration: style.textDecoration,
        textCase: style.textCase,
        paragraphSpacing: style.paragraphSpacing,
      }));
    }

    // Effect styles
    for (const style of figma.getLocalEffectStyles()) {
      fp.effectStyles[style.name] = hash(j(style.effects));
    }
  }

  return fp;
}
