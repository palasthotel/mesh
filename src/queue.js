(function(window) {

  /**
   * FIFO.
   * 
   * @param capacity
   */
  function Queue(capacity) {
    this.capacity = capacity;
    this.length = 0;
    this.cursor = -1;
    this.data = [];
  }

  Queue.prototype.enqueue = function enqueue(elem) {
    // get next cursor position
    this.cursor = (this.cursor + 1) % this.capacity;
    // enqueue element
    this.data[this.cursor] = elem;
    this.length = Math.min(this.capacity, this.length + 1);
  };

  Queue.prototype.dequeue = function dequeue() {
    if (this.length <= 0)
      throw new Error('Cannot dequeue an empty Queue');

    var result = this.data[this.cursor];
    delete this.data[this.cursor];
    this.cursor = (this.cursor - 1) % this.length;
    this.length = this.length - 1;
    return result;
  };

  Queue.prototype.isEmpty = function isEmpty() {
    return this.length === 0;
  };

  Queue.prototype.toString = function toString() {
    if (this.isEmpty())
      return '()';

    var i = 0, c = (this.cursor + 1) % this.length, str = 'Queue(';
    for (; i < this.length; i++, c = (c + 1) % this.capacity) {
      str += this.data[c] + (i + 1 < this.length ? ', ' : '');
    }
    str += ')';
    return str;
  };

  window.Queue = Queue;

})(this);