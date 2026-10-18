// Shared figure frame, used by the Reddit renderer (render.mjs) and the Observable story.
// Every style is an inline attribute so exported SVGs import cleanly into design tools.
export const PT = 96 / 72;                    // spec sizes are in points, the SVG in CSS px

// Text with the given style; returns the d3 selection.
export function text(g, x, y, str, o = {}) {
  const t = g.append("text").attr("x", x).attr("y", y)
    .attr("font-size", o.size).attr("fill", o.color).attr("text-anchor", o.anchor ?? "start");
  if (o.weight) t.attr("font-weight", o.weight);
  if (o.style) t.attr("font-style", o.style);
  if (o.baseline) t.attr("dominant-baseline", o.baseline);
  if (o.rotate) t.attr("transform", `rotate(${o.rotate} ${x} ${y})`);
  if (str !== undefined) t.text(str);
  return t;
}

// Greedy word wrap into <tspan> lines using measured widths. Returns the number of lines.
export function wrap(t, str, width, lineHeight) {
  const x = t.attr("x");
  let line = [], n = 0;
  let span = t.append("tspan").attr("x", x).attr("dy", 0);
  for (const w of str.split(/\s+/)) {
    line.push(w);
    span.text(line.join(" "));
    if (span.node().getComputedTextLength() > width && line.length > 1) {
      line.pop();
      span.text(line.join(" "));
      line = [w];
      span = t.append("tspan").attr("x", x).attr("dy", lineHeight).text(w);
      n += 1;
    }
  }
  return n + 1;
}

// Boxed label: text first, then a rect sized from its bbox inserted behind it.
export function boxLabel(g, x, y, parts, o) {
  const grp = g.append("g").attr("class", "label");
  const t = text(grp, x, y, undefined, { size: o.size, color: o.color, anchor: o.anchor,
    baseline: "central" });
  parts.forEach((p) => {
    const s = t.append("tspan").text(p.text);
    if (p.br) s.attr("x", x).attr("dy", o.size * 1.2);
    if (p.weight) s.attr("font-weight", p.weight);
    if (p.color) s.attr("fill", p.color);
  });
  const b = t.node().getBBox(), px = o.padX ?? 6, py = o.padY ?? 3;
  grp.insert("rect", "text").attr("x", b.x - px).attr("y", b.y - py)
    .attr("width", b.width + 2 * px).attr("height", b.height + 2 * py).attr("rx", 3)
    .attr("fill", o.fill).attr("stroke", o.stroke).attr("stroke-width", 0.8);
  return grp;
}

// Title, subtitle and caption (when spec.frame !== false). Returns the free panel box.
function frame(svg, spec) {
  const P = spec.palette, m = spec.margin ?? 22;
  if (spec.frame === false) {
    return { top: m * 0.5, bottom: spec.height - m * 0.5, left: m * 0.5, right: spec.width - m * 0.5 };
  }
  const base = spec.base * PT, titleSize = (spec.base + 1.5) * PT, capSize = (spec.base - 1) * PT;
  const w = spec.width - 2 * m;
  const head = svg.append("g").attr("id", "header");
  let y = m + titleSize;
  const title = text(head, m, y, undefined, { size: titleSize, weight: "bold", color: P.ink })
    .attr("id", "title");
  let nTitle = 1;
  if (spec.titleSpans) {
    spec.titleSpans.forEach((s) => title.append("tspan").attr("fill", s.color ?? P.ink).text(s.text));
  } else {
    nTitle = wrap(title, spec.text.title, w, titleSize * 1.15);
  }
  y += (nTitle - 1) * titleSize * 1.15 + base * 1.45;
  const sub = text(head, m, y, undefined, { size: base, color: P.inkSecondary }).attr("id", "subtitle");
  const nSub = wrap(sub, spec.text.subtitle, w, base * 1.2);
  const top = y + (nSub - 1) * base * 1.2 + base * 0.6;
  const foot = svg.append("g").attr("id", "caption");
  const cap = text(foot, m, 0, undefined, { size: capSize, color: P.inkMuted });
  const nCap = wrap(cap, spec.text.caption, w, capSize * 1.2);
  cap.attr("y", spec.height - m - (nCap - 1) * capSize * 1.2);
  return { top, bottom: +cap.attr("y") - capSize * 1.4, left: m, right: spec.width - m };
}

// Build a figure: the SVG is attached offscreen while drawing (text measurement needs layout)
// and returned detached, ready to be inserted anywhere.
export function makeFigure(d3, spec, draw) {
  const svg = d3.create("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", spec.width).attr("height", spec.height)
    .attr("viewBox", `0 0 ${spec.width} ${spec.height}`)
    .attr("font-family", spec.font)
    .style("max-width", "100%").style("height", "auto");
  const host = document.createElement("div");
  host.style.cssText = "position:absolute;left:-10000px;top:0;visibility:hidden";
  document.body.appendChild(host);
  host.appendChild(svg.node());
  try {
    svg.append("rect").attr("id", "background").attr("width", spec.width)
      .attr("height", spec.height).attr("fill", spec.palette.bg);
    draw(svg, spec, frame(svg, spec));
  } finally {
    host.remove();
  }
  return svg.node();
}
