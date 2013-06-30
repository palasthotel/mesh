(function(window) {

  function Command(command, doc) {

    this.execute = function() {
      doc.execCommand(command, false, null);
    };

    this.queryState = function() {
      return editDoc.queryCommandState(command)
    };

  }

  window.Command = Command;

})(this);
