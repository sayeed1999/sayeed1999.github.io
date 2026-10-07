/* Shared helpers for the interactive tutorials */
document.getElementById("year").textContent = new Date().getFullYear();

/* Multiple-choice quiz. QUIZ = [{ q, o: [options], a: correctIndex, e: explanation }] */
function quiz(el, QUIZ) {
  el.innerHTML = QUIZ.map(function (it, qi) {
    return '<div class="q" data-q="' + qi + '"><b>' + (qi + 1) + '. ' + it.q + '</b>' +
      it.o.map(function (o, oi) { return '<button type="button" data-o="' + oi + '">' + o + '</button>'; }).join("") +
      '<div class="fb" aria-live="polite"></div></div>';
  }).join("");
  el.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var q = b.closest(".q"), it = QUIZ[Number(q.dataset.q)], oi = Number(b.dataset.o);
    q.querySelectorAll("button").forEach(function (x) { x.classList.remove("right", "wrong"); });
    b.classList.add(oi === it.a ? "right" : "wrong");
    q.querySelector(".fb").textContent = oi === it.a ? "✅ " + it.e : "❌ Not quite, try again.";
  });
}

/* Sequence diagrams. actors: [[name, subtitle]]. rows: [[dir, label]] with dir = "r" | "l" | "self" */
function diagram(actors, rows, note) {
  var a = '<div class="actors">' + actors.map(function (x) {
    return '<div class="actor">' + x[0] + (x[1] ? '<small>' + x[1] + '</small>' : '') + '</div>';
  }).join("") + '</div>';
  var r = '<div class="rows">' + rows.map(function (it, i) {
    var style = ' style="animation-delay:' + (i * 0.35) + 's"';
    var cls = "row " + it[0];
    if (it[0] === "self") return '<div class="' + cls + '"' + style + '><span class="lab">' + it[1] + '</span></div>';
    return '<div class="' + cls + '"' + style + '><span class="lab">' + it[1] + '</span><div class="line"></div></div>';
  }).join("") + '</div>';
  return '<div class="diagram">' + a + r + '</div>' + (note ? '<p class="note">' + note + '</p>' : "");
}

/* Click-through stepper. Needs elements with ids <id>Stage, <id>Dots, <id>Prev, <id>Next.
   STEPS = [{ t: title, why: intro text, html: function returning HTML }] */
function stepper(STEPS, id) {
  var cur = 0;
  var stageEl = document.getElementById(id + "Stage"), dotsEl = document.getElementById(id + "Dots");
  var prevB = document.getElementById(id + "Prev"), nextB = document.getElementById(id + "Next");
  function show(i) {
    cur = i;
    var s = STEPS[i];
    dotsEl.innerHTML = STEPS.map(function (_, k) {
      return '<button class="dot' + (k === i ? " on" : k < i ? " done" : "") + '" data-i="' + k + '" aria-label="Step ' + (k + 1) + '">' + (k + 1) + '</button>';
    }).join("");
    stageEl.innerHTML = '<h3>' + (i + 1) + '. ' + s.t + '</h3><p class="why">' + s.why + '</p>' + s.html();
    prevB.disabled = i === 0;
    nextB.disabled = i === STEPS.length - 1;
  }
  dotsEl.addEventListener("click", function (e) { var b = e.target.closest(".dot"); if (b) show(Number(b.dataset.i)); });
  prevB.addEventListener("click", function () { if (cur > 0) show(cur - 1); });
  nextB.addEventListener("click", function () { if (cur < STEPS.length - 1) show(cur + 1); });
  show(0);
}
