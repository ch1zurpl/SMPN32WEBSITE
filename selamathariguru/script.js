/* ==========================================================
   Hari Guru — interaksi
   1. Konfeti
   2. Hitung mundur
   3. Dinding terima kasih
   4. Kuis
   5. Kartu ucapan
   ========================================================== */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const boardMessage = document.getElementById('board-message-animation');
if (!reduceMotion) {
  const message = Array.from(boardMessage.textContent);
  boardMessage.textContent = '';
  boardMessage.classList.add('is-writing');
  let index = 0;
  const typingTimer = setInterval(() => {
    boardMessage.textContent += message[index];
    index += 1;
    if (index === message.length) {
      clearInterval(typingTimer);
      boardMessage.classList.remove('is-writing');
    }
  }, 45);
}

/* ---------- 1. Konfeti ---------- */
const Confetti = (() => {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  const colors = ['#f2c230', '#d6453d', '#f08fa3', '#8fd0f0', '#4d8a4a', '#f4f1e8'];
  let pieces = [];
  let running = false;

  function fit() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function fire() {
    if (reduceMotion) return;
    fit();
    for (let i = 0; i < 160; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.4,
        w: 6 + Math.random() * 8,
        h: 4 + Math.random() * 6,
        vx: -1.5 + Math.random() * 3,
        vy: 2 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        vr: -0.2 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    pieces = pieces.filter(p => p.y < canvas.height + 30);
    if (pieces.length) {
      requestAnimationFrame(tick);
    } else {
      running = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return { fire };
})();

/* ---------- 2. Dinding terima kasih ---------- */
(() => {
  const STORE_KEY = 'hariGuru.dinding.v1';
  const wallEl = document.getElementById('wall');
  const form = document.getElementById('wall-form');
  const tints = ['#fff3a8', '#ffd0d9', '#cdeefc', '#d6f0c8', '#ffe0b8'];

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY));
      if (Array.isArray(saved)) return saved;
    } catch (err) { /* abaikan data lokal yang tidak valid */ }
    return [];
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(notes)); } catch (err) { /* penyimpanan penuh atau diblokir */ }
  }

  let notes = load();

  function render() {
    wallEl.textContent = '';
    notes.forEach((n, i) => {
      const li = document.createElement('li');
      li.className = 'note';
      li.style.setProperty('--tint', tints[i % tints.length]);
      li.style.setProperty('--tilt', ((i * 37) % 7 - 3) * 0.9 + 'deg');

      const p = document.createElement('p');
      p.textContent = n.text;

      const foot = document.createElement('footer');
      const who = document.createElement('span');
      who.textContent = n.name;

      const like = document.createElement('button');
      like.type = 'button';
      like.className = 'like';
      like.setAttribute('aria-pressed', String(!!n.liked));
      like.setAttribute('aria-label', 'Setuju dengan pesan dari ' + n.name);
      like.textContent = '\u2665 ' + n.likes;
      like.addEventListener('click', () => {
        n.liked = !n.liked;
        n.likes += n.liked ? 1 : -1;
        save();
        like.setAttribute('aria-pressed', String(n.liked));
        like.textContent = '\u2665 ' + n.likes;
      });

      foot.append(who, like);
      li.append(p, foot);
      wallEl.append(li);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('w-name').value.trim();
    const text = document.getElementById('w-text').value.trim();
    if (!name || !text) return;
    notes.unshift({ name, text, likes: 0, liked: false });
    save();
    render();
    form.reset();
    Confetti.fire();
  });

  render();
})();

/* ---------- 3. Kuis ---------- */
(() => {
  const questions = [
    {
      q: 'Tanggal berapa Hari Guru Nasional diperingati?',
      options: ['2 Mei', '25 November', '17 Agustus', '20 Mei'],
      answer: 1,
      why: 'Hari Guru Nasional jatuh setiap 25 November.'
    },
    {
      q: 'Organisasi guru yang lahir pada 25 November 1945 bernama…',
      options: ['PGRI', 'IGI', 'Taman Siswa', 'IDI'],
      answer: 0,
      why: 'PGRI, Persatuan Guru Republik Indonesia, dibentuk tak lama setelah proklamasi kemerdekaan.'
    },
    {
      q: 'Siapa yang dijuluki Bapak Pendidikan Nasional?',
      options: ['R.A. Kartini', 'Ki Hajar Dewantara', 'Dewi Sartika', 'Moh. Hatta'],
      answer: 1,
      why: 'Ki Hajar Dewantara mendirikan Taman Siswa dan lahir pada 2 Mei, yang kini jadi Hari Pendidikan Nasional.'
    },
    {
      q: 'Apa arti “Tut wuri handayani”?',
      options: ['Di depan memberi teladan', 'Di tengah membangun semangat', 'Di belakang memberi dorongan', 'Di mana saja belajar'],
      answer: 2,
      why: 'Tut wuri handayani berarti dari belakang memberi dorongan. Semboyan ini juga ada di logo Kemendikdasmen.'
    },
    {
      q: 'Lagu Hymne Guru menyebut guru sebagai…',
      options: ['Pahlawan tanpa tanda jasa', 'Pelita dalam gelap', 'Bintang kelas', 'Penjaga ilmu'],
      answer: 0,
      why: 'Sebutan “pahlawan tanpa tanda jasa” sangat lekat dengan Hymne Guru.'
    }
  ];

  const root = document.getElementById('quiz');
  let index = 0;
  let score = 0;

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function showQuestion() {
    const item = questions[index];
    root.textContent = '';

    root.append(el('p', 'quiz-progress', 'Soal ' + (index + 1) + ' dari ' + questions.length));
    root.append(el('h3', 'quiz-q', item.q));

    const list = el('div', 'quiz-options');
    const feedback = el('p', 'quiz-feedback');
    feedback.setAttribute('role', 'status');
    const next = el('button', 'btn btn-primary quiz-next', index === questions.length - 1 ? 'Lihat skor' : 'Soal berikutnya');
    next.type = 'button';
    next.hidden = true;

    item.options.forEach((label, i) => {
      const b = el('button', 'quiz-opt', label);
      b.type = 'button';
      b.addEventListener('click', () => {
        list.querySelectorAll('button').forEach(btn => { btn.disabled = true; });
        const right = i === item.answer;
        b.classList.add(right ? 'is-right' : 'is-wrong');
        list.children[item.answer].classList.add('is-right');
        if (right) score++;
        feedback.textContent = (right ? 'Benar. ' : 'Belum tepat. ') + item.why;
        next.hidden = false;
        next.focus();
      });
      list.append(b);
    });

    next.addEventListener('click', () => {
      index++;
      index < questions.length ? showQuestion() : showResult();
    });

    root.append(list, feedback, next);
  }

  function showResult() {
    root.textContent = '';
    const msg = score === questions.length
      ? 'Sempurna. Kamu murid yang menyimak.'
      : score >= 3
        ? 'Bagus. Tinggal sedikit lagi.'
        : 'Tidak apa-apa. Guru juga mulai dari belajar.';
    root.append(
      el('p', 'quiz-progress', 'Hasil kuis'),
      el('p', 'quiz-score', score + ' / ' + questions.length),
      el('p', '', msg)
    );
    const again = el('button', 'btn btn-primary quiz-next', 'Main lagi');
    again.type = 'button';
    again.addEventListener('click', () => { index = 0; score = 0; showQuestion(); });
    root.append(again);
    if (score === questions.length) Confetti.fire();
  }

  showQuestion();
})();

/* ---------- 4. Kartu ucapan ---------- */
(() => {
  const f = {
    guru: document.getElementById('f-guru'),
    mapel: document.getElementById('f-mapel'),
    pesan: document.getElementById('f-pesan'),
    dari: document.getElementById('f-dari')
  };
  const out = {
    to: document.getElementById('p-to'),
    msg: document.getElementById('p-msg'),
    from: document.getElementById('p-from')
  };
  const status = document.getElementById('card-status');
  const shareBtn = document.getElementById('btn-share');

  function values() {
    const guru = f.guru.value.trim() || 'Bapak/Ibu Guru';
    const mapel = f.mapel.value.trim();
    return {
      to: 'Untuk ' + guru + (mapel ? ', guru ' + mapel : ''),
      msg: f.pesan.value.trim() || 'Terima kasih sudah mengajarku.',
      from: '\u2014 ' + (f.dari.value.trim() || 'seorang murid')
    };
  }

  function update() {
    const v = values();
    out.to.textContent = v.to;
    out.msg.textContent = v.msg;
    out.from.textContent = v.from;
  }

  function plainText() {
    const v = values();
    return v.to + '\n\n' + v.msg + '\n\nSelamat Hari Guru Nasional!\n' + v.from;
  }

  function say(text) {
    status.textContent = text;
    clearTimeout(say.timer);
    say.timer = setTimeout(() => { status.textContent = ''; }, 3000);
  }

  Object.values(f).forEach(input => input.addEventListener('input', update));

  document.getElementById('chips').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    f.pesan.value = chip.dataset.msg;
    update();
  });

  document.getElementById('btn-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(plainText());
      say('Ucapan disalin. Tinggal tempel di chat.');
    } catch (err) {
      say('Gagal menyalin. Blok teks pada kartu lalu salin manual.');
    }
  });

  if (navigator.share) {
    shareBtn.hidden = false;
    shareBtn.addEventListener('click', () => {
      navigator.share({ title: 'Selamat Hari Guru Nasional', text: plainText() }).catch(() => {});
    });
  }

  document.getElementById('btn-confetti').addEventListener('click', Confetti.fire);

  update();
})();