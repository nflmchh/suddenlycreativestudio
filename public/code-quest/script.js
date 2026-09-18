const progressKey = 'codeQuestProgress';

const lessons = [
  {
    title: 'Level 1: Langkahnya Jangan Kebalik',
    story: 'Kiko mau bikin roti. Ia harus melakukan langkahnya satu-satu supaya rotinya jadi enak.',
    reward: 'Lencana Jago Urutan',
    conceptTitle: 'Komputer juga perlu diberi tahu pelan-pelan',
    conceptText: 'Komputer mengikuti perintah satu per satu. print dibaca “cetak”, maksudnya suruh komputer menampilkan sesuatu di layar.',
    conceptParts: ['print = tampilkan sesuatu', '( ) = tempat isi perintah', '"..." = tulisan yang mau ditampilkan'],
    mission: 'Yuk bantu komputer mengikuti urutan yang pas.',
    code: 'print("Ambil buku")\nprint("Buka buku")\nprint("Belajar")',
    question: 'Kalau mau belajar, urutan mana yang paling masuk akal?',
    options: ['Ambil buku → Buka buku → Belajar', 'Belajar → Ambil buku → Buka buku', 'Buka buku → Belajar → Ambil buku', 'Belajar → Buka buku → Ambil buku'],
    correct: 'Ambil buku → Buka buku → Belajar',
    explanation: 'Komputer membaca dari atas ke bawah. Jadi kita ambil buku dulu, membukanya, baru mulai belajar.',
    hint: 'Bayangkan kamu mau belajar sungguhan. Mana yang dilakukan duluan?'
  },
  {
    title: 'Level 2: Kotak Rahasia',
    story: 'Kiko menemukan kotak ajaib. Namanya bisa disimpan di sana supaya tidak lupa.',
    reward: 'Lencana Penjaga Kotak',
    conceptTitle: 'Variabel itu seperti kotak yang punya nama',
    conceptText: 'Kita beri nama sebuah kotak, lalu memasukkan sesuatu ke dalamnya. Tanda = artinya “masukkan ke sini”.',
    conceptParts: ['nama = nama kotaknya', '= = masukkan ke kotak', '"Rina" = isi kotaknya'],
    mission: 'Yuk lihat apa isi kotak bernama nama.',
    code: 'nama = "Rina"\nprint(nama)',
    question: 'Kalau kode ini dijalankan, apa yang muncul?',
    options: ['Rina', 'nama', '20', 'Error'],
    correct: 'Rina',
    explanation: 'Kotak nama berisi tulisan "Rina". Jadi saat isinya ditampilkan, yang muncul adalah Rina.',
    hint: 'Coba intip isi kotak nama. Isinya apa?'
  },
  {
    title: 'Level 3: Benar atau Salah?',
    story: 'Pintu taman robot cuma mau terbuka kalau jawabannya benar. Bantu Kiko mengeceknya, yuk.',
    reward: 'Lencana Detektif Jawaban',
    conceptTitle: 'True dan False itu jawaban komputer',
    conceptText: 'Komputer sering ditanya, “Benar atau tidak?” Di Python, benar ditulis True dan tidak benar ditulis False.',
    conceptParts: ['True = benar / iya', 'False = salah / tidak', 'lulus = True = kotaknya berisi benar'],
    mission: 'Yuk kenalan dengan jawaban benar dan salah.',
    code: 'lulus = True\nprint(lulus)',
    question: 'Kotak lulus berisi jawaban apa?',
    options: ['True', 'False', '"True"', 'lulus'],
    correct: 'True',
    explanation: 'True artinya benar. Jadi kotak lulus berisi jawaban benar.',
    hint: 'True itu artinya benar atau iya.'
  },
  {
    title: 'Level 4: Pilih Jalan',
    story: 'Kiko mau masuk turnamen. Ia harus melihat nilainya dulu sebelum memilih pintu.',
    reward: 'Lencana Jago Memilih',
    conceptTitle: 'if itu artinya “kalau”',
    conceptText: 'Program bisa memilih jalan. Bagian setelah if dijalankan kalau syaratnya benar. else artinya “kalau tidak”.',
    conceptParts: ['if = kalau syaratnya benar', '>= = lebih besar atau sama dengan', 'else = kalau tidak begitu'],
    mission: 'Yuk bantu program memilih jalan yang tepat.',
    code: 'nilai = 60\nif nilai >= 75:\n    print("Lulus")\nelse:\n    print("Belum")',
    question: 'Kalau nilainya 60, tulisan apa yang muncul?',
    options: ['Lulus', 'Belum', 'Error', 'Tunggu'],
    correct: 'Belum',
    explanation: '60 belum sampai 75. Jadi syaratnya belum benar dan program memilih jalan else: Belum.',
    hint: 'Bandingkan 60 dengan 75. Sudah cukup besar belum?'
  },
  {
    title: 'Level 5: Ulangi Lagi',
    story: 'Lampu markas Kiko harus menyala tiga kali. Untung ada loop, jadi tidak perlu menulis perintahnya berkali-kali.',
    reward: 'Lencana Jago Mengulang',
    conceptTitle: 'Loop itu perintah “ulang lagi”',
    conceptText: 'Loop menyuruh komputer mengerjakan hal yang sama beberapa kali. range membantu menghitung putarannya.',
    conceptParts: ['for = lakukan berulang', 'range(1, 4) = putaran 1, 2, 3', 'print(i) = tampilkan angka putaran'],
    mission: 'Yuk hitung berapa kali tugas ini diulang.',
    code: 'for i in range(1, 4):\n    print(i)',
    question: 'Perintah print akan dijalankan berapa kali?',
    options: ['1 kali', '2 kali', '3 kali', '4 kali'],
    correct: '3 kali',
    explanation: 'range(1, 4) menghasilkan 1, 2, dan 3. Jadi print berjalan tiga kali.',
    hint: 'Sebutkan angka dari 1 sampai sebelum 4: 1, 2, 3.'
  },
  {
    title: 'Level 6: Rak Buah',
    story: 'Kiko sedang menyiapkan bekal. Semua buah dimasukkan ke satu rak supaya gampang dicari.',
    reward: 'Lencana Jago Menata',
    conceptTitle: 'List itu rak untuk banyak barang',
    conceptText: 'List memakai tanda [ ]. Setiap barang punya nomor tempat. Uniknya, komputer mulai menghitung dari angka 0.',
    conceptParts: ['[ ] = rak list', 'buah[0] = barang pertama', ', = pemisah antar barang'],
    mission: 'Yuk cari buah yang ada di tempat pertama.',
    code: 'buah = ["apel", "pisang", "mangga"]\nprint(buah[0])',
    question: 'Buah apa yang muncul?',
    options: ['apel', 'pisang', 'mangga', 'Error'],
    correct: 'apel',
    explanation: 'Nomor 0 adalah tempat pertama. Di rak ini, buah pertama adalah apel.',
    hint: 'Ingat, komputer mulai menghitung tempat dari 0. Lihat barang paling depan.'
  },
  {
    title: 'Level 7: Resep Ajaib',
    story: 'Kiko punya resep untuk menjumlahkan angka. Resep ini sering dipakai, jadi ia menyimpannya supaya tidak membuat dari awal terus.',
    reward: 'Lencana Pembuat Resep',
    conceptTitle: 'Fungsi itu resep yang bisa dipakai lagi',
    conceptText: 'Fungsi menyimpan langkah kecil. Kita membuatnya dengan def, lalu memakainya dengan menulis nama resepnya.',
    conceptParts: ['def = buat resep', 'tambah(a, b) = nama resep dan bahan', 'return = kembalikan hasilnya'],
    mission: 'Yuk pakai resep tambah untuk menghitung angka.',
    code: 'def tambah(a, b):\n    return a + b\nprint(tambah(4, 6))',
    question: 'Kalau resep ini dipakai, hasilnya berapa?',
    options: ['10', '12', '24', 'Error'],
    correct: '10',
    explanation: 'Resep tambah menjumlahkan 4 dan 6. Hasilnya tentu 10.',
    hint: 'Ayo hitung 4 + 6 dengan jari atau bayangkan benda.'
  },
  {
    title: 'Level 8: Dua Syarat',
    story: 'Ada dua sensor di pintu rahasia. Pintu baru terbuka kalau dua-duanya bilang benar.',
    reward: 'Lencana Jago Logika',
    conceptTitle: 'and itu artinya “dan”',
    conceptText: 'Kalau ada and, semua syarat harus benar. Kalau satu saja salah, pintunya tetap tertutup.',
    conceptParts: ['and = dua-duanya harus benar', 'umur >= 12 = syarat pertama', 'memiliki_uang = syarat kedua'],
    mission: 'Yuk cek dua syarat pintu rahasia.',
    code: 'umur = 12\nmemiliki_uang = True\nif umur >= 12 and memiliki_uang:\n    print("Boleh masuk")\nelse:\n    print("Tidak boleh")',
    question: 'Menurutmu, pintunya terbuka atau tidak?',
    options: ['Boleh masuk', 'Tidak boleh', 'Error', 'Kosong'],
    correct: 'Boleh masuk',
    explanation: 'Umurnya 12, jadi syarat umur benar. Uangnya juga ada. Dua-duanya benar, maka pintu berkata: Boleh masuk.',
    hint: 'Cek dua-duanya: umurnya cukup dan uangnya ada tidak?'
  },
  {
    title: 'Level 9: Cari yang Nyeleneh',
    story: 'Pesan Kiko tiba-tiba berhenti. Ada satu kata yang salah. Yuk cari bersama-sama.',
    reward: 'Lencana Pemburu Kesalahan',
    conceptTitle: 'Debugging itu mencari bagian yang salah',
    conceptText: 'Programmer juga bisa salah. Kalau komputer berhenti, kita tidak panik. Kita baca kodenya pelan-pelan dan cari penyebabnya.',
    conceptParts: ['print = ejaan yang benar', 'prnt = ejaan yang keliru', 'Error = komputer bilang ada masalah'],
    mission: 'Yuk bantu Kiko menemukan kata yang keliru.',
    code: 'print("Halo")\nprnt("Dunia")',
    question: 'Apa yang terjadi saat kode ini dijalankan?',
    options: ['Halo lalu Dunia', 'Hanya Halo', 'Error karena prnt salah', 'Tidak ada output'],
    correct: 'Error karena prnt salah',
    explanation: 'print adalah ejaan yang benar. prnt kurang satu huruf, jadi komputer tidak mengenali perintah itu dan muncul Error.',
    hint: 'Bandingkan print dan prnt. Ada huruf yang hilang.'
  },
  {
    title: 'Level 10: Misi Besar',
    story: 'Ini misi terakhir! Campurkan semua yang sudah kamu pelajari untuk membantu Kiko naik level dua kali.',
    reward: 'Lencana Master Logika',
    conceptTitle: 'Sekarang kita campur semuanya',
    conceptText: 'Program besar dibuat dari bagian kecil: simpan data, ulangi tugas, lalu pilih jalan yang tepat.',
    conceptParts: ['nilai = data yang disimpan', 'for = mengulang tugas', 'if = memilih berdasarkan syarat'],
    mission: 'Yuk gabungkan semua jurus logika yang sudah dipelajari.',
    code: 'nilai = 80\nfor i in range(1, 3):\n    if nilai >= 75:\n        print("Naik level")\n    else:\n        print("Belajar lagi")',
    question: 'Tulisan apa yang muncul?',
    options: ['Naik level dua kali', 'Belajar lagi dua kali', 'Naik level lalu Belajar lagi', 'Error'],
    correct: 'Naik level dua kali',
    explanation: 'Nilai 80 cukup besar karena lebih dari 75. Loop berputar dua kali, jadi tulisan Naik level muncul dua kali.',
    hint: 'Nilai 80 cukup tidak untuk melewati syarat 75? Lalu loop berapa putaran?'
  }
];

const state = {
  currentIndex: 0,
  stars: 0,
  answered: false,
  answerCorrect: false,
  playerName: ''
};

const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const endScreen = document.getElementById('endScreen');
const missionTitle = document.getElementById('missionTitle');
const missionText = document.getElementById('missionText');
const storyText = document.getElementById('storyText');
const conceptTitle = document.getElementById('conceptTitle');
const conceptText = document.getElementById('conceptText');
const conceptParts = document.getElementById('conceptParts');
const codeSnippet = document.getElementById('codeSnippet');
const questionText = document.getElementById('questionText');
const answers = document.getElementById('answers');
const feedback = document.getElementById('feedback');
const reward = document.getElementById('reward');
const nextBtn = document.getElementById('nextBtn');
const hintBtn = document.getElementById('hintBtn');
const starCount = document.getElementById('starCount');
const levelCount = document.getElementById('levelCount');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultText = document.getElementById('resultText');
const finishStars = document.getElementById('finishStars');
const playerNameInput = document.getElementById('playerName');
const nameMessage = document.getElementById('nameMessage');
const playerLabel = document.getElementById('playerLabel');
const celebration = document.getElementById('celebration');
const celebrationText = document.getElementById('celebrationText');
const startBtn = document.getElementById('startBtn');
const bonusModal = document.getElementById('bonusModal');
const bonusAnswers = document.getElementById('bonusAnswers');
const bonusFeedback = document.getElementById('bonusFeedback');
const bonusRoundLabel = document.getElementById('bonusRoundLabel');
const bonusTitle = document.getElementById('bonusTitle');
const bonusDescription = document.getElementById('bonusDescription');
const bonusCode = document.getElementById('bonusCode');
const bonusNextBtn = document.getElementById('bonusNextBtn');
let bonusMode = 'secret';
let bonusRoundIndex = 0;
let bonusScore = 0;

const bonusMissions = {
  secret: [
    { title: 'Kode Rahasia Sudy', description: 'Sudy menemukan kode rahasia. Baca pelan-pelan, lalu tebak pesan yang muncul.', code: 'pesan = "Halo, Kreator!"\nprint(pesan)', options: ['Halo, Kreator!', 'pesan', 'Error', 'Sudy'], correct: 'Halo, Kreator!', explanation: 'Kotak pesan berisi tulisan Halo, Kreator!, lalu print menampilkan isi kotak itu.' },
    { title: 'Pesan Berubah', description: 'Sudy mengganti isi kotak. Apa yang akan muncul sekarang?', code: 'pesan = "Aku bisa!"\nprint(pesan)', options: ['Halo, Kreator!', 'Aku bisa!', 'pesan', 'Kosong'], correct: 'Aku bisa!', explanation: 'Isi kotak pesan sekarang adalah Aku bisa!, jadi itulah yang ditampilkan.' },
    { title: 'Pesta Kreator', description: 'Kamu sampai di tantangan terakhir. Hitung hasilnya dengan tenang.', code: 'a = 2\nb = 3\nprint(a + b)', options: ['23', '5', 'a + b', 'Error'], correct: '5', explanation: 'a berisi 2 dan b berisi 3. Komputer menjumlahkannya menjadi 5.' }
  ],
  lab: [
    { title: 'Lab Eksperimen', description: 'Di lab, kita boleh mencoba. Apa hasil percobaan ini?', code: 'warna = "biru"\nprint(warna)', options: ['merah', 'biru', 'warna', 'Error'], correct: 'biru', explanation: 'Kotak warna berisi tulisan biru, jadi itulah yang muncul.' },
    { title: 'Campur Data', description: 'Sudy mencampur dua angka. Tebak hasilnya.', code: 'bintang = 4\nbonus = 1\nprint(bintang + bonus)', options: ['41', '3', '5', 'bonus'], correct: '5', explanation: 'Empat bintang ditambah satu bonus sama dengan lima.' },
    { title: 'Coba Kondisi', description: 'Kalau syaratnya benar, pesan mana yang muncul?', code: 'poin = 10\nif poin > 5:\n    print("Hebat!")', options: ['Hebat!', 'Belum', '10', 'Error'], correct: 'Hebat!', explanation: '10 lebih besar dari 5, jadi syaratnya benar dan komputer menampilkan Hebat!.' }
  ]
};
const resumeCard = document.getElementById('resumeCard');
const resumeTitle = document.getElementById('resumeTitle');
const resumeText = document.getElementById('resumeText');
const resumeStars = document.getElementById('resumeStars');
const robotCompanion = document.getElementById('robotCompanion');
const robotBubble = document.getElementById('robotBubble');
let idleTimer;
let followFrame;
let lastPointer = null;
let restUntil = 0;
let hintMode = false;
const robotPosition = { x: window.innerWidth - 150, y: 150 };
const robotTarget = { x: robotPosition.x, y: robotPosition.y };
const companionFlight = document.getElementById('companionFlight');

function updateHud() {
  const total = lessons.length;
  const progress = ((state.currentIndex) / total) * 100;
  starCount.textContent = state.stars;
  levelCount.textContent = `${Math.min(state.currentIndex + 1, total)}/${total}`;
  progressFill.style.width = `${Math.min(progress, 100)}%`;
  progressText.textContent = `${Math.round(Math.min(progress, 100))}%`;
}

function showScreen(screen) {
  startScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  screen.classList.remove('hidden');
  document.body.classList.toggle('game-active', screen === gameScreen);
}

function renderLesson() {
  const lesson = lessons[state.currentIndex];
  missionTitle.textContent = lesson.title;
  missionText.textContent = `${state.playerName}, ${lesson.mission.toLowerCase()}`;
  storyText.textContent = lesson.story;
  conceptTitle.textContent = lesson.conceptTitle;
  conceptText.textContent = lesson.conceptText;
  conceptParts.innerHTML = '';
  lesson.conceptParts.forEach((part) => {
    const partElement = document.createElement('span');
    partElement.className = 'concept-part';
    partElement.textContent = part;
    conceptParts.appendChild(partElement);
  });
  codeSnippet.textContent = lesson.code;
  questionText.textContent = lesson.question;
  answers.innerHTML = '';
  feedback.className = 'feedback hidden';
  feedback.textContent = '';
  reward.className = 'reward hidden';
  reward.textContent = '';
  nextBtn.classList.add('hidden');
  state.answered = false;
  state.answerCorrect = false;
  leaveHintMode();
  setRobotMessage(`Ayo, ${state.playerName}! Baca pelan-pelan, kamu pasti bisa.`);
  startIdleTimer();

  lesson.options.forEach((option) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = option;
    btn.addEventListener('click', () => handleAnswer(btn, option, lesson.correct));
    answers.appendChild(btn);
  });

  updateHud();
}

function handleAnswer(btn, selected, correctAnswer) {
  if (state.answered) return;
  state.answered = true;
  state.answerCorrect = selected === correctAnswer;
  leaveHintMode();
  window.clearTimeout(idleTimer);

  const buttons = [...answers.querySelectorAll('button')];
  buttons.forEach((button) => {
    button.disabled = true;
    if (button.textContent === correctAnswer) {
      button.classList.add('correct');
    }
  });

  if (selected === correctAnswer) {
    btn.classList.add('correct');
    state.stars += 1;
    feedback.className = 'feedback success';
    feedback.textContent = `🎉 ${state.playerName} pintar! ${lessons[state.currentIndex].explanation}`;
    reward.className = 'reward unlocked';
    reward.textContent = `🏅 Lencana baru: ${lessons[state.currentIndex].reward}`;
    celebrationText.textContent = `${state.playerName} pintar!!`;
    setRobotMessage(`Hebat, ${state.playerName}! Sudy ikut senang.`);
    celebration.classList.remove('hidden');
    window.setTimeout(() => celebration.classList.add('hidden'), 1800);
    gameScreen.classList.remove('level-complete');
    void gameScreen.offsetWidth;
    gameScreen.classList.add('level-complete');
    nextBtn.classList.remove('hidden');
    saveProgress();
  } else {
    btn.classList.add('wrong');
    feedback.className = 'feedback error';
    feedback.textContent = '💡 Belum pas. Coba lihat petunjuk ini: ' + lessons[state.currentIndex].hint;
    nextBtn.textContent = 'Coba Lagi';
    nextBtn.classList.remove('hidden');
    setRobotMessage(`Tidak apa-apa, ${state.playerName}. Coba perhatikan petunjuknya ya.`);
  }

  updateHud();
}

function nextMission() {
  if (!state.answerCorrect) {
    renderLesson();
    return;
  }

  if (state.currentIndex < lessons.length - 1) {
    state.currentIndex += 1;
    saveProgress();
    nextBtn.textContent = 'Lanjut yuk';
    renderLesson();
    return;
  }

  resultText.textContent = `${state.playerName}, kamu mengumpulkan ${state.stars} bintang dari ${lessons.length} misi. Keren banget!`;
  finishStars.textContent = state.stars;
  clearProgress();
  showScreen(endScreen);
}

function startGame() {
  const typedName = playerNameInput.value.trim();
  const saved = readProgress();
  state.playerName = typedName || saved?.playerName || '';
  if (!state.playerName) {
    nameMessage.textContent = 'Tulis nama kamu dulu, ya. Setelah itu kita mulai!';
    playerNameInput.focus();
    return;
  }

  const canResume = saved && saved.playerName.toLowerCase() === state.playerName.toLowerCase();
  state.currentIndex = canResume ? Math.min(saved.currentIndex, lessons.length - 1) : 0;
  state.stars = canResume ? saved.stars : 0;
  playerLabel.textContent = `👋 ${state.playerName}`;
  playerLabel.classList.remove('hidden');
  nextBtn.textContent = 'Lanjut yuk';
  startBtn.textContent = canResume ? 'Lanjutkan yuk!' : 'Ayo Mulai!';
  renderLesson();
  showScreen(gameScreen);
}

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(progressKey));
  } catch (error) {
    return null;
  }
}

function updateResumeCard(saved) {
  if (!saved?.playerName) {
    resumeCard.classList.add('hidden');
    return;
  }

  resumeCard.classList.remove('hidden');
  resumeTitle.textContent = `Sudy ingat perjalanan ${saved.playerName}!`;
  resumeText.textContent = `Kita bisa lanjut dari level ${Math.min(saved.currentIndex + 1, lessons.length)}.`;
  resumeStars.textContent = saved.stars;
}

function saveProgress() {
  localStorage.setItem(progressKey, JSON.stringify({
    playerName: state.playerName,
    currentIndex: state.currentIndex,
    stars: state.stars
  }));
}

function clearProgress() {
  localStorage.removeItem(progressKey);
}

function openBonusMission(mode = 'secret') {
  bonusMode = mode;
  bonusRoundIndex = 0;
  bonusScore = 0;
  renderBonusRound();
  bonusModal.classList.remove('hidden');
}

function renderBonusRound() {
  const missions = bonusMissions[bonusMode];
  const mission = missions[bonusRoundIndex];
  bonusRoundLabel.textContent = `Misi ${bonusRoundIndex + 1} dari ${missions.length}`;
  bonusTitle.textContent = mission.title;
  bonusDescription.textContent = mission.description;
  bonusCode.textContent = mission.code;
  bonusAnswers.innerHTML = '';
  bonusFeedback.textContent = '';
  bonusNextBtn.classList.add('hidden');
  mission.options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'bonus-answer';
    button.textContent = option;
    button.addEventListener('click', () => {
      bonusAnswers.querySelectorAll('button').forEach((item) => {
        item.disabled = true;
        if (item.textContent === mission.correct) item.classList.add('correct');
      });
      if (option === mission.correct) {
        button.classList.add('correct');
        bonusScore += 1;
        bonusFeedback.textContent = `Keren, ${state.playerName}! ${mission.explanation}`;
      } else {
        button.classList.add('wrong');
        bonusFeedback.textContent = `Belum pas. ${mission.explanation}`;
      }
      if (bonusRoundIndex < missions.length - 1) {
        bonusNextBtn.textContent = 'Lanjut misi';
        bonusNextBtn.classList.remove('hidden');
      } else {
        bonusNextBtn.textContent = `Selesai, ${state.playerName}!`;
        bonusNextBtn.classList.remove('hidden');
      }
    });
    bonusAnswers.appendChild(button);
  });
}

function closeBonusMission() {
  bonusModal.classList.add('hidden');
}

function setRobotMessage(message) {
  robotBubble.textContent = message;
  robotBubble.classList.remove('hint-ready');
}

function showRobotHint() {
  const lesson = lessons[state.currentIndex];
  enterHintMode();
  answers.querySelectorAll('button').forEach((button) => {
    button.classList.toggle('hint-correct', button.textContent === lesson.correct);
  });
  robotBubble.textContent = `Sudy: Yang benar “${lesson.correct}”. ${lesson.explanation}`;
  feedback.className = 'feedback success';
  feedback.textContent = `💡 Yang benar: ${lesson.correct}. Kenapa? ${lesson.explanation}`;
  feedback.classList.remove('hidden');
}

function startIdleTimer() {
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => {
    if (state.answered) return;
    enterHintMode();
    robotBubble.textContent = `Hmm, ${state.playerName}, semangat! Sudy berhenti dulu. Klik aku kalau mau dibantu.`;
  }, 5000);
}

function enterHintMode() {
  hintMode = true;
  restUntil = Number.POSITIVE_INFINITY;
  robotCompanion.classList.add('hint-ready');
  robotCompanion.classList.remove('thinking');
  robotBubble.classList.add('hint-ready');
  window.clearTimeout(idleTimer);
}

function leaveHintMode() {
  hintMode = false;
  restUntil = 0;
  robotCompanion.classList.remove('hint-ready');
  robotBubble.classList.remove('hint-ready');
}

function trackPointer(event) {
  if (hintMode) return;
  const now = performance.now();
  const movement = lastPointer
    ? Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y)
    : 0;
  const elapsed = lastPointer ? now - lastPointer.time : 999;

  robotTarget.x = Math.min(Math.max(event.clientX + 76, 70), window.innerWidth - 78);
  robotTarget.y = Math.min(Math.max(event.clientY - 92, 80), window.innerHeight - 90);

  if (movement > 48 && elapsed < 150) {
    restUntil = now + 850;
    robotCompanion.classList.add('thinking');
    robotBubble.textContent = `Hmm... ${state.playerName || 'teman'} geraknya cepat sekali. Sudy mikir dulu, ya...`;
    robotBubble.classList.add('hint-ready');
    window.clearTimeout(idleTimer);
    startIdleTimer();
  }

  lastPointer = { x: event.clientX, y: event.clientY, time: now };
}

function moveRobot() {
  const now = performance.now();
  if (!hintMode && now >= restUntil) {
    robotPosition.x += (robotTarget.x - robotPosition.x) * 0.075;
    robotPosition.y += (robotTarget.y - robotPosition.y) * 0.075;
    robotCompanion.classList.remove('thinking');
  }

  companionFlight.style.transform = `translate3d(${robotPosition.x}px, ${robotPosition.y}px, 0)`;
  updateBubblePosition();
  followFrame = window.requestAnimationFrame(moveRobot);
}

function updateBubblePosition() {
  const bubbleOnLeft = robotPosition.x > window.innerWidth * 0.52;
  const bubbleBelow = robotPosition.y < 105;
  robotBubble.classList.toggle('bubble-left', bubbleOnLeft);
  robotBubble.classList.toggle('bubble-below', bubbleBelow);
}

playerNameInput.addEventListener('input', () => {
  const hasName = playerNameInput.value.trim().length > 0;
  startBtn.disabled = !hasName;
  nameMessage.textContent = hasName ? '' : 'Namamu akan dipakai selama kita main.';
  if (hasName) {
    const saved = readProgress();
    updateResumeCard(saved?.playerName.toLowerCase() === playerNameInput.value.trim().toLowerCase() ? saved : null);
    if (saved?.playerName.toLowerCase() === playerNameInput.value.trim().toLowerCase()) {
      nameMessage.textContent = `Yuk lanjut dari level ${saved.currentIndex + 1}, ${saved.playerName}!`;
      startBtn.textContent = 'Lanjutkan yuk!';
    } else {
      startBtn.textContent = 'Ayo Mulai!';
    }
  }
});
playerNameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !startBtn.disabled) startGame();
});
startBtn.addEventListener('click', startGame);
document.getElementById('nextBtn').addEventListener('click', nextMission);
document.getElementById('hintBtn').addEventListener('click', () => {
  const lesson = lessons[state.currentIndex];
  feedback.className = 'feedback error';
  feedback.textContent = '💡 Coba pikirkan ini: ' + lesson.hint;
  feedback.classList.remove('hidden');
});
robotCompanion.addEventListener('click', showRobotHint);
window.addEventListener('pointermove', trackPointer, { passive: true });
window.addEventListener('resize', () => {
  robotTarget.x = Math.min(robotTarget.x, window.innerWidth - 78);
  robotTarget.y = Math.min(robotTarget.y, window.innerHeight - 90);
});
moveRobot();

const savedProgress = readProgress();
if (savedProgress?.playerName) {
  playerNameInput.value = savedProgress.playerName;
  startBtn.disabled = false;
  startBtn.textContent = 'Lanjutkan yuk!';
  nameMessage.textContent = `Hai lagi, ${savedProgress.playerName}! Kita bisa lanjut dari level ${savedProgress.currentIndex + 1}.`;
  updateResumeCard(savedProgress);
}
document.getElementById('restartBtn').addEventListener('click', () => {
  clearProgress();
  playerNameInput.value = state.playerName;
  startGame();
});
document.getElementById('bonusBtn').addEventListener('click', () => openBonusMission('secret'));
document.getElementById('labBtn').addEventListener('click', () => openBonusMission('lab'));
document.getElementById('collectionBtn').addEventListener('click', () => {
  bonusMode = 'secret';
  bonusTitle.textContent = 'Koleksi Lencana';
  bonusRoundLabel.textContent = 'Koleksi kamu';
  bonusDescription.textContent = `Hebat, ${state.playerName}! Kamu sudah membuka Lencana Master Logika. Lanjutkan misi bonus untuk mengumpulkan lencana baru.`;
  bonusCode.textContent = 'MASTER LOGIKA\n+  ★ ★ ★';
  bonusAnswers.innerHTML = '';
  bonusFeedback.textContent = '';
  bonusNextBtn.classList.add('hidden');
  bonusModal.classList.remove('hidden');
});
document.getElementById('closeBonusBtn').addEventListener('click', closeBonusMission);
bonusNextBtn.addEventListener('click', () => {
  if (bonusRoundIndex < bonusMissions[bonusMode].length - 1) {
    bonusRoundIndex += 1;
    renderBonusRound();
  } else {
    bonusFeedback.textContent = `Kamu mengumpulkan ${bonusScore} dari ${bonusMissions[bonusMode].length} bintang bonus. Keren!`;
    bonusNextBtn.classList.add('hidden');
  }
});
bonusModal.addEventListener('click', (event) => {
  if (event.target === bonusModal) closeBonusMission();
});

showScreen(startScreen);
updateHud();
