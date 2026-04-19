var stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight
});

var layer = new Konva.Layer();
stage.add(layer);

var daftarKabel = [];
var pinAwal = null;

// =====================
// BUAT KOMPONEN
// =====================
function buatKomponen(x, y, nama, tipe) {

  var group = new Konva.Group({
    x: x,
    y: y,
    draggable: true
  });

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

  // PIN kiri
  var pin1 = new Konva.Circle({
    x: 0,
    y: 25,
    radius: 6,
    fill: 'black',
    name: 'pin'
  });

  // PIN kanan
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

  layer.add(group);
  layer.draw();

  return group;
}

// =====================
// TAMBAH KOMPONEN
// =====================
function tambahSumber() {
  var s = buatKomponen(50, 150, "Sumber", "power");
  s.state = true;
}

function tambahSaklar() {
  buatKomponen(200, 150, "Saklar", "switch");
}

function tambahLampu() {
  buatKomponen(350, 150, "Lampu", "lamp");
}

// =====================
// BUAT KABEL (FIX)
// =====================
stage.on('click', function(e) {

  if (!e.target.hasName('pin')) return;

  // klik pertama
  if (!pinAwal) {
    pinAwal = e.target;
    e.target.fill('red'); // tanda dipilih
    layer.draw();
  } 
  // klik kedua
  else {

    var garis = new Konva.Line({
      stroke: 'blue',
      strokeWidth: 3
    });

    layer.add(garis);

    daftarKabel.push({
      dari: pinAwal,
      ke: e.target,
      garis: garis
    });

    // reset warna pin
    pinAwal.fill('black');
    pinAwal = null;

    updateKabel();
  }
});

// =====================
// UPDATE POSISI KABEL
// =====================
function updateKabel() {
  daftarKabel.forEach(k => {

    var p1 = k.dari.getAbsolutePosition();
    var p2 = k.ke.getAbsolutePosition();

    k.garis.points([p1.x, p1.y, p2.x, p2.y]);
  });

  layer.draw();
}

// kabel ikut gerak saat drag
stage.on('dragmove', function() {
  updateKabel();
});
