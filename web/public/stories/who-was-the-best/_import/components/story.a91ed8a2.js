// Stepper story: one D3 stage. Each phase names a view (timeline, lines, drift, revision,
// network, mountains, peaks, certainty, simplex, slams, trust, limits, thanks) and its parameters; go(n) transitions the stage there.
// Titles and notes are page text, set by the caller from PHASES; a note may be a function of
// the data payload when it quotes the run.
import { simplex } from "./simplex.131ada0f.js";
import { wrap } from "./common.9b492e00.js";

const SURF = ["Hard", "Clay", "Grass"];

export const PHASES = [
  { label: "Start", view: "title", title: "", note: "" },
  { label: "A match", view: "winprob", bo5: false,
    title: "Each match can be modelled as a weighted coin flip",
    note: "The bigger the strength gap, the more likely the stronger player is to win. This is a "
      + "Bradley–Terry model, using the same win-probability formula as Elo. On the usual Elo "
      + "scale, a 100-point edge wins about 64% of the time, and a 550-point edge about 96%." },
  { label: "Best of five", view: "winprob", bo5: true,
    title: "Best of five makes the gap count more",
    note: (d) => "Longer matches give the better player more chances. In best of five the model multiplies "
      + `the strength gap by a learned ${d.model.kappa5.toFixed(2)} before turning it into a win probability: `
      + "a 100-point edge wins about 69% instead of 64%. Upsets in Grand Slam matches are therefore less likely and generate stronger signals when they occur." },
  { label: "Elo", view: "elo",
    title: "The usual way: Elo",
    note: "Elo nudges a player's rating after every match by K × (result − expected). Beating a weaker "
      + "player earns little, but an upset moves both ratings a lot. Illustration with K = 32; the tuned Elo "
      + "benchmark used later lets K shrink with experience, adds surface ratings and scales best of five." },
  { label: "Versus Elo", view: "versus",
    title: "From Elo ratings to reconstructed careers",
    note: "Both turn a strength gap into a win probability. They differ in how strength is estimated over "
      + "time, whether past estimates can be revised, and how uncertainty is shown." },
  { label: "Hidden strength", view: "lines", player: "Novak Djokovic", series: ["Overall"], draw: true,
    title: "We observe results and estimate strength",
    note: "Here is Djokovic's estimated strength, using his matches before and after each date. The line is "
      + "the posterior median, with the shaded band containing the middle 50% of the model's estimates. Zero is "
      + "the average strength of active players ranked 10th–100th by the model in that two-week period." },
  { label: "Aging", view: "aging",
    title: "A shared aging curve",
    note: "The model learns one average age pattern for all players, relative to the field; each career "
      + "then deviates from it. The fitted curve peaks around 23, then drops about 75 rating points from "
      + "26 to 30 and about 200 by 34. This is the typical pattern, but individual careers may vary, and in fact elite players often deviate significantly." },
  { label: "Drift", view: "drift",
    title: "How quickly can strength change?",
    note: (d) => "On top of the aging curve, strength drifts a little every two weeks modelled as a random walk. The "
      + `model learns one drift size for all players, about ${Math.round(d.model.tau_points)} rating points `
      + `per two weeks (about ${Math.round(d.model.tau_points * Math.sqrt(26) / 10) * 10} a year). Slow `
      + "drift links nearby periods, so later results say more about earlier strength." },
  { label: "Future", view: "revision",
    title: "Can future matches change the past? Alcaraz's example.",
    note: "At the end of 2022 we had seen only part of Alcaraz's career. His later results are more "
      + "evidence about how strong he already was. The model uses them to revisit its earlier estimate, "
      + "while still allowing for real improvement in between." },
  { label: "Opponents", view: "network",
    title: "Every opponent tells us something",
    note: "A win says something about your strength, but how much depends on how strong the opponent was. "
      + "That opponent's other matches, including later ones, sharpen the picture. The model revisits "
      + "these linked estimates together, so a later result can change how an old win reads." },
  { label: "Surfaces", view: "lines", player: "Novak Djokovic", series: ["Hard", "Clay", "Grass"],
    ghost: "Overall", morph: true,
    title: "One strength per surface",
    note: (d) => "In this surface model, each player has three linked strengths: hard, clay and grass. Their "
      + `two-week changes are strongly correlated (fitted ≈ ${d.model.rho.toFixed(2)}), so each surface `
      + "informs the others, but they can grow apart. Dashed: overall, by each season's surface mix." },
  { label: "Nadal", view: "lines", player: "Rafael Nadal", series: ["Hard", "Clay", "Grass"],
    ghost: "Overall",
    title: "For Nadal, the surfaces separate much more",
    note: "The same model gives Nadal a much larger gap between surfaces. His clay peak is the highest "
      + "rating on any surface in the data, about 120 points clear of "
      + "the next-best clay player (Djokovic)." },
  { label: "Who was strongest", view: "timeline", domain: ["1990-01-01", "2026-07-01"],
    title: "Who was strongest at each point in time?",
    note: "Each column covers two weeks, with each row representing a player. Darker cells mean the model gives that "
      + "player a higher probability of being the strongest active player, using the tour's surface mix." },
  { label: "Sampras", view: "timeline", domain: ["1991-01-01", "2000-01-01"], focus: ["Pete Sampras"],
    title: "1993–1998: Sampras",
    note: "Sampras holds the top spot almost uncontested for six seasons. Before him, Lendl, Becker, Edberg "
      + "and Courier share it, with the model rarely sure who was on top." },
  { label: "Federer", view: "timeline", domain: ["2002-01-01", "2009-01-01"], focus: ["Roger Federer"],
    title: "2004–2007: Federer",
    note: "One of the two most clear-cut stretches of dominance in the whole period. The other is "
      + "Djokovic's in 2014–2016." },
  { label: "Big Three", view: "timeline", domain: ["2007-06-01", "2024-01-01"],
    focus: ["Roger Federer", "Rafael Nadal", "Novak Djokovic"],
    title: "2008–2023: The Big Three era.",
    note: "Djokovic leads for most of 2011–2016 and 2019–2023. Nadal moves in and out of the lead, and "
      + "Federer returns to it in 2017. When several rows have similar shading, the model is less sure "
      + "who was strongest." },
  { label: "Sinner", view: "timeline", domain: ["2019-01-01", "2026-07-01"],
    focus: ["Jannik Sinner", "Carlos Alcaraz"],
    title: "2024 to June 2026: Sinner and Alcaraz",
    note: "Sinner and Alcaraz lead the recent period. Their newest estimates have no later results to "
      + "learn from, so they can change as more matches arrive. The data stops at Roland Garros 2026."
      + " The model favors consistency over higher peaks of form, so Sinner's favored most of the time."
    },
  { label: "By year", view: "mountains", panels: ["Overall"], x: "year",
    title: "Career trajectories: the Big Three by year",
    note: "Their careers on the same calendar. Federer gets an early start, but Nadal and Djokovic arrive later."
      + " Lines show posterior medians; bands contain the middle 50% of estimates. Next, align them by "
      + "age to compare where each player was at the same stage of his career." },
  { label: "By age", view: "mountains", panels: ["Overall"], x: "age",
    title: "Career trajectories: the Big Three by age",
    note: "The same curves but now aligned by age. Nadal's rise was the earliest, Federer peaks around 24–25, and "
      + "Djokovic reaches the highest summit, at "
      + "around 27–28. All three stay strong well into their thirties, which is remarkable for professional tennis." },
  // One surface at a time: the single panel keeps its curves, so they morph from surface to surface.
  { label: "Hard", view: "mountains", panels: ["Hard"], x: "age", duration: 1400,
    title: "On hard courts, Djokovic leads",
    note: "The same curves, but now using only each player's hard-court strength instead of the "
      + "calendar-weighted overall." },
  { label: "Grass", view: "mountains", panels: ["Grass"], x: "age", duration: 1400,
    title: "On grass, Federer takes the edge over Djokovic",
    note: "Now each player's grass-court strength. Federer takes the edge over Djokovic at the top, and Nadal's grass "
      + "curve sits well below both." },
  { label: "Clay", view: "mountains", panels: ["Clay"], x: "age", duration: 1400,
    title: "On clay, there is no contest: Nadal is king.",
    note: "Nadal's clay peak is the highest rating on any surface in the data, about 120 points clear of "
      + "the next-best clay player (Djokovic). During a period in their late twenties, however, Novak and Rafa were extremely close." },
  { label: "Peaks", view: "peaks",
    title: "Each player's peak is on different surfaces, and each surface's peak is led by a different player",
    note: "Peak strength on each surface and overall (posterior median and 90% credible interval). Djokovic leads on hard, "
      + "Nadal on clay, Federer on grass, and Djokovic has the highest calendar-weighted overall peak." },
  { label: "Certainty", view: "certainty",
    title: "How certain are we?",
    note: (d) => "Past strength is never known exactly. The models don't give a single rating but many plausible careers: a distribution of outcomes. "
      + `In about ${Math.round(d.certainty.p_first_higher * 100)}% of them, Djokovic's overall `
      + "peak is higher than Federer's." },
  { label: "Weights", view: "simplex", highlight: null, build: true, duration: 600,
    title: "But “overall strength” depends on how you weigh the surfaces",
    note: "Here, each hexagon is a different mix of hard, clay and grass. Its colour shows the most likely peak "
      + "leader, with fainter colours meaning less certainty. Djokovic is most likely to lead using the tour's "
      + "surface mix (79%), the Grand Slam mix (74%) or equal weights (68%)." },
  { label: "Where it flips", view: "simplex", highlight: ["Rafael Nadal", "Roger Federer"],
    title: "Where Nadal and Federer take over",
    note: "Nadal leads once clay counts for around >50% of the weight, and on clay alone he is almost "
      + "certain (99.3%, 298/300 draws). Federer leads in mixes with at least 60% grass; the threshold depends on the "
      + "remaining mix. Even on grass alone, his probability of the highest peak is 57%." },
  { label: "Sinner & Alcaraz", view: "mountains", panels: ["Overall"],
    players: ["Roger Federer", "Rafael Nadal", "Novak Djokovic", "Jannik Sinner", "Carlos Alcaraz"],
    focus: ["Jannik Sinner", "Carlos Alcaraz"],
    title: "Sinner and Alcaraz, so far",
    note: "Their careers so far, against the Big Three at the same ages. Strength is relative to each "
      + "player's field. Data "
      + "runs until Roland Garros 2026, with the curves ending at each player's last match period." },
  { label: "Slams", view: "slams",
    title: "The most unlikely Grand Slam champions",
    note: (d) => (d.slams ? "Some champions looked inevitable, but many others had almost no chance when play began. "
      + `We replayed each Slam's draw in simulation, using only what the model knew before the first match. `
      + `The median champion had a ${Math.round(d.slams.median * 100)}% chance; Kuerten at Roland Garros 1997 had `
      + `about 1 in ${(Math.round(1 / d.slams.rows[0].p_title / 1000) * 1000).toLocaleString("en-US")}.`
      : "TODO: pre-tournament title probabilities not computed yet.") },
  { label: "Limits", view: "limits",
    title: "What the model takes into account, and what it misses",
    note: "A reconstruction of match-winning ability, within the limits of the observations and the "
      + "assumptions." },
  { label: "Thanks", view: "thanks",
    title: "Thanks for reading",
    note: "What would you want the Tennis Time Machine to investigate next?" },
];

export function createStory(d3, data, opts) {
  // The stage takes the real pixel size of its container; layouts adapt to it.
  const W = Math.round(opts.width), H = Math.round(opts.height);
  const wide = opts.wide ?? (W >= 760 && W / H >= 1.15);   // record.mjs forces it for portrait video
  const P = opts.palette, C = opts.colors;
  // Base font, px. textScale > 1 enlarges text for video renders (record.mjs; simplexScale sets the
  // triangle's, whose layout grows with its text; simplexLandscape fixes its layout for a near-square
  // video stage); the deck uses 1.
  const textScale = opts.textScale ?? 1;
  const fs = textScale * Math.max(12, Math.min(17, Math.min(W / 75, H / 38)));
  const color = (name) => C[name] ?? P.inkSecondary;
  const svg = d3.create("svg").attr("viewBox", `0 0 ${W} ${H}`).attr("width", "100%")
    .attr("font-family", opts.font).style("display", "block").style("height", "auto")
    .style("overflow", "visible");
  const clipId = `story-clip-${Math.random().toString(36).slice(2)}`;
  const clipRect = svg.append("defs").append("clipPath").attr("id", clipId).append("rect");
  const views = {};
  for (const v of ["title", "winprob", "elo", "versus", "aging", "drift", "revision", "network", "timeline",
    "lines", "mountains", "peaks", "certainty", "simplex", "slams", "trust", "limits", "thanks"]) {
    views[v] = svg.append("g").attr("class", `view-${v}`).attr("opacity", 0)
      .style("pointer-events", "none");
  }
  const parseDate = d3.utcParse("%Y-%m-%d");
  const ratingY = [-280, 720];
  const t0 = () => svg.transition().duration(0);
  let current = null, shown = null;

  const axisStyle = (g) => {
    g.selectAll("path, line").attr("stroke", P.inkMuted);
    g.selectAll("text").attr("fill", P.inkSecondary).attr("font-size", fs * 0.85)
      .attr("font-family", opts.font);
  };
  const gridStyle = (g) => {
    g.selection().select(".domain").remove();
    g.selectAll("line").attr("stroke", P.grid).attr("stroke-width", 1);
    g.selectAll("text").remove();
  };
  // Small print at the bottom of the stage; returns the height it takes.
  const footSize = () => fs * 0.78;
  const footnote = (g, str, delay = 0) => {
    const k = g.append("text").attr("class", "footnote").attr("x", 0).attr("y", 0)
      .attr("font-size", footSize()).attr("fill", P.inkMuted);
    const n = wrap(k, str, W, footSize() * 1.3);
    k.attr("transform", `translate(0,${H - (n - 1) * footSize() * 1.3 - footSize() * 0.3})`)
      .attr("opacity", 0).transition().delay(delay).duration(400).attr("opacity", 1);
    return n * footSize() * 1.3 + fs * 0.6;
  };
  // Seeded normal draws, so the illustrations look the same on every visit.
  const gauss = (seed) => {
    let s = seed >>> 0;
    const u = () => { s = (s + 0x6d2b79f5) >>> 0; let z = s;
      z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
      return (((z ^ (z >>> 14)) >>> 0) + 1) / 4294967297; };
    return () => Math.sqrt(-2 * Math.log(u())) * Math.cos(2 * Math.PI * u());
  };

  // --------------------------------------------------------------------- title
  function title(ph, t) {
    const g = views.title;
    if (!g.select("text").empty()) return;
    const cx = W / 2, cy = H * 0.42, big = Math.min(W / 14, H / 7);
    const lines = W / big > 9 ? ["Who was the best", "tennis player?"] : ["Who was", "the best tennis", "player?"];
    lines.forEach((l, i) => g.append("text").attr("x", cx).attr("y", cy - (lines.length - 1 - i) * big * 1.05)
      .attr("text-anchor", "middle").attr("font-size", big).attr("font-weight", 700)
      .attr("letter-spacing", "-0.03em").attr("fill", P.ink).text(l));
    const sub = g.append("text").attr("x", cx).attr("y", cy + big * 0.9).attr("text-anchor", "middle")
      .attr("font-size", fs * 1.25).attr("fill", P.inkSecondary);
    wrap(sub, `Modelling the relative strength of every player using all ATP tour-level matches from ${data.data.fit_start} to `
      + `${data.data.end}, with separate strengths on hard courts, clay and grass. Only match results (Win or Lose) are used to estimate each player's strength.`
      , Math.min(W * 0.8, 820), fs * 1.7);
    sub.selectAll("tspan").attr("x", cx);
    g.append("text").attr("x", cx).attr("y", H - fs * 2.2).attr("text-anchor", "middle")
      .attr("font-size", fs).attr("fill", P.accent).attr("font-weight", 600)
      .text("Press → or Next to start");
    g.append("text").attr("x", cx).attr("y", H - fs * 0.6).attr("text-anchor", "middle")
      .attr("font-size", fs * 0.8).attr("fill", P.inkMuted).attr("font-family", "IBM Plex Mono, monospace")
      .text("Alejandro Fontal · October 2026");
  }

  // ------------------------------------------------------------------- winprob
  // P(win) = 1 / (1 + 10^(-gap / 400)), with gaps scaled by kappa5 in best-of-five.
  const scale = data.model.elo_scale, k5 = data.model.kappa5;
  const pwin = (gap, bo5) => 1 / (1 + 10 ** (-(bo5 ? gap * k5 : gap) / scale));
  const pct = (v) => `${Math.round(v * 100)}%`;
  function winprob(ph, t) {
    const g = views.winprob;
    const m = { l: wide ? 90 : 70, r: wide ? 60 : 30, t: Math.max(90, H * 0.22), b: 56 };
    const x = d3.scaleLinear([0, 700], [m.l, W - m.r]);
    const y = d3.scaleLinear([0.5, 1], [H - m.b, m.t]);
    const curve = (bo5) => d3.line().x((d) => x(d)).y((d) => y(pwin(d, bo5)))(d3.range(0, 701, 5));
    if (g.select(".bo3").empty()) {
      g.append("g").attr("class", "grid").attr("transform", `translate(${m.l},0)`)
        .call(d3.axisLeft(y).ticks(5).tickSize(-(W - m.l - m.r))).call(gridStyle);
      g.append("g").attr("transform", `translate(0,${H - m.b + 6})`)
        .call(d3.axisBottom(x).ticks(7).tickSizeOuter(0)).call(axisStyle);
      g.append("g").attr("transform", `translate(${m.l - 6},0)`)
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".0%")).tickSize(0)).call(axisStyle)
        .select(".domain").remove();
      g.append("text").attr("x", (m.l + W - m.r) / 2).attr("y", H - 8).attr("text-anchor", "middle")
        .attr("font-size", fs * 0.85).attr("fill", P.inkSecondary).text("Strength gap, rating points");
      g.append("text").attr("transform", `translate(${fs},${(m.t + H - m.b) / 2}) rotate(-90)`)
        .attr("text-anchor", "middle").attr("font-size", fs * 0.85).attr("fill", P.inkSecondary)
        .text("Chance the stronger player wins");
      g.append("path").attr("class", "bo5").attr("fill", "none").attr("stroke", P.accent)
        .attr("stroke-width", 2.5).attr("stroke-dasharray", "7 5").attr("d", curve(true)).attr("opacity", 0);
      g.append("text").attr("class", "bo5-label").attr("font-size", fs).attr("font-weight", 600)
        .attr("fill", P.accent).attr("x", x(260)).attr("y", y(pwin(260, true)) - 12).attr("opacity", 0)
        .text("Best of five");
      g.append("path").attr("class", "bo3").attr("fill", "none").attr("stroke", P.ink)
        .attr("stroke-width", 2.5).attr("d", curve(false));
      g.append("text").attr("class", "bo3-label").attr("font-size", fs).attr("font-weight", 600)
        .attr("fill", P.ink).attr("x", x(330)).attr("y", y(pwin(330, false)) + fs * 1.6)
        .text("Best of three");
      // Two players on a strength line above the chart, pulled apart as the marker moves.
      const ly = m.t * 0.42;
      g.append("line").attr("x1", m.l).attr("x2", W - m.r).attr("y1", ly).attr("y2", ly)
        .attr("stroke", P.grid).attr("stroke-width", 2);
      g.append("text").attr("x", m.l).attr("y", ly - fs * 1.1).attr("font-size", fs * 0.8)
        .attr("fill", P.inkMuted).text("Strength");
      g.append("circle").attr("class", "pa").attr("cy", ly).attr("r", fs * 0.7).attr("fill", P.inkMuted);
      g.append("circle").attr("class", "pb").attr("cy", ly).attr("r", fs * 0.7).attr("fill", P.accent);
      g.append("line").attr("class", "gapline").attr("y1", ly + fs * 1.4).attr("y2", ly + fs * 1.4)
        .attr("stroke", P.inkSecondary).attr("stroke-width", 1.5);
      g.append("circle").attr("class", "marker").attr("r", fs * 0.55).attr("fill", P.accent)
        .attr("stroke", P.bg).attr("stroke-width", 2);
      g.append("text").attr("class", "readout").attr("font-size", fs * 1.15).attr("font-weight", 700)
        .attr("fill", P.ink);
      g.append("g").attr("class", "callouts");
    }
    const set = (gap) => {
      const p = pwin(gap, ph.bo5);
      const base = m.l + 0.05 * (W - m.l - m.r);
      g.select(".pa").attr("cx", base);
      g.select(".pb").attr("cx", base + (x(gap) - x(0)));
      g.select(".gapline").attr("x1", base).attr("x2", base + (x(gap) - x(0)));
      g.select(".marker").attr("cx", x(gap)).attr("cy", y(p));
      const flip = x(gap) > m.l + 0.62 * (W - m.l - m.r);    // keep the readout on screen
      g.select(".readout").attr("text-anchor", flip ? "end" : "start")
        .attr("x", x(gap) + (flip ? -fs : fs)).attr("y", y(p) + (ph.bo5 ? -fs * 0.9 : fs * 1.6))
        .text(`${Math.round(gap)} pts → ${pct(p)}`);
    };
    g.select(".bo5").transition(t).attr("opacity", ph.bo5 ? 1 : 0);
    g.select(".bo5-label").transition(t).attr("opacity", ph.bo5 ? 1 : 0);
    const target = ph.bo5 ? 100 : 550;
    g.transition("gap").duration(t.duration() ? 2200 : 0).ease(d3.easeCubicInOut).tween("gap", () => {
      const start = ph.bo5 ? 550 : 0;
      const i = d3.interpolateNumber(start, target);
      return (u) => set(i(u));
    });
    // Callouts: the numbers quoted in the note.
    const marks = ph.bo5 ? [[100, false], [100, true]] : [[100, false], [550, false]];
    g.select(".callouts").selectAll("*").remove();
    for (const [gap, bo5] of marks) {
      const p = pwin(gap, bo5);
      const c = g.select(".callouts").append("g").attr("opacity", 0);
      c.append("line").attr("x1", x(gap)).attr("x2", x(gap)).attr("y1", y(0.5)).attr("y2", y(p))
        .attr("stroke", bo5 ? P.accent : P.inkMuted).attr("stroke-dasharray", "3 3");
      c.append("circle").attr("cx", x(gap)).attr("cy", y(p)).attr("r", 4)
        .attr("fill", bo5 ? P.accent : P.ink);
      c.append("text").attr("x", x(gap) - 8).attr("y", y(p) - 8).attr("text-anchor", "end")
        .attr("font-size", fs * 0.9).attr("fill", bo5 ? P.accent : P.ink).text(pct(p));
      c.transition().delay(t.duration() ? 2200 : 0).duration(400).attr("opacity", 1);
    }
  }

  // ----------------------------------------------------------------------- elo
  // Worked example (illustration, not data): A 1900 vs B 1800, K = 32.
  function elo(ph, t) {
    const g = views.elo;
    g.selectAll("*").remove();
    const K = 32, rA = 1900, rB = 1800;
    const eA = 1 / (1 + 10 ** (-(rA - rB) / 400));
    const cases = [
      { head: "If the favourite wins", d: K * (1 - eA), win: "A" },
      { head: "If the underdog wins (an upset)", d: -K * eA, win: "B" },
    ];
    const pad = fs * 1.5, cols = wide ? 2 : 1;
    const pw = (W - (cols - 1) * pad) / cols, ph2 = (H - (cols === 1 ? pad : 0)) / (3 - cols);
    const y = (b) => d3.scaleLinear([1770, 1930], [b + ph2 - fs * 1.5, b + fs * 6.2]);
    const late = t.duration() ? 900 : 0;
    cases.forEach((c, i) => {
      const x0 = cols === 2 ? i * (pw + pad) : 0, y0 = cols === 2 ? 0 : i * (ph2 + pad);
      const k = g.append("g");
      const sy = y(y0);
      k.append("rect").attr("x", x0).attr("y", y0).attr("width", pw).attr("height", ph2).attr("rx", 14)
        .attr("fill", P.paper).attr("stroke", P.grid);
      k.append("text").attr("x", x0 + fs).attr("y", y0 + fs * 1.8).attr("font-size", fs * 1.15)
        .attr("font-weight", 700).attr("fill", P.ink).text(c.head);
      k.append("g").attr("transform", `translate(${x0 + fs * 4},0)`)
        .call(d3.axisLeft(sy).ticks(4).tickFormat(d3.format("d"))).call(axisStyle);
      const players = [
        { id: "A", r: rA, e: eA, col: P.accent, dx: 0.38 },
        { id: "B", r: rB, e: 1 - eA, col: P.inkMuted, dx: 0.7 },
      ];
      for (const p of players) {
        const delta = p.id === "A" ? c.d : -c.d;
        const cx = x0 + pw * p.dx;
        k.append("line").attr("x1", cx).attr("x2", cx).attr("y1", sy(p.r)).attr("y2", sy(p.r))
          .attr("stroke", p.col).attr("stroke-width", 3)
          .transition().delay(late).duration(1200).attr("y2", sy(p.r + delta));
        k.append("circle").attr("cx", cx).attr("cy", sy(p.r)).attr("r", fs * 0.35).attr("fill", "none")
          .attr("stroke", p.col).attr("stroke-dasharray", "2 2");
        const dot = k.append("circle").attr("cx", cx).attr("cy", sy(p.r)).attr("r", fs * 0.6).attr("fill", p.col);
        dot.transition().delay(late).duration(1200).ease(d3.easeCubicOut).attr("cy", sy(p.r + delta));
        k.append("text").attr("x", cx).attr("y", y0 + fs * 3.6).attr("text-anchor", "middle")
          .attr("font-size", fs).attr("font-weight", 700).attr("fill", p.col)
          .text(`${p.id} · ${p.r}`);
        k.append("text").attr("x", cx).attr("y", y0 + fs * 4.8).attr("text-anchor", "middle")
          .attr("font-size", fs * 0.8).attr("fill", P.inkSecondary).text(`expected ${pct(p.e)}`);
        const lab = k.append("text").attr("x", cx + fs).attr("y", sy(p.r + delta)).attr("dominant-baseline", "central")
          .attr("font-size", fs * 1.1).attr("font-weight", 700).attr("fill", p.col).attr("opacity", 0)
          .text(`${delta > 0 ? "+" : "−"}${Math.abs(delta).toFixed(1)}`);
        lab.transition().delay(late + 1100).duration(400).attr("opacity", 1);
      }
    });
  }

  // -------------------------------------------------------------------- versus
  function versus(ph, t) {
    const g = views.versus;
    g.selectAll("*").remove();
    const rows = [
      ["Information", "Updates ratings using earlier matches only",
        "Reconstructs past strength using matches before and after each date"],
      ["Output", "A point rating (overall and per surface), no uncertainty",
        "A posterior distribution over each player's strength"],
      ["Change over time", "Ratings move after each result; the step size (K) shrinks with experience",
        "A hidden strength path, with a rate of change learned from the data"],
      ["Opponents", "Uses each opponent's rating at the time",
        "Revises linked estimates across the whole match network"],
    ];
    const late = (i) => (t.duration() ? 300 + i * 220 : 0);
    footnote(g, "Forecasts from this model still use only information available before each match.",
      late(rows.length));
    if (wide) {
      const c0 = 0, c1 = W * 0.2, c2 = W * 0.56, rh = Math.min(fs * 6, (H - fs * 7) / rows.length);
      const head = g.append("g");
      [["", c0], ["Elo benchmark", c1], ["This model", c2]].forEach(([h, x]) => head.append("text").attr("x", x)
        .attr("y", fs * 1.4).attr("font-size", fs * 1.2).attr("font-weight", 700)
        .attr("fill", h === "This model" ? P.accent : P.ink).text(h));
      rows.forEach(([lab, a, b], i) => {
        const y0 = fs * 2.6 + i * rh;
        const k = g.append("g").attr("opacity", 0);
        k.append("line").attr("x1", 0).attr("x2", W).attr("y1", y0).attr("y2", y0).attr("stroke", P.grid);
        k.append("text").attr("x", c0).attr("y", y0 + rh / 2 - fs * 0.3)
          .attr("font-size", fs * 1.05).attr("font-weight", 600).attr("fill", P.ink).text(lab);
        const ta = k.append("text").attr("x", c1).attr("y", y0 + rh / 2 - fs * 0.3).attr("font-size", fs)
          .attr("fill", P.inkSecondary);
        wrap(ta, a, c2 - c1 - fs * 2, fs * 1.3);
        const tb = k.append("text").attr("x", c2).attr("y", y0 + rh / 2 - fs * 0.3).attr("font-size", fs)
          .attr("font-weight", 500).attr("fill", P.ink);
        wrap(tb, b, W - c2, fs * 1.3);
        k.transition().delay(late(i)).duration(400).attr("opacity", 1);
      });
    } else {
      // Phones: one block per row, Elo line then model line, wrapped to the width.
      let y = fs;
      const lh = fs * 1.25;
      rows.forEach(([lab, a, b2], i) => {
        const k = g.append("g").attr("opacity", 0);
        k.append("line").attr("x1", 0).attr("x2", W).attr("y1", y - fs * 0.6).attr("y2", y - fs * 0.6)
          .attr("stroke", P.grid);
        k.append("text").attr("x", 0).attr("y", y + fs * 0.6).attr("font-size", fs)
          .attr("font-weight", 700).attr("fill", P.ink).text(lab);
        y += fs * 1.9;
        const ta = k.append("text").attr("x", 0).attr("y", y).attr("font-size", fs * 0.88)
          .attr("fill", P.inkSecondary);
        y += wrap(ta, `Elo benchmark: ${a}`, W, lh) * lh;
        const tb = k.append("text").attr("x", 0).attr("y", y).attr("font-size", fs * 0.88)
          .attr("fill", P.accent).attr("font-weight", 500);
        y += wrap(tb, `Model: ${b2}`, W, lh) * lh + fs * 0.9;
        k.transition().delay(late(i)).duration(400).attr("opacity", 1);
      });
    }
  }

  // --------------------------------------------------------------------- aging
  function aging(ph, t) {
    const g = views.aging;
    if (!g.select(".curve").empty()) { drawOn(g.select(".curve"), t); return; }
    const m = { l: wide ? 90 : 70, r: wide ? 60 : 30, t: 20, b: 56 };
    const pts = data.model.aging.filter(([a]) => a >= 17 && a <= 38);
    const x = d3.scaleLinear([17, 38], [m.l, W - m.r]);
    const y = d3.scaleLinear([d3.min(pts, (d) => d[1]) - 20, 60], [H - m.b, m.t]).nice();
    g.append("g").attr("transform", `translate(${m.l},0)`)
      .call(d3.axisLeft(y).ticks(6).tickSize(-(W - m.l - m.r))).call(gridStyle);
    g.append("g").attr("transform", `translate(0,${H - m.b + 6})`)
      .call(d3.axisBottom(x).ticks(11).tickSizeOuter(0)).call(axisStyle);
    g.append("g").attr("transform", `translate(${m.l - 6},0)`)
      .call(d3.axisLeft(y).ticks(6).tickSize(0)).call(axisStyle).select(".domain").remove();
    g.append("line").attr("x1", m.l).attr("x2", W - m.r).attr("y1", y(0)).attr("y2", y(0))
      .attr("stroke", P.inkMuted).attr("stroke-dasharray", "4 4");
    g.append("text").attr("x", (m.l + W - m.r) / 2).attr("y", H - 8).attr("text-anchor", "middle")
      .attr("font-size", fs * 0.85).attr("fill", P.inkSecondary).text("Age");
    g.append("text").attr("transform", `translate(${fs},${(m.t + H - m.b) / 2}) rotate(-90)`)
      .attr("text-anchor", "middle").attr("font-size", fs * 0.85).attr("fill", P.inkSecondary)
      .text(`Rating points relative to the same player at ${data.model.aging_anchor}`);
    g.append("path").attr("class", "curve").attr("fill", "none").attr("stroke", P.accent)
      .attr("stroke-width", 3).attr("d", d3.line().x((d) => x(d[0])).y((d) => y(d[1]))(pts));
    const at = (age) => d3.least(data.model.aging, (d) => Math.abs(d[0] - age))[1];
    const peak = d3.greatest(pts, (d) => d[1]);
    const marks = [[peak[0], `Peak around ${Math.round(peak[0])}`],
      [30, `${Math.round(at(30) - at(26))} by 30`], [34, `${Math.round(at(34) - at(26))} by 34`]];
    const c = g.append("g").attr("class", "callouts");
    marks.forEach(([age, label], i) => {
      const k = c.append("g").attr("opacity", 0);
      k.append("circle").attr("cx", x(age)).attr("cy", y(at(age))).attr("r", 5).attr("fill", P.accent);
      k.append("text").attr("x", x(age) + 10).attr("y", y(at(age)) - 10).attr("font-size", fs)
        .attr("font-weight", 600).attr("fill", P.ink).text(label);
      k.transition().delay((t.duration() ? 1800 : 0) + i * 250).duration(400).attr("opacity", 1);
    });
    drawOn(g.select(".curve"), t);
  }

  // --------------------------------------------------------------------- drift
  // Illustration, not data: random walks run backwards from a strength known at "now", with the
  // fitted drift and three times that. The fan is the 90% range of the earlier strength.
  function drift(ph, t) {
    const g = views.drift;
    g.selectAll("*").remove();
    const tau = data.model.tau_points, n = 78, z90 = 1.645;
    const fb = footnote(g, "Illustration: simulated random walks. θ[t+1] = θ[t] + ε[t], "
      + "ε ~ Normal(0, τ²), for the part of strength the aging curve does not explain. One τ for all "
      + "players (shared across surfaces in the surface model). Uncertainty also grows during long breaks "
      + "without matches.", t.duration() ? 1800 : 0);
    const panels = [
      { head: `Slow drift: the fitted ≈ ${Math.round(tau)} points per two weeks`, tau, seed: 7 },
      { head: "Fast drift: three times as much, for comparison", tau: 3 * tau, seed: 11 },
    ];
    const gap = fs * 2, cols = wide ? 2 : 1;
    const pw = (W - (cols - 1) * gap) / cols;
    const pht = (H - fb - (cols === 1 ? gap : 0)) / (3 - cols);
    panels.forEach((p, i) => {
      const x0 = cols === 2 ? i * (pw + gap) : 0, y0 = cols === 2 ? 0 : i * (pht + gap);
      const m = { l: 56, r: 16, t: fs * 2.4, b: fs * 2.6 };
      const x = d3.scaleLinear([-n, 0], [x0 + m.l, x0 + pw - m.r]);
      const y = d3.scaleLinear([-460, 460], [y0 + pht - m.b, y0 + m.t]);
      const k = g.append("g");
      const cid = `${clipId}-drift-${i}`;
      k.append("clipPath").attr("id", cid).append("rect").attr("x", x0 + m.l).attr("y", y0 + m.t)
        .attr("width", pw - m.l - m.r + fs).attr("height", pht - m.t - m.b);
      k.append("text").attr("x", x0).attr("y", y0 + fs * 1.1).attr("font-size", fs * 1.05)
        .attr("font-weight", 600).attr("fill", P.ink).text(p.head);
      k.append("g").attr("transform", `translate(${x0 + m.l},0)`)
        .call(d3.axisLeft(y).tickValues([-400, -200, 0, 200, 400]).tickSize(-(pw - m.l - m.r)))
        .call(gridStyle);
      k.append("g").attr("transform", `translate(${x0 + m.l - 6},0)`)
        .call(d3.axisLeft(y).tickValues([-400, -200, 0, 200, 400]).tickSize(0)
          .tickFormat((v) => (v > 0 ? `+${v}` : `${v}`))).call(axisStyle).select(".domain").remove();
      k.append("g").attr("transform", `translate(0,${y0 + pht - m.b + 6})`)
        .call(d3.axisBottom(x).tickValues([-78, -52, -26, 0]).tickSizeOuter(0)
          .tickFormat((v) => (v ? `${-v / 26} yr before` : "known"))).call(axisStyle);
      const ks = d3.range(0, n + 1);
      const plot = k.append("g").attr("clip-path", `url(#${cid})`);
      const fan = plot.append("path").attr("fill", P.accent).attr("fill-opacity", 0.12)
        .attr("d", d3.area().x((j) => x(-j)).y0((j) => y(-z90 * p.tau * Math.sqrt(j)))
          .y1((j) => y(z90 * p.tau * Math.sqrt(j)))(ks));
      const rnd = gauss(p.seed);
      const walks = d3.range(7).map(() => {
        let v = 0;
        return ks.map((j) => { if (j) v += p.tau * rnd(); return [j, v]; });
      });
      const paths = plot.selectAll("path.walk").data(walks).join("path").attr("class", "walk")
        .attr("fill", "none").attr("stroke", P.inkSecondary).attr("stroke-width", 1.2)
        .attr("stroke-opacity", 0.55).attr("d", d3.line().x((d) => x(-d[0])).y((d) => y(d[1])));
      k.append("circle").attr("cx", x(0)).attr("cy", y(0)).attr("r", fs * 0.45).attr("fill", P.accent);
      const spread = Math.round(z90 * p.tau * Math.sqrt(n));
      const lab = k.append("text").attr("x", x(-n) + 8).attr("y", Math.max(y(spread) - 8, y0 + m.t + fs * 1.2)).attr("font-size", fs * 0.95)
        .attr("font-weight", 600).attr("fill", P.accent).attr("stroke", P.bg).attr("stroke-width", 5)
        .attr("paint-order", "stroke").text(`3 years earlier: ±${spread} points`);
      // Draw the walks backwards from the known point, then reveal the fan and its label.
      if (t.duration()) {
        paths.each(function () {
          const len = this.getTotalLength();
          d3.select(this).attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", -len)
            .transition().delay(i * 300).duration(1500).ease(d3.easeCubicOut).attr("stroke-dashoffset", 0);
        });
        fan.attr("opacity", 0).transition().delay(1300 + i * 300).duration(600).attr("opacity", 1);
        lab.attr("opacity", 0).transition().delay(1500 + i * 300).duration(400).attr("opacity", 1);
      }
    });
  }

  // ------------------------------------------------------------------ revision
  // Alcaraz's R_w from the same model fitted on matches through 2022 and on all matches, with the
  // same hyperparameters and refinement (analysis/revision.py).
  const rev = data.revision?.["Carlos Alcaraz"];
  const revSeries = (k) => rev[k].map(([d, q05, q25, q50, q75]) => ({ x: parseDate(d), lo: q25, mid: q50, hi: q75 }));
  function revision(ph, t) {
    const g = views.revision;
    g.selectAll("*").remove();
    if (!rev) {
      g.append("text").attr("x", W / 2).attr("y", H / 2).attr("text-anchor", "middle").attr("font-size", fs)
        .attr("fill", P.inkMuted).text("No revision.csv in this run (ttm revision --run-id …)");
      return;
    }
    const then = revSeries("cut_2022"), now = revSeries("smoothed");
    const late = t.duration() ? 1 : 0;
    const fb = footnote(g, "Both curves: the same surface model, fitted settings and procedure but "
      + "only the number of future matches differ.",
       late * 3200);
    const col = color("Carlos Alcaraz");
    const m = { l: 72, r: wide ? 24 : 12, t: fs * 5.6, b: fb + 30 };
    const x = d3.scaleUtc([parseDate("2020-01-01"), now.at(-1).x], [m.l, W - m.r]);
    const y = d3.scaleLinear([d3.min([...then, ...now], (d) => d.lo) - 20,
      d3.max([...then, ...now], (d) => d.hi) + 20], [H - m.b, m.t]).nice();
    // Axes (not frameAxes: this view keeps its own bottom margin for the footnote).
    g.append("g").attr("transform", `translate(${m.l},0)`)
      .call(d3.axisLeft(y).ticks(6).tickSize(-(W - m.l - m.r))).call(gridStyle);
    g.append("g").attr("transform", `translate(0,${H - m.b + 6})`)
      .call(d3.axisBottom(x).ticks(wide ? 7 : 4).tickSizeOuter(0)).call(axisStyle);
    g.append("g").attr("transform", `translate(${m.l - 6},0)`)
      .call(d3.axisLeft(y).ticks(6).tickSize(0)).call(axisStyle).select(".domain").remove();
    g.append("line").attr("x1", m.l).attr("x2", W - m.r).attr("y1", y(0)).attr("y2", y(0))
      .attr("stroke", P.inkMuted).attr("stroke-dasharray", "4 4");
    g.append("text").attr("transform", `translate(${wide ? 16 : 18},${(m.t + H - m.b) / 2}) rotate(-90)`)
      .attr("text-anchor", "middle").attr("font-size", fs * 0.85).attr("fill", P.inkSecondary)
      .text(wide ? "Rating points above the 10th–100th best players" : "Points above 10th–100th");
    // Legend.
    const legend = [
      { label: "Estimated at the end of 2022: matches up to then", stroke: P.inkSecondary, dash: "6 4" },
      { label: `Estimated today: all matches through ${data.data.end}`, stroke: col, dash: null },
    ];
    legend.forEach((l, i) => {
      const ly = fs * (0.8 + i * 1.5);
      const lx = wide ? m.l : 0;
      g.append("line").attr("x1", lx).attr("x2", lx + fs * 1.6).attr("y1", ly).attr("y2", ly)
        .attr("stroke", l.stroke).attr("stroke-width", 2.4).attr("stroke-dasharray", l.dash);
      g.append("text").attr("x", lx + fs * 2.1).attr("y", ly).attr("dominant-baseline", "central")
        .attr("font-size", fs * 0.95).attr("font-weight", 600).attr("fill", l.stroke).text(l.label);
    });
    const area = d3.area().x((d) => x(d.x)).y0((d) => y(d.lo)).y1((d) => y(d.hi));
    const line = d3.line().x((d) => x(d.x)).y((d) => y(d.mid));
    // The cut: his last match period of 2022, the end of the cut fit.
    const a = then.at(-1), b = now.find((d) => +d.x === +a.x);
    g.append("line").attr("x1", x(a.x)).attr("x2", x(a.x)).attr("y1", m.t - fs * 0.6).attr("y2", H - m.b)
      .attr("stroke", P.inkMuted).attr("stroke-dasharray", "2 3");
    g.append("text").attr("x", x(a.x)).attr("y", m.t - fs * 0.9).attr("text-anchor", "middle")
      .attr("font-size", fs * 0.85).attr("fill", P.inkSecondary).text("End of 2022");
    const bandThen = g.append("path").attr("fill", P.inkSecondary).attr("fill-opacity", 0.14).attr("d", area(then));
    const lineThen = g.append("path").attr("fill", "none").attr("stroke", P.inkSecondary).attr("stroke-width", 2)
      .attr("stroke-dasharray", "6 4").attr("d", line(then));
    const bandNow = g.append("path").attr("fill", col).attr("fill-opacity", 0.18);
    const lineNow = g.append("path").attr("fill", "none").attr("stroke", col).attr("stroke-width", 2.6);
    // Callouts at the cut: then vs now.
    const call = g.append("g");
    // The higher value is labelled above-left of its point, the lower one below-right.
    for (const [d, c, txt] of [[a, P.inkSecondary, `then ${Math.round(a.mid)}`], [b, col, `now ${Math.round(b.mid)}`]]) {
      const up = d.mid >= Math.max(a.mid, b.mid);
      call.append("circle").attr("cx", x(d.x)).attr("cy", y(d.mid)).attr("r", 5).attr("fill", c)
        .attr("stroke", P.bg).attr("stroke-width", 1.5);
      call.append("text").attr("x", x(d.x) + (up ? -10 : 10)).attr("y", y(d.mid) + (up ? -fs * 0.8 : fs * 1.4))
        .attr("text-anchor", up ? "end" : "start").attr("font-size", fs * 1.05).attr("font-weight", 700)
        .attr("fill", c).text(txt);
    }
    if (t.duration()) {
      // First the end-of-2022 estimate, then today's estimate over the whole career.
      // A fade, not drawOn: drawOn clears the dash pattern this line needs.
      bandThen.attr("opacity", 0).transition().delay(300).duration(800).attr("opacity", 1);
      lineThen.attr("opacity", 0).transition().duration(800).attr("opacity", 1);
      bandNow.attr("d", area(now)).attr("opacity", 0).transition().delay(2300).duration(700)
        .attr("opacity", 1);
      const len = lineNow.attr("d", line(now)).node().getTotalLength();
      lineNow.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len)
        .transition().delay(1200).duration(1600).ease(d3.easeCubicInOut).attr("stroke-dashoffset", 0)
        .on("end", function () { d3.select(this).attr("stroke-dasharray", null); });
      call.attr("opacity", 0).transition().delay(2900).duration(500).attr("opacity", 1);
    } else {
      bandNow.attr("d", area(now));
      lineNow.attr("d", line(now));
    }
  }

  // ------------------------------------------------------------------- network
  // Illustration with made-up players: a later result changes how an earlier win reads.
  function network(ph, t) {
    const g = views.network;
    g.selectAll("*").remove();
    const step = (i) => (t.duration() ? i * 1300 : 0);
    const fb = footnote(g, "Illustration with made-up players. The fit approximates this joint updating with "
      + "repeated passes over all matches (iterated Laplace, expectation-propagation-style updates and Kalman "
      + "smoothing), checked against exact sampling on subsets of the data.", step(3));
    const box = { x0: wide ? W * 0.04 : 0, x1: wide ? W * 0.8 : W, y0: fs * 1.5, y1: H - fb - fs };
    const at = (u, v) => [box.x0 + u * (box.x1 - box.x0), box.y0 + v * (box.y1 - box.y0)];
    const uv = wide ? { A: [0.08, 0.55], B: [0.42, 0.55], C: [0.8, 0.12], D: [0.8, 0.88] }
      : { A: [0.1, 0.12], B: [0.3, 0.5], C: [0.82, 0.3], D: [0.82, 0.86] };
    const nodes = {
      A: { uv: uv.A, col: P.accent, s0: 0.45, s1: 0.6 },
      B: { uv: uv.B, col: P.ink, s0: 0.3, s1: 0.8 },
      C: { uv: uv.C, col: P.inkSecondary, s0: 0.85, s1: 0.85 },
      D: { uv: uv.D, col: P.inkSecondary, s0: 0.8, s1: 0.8 },
    };
    const r = Math.max(fs * 1.3, Math.min(W, H) * 0.045);
    const mid = `story-arrow-${Math.random().toString(36).slice(2)}`;
    g.append("defs").append("marker").attr("id", mid).attr("viewBox", "0 0 10 10").attr("refX", 9).attr("refY", 5)
      .attr("markerWidth", 7).attr("markerHeight", 7).attr("orient", "auto-start-reverse")
      .append("path").attr("d", "M0,0L10,5L0,10z").attr("fill", P.inkSecondary);
    const edge = (w, l, label, i) => {
      const [x1, y1] = at(...nodes[w].uv), [x2, y2] = at(...nodes[l].uv);
      const len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len;
      const k = g.append("g").attr("opacity", 0);
      k.append("line").attr("x1", x1 + ux * r * 1.15).attr("y1", y1 + uy * r * 1.15)
        .attr("x2", x2 - ux * r * 1.25).attr("y2", y2 - uy * r * 1.25)
        .attr("stroke", P.inkSecondary).attr("stroke-width", 2).attr("marker-end", `url(#${mid})`);
      // Label along the arrow, on its upper side.
      const ang = Math.atan2(uy, ux) * 180 / Math.PI, lx = (x1 + x2) / 2 + uy * fs * 0.7, ly = (y1 + y2) / 2 - ux * fs * 0.7;
      k.append("text").attr("transform", `translate(${lx},${ly}) rotate(${ang})`).attr("text-anchor", "middle")
        .attr("font-size", fs * 0.9).attr("fill", P.inkSecondary).text(label);
      k.transition().delay(step(i)).duration(500).attr("opacity", 1);
      return k;
    };
    edge("A", "B", "earlier: A beats B", 0);
    edge("B", "C", "later: B beats C", 1);
    edge("B", "D", "later: B beats D", 1);
    // Each player: a circle and a bar for the current estimate of strength.
    const bh = r * 2.6;
    for (const [id, n] of Object.entries(nodes)) {
      const [cx, cy] = at(...n.uv);
      const k = g.append("g").attr("opacity", 0);
      k.append("circle").attr("cx", cx).attr("cy", cy).attr("r", r).attr("fill", P.paper)
        .attr("stroke", n.col).attr("stroke-width", 2.5);
      k.append("text").attr("x", cx).attr("y", cy).attr("text-anchor", "middle").attr("dominant-baseline", "central")
        .attr("font-size", fs * 1.3).attr("font-weight", 700).attr("fill", n.col).text(id);
      const bx = cx + r * 1.35, by = cy + bh / 2;
      k.append("rect").attr("x", bx).attr("y", by - bh).attr("width", fs * 0.7).attr("height", bh)
        .attr("fill", P.grid).attr("rx", 3);
      const bar = k.append("rect").attr("x", bx).attr("width", fs * 0.7).attr("rx", 3).attr("fill", n.col)
        .attr("y", by - bh * n.s0).attr("height", bh * n.s0);
      if (n.s1 !== n.s0) {
        bar.transition().delay(step(id === "B" ? 2 : 3)).duration(900).ease(d3.easeCubicInOut)
          .attr("y", by - bh * n.s1).attr("height", bh * n.s1);
      }
      k.transition().delay(id === "C" || id === "D" ? step(1) : 0).duration(500).attr("opacity", 1);
    }
    // The two take-aways, revealed in order.
    const [bxp, byp] = at(...nodes.B.uv), [axp, ayp] = at(...nodes.A.uv);
    const notes = wide ? [
      [bxp + r, byp - r - fs * 0.9, "end", "B was stronger than it first looked", P.ink, 2],
      [axp - r, ayp + r + fs * 1.8, "start", "so A's earlier win counts for more", P.accent, 3],
    ] : [
      [0, byp + r + fs * 2.6, "start", "B was stronger than it first looked", P.ink, 2],
      [axp + r * 1.35 + fs * 1.6, ayp + fs * 0.35, "start", "so A's earlier win counts for more", P.accent, 3],
    ];
    for (const [nx, ny, anchor, txt, c, i] of notes) {
      const q = g.append("text").attr("x", nx).attr("y", ny).attr("text-anchor", anchor)
        .attr("font-size", fs * 1.05).attr("font-weight", 700).attr("fill", c)
        .attr("stroke", P.bg).attr("stroke-width", 5).attr("paint-order", "stroke");
      if (wide) q.text(txt); else wrap(q, txt, i === 2 ? W * 0.42 : W - nx, fs * 1.3);
      q.attr("opacity", 0).transition().delay(step(i) + 600).duration(400).attr("opacity", 1);
    }
    if (wide) {
      g.append("text").attr("x", box.x1 + fs * 3).attr("y", box.y0 + fs).attr("font-size", fs * 0.85)
        .attr("fill", P.inkMuted).call((q) => wrap(q, "Bars: the model's current estimate of each player's "
          + "strength at the time of the first match.", W - box.x1 - fs * 3, fs * 1.2));
    }
  }

  // Draw a path on from left to right (only when animating).
  function drawOn(path, t, ms = 1800) {
    if (!t.duration()) return;
    const len = path.node().getTotalLength();
    path.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len)
      .transition().duration(ms).ease(d3.easeCubicInOut).attr("stroke-dashoffset", 0)
      .on("end", function () { d3.select(this).attr("stroke-dasharray", null); });
  }

  // ------------------------------------------------------------------ timeline
  const dom = data.dominance;
  const tlDates = dom.dates.map(parseDate);
  const tlEnd = d3.utcDay.offset(tlDates.at(-1), 14);
  const tlCells = dom.players.flatMap((pl) => pl.p.map((p, i) => ({
    name: pl.name, p, d0: tlDates[i], d1: tlDates[i + 1] ?? tlEnd,
  })).filter((c) => c.p >= 0.02));
  function timeline(ph, t) {
    const g = views.timeline;
    const m = { l: wide ? 150 : fs * 5.5, r: wide ? 20 : 8, t: 8, b: 44 };
    const names = dom.players.map((p) => p.name);
    const shortName = (n) => (wide ? n : n.split(" ").at(-1));
    const y = d3.scaleBand(names, [m.t, H - m.b]).paddingInner(0.18);
    const x = d3.scaleUtc(ph.domain.map(parseDate), [m.l, W - m.r]);
    clipRect.attr("x", m.l).attr("y", 0).attr("width", W - m.l - m.r).attr("height", H);
    if (g.select(".cells").empty()) {
      g.append("g").attr("class", "rows");
      g.append("g").attr("class", "cells").attr("clip-path", `url(#${clipId})`)
        .selectAll("rect").data(tlCells).join("rect")
        .attr("y", (d) => y(d.name)).attr("height", y.bandwidth())
        .attr("fill", (d) => color(d.name)).attr("fill-opacity", (d) => d.p)
        .append("title").text((d) => `${d.name}, ${d3.utcFormat("%b %Y")(d.d0)}: `
          + `${Math.round(d.p * 100)}% chance of being the strongest`);
      g.append("g").attr("class", "names");
      g.append("g").attr("class", "x-axis").attr("transform", `translate(0,${H - m.b + 6})`);
    }
    const on = (n) => !ph.focus || ph.focus.includes(n);
    g.select(".rows").selectAll("rect").data(names).join("rect")
      .attr("x", m.l).attr("width", W - m.l - m.r).attr("y", (n) => y(n))
      .attr("height", y.bandwidth()).attr("fill", P.grid).attr("fill-opacity", 0.35);
    g.select(".cells").selectAll("rect").transition(t)
      .attr("x", (d) => x(d.d0)).attr("width", (d) => Math.max(0.6, x(d.d1) - x(d.d0) + 0.4))
      .attr("opacity", (d) => (on(d.name) ? 1 : 0.22));
    g.select(".names").selectAll("text").data(names).join("text")
      .attr("x", m.l - 10).attr("y", (n) => y(n) + y.bandwidth() / 2).attr("text-anchor", "end")
      .attr("dominant-baseline", "central").attr("font-size", fs).text(shortName)
      .transition(t).attr("fill", (n) => (on(n) ? (ph.focus ? color(n) : P.ink) : P.inkMuted))
      .attr("font-weight", (n) => (ph.focus && on(n) ? 600 : 400));
    g.select(".x-axis").transition(t)
      .call(d3.axisBottom(x).ticks(wide ? 9 : 5).tickSizeOuter(0)).call(axisStyle);
  }

  // --------------------------------------------------------------------- lines
  const lineSets = new Map(data.lines.map((s) => [`${s.name}|${s.surface}`,
    s.points.map(([d, a, b, c]) => ({ x: parseDate(d), lo: a, mid: b, hi: c }))]));
  const surfColor = { Hard: C.hard, Clay: C.clay, Grass: C.grass, Overall: P.ink };
  function frameAxes(g, x, y, m, ylab, xTicks) {
    if (g.select(".grid").empty()) {
      g.append("g").attr("class", "grid");
      g.append("g").attr("class", "x-axis");
      g.append("g").attr("class", "y-axis");
      g.append("text").attr("class", "y-label");
      g.append("line").attr("class", "zero");
    }
    g.select(".grid").attr("transform", `translate(${m.l},0)`)
      .call(d3.axisLeft(y).ticks(6).tickSize(-(W - m.l - m.r))).call(gridStyle);
    g.select(".x-axis").attr("transform", `translate(0,${H - m.b + 6})`)
      .call(d3.axisBottom(x).ticks(xTicks).tickSizeOuter(0)).call(axisStyle);
    g.select(".y-axis").attr("transform", `translate(${m.l - 6},0)`)
      .call(d3.axisLeft(y).ticks(6).tickSize(0)).call(axisStyle).select(".domain").remove();
    g.select(".zero").attr("x1", m.l).attr("x2", W - m.r).attr("y1", y(0)).attr("y2", y(0))
      .attr("stroke", P.inkMuted).attr("stroke-dasharray", "4 4");
    g.select(".y-label").attr("transform", `translate(${wide ? 16 : 18},${(m.t + H - m.b) / 2}) rotate(-90)`)
      .attr("text-anchor", "middle").attr("font-size", fs * 0.85).attr("fill", P.inkSecondary)
      .text(ylab);
  }
  function lines(ph, t) {
    const g = views.lines;
    const m = { l: 72, r: wide ? 90 : 96, t: 16, b: 44 };
    const all = [...ph.series, ph.ghost].filter(Boolean);
    const pts = lineSets.get(`${ph.player}|Overall`);
    const x = d3.scaleUtc(d3.extent(pts, (d) => d.x), [m.l, W - m.r]);
    const y = d3.scaleLinear(ratingY, [H - m.b, m.t]);
    frameAxes(g, x, y, m, "Rating points above the 10th–100th best players", wide ? 10 : 5);
    g.selectAll("text.player-label").data([ph.player]).join("text").attr("class", "player-label")
      .attr("x", m.l + 8).attr("y", m.t + fs).attr("font-size", fs * 1.1)
      .attr("font-weight", 600).attr("fill", P.ink).text((d) => d);
    const area = d3.area().x((d) => x(d.x)).y0((d) => y(d.lo)).y1((d) => y(d.hi));
    const line = d3.line().x((d) => x(d.x)).y((d) => y(d.mid));
    const rows = all.map((s) => ({ key: `${ph.player}|${s}`, s, pts: lineSets.get(`${ph.player}|${s}`),
      ghost: s === ph.ghost }));
    const from = (d) => (ph.morph && !d.ghost ? pts : d.pts);   // surfaces grow out of overall
    const series = g.selectAll("g.series").data(rows, (d) => d.key).join(
      (enter) => {
        const e = enter.append("g").attr("class", "series").attr("opacity", 0);
        e.append("path").attr("class", "band").attr("d", (d) => area(from(d)));
        e.append("path").attr("class", "line").attr("fill", "none").attr("d", (d) => line(from(d)));
        e.append("text").attr("class", "end").attr("font-size", fs).attr("font-weight", 600);
        return e;
      },
      (update) => update,
      (exit) => exit.transition(t).attr("opacity", 0).remove());
    series.transition(t).attr("opacity", 1);
    series.select(".band").attr("fill", (d) => (d.s === "Overall" ? color(ph.player) : surfColor[d.s]))
      .attr("fill-opacity", (d) => (d.ghost ? 0 : 0.16)).transition(t).attr("d", (d) => area(d.pts));
    series.select(".line").attr("stroke", (d) => (d.s === "Overall" && !d.ghost ? color(ph.player) : surfColor[d.s]))
      .attr("stroke-width", (d) => (d.ghost ? 1.5 : 2.2))
      .attr("stroke-dasharray", (d) => (d.ghost ? "5 4" : null));
    if (!(ph.draw && t.duration())) series.select(".line").transition(t).attr("d", (d) => line(d.pts));
    if (ph.draw && t.duration()) {
      series.select(".band").attr("opacity", 0).transition().delay(1500).duration(700).attr("opacity", 1);
      series.select(".line").attr("d", (d) => line(d.pts))
        .each(function () { drawOn(d3.select(this), t, 2200); });
    } else {
      series.select(".band").attr("opacity", 1);
    }
    // End labels, nudged apart vertically.
    const ends = rows.map((d) => ({ key: d.key, y: y(d.pts.at(-1).mid) }));
    ends.sort((a, b) => a.y - b.y).forEach((e, i, a) => { if (i && e.y - a[i - 1].y < fs * 1.1) e.y = a[i - 1].y + fs * 1.1; });
    const endY = new Map(ends.map((e) => [e.key, e.y]));
    series.select(".end").attr("dominant-baseline", "central")
      .attr("fill", (d) => (d.s === "Overall" && !d.ghost ? color(ph.player) : surfColor[d.s]))
      .text((d) => (d.s === "Overall" && !d.ghost ? ph.player.split(" ").at(-1) : d.s))
      .transition(t).attr("x", (d) => x(d.pts.at(-1).x) + 8).attr("y", (d) => endY.get(d.key));
  }

  // ----------------------------------------------------------------- mountains
  const ageSets = new Map(data.mountains.map((s) => [`${s.name}|${s.surface}`,
    s.points.map(([a, lo, mid, hi, date]) => ({ age: a, date: parseDate(date), lo, mid, hi }))]));
  const bigThree = ["Roger Federer", "Rafael Nadal", "Novak Djokovic"];
  const careerDates = d3.extent(bigThree.flatMap((n) => ageSets.get(`${n}|Overall`)), (p) => p.date);
  function mountains(ph, t) {
    const g = views.mountains;
    const players = ph.players ?? bigThree;
    const focused = (n) => !ph.focus || ph.focus.includes(n);
    const calendar = ph.x === "year";
    const coordinate = (p) => calendar ? p.date : p.age;
    const m = { l: 72, r: wide ? 100 : 30, t: 10 + fs * 2, b: 44 };   // top: room for the legend
    const single = ph.panels.length === 1;
    const lg = g.selectAll("g.legend").data([0]).join("g").attr("class", "legend");
    const entries = lg.selectAll("g.entry").data(players, (n) => n).join(
      (e) => e.append("g").attr("class", "entry").call((q) => {
        q.append("line"); q.append("text");
      }));
    entries.select("line").attr("x1", 0).attr("x2", fs * 1.4).attr("y1", 0).attr("y2", 0)
      .attr("stroke", (n) => color(n)).attr("stroke-width", 2.2)
      .attr("stroke-dasharray", (n) => focused(n) ? null : "4 3");
    entries.select("text").attr("x", fs * 1.8).attr("dominant-baseline", "central")
      .attr("font-size", fs).attr("font-weight", 600).attr("fill", (n) => color(n))
      .text((n) => n.split(" ").at(-1));
    let lx = m.l, ly = fs * 0.5;
    entries.each(function () {
      const entry = d3.select(this), width = fs * 2.8 + entry.select("text").node().getComputedTextLength();
      if (lx > m.l && lx + width > W - 8) { lx = m.l; ly += fs * 1.7; }
      entry.attr("transform", `translate(${lx},${ly})`);
      lx += width;
    });
    m.t = ly + fs * 2;
    const gap = wide ? 26 : 12, cols = 2;
    const rowsN = single ? 1 : Math.ceil(4 / cols);
    const pw = single ? W - m.l - m.r : (W - m.l - m.r - (cols - 1) * gap) / cols;
    const pht = single ? H - m.t - m.b : (H - m.t - m.b - (rowsN - 1) * (gap + 18)) / rowsN;
    const order = ["Hard", "Clay", "Grass", "Overall"];
    const box = (s) => {
      if (single) return { x0: m.l, y0: m.t };
      const i = order.indexOf(s);
      return { x0: m.l + (i % cols) * (pw + gap), y0: m.t + 18 + Math.floor(i / cols) * (pht + gap + 18) };
    };
    const panels = order.filter((s) => ph.panels.includes(s));
    const sx = (s, byYear = calendar) => {
      const b = box(s), range = [b.x0, b.x0 + pw];
      return byYear ? d3.scaleUtc(careerDates, range) : d3.scaleLinear([15, 41], range);
    };
    const sy = (s) => { const b = box(s); return d3.scaleLinear(ratingY, [b.y0 + (single ? pht : pht - 18), b.y0]); };
    // Panel frames: grid, axes, titles.
    // A single panel always takes the "Overall" slot, so switching its surface (record.mjs clips) morphs
    // the curves in place instead of fading panels and series out and in.
    const slot = (s) => single ? "Overall" : s;
    const frames = g.selectAll("g.panel").data(panels, slot).join(
      (e) => e.append("g").attr("class", "panel").attr("opacity", 0).call((p) => {
        p.append("g").attr("class", "grid");
        p.append("g").attr("class", "x-axis x-axis-year").attr("opacity", 0);
        p.append("g").attr("class", "x-axis x-axis-age").attr("opacity", 0);
        p.append("g").attr("class", "y-axis"); p.append("text").attr("class", "ptitle");
        p.append("line").attr("class", "zero");
      }),
      (u) => u, (x) => x.transition(t).attr("opacity", 0).remove());
    frames.transition(t).attr("opacity", 1);
    frames.each(function (s) {
      const p = d3.select(this), y = sy(s), b = box(s);
      p.select(".grid").transition(t).attr("transform", `translate(${b.x0},0)`)
        .call(d3.axisLeft(y).ticks(single ? 6 : 4).tickSize(-pw)).call(gridStyle);
      // Keep date and age ticks in separate layers: interpolating their numeric values would
      // send ticks off-screen (dates are epoch milliseconds). The curves themselves morph.
      for (const byYear of [true, false]) {
        const axis = byYear
          ? d3.axisBottom(sx(s, true)).ticks(wide ? 6 : 3).tickFormat(d3.utcFormat("%Y"))
          : d3.axisBottom(sx(s, false)).tickValues([18, 24, 30, 36]);
        p.select(byYear ? ".x-axis-year" : ".x-axis-age")
          .attr("transform", `translate(0,${y.range()[0] + 6})`)
          .call(axis.tickSizeOuter(0)).call(axisStyle)
          .transition(t).delay(calendar === byYear ? t.duration() / 2 : 0).duration(t.duration() / 2)
          .attr("opacity", calendar === byYear ? 1 : 0);
      }
      const showY = single || wide || order.indexOf(s) % cols === 0;   // phones: left column only
      p.select(".y-axis").attr("opacity", showY ? 1 : 0).transition(t)
        .attr("transform", `translate(${b.x0 - 6},0)`)
        .call(d3.axisLeft(y).ticks(single ? 6 : 4).tickSize(0)).call(axisStyle)
        .selection().select(".domain").remove();
      p.select(".zero").transition(t).attr("x1", b.x0).attr("x2", b.x0 + pw)
        .attr("y1", y(0)).attr("y2", y(0)).attr("stroke", P.inkMuted).attr("stroke-dasharray", "4 4");
      p.select(".ptitle").attr("font-size", fs * 1.05).attr("font-weight", 600).attr("fill", P.ink)
        .text(s === "Overall" ? (wide ? "Overall (calendar-weighted)" : "Overall") : s)
        .transition(t).attr("x", b.x0).attr("y", b.y0 - 6).attr("opacity", single ? 0 : 1);
    });
    const rows = panels.flatMap((s) => players.map((n) => ({ key: `${n}|${slot(s)}`, n, s,
      pts: ageSets.get(`${n}|${s}`) })));
    const series = g.selectAll("g.series").data(rows, (d) => d.key).join(
      (e) => e.append("g").attr("class", "series").attr("opacity", 0).call((q) => {
        q.append("path").attr("class", "band");
        q.append("path").attr("class", "line").attr("fill", "none");
        q.append("text").attr("class", "end");
        q.append("circle").attr("class", "latest");
      }),
      (u) => u, (x) => x.transition(t).attr("opacity", 0).remove());
    series.transition(t).attr("opacity", (d) => focused(d.n) ? 1 : 0.5);
    series.select(".band").attr("fill", (d) => color(d.n))
      .attr("fill-opacity", (d) => focused(d.n) ? 0.15 : 0.05).transition(t)
      .attr("d", (d) => d3.area().x((p) => sx(d.s)(coordinate(p))).y0((p) => sy(d.s)(p.lo)).y1((p) => sy(d.s)(p.hi))(d.pts));
    series.select(".line").attr("stroke", (d) => color(d.n)).attr("stroke-width", single ? 2.6 : 1.8)
      .attr("stroke-dasharray", (d) => focused(d.n) ? null : "5 4")
      .transition(t).attr("d", (d) => d3.line().x((p) => sx(d.s)(coordinate(p))).y((p) => sy(d.s)(p.mid))(d.pts));
    series.select(".latest").attr("r", 4).attr("fill", (d) => color(d.n))
      .attr("stroke", P.bg).attr("stroke-width", 1.5)
      .transition(t).attr("opacity", (d) => ph.focus?.includes(d.n) ? 1 : 0)
      .attr("cx", (d) => sx(d.s)(coordinate(d.pts.at(-1)))).attr("cy", (d) => sy(d.s)(d.pts.at(-1).mid));
    // End labels: spread apart vertically (per panel) when curves finish close together.
    const endY = new Map();
    for (const s of panels) {
      const ends = rows.filter((d) => d.s === s).map((d) => ({ key: d.key, y: sy(s)(d.pts.at(-1).mid),
        x: sx(s)(coordinate(d.pts.at(-1))) })).sort((p, q) => p.y - q.y);
      // Only labels that start near the same x can collide.
      ends.forEach((e, i) => {
        for (const q of ends.slice(0, i)) if (Math.abs(q.x - e.x) < fs * 6) e.y = Math.max(e.y, q.y + fs * 1.15);
      });
      const over = ends.length ? ends.at(-1).y - sy(s).range()[0] : 0;   // keep inside the panel
      for (const e of ends) endY.set(e.key, over > 0 ? e.y - over : e.y);
    }
    series.select(".end").attr("font-size", fs).attr("font-weight", 600).attr("fill", (d) => color(d.n))
      .attr("dominant-baseline", "central").text((d) => d.n.split(" ").at(-1))
      .transition(t).attr("opacity", single && wide ? 1 : 0)
      .attr("x", (d) => sx(d.s)(coordinate(d.pts.at(-1))) + 8).attr("y", (d) => endY.get(d.key));
    g.selectAll("text.y-label").data([0]).join("text").attr("class", "y-label")
      .attr("transform", `translate(${wide ? 16 : 18},${H / 2}) rotate(-90)`).attr("text-anchor", "middle")
      .attr("font-size", fs * 0.85).attr("fill", P.inkSecondary)
      .text("Rating points above the 10th–100th best players");
    g.selectAll("text.x-label").data(["Year", "Age"]).join("text").attr("class", "x-label")
      .attr("x", (m.l + W - m.r) / 2).attr("y", H - 4).attr("text-anchor", "middle")
      .attr("font-size", fs * 0.85).attr("fill", P.inkSecondary).text((d) => d)
      .transition(t).delay((d) => (d === "Year") === calendar ? t.duration() / 2 : 0)
      .duration(t.duration() / 2).attr("opacity", (d) => (d === "Year") === calendar ? 1 : 0);
  }

  // --------------------------------------------------------------------- peaks
  function peaks(ph, t) {
    const g = views.peaks;
    g.selectAll("*").remove();
    const m = { l: wide ? 170 : fs * 4.6, r: wide ? 130 : fs * 6.5, t: 20, b: 50 };
    const rowsDef = [["Hard only", "Hard"], ["Clay only", "Clay"], ["Grass only", "Grass"],
      ["Calendar", wide ? "Overall (calendar)" : "Overall"]];
    const y = d3.scaleBand(rowsDef.map((r) => r[0]), [m.t, H - m.b]).padding(0.25);
    const x = d3.scaleLinear([d3.min(data.peaks, (d) => d.peak_q05) - 15,
      d3.max(data.peaks, (d) => d.peak_q95) + 10], [m.l, W - m.r]).nice();
    const off = d3.scalePoint(bigThree, [-y.bandwidth() * 0.32, y.bandwidth() * 0.32]);
    g.append("g").attr("transform", `translate(0,${H - m.b + 6})`)
      .call(d3.axisBottom(x).ticks(wide ? 8 : 4).tickSizeOuter(0)).call(axisStyle);
    g.append("g").attr("transform", `translate(0,${m.t})`)
      .call(d3.axisTop(x).ticks(wide ? 8 : 4).tickSize(-(H - m.t - m.b))).call(gridStyle);
    g.append("text").attr("x", (m.l + W - m.r) / 2).attr("y", H - 6).attr("text-anchor", "middle")
      .attr("font-size", fs * 0.85).attr("fill", P.inkSecondary)
      .text("Peak rating, points above the 10th–100th best players");
    for (const [w, lab] of rowsDef) {
      g.append("text").attr("x", m.l - 14).attr("y", y(w) + y.bandwidth() / 2).attr("text-anchor", "end")
        .attr("dominant-baseline", "central").attr("font-size", fs * 1.05).attr("font-weight", 600)
        .attr("fill", P.ink).text(lab);
      const rows = data.peaks.filter((d) => d.weighting === w);
      const best = d3.greatest(rows, (d) => d.peak_q50);
      for (const d of rows) {
        const cy = y(w) + y.bandwidth() / 2 + off(d.name);
        const k = g.append("g").attr("opacity", 0);
        k.append("line").attr("x1", x(d.peak_q05)).attr("x2", x(d.peak_q95)).attr("y1", cy).attr("y2", cy)
          .attr("stroke", color(d.name)).attr("stroke-width", 2.5).attr("stroke-opacity", 0.5);
        k.append("circle").attr("cx", x(d.peak_q50)).attr("cy", cy).attr("r", d === best ? 7 : 5)
          .attr("fill", color(d.name));
        k.append("text").attr("x", x(d.peak_q95) + 8).attr("y", cy).attr("dominant-baseline", "central")
          .attr("font-size", fs * (d === best ? 0.95 : 0.8)).attr("font-weight", d === best ? 700 : 400)
          .attr("fill", d === best ? color(d.name) : P.inkMuted)
          .text(`${d.name.split(" ").at(-1)} ${Math.round(d.peak_q50)}`);
        k.transition(t).delay(rowsDef.findIndex((r) => r[0] === w) * 120).attr("opacity", 1);
      }
    }
  }

  // ----------------------------------------------------------------- certainty
  // Calendar-weighted peaks of two players across posterior draws (binned counts).
  function certainty(ph, t) {
    const g = views.certainty;
    g.selectAll("*").remove();
    const c = data.certainty, [na, nb] = c.pair;
    const late = t.duration() ? 1 : 0;
    const fb = footnote(g, "Overall peak with the tour's surface mix, as on the previous slide"
      + ` with ${c.draws} posterior draws.`, late * 1600);
    const m = { l: wide ? 40 : 16, r: wide ? 40 : 16, t: fs * 6.2, b: fb + fs * 3.4 };
    const x = d3.scaleLinear(d3.extent(c.edges), [m.l, W - m.r]);
    const ymax = d3.max(c.counts.flat());
    const y = d3.scaleLinear([0, ymax], [H - m.b, m.t]);
    g.append("g").attr("transform", `translate(0,${H - m.b + 6})`)
      .call(d3.axisBottom(x).ticks(wide ? 8 : 4).tickSizeOuter(0)).call(axisStyle);
    g.append("text").attr("x", (m.l + W - m.r) / 2).attr("y", H - m.b + 6 + fs * 2.4).attr("text-anchor", "middle")
      .attr("font-size", fs * 0.85).attr("fill", P.inkSecondary)
      .text("Peak rating, points above the 10th–100th best players");
    const pts = (counts) => counts.map((n, i) => [c.edges[i], n]).concat([[c.edges.at(-1), 0]]);
    const area = d3.area().curve(d3.curveStepAfter).x((d) => x(d[0])).y0(y(0));
    [na, nb].forEach((name, i) => {
      const col = color(name), p = pts(c.counts[i]);
      const k = g.append("g");
      const shape = k.append("path").attr("fill", col).attr("fill-opacity", 0.22).attr("stroke", col)
        .attr("stroke-width", 1.6).attr("d", area.y1((d) => y(d[1]))(p));
      if (late) {
        shape.attr("d", area.y1(y(0))(p)).transition().delay(i * 300).duration(900).ease(d3.easeCubicOut)
          .attr("d", area.y1((d) => y(d[1]))(p));
      }
      const med = c.median[i];
      const lab = k.append("g").attr("opacity", late ? 0 : 1);
      lab.append("line").attr("x1", x(med)).attr("x2", x(med)).attr("y1", y(0)).attr("y2", m.t - fs * 0.4)
        .attr("stroke", col).attr("stroke-width", 1.5).attr("stroke-dasharray", "4 3");
      const close = Math.abs(x(c.median[0]) - x(c.median[1])) < fs * 9;
      lab.append("text").attr("x", x(med)).attr("y", m.t - fs * (close && i ? 0.9 : close ? 2.2 : 0.9))
        .attr("text-anchor", close ? (med === Math.max(...c.median) ? "start" : "end") : "middle")
        .attr("font-size", fs * 1.05).attr("font-weight", 700).attr("fill", col)
        .text(`${name.split(" ").at(-1)} ${Math.round(med)}`);
      if (late) lab.transition().delay(1000 + i * 200).duration(400).attr("opacity", 1);
    });
    const hits = Math.round(c.p_first_higher * c.draws);
    const head = g.append("text").attr("x", m.l).attr("y", fs * 1.3).attr("font-size", fs * 1.25)
      .attr("font-weight", 700).attr("fill", color(na)).attr("opacity", late ? 0 : 1);
    wrap(head, `${na.split(" ").at(-1)}'s peak is higher in ${hits} of ${c.draws} draws `
      + `(${Math.round(c.p_first_higher * 100)}%)`, W - m.l, fs * 1.5);
    if (late) head.transition().delay(1400).duration(400).attr("opacity", 1);
  }

  // ------------------------------------------------------------------- simplex
  let simplexNode = null;
  function simplexView(ph, t) {
    const g = views.simplex;
    if (!simplexNode) {
      // Text scales with the stage so the triangle keeps most of the space on small screens.
      const base = (opts.simplexScale ?? textScale) * (wide ? 11.5 : Math.max(7.5, Math.min(10, Math.min(W, H) / 46)));
      const spec = { ...data.simplex, width: W, height: H, base, font: opts.font,
        palette: P, frame: false, keyBelow: !wide, compact: !wide, landscape: opts.simplexLandscape,
        players: data.simplex.players.map((p) => ({ ...p, color: color(p.name) })) };
      simplexNode = simplex(d3, spec);
      g.node().appendChild(simplexNode);
    }
    // The staged entrance runs only when arriving animated from another slide (not on load, resize or
    // a theme change) and not for readers who ask for reduced motion.
    const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (ph.build && t.duration() > 0 && current !== "simplex" && !reduced) return buildSimplex();
    settleSimplex();
    d3.select(simplexNode).selectAll("polygon[data-leader]").transition(t)
      .attr("opacity", function () {
        return !ph.highlight || ph.highlight.includes(this.dataset.leader) ? 1 : 0.18;
      });
  }
  // Staged entrance (phase field `build`): the outline draws, then the cells
  // fill in three waves from the single-surface corners (hard, grass, clay, the order the surface
  // slides come in), each corner's label appearing as its wave starts; the named mixes and the key
  // come last. About 4.2 s.
  function buildSimplex() {
    const s = d3.select(simplexNode);
    const ease = d3.easeCubicOut;
    const fadeIn = (sel, delay, duration = 500) => sel.interrupt().attr("opacity", 0).transition().delay(delay)
      .duration(duration).ease(ease).attr("opacity", 1);
    const outline = s.select("#outline polygon");
    const tri = outline.attr("points").split(" ").map((p) => p.split(",").map(Number));
    const perimeter = d3.pairs([...tri, tri[0]]).reduce((a, [p, q]) => a + Math.hypot(p[0] - q[0], p[1] - q[1]), 0);
    const side = Math.hypot(tri[0][0] - tri[1][0], tri[0][1] - tri[1][1]);
    outline.interrupt().attr("stroke-dasharray", perimeter).attr("stroke-dashoffset", perimeter)
      .transition().delay(450).duration(800).ease(d3.easeCubicInOut).attr("stroke-dashoffset", 0)
      .on("end", function () { d3.select(this).attr("stroke-dasharray", null).attr("stroke-dashoffset", null); });
    fadeIn(s.select("#grid"), 650, 700);
    fadeIn(s.select("#axes"), 650, 700);
    // tri is [hard, clay, grass]; waves start in the order hard, grass, clay.
    const start = [1150, 1950, 1550], sweep = 1500;
    s.selectAll("#corners text").each(function (_, i) {
      const el = d3.select(this);
      el.interrupt().attr("opacity", 0).attr("transform", "translate(0,8)").transition().delay(start[i] - 150)
        .duration(500).ease(ease).attr("opacity", 1).attr("transform", "translate(0,0)");
    });
    s.selectAll("polygon[data-leader]").each(function () {
      const b = this.getBBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2;
      const delay = d3.min(tri, (c, i) => start[i] + Math.hypot(cx - c[0], cy - c[1]) / side * sweep);
      const from = `translate(${cx * 0.7},${cy * 0.7}) scale(0.3)`;
      d3.select(this).interrupt().attr("opacity", 0).attr("transform", from).transition().delay(delay).duration(450)
        .ease(d3.easeBackOut.overshoot(1.4)).attr("opacity", 1).attr("transform", "translate(0,0) scale(1)")
        .on("end", function () { d3.select(this).attr("transform", null); });
    });
    s.selectAll("#named > *").each(function (_, i) {
      fadeIn(d3.select(this), 3300 + Math.floor(i / 2) * 250, 400);
    });
    fadeIn(s.select("#key"), 3000, 700);
  }
  // Leaving a build half-way (a click during it, or coming back later): jump everything to its final
  // state, except the cells' opacity, which the caller's transition sets.
  function settleSimplex() {
    const s = d3.select(simplexNode);
    s.selectAll("#grid, #axes, #key, #named > *").interrupt().attr("opacity", 1);
    s.selectAll("#corners text").interrupt().attr("opacity", 1).attr("transform", null);
    s.select("#outline polygon").interrupt().attr("stroke-dasharray", null).attr("stroke-dashoffset", null);
    s.selectAll("polygon[data-leader]").interrupt().attr("transform", null);
  }

  // -------------------------------------------------------------------- slams
  // Least likely Grand Slam champions by pre-tournament title probability (log scale).
  const slamShort = { "Australian Open": "AO", "Roland Garros": "RG", "Wimbledon": "Wimbledon",
    "US Open": "US Open" };
  const fmtP = (p) => (p >= 0.1 ? d3.format(".0%") : p >= 0.01 ? d3.format(".1%")
    : p >= 0.001 ? d3.format(".2%") : d3.format(".3%"))(p);
  function slamsView(ph, t) {
    const g = views.slams;
    g.selectAll("*").remove();
    const S = data.slams;
    if (!S) {
      g.append("text").attr("x", W / 2).attr("y", H / 2).attr("text-anchor", "middle")
        .attr("font-size", fs * 1.3).attr("font-weight", 700).attr("fill", P.accent)
        .text("TODO: title probabilities not computed yet");
      return;
    }
    const late = t.duration() ? 1 : 0;
    const fb = footnote(g, `Pre-tournament title probability: simulated tournaments from the draw as it stood `
      + "when play began (rebuilt from the played matches), with strengths from matches before each Slam "
      + "and settings fitted only on earlier seasons. "
      + "This is the chance of winning from the start, not of the exact path taken, which would be an interesting but different quantity depending on the draws.",
    late * 900);
    const rows = S.rows.slice(0, wide ? S.rows.length : 10);
    const lab = (d) => (wide ? `${d.champion}, ${d.slam} ${d.year}`
      : `${d.champion.split(" ").at(-1)}, ${slamShort[d.slam] ?? d.slam} ${String(d.year).slice(2)}`);
    const m = { l: wide ? W * 0.3 : W * 0.44, r: wide ? 70 : 18, t: fs * 4.6, b: fb + fs * 2.6 };
    const lo = d3.min(S.all, (d) => d.p_title) / 1.4;
    const x = d3.scaleLog([lo, 1], [m.l, W - m.r]);
    const y = d3.scaleBand(rows.map((d) => lab(d)), [m.t + fs * 2.2, H - m.b]).padding(0.3);
    const ticks = [0.0001, 0.0003, 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1].filter((v) => v >= lo);
    g.append("g").attr("transform", `translate(0,${H - m.b + 6})`)
      .call(d3.axisBottom(x).tickValues(wide ? ticks : ticks.filter((_, i) => i % 2 === 0))
        .tickFormat(fmtP).tickSizeOuter(0)).call(axisStyle);
    g.append("g").attr("transform", `translate(0,${m.t})`)
      .call(d3.axisTop(x).tickValues(ticks).tickSize(-(H - m.t - m.b))).call(gridStyle);
    g.append("text").attr("x", (m.l + W - m.r) / 2).attr("y", H - m.b + 6 + fs * 2.3)
      .attr("text-anchor", "middle").attr("font-size", fs * 0.85).attr("fill", P.inkSecondary)
      .text("Pre-tournament title probability (log scale)");
    // Strip: every champion, so the least likely ones sit against the whole range.
    const strip = g.append("g");
    const sy = m.t + fs * 0.6, bottom = new Set(rows.map((d) => d.p_title));
    strip.append("text").attr("x", m.l - 12).attr("y", sy).attr("text-anchor", "end")
      .attr("dominant-baseline", "central").attr("font-size", fs * 0.9).attr("fill", P.inkSecondary)
      .text(wide ? `All ${S.n_slams} champions, ${S.first_year}–${S.last_year}` : `All ${S.n_slams} champions`);
    const jit = gauss(11);
    for (const d of S.all) {
      strip.append("circle").attr("cx", x(d.p_title)).attr("cy", sy + jit() * fs * 0.25).attr("r", 3)
        .attr("fill", bottom.has(d.p_title) ? P.accent : P.inkMuted).attr("fill-opacity", 0.55);
    }
    strip.append("line").attr("x1", x(S.median)).attr("x2", x(S.median)).attr("y1", sy - fs * 0.9)
      .attr("y2", sy + fs * 0.9).attr("stroke", P.ink).attr("stroke-width", 1.5);
    strip.append("text").attr("x", x(S.median) - 5).attr("text-anchor", "end").attr("y", sy - fs * 1.05)
      .attr("font-size", fs * 0.75)
      .attr("fill", P.inkSecondary).text(`median ${fmtP(S.median)}`);
    rows.forEach((d, i) => {
      const cy = y(lab(d)) + y.bandwidth() / 2;
      const k = g.append("g").attr("opacity", 0);
      k.append("text").attr("x", m.l - 12).attr("y", cy).attr("text-anchor", "end")
        .attr("dominant-baseline", "central").attr("font-size", fs * (wide ? 0.95 : 0.82))
        .attr("font-weight", i === 0 ? 700 : 500).attr("fill", P.ink).text(lab(d));
      k.append("line").attr("x1", m.l).attr("x2", x(d.p_title)).attr("y1", cy)
        .attr("y2", cy).attr("stroke", P.accent).attr("stroke-opacity", 0.45).attr("stroke-width", 2);
      k.append("circle").attr("cx", x(d.p_title)).attr("cy", cy).attr("r", i === 0 ? 7 : 5.5).attr("fill", P.accent);
      k.append("text").attr("x", x(d.p_title) + 10).attr("y", cy)
        .attr("dominant-baseline", "central").attr("font-size", fs * (i === 0 ? 0.95 : 0.82))
        .attr("font-weight", i === 0 ? 700 : 400).attr("fill", i === 0 ? P.accent : P.inkSecondary)
        .text(fmtP(d.p_title));
      k.transition(t).delay(i * 70).attr("opacity", 1);
    });
  }

  // --------------------------------------------------------------------- trust
  // Forecast scores on 2023-2025 (stored validation.json of each test run) and two caveat cards.
  function trust(ph, t) {
    const g = views.trust;
    if (!g.select("g").empty()) return;
    const V = data.validation;
    const late = (i) => (t.duration() ? 200 + i * 180 : 0);
    const fb = footnote(g, "The surface model also missed two checks planned before it was adopted: its "
      + "calibration on 2015–2022 matches (by 0.004) and an exact-sampler comparison on hard courts. "
      + "The newest estimates (Sinner, Alcaraz) have no later matches to learn from yet.", late(4));
    const models = [
      { lab: "Tuned Elo benchmark", sub: "updates after every match", v: V.elo.log_loss, col: P.inkMuted },
      { lab: "One-strength model", sub: "Doesn't take into account surface differences",
        v: V.m2.log_loss, col: P.ink },
      { lab: "Surface model (this story)", sub: "Accounts for surface differences",
        v: V.m2s.log_loss, col: P.accent },
    ];
    const head = (k, x0, y0, str) => k.append("text").attr("x", x0).attr("y", y0).attr("font-size", fs * 1.05)
      .attr("font-weight", 700).attr("fill", P.ink).text(str);
    // Block 1: forecast error on the test seasons.
    const top = wide ? Math.min((H - fb) * 0.55, fs * 22) : (H - fb) * 0.4;
    const b1 = g.append("g").attr("opacity", 0);
    head(b1, 0, fs * 1.1, `Forecast error on ${V.n.toLocaleString("en-US")} matches, 2023–2025`);
    b1.append("text").attr("x", 0).attr("y", fs * 2.4).attr("font-size", fs * 0.82).attr("fill", P.inkSecondary)
      .text("Log loss; lower is better. Each forecast uses only earlier matches.");
    const lx = wide ? W * 0.36 : W * 0.5;
    const x = d3.scaleLinear([0.62, 0.63], [lx, W - (wide ? 90 : 46)]);
    const y = d3.scaleBand(models.map((d) => d.lab), [fs * 3.4, top]).padding(0.25);
    b1.append("g").attr("transform", `translate(0,${top + 2})`)
      .call(d3.axisBottom(x).ticks(wide ? 5 : 3).tickFormat(d3.format(".3f")).tickSizeOuter(0)).call(axisStyle);
    for (const d of models) {
      const cy = y(d.lab) + y.bandwidth() / 2;
      b1.append("text").attr("x", lx - 14).attr("y", wide ? cy - fs * 0.25 : cy).attr("text-anchor", "end")
        .attr("dominant-baseline", "central").attr("font-size", fs * (wide ? 0.95 : 0.8))
        .attr("font-weight", 600).attr("fill", d.col).text(d.lab);
      if (wide) {
        b1.append("text").attr("x", lx - 14).attr("y", cy + fs * 0.85).attr("text-anchor", "end")
          .attr("dominant-baseline", "central").attr("font-size", fs * 0.75).attr("fill", P.inkMuted).text(d.sub);
      }
      b1.append("line").attr("x1", x.range()[0]).attr("x2", x(d.v)).attr("y1", cy).attr("y2", cy)
        .attr("stroke", d.col).attr("stroke-opacity", 0.35).attr("stroke-width", 2);
      b1.append("circle").attr("cx", x(d.v)).attr("cy", cy).attr("r", 6).attr("fill", d.col);
      b1.append("text").attr("x", x(d.v) + 11).attr("y", cy).attr("dominant-baseline", "central")
        .attr("font-size", fs * 0.85).attr("font-weight", 600).attr("fill", d.col).text(d.v.toFixed(4));
    }
    b1.transition().delay(late(0)).duration(400).attr("opacity", 1);
    // Blocks 2-3: calibration and interval coverage.
    const pc = (v) => `${Math.round(v * 100)}%`;
    const cards = [
      { big: `${V.m2.slope.toFixed(2)} · ${V.m2s.slope.toFixed(2)}`, head: "Too confident",
        body: `Calibration slope; 1 is ideal, below 1 means the probabilities are too extreme. One-strength `
          + `model ${V.m2.slope.toFixed(2)} in its pre-registered test, short of the planned ${V.m2.slope_range[0]}; `
          + `surface model ${V.m2s.slope.toFixed(2)}. Elo: ${V.elo.slope.toFixed(2)}.`,
        short: `Calibration slope (1 is ideal): ${V.m2.slope.toFixed(2)} pre-registered, short of the planned `
          + `${V.m2.slope_range[0]}; surface model ${V.m2s.slope.toFixed(2)}.` },
      { big: `${pc(V.coverage.cover_80)} / 80%`, head: "Intervals too narrow",
        body: `In simulated careers with known strengths, the surface model's 80% intervals contained the `
          + `true strength ${pc(V.coverage.cover_80)} of the time (95% intervals: ${pc(V.coverage.cover_95)}), `
          + "and peaks came out somewhat low.",
        short: `Simulated careers: 80% intervals held the truth ${pc(V.coverage.cover_80)} of the time; `
          + "peaks came out low." },
    ];
    const gap = fs, y0 = top + fs * 3.4, ch = Math.min(H - fb - y0, wide ? fs * 10 : Infinity);
    cards.forEach((c, i) => {
      const cw = wide ? (W - gap) / 2 : W, x0 = wide ? i * (cw + gap) : 0;
      const hh = wide ? ch : (ch - gap) / 2, yy = wide ? y0 : y0 + i * (hh + gap);
      const k = g.append("g").attr("opacity", 0);
      k.append("rect").attr("x", x0).attr("y", yy).attr("width", cw).attr("height", hh).attr("rx", 12)
        .attr("fill", P.paper).attr("stroke", P.grid);
      const pad = fs * (wide ? 1.2 : 0.8), big = fs * (wide ? 2 : 1.35);
      k.append("text").attr("x", x0 + pad).attr("y", yy + pad + big * 0.8).attr("font-size", big)
        .attr("font-weight", 700).attr("fill", P.accent).text(c.big);
      k.append("text").attr("x", x0 + pad).attr("y", yy + pad + big * 0.8 + fs * 1.6).attr("font-size", fs * 1.05)
        .attr("font-weight", 600).attr("fill", P.ink).text(c.head);
      const body = k.append("text").attr("x", x0 + pad).attr("y", yy + pad + big * 0.8 + fs * 3)
        .attr("font-size", fs * (wide ? 0.92 : 0.8)).attr("fill", P.inkSecondary);
      wrap(body, wide ? c.body : c.short, cw - 2 * pad, fs * (wide ? 1.35 : 1.15));
      k.transition().delay(late(i + 1)).duration(400).attr("opacity", 1);
    });
  }

  // -------------------------------------------------------------------- limits
  function limits(ph, t) {
    const g = views.limits;
    if (!g.select("g").empty()) return;
    const late = (i) => (t.duration() ? 200 + i * 220 : 0);
    const cols = [
      { head: "What it sees", col: P.ink, items: [
        ["Who beat whom", "on which surface, and whether the match was best of three or five."],
        ["Strength that drifts", "each player's path, inferred from a linked network of matches."],
        ["A shared aging pattern", "and how uncertain each estimate is."]] },
      { head: "What it misses", col: P.accent, items: [
        ["The score", "6–0 6–0 and 7–6 7–6 count the same: only who won enters. How much a win says "
          + "depends on how surprising it was.", "only who won enters, not the score"],
        ["Why strength changed", "injuries, fatigue, coaching or motivation. Our attempt to estimate "
          + "injury effects gave no reliable corrections.", "injuries, fatigue or coaching are not separated"],
        ["Who chose to play", "only tour-level main draws are used; withdrawals, part seasons, "
          + "Challengers and qualifying are outside the data.", "only tour-level main draws are used"],
        ["The absolute level of each era", "results link players who met, directly or through shared "
          + "opponents. They cannot show alone whether the whole tour got stronger.",
          "whether the whole tour got stronger"]] },
      { head: "Possible next steps", col: P.inkSecondary, items: [
        ["Richer match evidence", "sets and games, not just wins."],
        ["Short-term context", "documented injuries, rest, match length, withdrawals."],
        ["Wider coverage", "Challenger and qualifying matches; verified historical draws."],
        ["Stronger checks", "cross-validated calibration, selection sensitivity, explicit cross-era "
          + "scenarios."]] },
    ];
    const fb = 0;
    let bottom = 0;
    if (wide) {
      const gap = fs * 1.6, cw = (W - 2 * gap) / 3;
      cols.forEach((c, i) => {
        const x0 = i * (cw + gap), k = g.append("g").attr("opacity", 0);
        k.append("line").attr("x1", x0).attr("x2", x0 + cw).attr("y1", fs * 2).attr("y2", fs * 2)
          .attr("stroke", c.col).attr("stroke-width", 2);
        k.append("text").attr("x", x0).attr("y", fs * 1.2).attr("font-size", fs * 1.15).attr("font-weight", 700)
          .attr("fill", c.col).text(c.head);
        let y = fs * 3.6;
        for (const [lead, rest] of c.items) {
          k.append("text").attr("x", x0).attr("y", y).attr("font-size", fs * 1.08).attr("font-weight", 700)
            .attr("fill", P.ink).text(lead);
          const body = k.append("text").attr("x", x0).attr("y", y + fs * 1.45).attr("font-size", fs * 0.95)
            .attr("fill", P.inkSecondary);
          y += fs * 1.45 + wrap(body, rest, cw, fs * 1.35) * fs * 1.35 + fs * 1.1;
        }
        bottom = Math.max(bottom, y);
        k.transition().delay(late(i)).duration(400).attr("opacity", 1);
      });
    } else {
      // Phones: three bands, leads only.
      let y = fs;
      cols.forEach((c, i) => {
        const k = g.append("g").attr("opacity", 0);
        k.append("text").attr("x", 0).attr("y", y).attr("font-size", fs).attr("font-weight", 700)
          .attr("fill", c.col).text(c.head);
        y += fs * 1.45;
        if (c.items[0][2]) {
          for (const [lead, , short] of c.items) {
            const t2 = k.append("text").attr("x", 0).attr("y", y).attr("font-size", fs * 0.86).attr("fill", P.ink);
            t2.append("tspan").attr("font-weight", 700).text(`${lead}: `);
            t2.append("tspan").attr("fill", P.inkSecondary).text(short);
            y += fs * 1.35;
          }
          y += fs * 0.6;
        } else {
          const t2 = k.append("text").attr("x", 0).attr("y", y).attr("font-size", fs * 0.86).attr("fill", P.ink);
          y += wrap(t2, c.items.map((d) => d[0]).join(" · "), W, fs * 1.2) * fs * 1.2 + fs * 1.1;
        }
        bottom = y;
        k.transition().delay(late(i)).duration(400).attr("opacity", 1);
      });
    }
    const take = g.append("text").attr("x", 0).attr("y", Math.min(bottom + fs * 1.6, H - fb - fs * 3))
      .attr("font-size", fs * (wide ? 1.15 : 0.9)).attr("font-weight", 600).attr("fill", P.ink).attr("opacity", 0);
    wrap(take, "The model estimates what a player's results imply about competitive strength. "
      + " but it cannot recover everything that produced those results, like for instance injuries (which one could argue are part of the player's overall strength).", W, fs * 1.45);
    take.transition().delay(late(3)).duration(400).attr("opacity", 1);
  }

  // -------------------------------------------------------------------- thanks
  function thanks(ph, t) {
    const g = views.thanks;
    if (!g.select("g").empty()) return;
    const late = (i) => (t.duration() ? 150 + i * 120 : 0);
    const rows = [
      ["Author", [["Alejandro Fontal · "], ["alfontal.dev", "https://alfontal.dev"]]],
      ["Match data", [["Jeff Sackmann / Tennis Abstract, "],
        ["CC BY-NC-SA 4.0", "https://creativecommons.org/licenses/by-nc-sa/4.0/"],
        [". Historical files via the "],
        ["archival mirror", "https://github.com/Aneeshers/tennis-sackmann-archive"], ["."]]],
      ["Prior work", [["Leonelli (2026), How exceptional was the Big Three era? Extremes and persistence in "
        + "men's professional tennis. "], ["arXiv:2608.27362", "https://arxiv.org/abs/2608.27362"]]],
      ["Methods", [["Dynamic Bradley–Terry model; Bayesian state-space filtering and smoothing."]]],
      ["Licence", [["The match data is licensed CC BY-NC-SA 4.0: attribution, non-commercial use only."]]],
    ];
    const labW = wide ? Math.min(W * 0.2, fs * 11) : 0;
    const size = fs * (wide ? 1.12 : 0.86), lh = size * 1.4;
    let y = fs * (wide ? 1.5 : 1);
    rows.forEach(([lab, parts], i) => {
      const k = g.append("g").attr("opacity", 0);
      k.append("text").attr("x", 0).attr("y", y).attr("font-size", fs * (wide ? 0.95 : 0.78))
        .attr("font-weight", 700).attr("fill", P.inkMuted).attr("letter-spacing", "0.04em")
        .text(lab.toUpperCase());
      if (!wide) y += fs * 1.25;
      // Flowing text with inline links: words wrap across parts, links keep the accent colour.
      let x = labW, line = 0;
      const width = W - labW;
      for (const [str, href] of parts) {
        for (const word of href ? [str] : str.split(/(?<= )/)) {
          const host = href ? k.append("a").attr("href", href).attr("target", "_blank").attr("rel", "noopener") : k;
          const tx = host.append("text").attr("x", x).attr("y", y + line * lh).attr("font-size", size)
            .attr("fill", href ? P.accent : P.ink).attr("font-weight", href ? 600 : 400)
            .attr("text-decoration", href ? "underline" : null).style("white-space", "pre").text(word);
          const w = tx.node().getComputedTextLength();
          if (x + w > labW + width && x > labW) {
            line += 1; x = labW;
            tx.attr("x", x).attr("y", y + line * lh);
          }
          x += w;
        }
      }
      y += (line + 1) * lh + fs * (wide ? 1.5 : 0.8);
      k.transition().delay(late(i)).duration(400).attr("opacity", 1);
    });
    const idea = g.append("text").attr("x", 0).attr("y", y + fs * 0.6).attr("font-size", fs * 0.85)
      .attr("fill", P.inkSecondary).attr("opacity", 0);
    wrap(idea, "On the list, not yet tested: the most extraordinary 52-week stretch; when a champion first "
      + "became elite, and how long it took to be recognised; the biggest single-match upsets.", W, fs * 1.25);
    idea.transition().delay(late(rows.length)).duration(400).attr("opacity", 1);
  }

  const draw = { title, winprob, elo, versus, aging, drift, revision, network, timeline, lines, mountains, peaks,
    certainty, simplex: simplexView, slams: slamsView, trust, limits, thanks };

  return {
    node: svg.node(),
    phases: PHASES,
    go(n, animate = true) {
      if (animate && n === shown) return;          // e.g. a rebuild already drew this phase
      const previous = PHASES[shown];
      shown = n;
      const ph = PHASES[n];
      const aligning = previous?.view === "mountains" && ph.view === "mountains"
        && (previous.x === "year") !== (ph.x === "year");
      const t = animate ? svg.transition().duration(ph.duration ?? (aligning ? 1800 : 900))
        .ease(d3.easeCubicInOut) : t0();
      for (const [k, g] of Object.entries(views)) {
        const on = k === ph.view;
        g.style("pointer-events", on ? null : "none");
        if (!on && k !== current) continue;
        g.transition(t).attr("opacity", on ? 1 : 0);
      }
      draw[ph.view](ph, t);
      current = ph.view;
    },
  };
}
