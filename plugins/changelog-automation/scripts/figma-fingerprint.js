// ─────────────────────────────────────────────────────────────────────────────
// Canonical fingerprint algorithm — Claude Design System changelog baseline.
//
// Usage: embed this file verbatim at the top of a use_figma call, then:
//   const fp = await computeFingerprint()
//
// The returned object has five buckets:
//   { pages, components, variables, textStyles, effectStyles }
// Each bucket maps entity name → hash string.
//
// To capture a baseline:
//   const json = JSON.stringify({ fp, meta: { capturedAt: Date.now() } })
//   figma.root.setSharedPluginData('changelog', 'baseline', json)
//
// To diff against the baseline:
//   const stored = figma.root.getSharedPluginData('changelog', 'baseline')
//   const { fp: base } = JSON.parse(stored)
//   // diff(base, fp) → { added, removed, changed } per bucket
// ─────────────────────────────────────────────────────────────────────────────

async function computeFingerprint() {

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

  // ── Diff helper (exported for callers) ─────────────────────────────────────
  computeFingerprint.diff = function(base, current) {
    const result = {};
    for (const bucket of ['pages', 'components', 'variables', 'textStyles', 'effectStyles']) {
      const b = base[bucket] ?? {};
      const c = current[bucket] ?? {};
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

  const fp = { pages: {}, components: {}, variables: {}, textStyles: {}, effectStyles: {} };

  // ── Pages ───────────────────────────────────────────────────────────────────
  for (const page of figma.root.children) {
    fp.pages[page.name] = hash(page.name + ':' + page.children.length);
  }

  // ── Components and component sets ───────────────────────────────────────────
  // Switch to each page to load its content, collect top-level component sets
  // and standalone components (not variant children inside a set).
  for (const page of figma.root.children) {
    await figma.setCurrentPageAsync(page);
    const nodes = page.findAll(n =>
      n.type === 'COMPONENT_SET' ||
      (n.type === 'COMPONENT' && n.parent?.type !== 'COMPONENT_SET')
    );
    for (const node of nodes) {
      // Use page-qualified name to avoid collisions across pages
      const key = page.name + '/' + node.name;
      fp.components[key] = hash(nodeSig(node));
    }
  }

  // ── Variables ───────────────────────────────────────────────────────────────
  const vars = await figma.variables.getLocalVariablesAsync();
  for (const variable of vars) {
    fp.variables[variable.name] = hash(j({ type: variable.resolvedType, values: variable.valuesByMode }));
  }

  // ── Text styles ─────────────────────────────────────────────────────────────
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

  // ── Effect styles ────────────────────────────────────────────────────────────
  for (const style of figma.getLocalEffectStyles()) {
    fp.effectStyles[style.name] = hash(j(style.effects));
  }

  return fp;
}
