var stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight
});

var layer = new Konva.Layer();
stage.add(layer);

// fungsi buat komponen
function buatKomponen(x, y, nama) {
  var group = new Konva.Group({
    x: x,
    y: y,
    draggable: true
  });

  var rect = new Konva.Rect({
    width: 80,
    height: 40,
    fill: 'lightblue',
    stroke: 'black',
    strokeWidth: 2
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

  group.add(rect);
  group.add(text);
  group.add(pin1);
  group.add(pin2);

  layer.add(group);
  layer.draw();

  return group;
}

// contoh komponen
buatKomponen(50, 50, "Lampu");
buatKomponen(200, 50, "Relay");

// wiring sederhana
var garisAktif = null;

stage.on('mousedown', function(e) {
  if (e.target.hasName('pin')) {
    var pos = e.target.getAbsolutePosition();

    garisAktif = new Konva.Line({
      points: [pos.x, pos.y, pos.x, pos.y],
      stroke: 'red',
      strokeWidth: 2
    });

    layer.add(garisAktif);
  }
});

stage.on('mousemove', function() {
  if (garisAktif) {
    var pos = stage.getPointerPosition();
    var points = garisAktif.points();

    points[2] = pos.x;
    points[3] = pos.y;

    garisAktif.points(points);
    layer.draw();
  }
});

stage.on('mouseup', function() {
  garisAktif = null;
});
