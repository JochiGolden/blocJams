function forEach(func, array) {
  var i = 0,
      l = array.length;
  for (i; i < l; i += 1) {
    func(i);
  }
}