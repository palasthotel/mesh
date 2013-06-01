<!DOCTYPE html>
<html>
  <head>
    <title>Mesh &mdash; WISIWIG</title>
    <link rel="stylesheet" href="editor.css" />
  </head>
<?php
if (isset($_GET['mode']) && $_GET['mode'] == 'save') {
  $html = $_POST['mesh-preview'];
} else {
  $html = '';
}
?>
  <body>
    <div id="container">
      <h1>Mesh</h1>
      <form action="?mode=save" method="post">
        <div id="mesh-tools"></div>
        <div id="mesh-editor"><?php echo $html ?></div>
        <textarea id="mesh-preview" name="mesh-preview" value="mesh-preview"><?php echo $html ?></textarea>
      </form>
    </div>
    <script src="jquery/jquery-1.9.1.js" type="text/javascript"></script>
    <script src="editor.js" type="text/javascript"></script>
  </body>
</html>
