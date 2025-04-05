// Generates BBCode output after name generation
function buildBBCodeOutput(shell, scar, soul, song) {
    return `[div="max-width: 920px; background: #111; padding: 10px; margin: auto; border: 2px solid #333; font-family: Courier New; font-size: 100%; color: #c0c0c0;"]\n
  [b][color=#66fcf1]Shell-Name:[/color][/b] ${shell}\n
  [b][color=#66fcf1]Scar-Name:[/color][/b] ${scar}\n
  [b][color=#66fcf1]Soul-Name:[/color][/b] ${soul}\n
  [b][color=#66fcf1]Song-Name:[/color][/b] ${song}\n
  \n[b][color=#66fcf1]BIO[/color][/b]\nInsert character biography here.\n\n[b][color=#66fcf1]INVENTORY[/color][/b]\n[LIST]\n[*]Item 1\n[*]Item 2\n[*]Item 3\n[/LIST]\n\n[b][color=#66fcf1]PERSONALITY[/color][/b]\nInsert traits, beliefs, quirks.\n\n[b][color=#66fcf1]STRENGTHS[/color][/b]\n[LIST]\n[*]Strength 1\n[*]Strength 2\n[/LIST]\n\n[b][color=#66fcf1]WEAKNESSES[/color][/b]\n[LIST]\n[*]Weakness 1\n[*]Weakness 2\n[/LIST]\n[/div]`;
  }
  
  function showBBCode(shell, scar, soul, song) {
    const bbcode = buildBBCodeOutput(shell, scar, soul, song);
    document.getElementById("bbcodeOutput").value = bbcode;
    document.getElementById("bbcodePreview").style.display = "none";
  }
  
  
  
  
  function copyBBCode() {
    const textarea = document.getElementById("bbcodeOutput");
    textarea.select();
    document.execCommand("copy");
  }
  
  function previewBBCode() {
    const preview = document.getElementById("bbcodePreview");
  
    // Toggle: if preview is visible, hide it
    if (preview.style.display === "block") {
      preview.style.display = "none";
      preview.innerHTML = ""; // clear rendered HTML
      return;
    }
  
    // Otherwise: show it
    const raw = document.getElementById("bbcodeOutput").value;
  
    let html = raw
      .replace(/\[b\](.*?)\[\/b\]/gi, "<strong>$1</strong>")
      .replace(/\[i\](.*?)\[\/i\]/gi, "<em>$1</em>")
      .replace(/\[u\](.*?)\[\/u\]/gi, "<u>$1</u>")
      .replace(/\[color=([#a-zA-Z0-9]+)\](.*?)\[\/color\]/gi, '<span style="color:$1;">$2</span>')
      .replace(/\[list\](.*?)\[\/list\]/gis, '<ul>$1</ul>')
      .replace(/\[\*\](.*?)(?=\[\*]|\n|<\/ul>)/gis, '<li>$1</li>')
      .replace(/\[url='?(.*?)'?\](.*?)\[\/url\]/gi, '<a href="$1" target="_blank">$2</a>')
      .replace(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" alt="" style="max-width:100%; border:1px solid #444; margin:5px 0;">')
      .replace(/\[div="(.*?)"\]/gi, '<div style="$1">')
      .replace(/\[\/div\]/gi, '</div>')
      .replace(/\n/g, "<br>");
  
    preview.innerHTML = html;
    preview.style.display = "block";
  }
  
  
  