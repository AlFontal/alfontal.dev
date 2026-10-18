// Ternary map of surface weightings: each cell is a weighting (hard, clay, grass), filled with
// the most likely leader's colour, tinted towards the background by how sure (binned probability).
import { PT, text, boxLabel, makeFigure } from "./common.9b492e00.js";

const H = Math.sqrt(3) / 2;
let uid = 0;
const pct = (v) => `${Math.round(v * 100)}%`;

export function simplex(d3, spec) {
  return makeFigure(d3, spec, (svg, spec, box) => {
    const P = spec.palette, base = spec.base * PT;
    const small = base * 0.72, label = base * 0.8, u = base;   // u: layout unit
    const players = Object.fromEntries(spec.players.map((p) => [p.name, p]));
    const bins = spec.bins;                       // lower edges, e.g. [0, .55, .7, .85]
    const binOf = (p) => d3.bisectRight(bins, p) - 1;
    const tint = (color, i) => d3.interpolateLab(P.bg, color)(spec.tints[i]);

    // Layout: key to the right in landscape, below in portrait.
    const landscape = spec.width > spec.height;
    const keyRight = landscape && !spec.keyBelow;          // the story puts the key underneath
    const keyW = keyRight ? 17 * u : 0, keyH = keyRight ? 0 : (spec.compact ? 15 : 11.7) * u;
    const side = landscape ? 5.6 * u : 3 * u;
    const pad = { l: side, r: side, t: 3 * u, b: landscape ? 4.5 * u : 5.2 * u };
    const availW = box.right - box.left - keyW - pad.l - pad.r;
    const availH = box.bottom - box.top - keyH - pad.t - pad.b;
    const L = Math.min(availW, availH / H);
    const ox = box.left + pad.l + (availW - L) / 2;
    const oy = box.top + pad.t + (availH + L * H) / 2;
    const xy = (h, c, g) => [ox + (c + g / 2) * L, oy - g * H * L];

    // Hexagonal cells, clipped to the triangle.
    const tri = [xy(1, 0, 0), xy(0, 1, 0), xy(0, 0, 1)];
    const clipId = `triangle-${++uid}`;
    svg.append("defs").append("clipPath").attr("id", clipId)
      .append("polygon").attr("points", tri.map((p) => p.join(",")).join(" "));
    const R = spec.step * L / Math.sqrt(3);
    const hex = (cx, cy, r) => d3.range(6).map((k) => {
      const a = Math.PI / 180 * (60 * k - 90);
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    const cells = svg.append("g").attr("id", "cells").attr("clip-path", `url(#${clipId})`);
    for (const d of spec.cells) {
      const [cx, cy] = xy(d.hard, d.clay, d.grass);
      const fill = tint(players[d.leader].color, binOf(d.p));
      cells.append("polygon").attr("points", hex(cx, cy, R).map((p) => p.join(",")).join(" "))
        .attr("fill", fill).attr("stroke", P.bg).attr("stroke-width", 1.2)
        .attr("data-leader", d.leader)
        .append("title").text(`Hard ${pct(d.hard)}, clay ${pct(d.clay)}, grass ${pct(d.grass)}: `
          + `${players[d.leader].short}, ${pct(d.p)} chance of the highest peak`);
    }

    // Iso-lines and ternary axes: ticks extend each iso-line outwards past its edge.
    const grid = svg.append("g").attr("id", "grid");
    const axes = svg.append("g").attr("id", "axes");
    const iso = {
      clay: (t) => [[1 - t, t, 0], [0, t, 1 - t]],
      grass: (t) => [[0, 1 - t, t], [1 - t, 0, t]],
      hard: (t) => [[t, 0, 1 - t], [t, 1 - t, 0]],
    };
    for (const [surface, f] of Object.entries(iso)) {
      for (const t of spec.ticks) {
        const [a, b] = f(t).map((w) => xy(...w));
        grid.append("line").attr("x1", a[0]).attr("y1", a[1]).attr("x2", b[0]).attr("y2", b[1])
          .attr("stroke", P.ink).attr("stroke-opacity", 0.22).attr("stroke-width", 0.9);
        const len = Math.hypot(a[0] - b[0], a[1] - b[1]);
        const v = [(a[0] - b[0]) / len, (a[1] - b[1]) / len];
        axes.append("line").attr("x1", a[0]).attr("y1", a[1])
          .attr("x2", a[0] + 7 * v[0]).attr("y2", a[1] + 7 * v[1])
          .attr("stroke", P.inkMuted).attr("stroke-width", 1);
        // Anchor the label on the side the tick points to, so it never sits on the tick.
        const anchor = v[0] > 0.3 ? "start" : v[0] < -0.3 ? "end" : "middle";
        const gap = anchor === "middle" ? 0.85 * u : 0.47 * u;
        text(axes, a[0] + (7 + gap) * v[0], a[1] + (7 + gap) * v[1], pct(t),
          { size: small, color: P.inkMuted, anchor, baseline: "central" });
      }
    }
    svg.append("g").attr("id", "outline").append("polygon")
      .attr("points", tri.map((p) => p.join(",")).join(" "))
      .attr("fill", "none").attr("stroke", P.inkMuted).attr("stroke-width", 0.8);
    // Axis titles, parallel to each side; arrows point to where that share grows.
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const titles = [
      { text: "Clay share →", at: mid(tri[0], tri[1]), n: [0, 1], rot: 0 },
      { text: "← Grass share", at: mid(tri[1], tri[2]), n: [H, -0.5], rot: 60 },
      { text: "← Hard share", at: mid(tri[2], tri[0]), n: [-H, -0.5], rot: -60 },
    ];
    for (const a of titles) {
      const x = a.at[0] + 2.45 * u * a.n[0], y = a.at[1] + 2.45 * u * a.n[1];
      text(axes, x, y, a.text, { size: label, color: P.inkSecondary, anchor: "middle",
        baseline: "central", style: "italic", rotate: a.rot });
    }

    // Corners: the single-surface weightings with their leader and probability.
    const corners = svg.append("g").attr("id", "corners");
    // Beside the base corners in landscape; under them in portrait, where the sides are tight.
    const cornerAt = landscape ? {
      hard: { x: tri[0][0] - 0.75 * u, y: tri[0][1] + 0.47 * u, anchor: "end" },
      clay: { x: tri[1][0] + 0.75 * u, y: tri[1][1] + 0.47 * u, anchor: "start" },
      grass: { x: tri[2][0], y: tri[2][1] - 1.9 * u, anchor: "middle" },
    } : {
      hard: { x: tri[0][0] - 0.56 * u, y: tri[0][1] + 2.9 * u, anchor: "start" },
      clay: { x: tri[1][0] + 0.56 * u, y: tri[1][1] + 2.9 * u, anchor: "end" },
      grass: { x: tri[2][0], y: tri[2][1] - 1.9 * u, anchor: "middle" },
    };
    for (const c of spec.corners) {
      const at = cornerAt[c.surface];
      const t = text(corners, at.x, at.y, undefined, { size: label * 1.05, anchor: at.anchor,
        color: P.ink });
      t.append("tspan").attr("x", at.x).attr("font-weight", "bold").text(c.label);
      t.append("tspan").attr("x", at.x).attr("dy", label * 1.25)
        .attr("fill", players[c.leader].color).attr("font-weight", "bold")
        .text(`${players[c.leader].short} ${pct(c.p)}`);
    }

    // Named interior weightings: marker plus boxed label.
    const named = svg.append("g").attr("id", "named");
    const placed = [];
    if (spec.compact) {
      // Narrow screens: lettered markers here, spelled out under the key.
      for (const n of spec.named) {
        const [x, y] = xy(n.hard, n.clay, n.grass);
        named.append("circle").attr("cx", x).attr("cy", y).attr("r", 0.62 * u)
          .attr("fill", P.bg).attr("stroke", P.ink).attr("stroke-width", 1.5);
        text(named, x, y, n.label[0], { size: small, color: P.ink, anchor: "middle",
          baseline: "central", weight: "bold" });
      }
    }
    for (const n of spec.compact ? [] : spec.named) {
      const [x, y] = xy(n.hard, n.clay, n.grass);
      const who = `${players[n.leader].short} ${pct(n.p)}`;
      // Try preferred side then the other, one line then two; keep the first box that stays
      // inside the triangle (ticks live just outside) and clears earlier labels.
      const other = n.side === "left" ? "right" : "left";
      const tries = [[n.side, 1], [n.side, 2], [other, 1], [other, 2]];
      let lab = null;
      for (const [side, lines] of tries) {
        const o = { size: label, color: P.ink, anchor: side === "left" ? "end" : "start",
          fill: P.bg, stroke: P.ink };
        const dx = side === "left" ? -12 : 12;
        lab = lines === 1
          ? boxLabel(named, x + dx, y, [{ text: `${n.label}: `, weight: "bold" }, { text: who }], o)
          : boxLabel(named, x + dx, y - label * 0.6, [{ text: n.label, weight: "bold" },
            { text: who, br: true }], o);
        const bb = lab.node().getBBox();
        const inside = [bb.y, bb.y + bb.height].every((yy) => {
          const g = (oy - yy) / (H * L);
          return bb.x >= ox + g * L / 2 && bb.x + bb.width <= ox + L - g * L / 2;
        });
        const clear = placed.every((q) => bb.x > q.x + q.width || bb.x + bb.width < q.x
          || bb.y > q.y + q.height || bb.y + bb.height < q.y);
        if (inside && clear) { placed.push(bb); break; }
        if (side === other && lines === 2) { placed.push(bb); break; }   // best effort
        lab.remove();
      }
      named.append("circle").attr("cx", x).attr("cy", y).attr("r", 5)
        .attr("fill", P.bg).attr("stroke", P.ink).attr("stroke-width", 2);
    }

    // Key: one row per player, one column per probability bin, using the plot's own fills.
    const key = svg.append("g").attr("id", "key");
    const r = Math.min(R * 1.1, 0.75 * u);
    let colW = Math.max(2 * r + 8, small * 3.4);
    const rowH = 2 * r + 8;
    const kx = keyRight ? box.right - keyW + 0.94 * u : box.left + (box.right - box.left) / 2 - 9.4 * u;
    const ky = keyRight ? box.top + (box.bottom - box.top) / 2 - 4.2 * u : oy + pad.b + 1.7 * u;
    text(key, kx, ky, "Most likely to have the highest peak", { size: label, weight: "bold",
      color: P.ink });
    text(key, kx, ky + label * 1.5, "How likely, given the data:", { size: small,
      color: P.inkSecondary });
    const heads = spec.binLabels.map((b) => text(key, 0, ky + label * 3, b,
      { size: small * 0.9, color: P.inkSecondary, anchor: "middle" }));
    colW = Math.max(colW, d3.max(heads, (t) => t.node().getComputedTextLength()) + 0.5 * u);
    heads.forEach((t, i) => t.attr("x", kx + r + i * colW));
    spec.players.forEach((p, j) => {
      const cy = ky + label * 3 + 8 + r + j * rowH;
      bins.forEach((_, i) => {
        const f = tint(p.color, i);
        key.append("polygon").attr("points", hex(kx + r + i * colW, cy, r)
          .map((q) => q.join(",")).join(" ")).attr("fill", f);
      });
      text(key, kx + bins.length * colW + 4, cy, p.name, { size: label, color: P.ink,
        baseline: "central" });
    });
    // Keep the key inside the panel: shift it left by however much its measured width overflows.
    const kb = key.node().getBBox();
    if (kb.x + kb.width > box.right) key.attr("transform", `translate(${box.right - kb.x - kb.width},0)`);
    if (spec.compact) {
      spec.named.forEach((n, j) => {
        const t = text(key, kx, ky + label * 3 + 8 + 2 * r + spec.players.length * rowH + label * 1.4 * (j + 0.6),
          undefined, { size: label, color: P.ink });
        t.append("tspan").attr("font-weight", "bold").text(`${n.label[0]}  ${n.label}: `);
        t.append("tspan").text(`${players[n.leader].short} ${pct(n.p)}`);
      });
    }
  });
}
