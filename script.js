var pinAwal = null;

stage.on('click', function(e) {
  if (!e.target.hasName('pin')) return;

  var pos = e.target.getAbsolutePosition();

  // klik pertama
  if (!pinAwal) {
    pinAwal = pos;
  } 
  // klik kedua
  else {
    var garis = new Konva.Line({
      points: [pinAwal.x, pinAwal.y, pos.x, pos.y],
      stroke: 'red',
      strokeWidth: 2
    });

    layer.add(garis);
    layer.draw();

    pinAwal = null;
  }
});
