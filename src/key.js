var key = module.exports;

key.isAlterationKey = function(keyCode) {
  // Matches all keys that do may alter text
  return !(keyCode >= 16 && keyCode <= 45 || keyCode >= 112 && keyCode <= 145);
};
