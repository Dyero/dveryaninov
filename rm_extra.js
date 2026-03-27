const fs = require('fs');
const glob = require('glob');

const files = glob.sync('/workspaces/dveryaninov/product*.html');
files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    // Replace <div class="product__extra"> ... </div>
    // Note: We need a regex that matches the entire div.
    html = html.replace(/<div class="product__extra">[\s\S]*?<\/div>/g, '');
    fs.writeFileSync(file, html);
    console.log(`Updated ${file}`);
});
