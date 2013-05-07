<html>
  <head>
    <title>Text-Editor</title>
    <!-- Styles -->
    <style>
    #thediv, #thearea { width: 50em; min-height: 6em; font-family: Georgia; font-size: 18px; }
    #thediv { border: 1px solid gray; padding: 3px; }
    </style>
    <!-- Scipts -->
    <script src="jquery/jquery-1.4.2.js" type="text/javascript"></script>
    <script src="jquery/jquery.ui.core.js" type="text/javascript"></script>
    <script src="jquery/jquery.ui.widget.js" type="text/javascript"></script>
    <script src="jquery/jquery.ui.mouse.js" type="text/javascript"></script>
    <script src="jquery/jquery.ui.position.js" type="text/javascript"></script>
    <script src="jquery/jquery.ui.autocomplete.js" type="text/javascript"></script>
    <script src="jquery/jquery.ui.draggable.js" type="text/javascript"></script>
    <script src="jquery/jquery.ui.droppable.js" type="text/javascript"></script>
    <script src="jquery/jquery.ui.sortable.js" type="text/javascript"></script>
  </head>
  <body>
    <h1>Text-Editor</h1>
    <?php
    if (isset($_GET["modus"]) and $_GET["modus"] == "save") {
      $thetext = $_POST["thearea"];
    } else {
      $thetext = "";
    }

    $thetext = string_beautify_text($thetext);

    function string_beautify_text($text) {
      $text = string_doublebr2paragraphs($text);
      $text = string_remove_br_before_endof_paragraph($text);
      $text = string_remove_empty_paragraphs($text);
      return $text;

    }

    function string_doublebr2paragraphs($text) {
      if (strpos($text, "<br><br>")) {
        $paragraphs = explode("<br><br>", $text);
        foreach ($paragraphs as $key => $p) {
          $paragraphs[$key] = "<p>".trim($p)."</p>";
        }
        $text = implode("\n", $paragraphs);
        $text = str_replace("<p><p>", "", $text);
        $text = str_replace("</p></p>", "", $text);
      }
      return $text;
    }

    function string_remove_empty_paragraphs($text) {
      $text = str_replace("<p></p>", "", $text);
      return $text;
    }

    function string_remove_br_before_endof_paragraph($text) {
      $text = str_replace("<br></p>", "</p>", $text);
      return $text;
    }


    ?>
    <form action="?modus=save" method="post">
      <input type="button" value="b" class="bold" />
      <input type="button" value="i" class="italic" />
      <input type="button" value="Link" class="link" />
      <div id="thediv" contenteditable="true">
        <?php print($thetext); ?>
      </div>
      <textarea id="thearea" name="thearea"><?php print($thetext); ?></textarea>
      <p><input type="submit" id="save" value="save" /></p>
    </form>

    <script>
    jQuery(function($) {

      function getSelectionText() {
        var text = "";
        if (window.getSelection) {
          text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
        }
         return text;
      }

      $('#save').click(function() {
        $('#thearea').html($('#thediv').html());
      });

      $('input[type="button"]').click(function() {
        var mode = $(this).attr('class');
        var divcontent = $('#thediv').html();
        var selection = getSelectionText();

        switch(mode) {
          case 'bold':
            if (selection)
              var new_content = divcontent.replace(selection, '<b>' + selection + '</b>');
            break;

          case 'italic':
            if (selection)
              var new_content = divcontent.replace(selection, '<em>' + selection + '</em>');
            break;

          case 'link':
            if (selection) {
              var linkurl = prompt('URL');
              var new_content = divcontent.replace(selection, '<a href="' + linkurl + '">' + selection + '</a>');
            }	else {
                var linkurl = prompt('URL');
                var linktext = prompt('Link-Text');
                var new_content = divcontent + '<a href="' + linkurl + '">' + linktext + '</a>';
              }
            break;
        }

        if (new_content) {
          $('#thediv').html(new_content.trim());
          $('#thearea').html($('#thediv').html());
        }
      });

    });
    </script>

  </body>
</html>
