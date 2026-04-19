var stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight
});

// layer
var layerKabel = new Konva.Layer();
var layerKomponen = new Konva.Layer();

stage.add(layerKabel);
stage.add(layerKomponen);

var daftarKabel = [];
var semuaKomponen = [];
var pinAwal = null;

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

  // PIN
  var pin1 = new Konva.Circle({
    x: 0,
    y: 25,
    radius: 6,
    fill: (tipe === "power") ? "red" : "black",
    name: 'pin'
  });

  var pin2 = new Konva.Circle({
    x: 100,
    y: 25,
    radius: 6,
    fill: (tipe === "power") ? "blue" : "black",
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
// KLIK SAKLAR
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
// BUAT KABEL + NODE
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
      strokeWidth: 3,
      lineJoin: 'round',
      lineCap: 'round'
    });

    layerKabel.add(garis);

    // node tengah
    var control = new Konva.Circle({
      radius: 6,
      fill: 'orange',
      draggable: true
    });

    layerKomponen.add(control);

    var p1 = pinAwal.getAbsolutePosition();
    var p2 = e.target.getAbsolutePosition();

    control.position({
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    });

    var dataKabel = {
      dari: pinAwal,
      ke: e.target,
      garis: garis,
      control: control
    };

    daftarKabel.push(dataKabel);

    control.on('dragmove', updateKabel);

    pinAwal.fill('black');
    pinAwal = null;

    updateKabel();
    cekRangkaian();
  }
});

// =====================
// UPDATE KABEL (ANTI TEMBUS)
// =====================
function updateKabel() {

  daftarKabel.forEach(k => {

    var p1 = k.dari.getAbsolutePosition();
    var p2 = k.ke.getAbsolutePosition();
    var c = k.control.position();

    var offset = 40;

    var keluar1 = (p1.x < c.x) ? offset : -offset;
    var keluar2 = (p2.x < c.x) ? offset : -offset;

    var x1 = p1.x + keluar1;
    var x2 = p2.x + keluar2;

    k.garis.points([
      p1.x, p1.y,
      x1, p1.y,
      x1, c.y,
      c.x, c.y,
      x2, c.y,
      x2, p2.y,
      p2.x, p2.y
    ]);
  });

  layerKabel.draw();
}

stage.on('dragmove', updateKabel);

// =====================
// LOGIKA LISTRIK
// =====================
function cekRangkaian() {

  semuaKomponen.forEach(k => {
    if (k.tipe === "lamp") {
      k.state = false;
    }
  });

  var adaSumber = semuaKomponen.some(k => k.tipe === "power" && k.state);
  var saklarOn = semuaKomponen.some(k => k.tipe === "switch" && k.state);

  semuaKomponen.forEach(lamp => {

    if (lamp.tipe !== "lamp") return;

    var terhubung = daftarKabel.some(k => {
      return (
        k.dari.getParent() === lamp ||
        k.ke.getParent() === lamp
      );
    });

    if (adaSumber && saklarOn && terhubung) {
      lamp.state = true;
    }

    lamp.children[0].fill(lamp.state ? "yellow" : "lightgray");
  });

  layerKomponen.draw();
}
