const fs = require('fs');
let css = fs.readFileSync('/workspaces/dveryaninov/css/main.css', 'utf8');

// Fix config detail options
css = css.replace(/\.config-detail-options \{([\s\S]*?)\}/, (match, body) => {
    return `.config-detail-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 0;
  padding: 0;
  margin: 0;
  opacity: 0;
  visibility: hidden;
  overflow: hidden;
  transition: max-height 0.35s ease, padding 0.25s ease, margin 0.25s ease, opacity 0.25s ease;
}`;
});

css = css.replace(/\.config-detail-options\.is-open\s*\{([\s\S]*?)\}/, (match, body) => {
    return `.config-detail-options.is-open {
  max-height: 600px;
  padding-top: 16px;
  padding-bottom: 8px;
  opacity: 1;
  visibility: visible;
}`;
});

// Fix config chips colors
css = css.replace(/\.config-chip\s*\{([\s\S]*?)\}/, (match, body) => {
    return `.config-chip {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-light);
  border-radius: 0;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.2;
  transition: all 0.2s ease;
}`;
});

css = css.replace(/\.config-chip:hover\s*\{([\s\S]*?)\}/, (match, body) => {
    return `.config-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}`;
});

css = css.replace(/\.config-chip_active\s*\{([\s\S]*?)\}/, (match, body) => {
    return `.config-chip_active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: transparent;
  font-weight: 500;
}`;
});

fs.writeFileSync('/workspaces/dveryaninov/css/main.css', css, 'utf8');
console.log('CSS updated');
