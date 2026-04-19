var stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight
});

var layer = new Konva.Layer();
stage.add(layer);

var daftarKabel = [];
var semuaKomponen = [];

// ======================
// BUAT KOMPONEN
// ======================
function buatKomponen(x, y, nama, tipe) {
  var group = new Konva.Group({
    x: x,
    y: y,
    draggable: true
  });

  var rect = new Konva.Rect({
    width: 80,
    height: 40,
    fill: 'lightgray',
    stroke: 'black'
  });

  var text = new Konva.Text({
    text: nama,
    fontSize: 14,
    width: 80,
    align: 'center'
  });

  var pin1 = new Konva.Circle({
    x: 0,
    y: 20,
    radius: 5,
    fill: 'black',
    name: 'pin'
  });

  var pin2 = new Konva.Circle({
    x: 80,
    y: 20,
    radius: 5,
    fill: 'black',
    name: 'pin'
  });

  group.add(rect, text, pin1, pin2);

  // data komponen
  group.tipe = tipe;
  group.state = false;

  semuaKomponen.push(group);

  layer.add(group);
  layer.draw();

  return group;
}

// ======================
// BUAT KOMPONEN AWAL
// ======================
var sumber = buatKomponen(50, 100, "Sumber", "power");
sumber.state = true;

var saklar = buatKomponen(200, 100, "Saklar", "switch");

var lampu = buatKomponen(350, 100, "Lampu", "lamp");

// ======================
// WIRING
// ======================
var pinAwal = null;

stage.on('click', function(e) {
  if (!e.target.hasName('pin')) return;

  if (!pinAwal) {
    pinAwal = e.target;
  } else {
    var garis = new Konva.Line({
      stroke: 'red',
      strokeWidth: 2
    });

    layer.add(garis);

    daftarKabel.push({
      dari: pinAwal,
      ke: e.target,
      garis: garis
    });

    pinAwal = null;
    updateKabel();
    cekRangkaian();
  }
});

// ======================
// UPDATE KABEL
// ======================
function updateKabel() {
  daftarKabel.forEach(k => {
    var p1 = k.dari.getAbsolutePosition();
    var p2 = k.ke.getAbsolutePosition();

    k.garis.points([p1.x, p1.y, p2.x, p2.y]);
  });

  layer.draw();
}

stage.on('dragmove', updateKabel);

// ======================
// SAKLAR ON/OFF
// ======================
stage.on('dblclick', function(e) {
  var obj = e.target.getParent();

  if (obj && obj.tipe === "switch") {
    obj.state = !obj.state;

    obj.children[0].fill(obj.state ? "green" : "gray");
    layer.draw();

    cekRangkaian();
  }
});

// ======================
// CEK RANGKAIAN (LOGIKA)
// ======================
function cekRangkaian() {
  // reset lampu
  lampu.state = false;

  // cek sederhana:
  if (sumber.state && saklar.state) {
    lampu.state = true;
  }

  // update tampilan lampu
  lampu.children[0].fill(lampu.state ? "yellow" : "gray");

  layer.draw();
}
