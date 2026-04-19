var stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight
});

// 🔥 PISAH LAYER
var layerKabel = new Konva.Layer();
var layerKomponen = new Konva.Layer();

stage.add(layerKabel);
stage.add(layerKomponen);

var daftarKabel = [];
var pinAwal = null;
var semuaKomponen = [];

// posisi otomatis
var posX = 50;
var posY = 150;

// =====================
// BUAT KOMPONEN
// =====================
function buatKomponen(nama, tipe) {

  var group = new Konva.Group({
    x: posX,
    y: posY,
    draggable: true
  });

  posX += 150;
  if (posX > window.innerWidth - 150) {
    posX = 50;
    posY += 100;
  }

  var rect = new Konva.Rect({
    width: 100,
    height: 50,
    fill: 'lightgray',
    stroke: 'black',
    cornerRadius: 5
  });

  var text = new Konva.Text({
    text: nama,
    fontSize: 14,
    width: 100,
    align: 'center',
    y: 15
  });

  var pin1 = new Konva.Circle({
    x: 0,
    y: 25,
    radius: 6,
    fill: 'black',
    name: 'pin'
  });

  var pin2 = new Konva.Circle({
    x: 100,
    y: 25,
    radius: 6,
    fill: 'black',
    name: 'pin'
  });

  group.add(rect, text, pin1, pin2);

  group.tipe = tipe;
  group.state = false;

  semuaKomponen.push(group);

  layerKomponen.add(group);
  layerKomponen.draw();

  return group;
}

// =====================
// TOMBOL
// =====================
function tambahSumber() {
  var s = buatKomponen("Sumber", "power");
  s.state = true;
}

function tambahSaklar() {
  buatKomponen("Saklar", "switch");
}

function tambahLampu() {
  buatKomponen("Lampu", "lamp");
}

// =====================
// KLIK SAKLAR (FIX)
// =====================
stage.on('click', function(e) {

  var obj = e.target.getParent();

  if (obj && obj.tipe === "switch") {
    obj.state = !obj.state;

    obj.children[0].fill(obj.state ? "green" : "lightgray");
    layerKomponen.draw();

    cekRangkaian();
  }
});

// =====================
// BUAT KABEL
// =====================
stage.on('click', function(e) {

  if (!e.target.hasName('pin')) return;

  if (!pinAwal) {
    pinAwal = e.target;
    e.target.fill('red');
    layerKomponen.draw();
  } else {

    var garis = new Konva.Line({
      stroke: 'blue',
      strokeWidth: 3
    });

    layerKabel.add(garis);

    daftarKabel.push({
      dari: pinAwal,
      ke: e.target,
      garis: garis
    });

    pinAwal.fill('black');
    pinAwal = null;

    updateKabel();
    cekRangkaian();
  }
});

// =====================
// ROUTING
// =====================
function buatJalur(p1, p2) {
  var midX = (p1.x + p2.x) / 2;

  return [
    p1.x, p1.y,
    midX, p1.y,
    midX, p2.y,
    p2.x, p2.y
  ];
}

// =====================
// UPDATE KABEL
// =====================
function updateKabel() {
  daftarKabel.forEach(k => {

    var p1 = k.dari.getAbsolutePosition();
    var p2 = k.ke.getAbsolutePosition();

    k.garis.points(buatJalur(p1, p2));
  });

  layerKabel.draw();
}

stage.on('dragmove', updateKabel);

// =====================
// LOGIKA LISTRIK (SIMPLE)
// =====================
function cekRangkaian() {

  semuaKomponen.forEach(k => {
    if (k.tipe === "lamp") {
      k.state = false;
    }
  });

  var adaSumber = semuaKomponen.some(k => k.tipe === "power" && k.state);
  var saklarOn = semuaKomponen.some(k => k.tipe === "switch" && k.state);

  semuaKomponen.forEach(k => {
    if (k.tipe === "lamp") {
      k.state = (adaSumber && saklarOn);
      k.children[0].fill(k.state ? "yellow" : "lightgray");
    }
  });

  layerKomponen.draw();
}
