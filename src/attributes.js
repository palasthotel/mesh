(function() {
  'use strict';

  // export functionality
  if (typeof module === 'object')
    module.exports = Attributes;
  else
    window.Attributes = Attributes;

  function Attributes(containerNode) {
    var attributes = this;

    this.container = containerNode;

    this.container.innerHTML =
        '<table><tbody>'
            + '<tr><td><button class="addattr">add attribute</button></td><td></td><td></td></tr>'
            + '</tbody></table>';

    this.visible = false;

    this.lastRow = $(this.container).find('tr:last-child')[0];
    this.body = this.lastRow.parentNode;

    $(this.container).bind('click', function() {
      attributes.setVisible(false);
    });

    $(this.container).find('table').bind('click', function(e) {
      e.stopPropagation();
    });

    $(this.container).find('.addattr').bind('click', function() {
      attributes.append();
    });

    this.changeTimeout = null;
  }

  Emitter(Attributes.prototype);

  Attributes.prototype.append =
      function append(key, value) {
        if (typeof key == 'undefined')
          key = '';
        if (typeof value == 'undefined')
          value = '';

        var attrs = this;

        var attr = document.createElement('tr');
        attr.innerHTML =
            '<td><input class="key" type="text" placeholder="attribute name" value="'
                + key
                + '" /></td><td><input class="value" type="text" placeholder="value" value="'
                + value
                + '" /></td><td><button class="del"><i class="fa fa-trash-o"></i></button>';
        this.body.insertBefore(attr, this.lastRow);

        var $attr = $(attr);
        $attr.addClass('attr');
        $attr.find('.del').bind('click', function() {
          $attr.remove();
          attrs.emitEvent('change');
        });

        // emit 'change' events when a attribute is changed
        $attr.find('input').bind('change keydown', function(e) {
          if (attrs.changeTimeout)
            clearTimeout(attrs.changeTimeout);

          attrs.changeTimeout = setTimeout(function() {
            attrs.emitEvent('change');
          }, 50);
        });
      };

  Attributes.prototype.setVisible = function setVisible(bool) {
    this.visible = bool;
    // $(this.container).css('display', bool ? 'block' : 'none');

    if (bool) {
      $(this.container).fadeIn();
    } else {
      $(this.container).fadeOut();
    }
  };

  Attributes.prototype.setAttributes = function setAttibutes(attrs) {
    this.reset();
    var i;
    for (i = 0; i < attrs.length; i++) {
      this.append(attrs[i].key, attrs[i].value);
    }
  };

  Attributes.prototype.getAttributes = function getAttributes() {
    var attrs = [];
    var i;
    var keys = $(this.body).find('.key');
    var values = $(this.body).find('.value');
    for (i = 0; i < this.body.children.length - 1; i++) {
      attrs.push({
        key : $(keys[i]).val(),
        value : $(values[i]).val()
      });
    }
    return attrs;
  }

  Attributes.prototype.reset = function reset() {
    $(this.container).find('.attr').each(function() {
      $(this).remove();
    });
  };
})();
