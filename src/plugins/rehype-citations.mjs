// Turns [1](https://source "What the source shows") into a superscript citation
// with a hover/focus tooltip. The title text becomes the tooltip, and the link
// opens the source in a new tab. Only links whose text is a number (or numbers
// like "2, 3") and that have a title are converted.
const NUMBERS = /^\d+(?:\s*[,-]\s*\d+)*$/;

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children || []).map(textOf).join('');

function walk(node) {
  if (!node.children) return;
  node.children = node.children.map((child) => {
    if (child.type === 'element' && child.tagName === 'a') {
      const label = textOf(child).trim();
      const tip = child.properties?.title;
      if (NUMBERS.test(label) && typeof tip === 'string' && tip.trim()) {
        const props = { ...child.properties };
        delete props.title;
        return {
          type: 'element',
          tagName: 'sup',
          properties: { className: ['cite'] },
          children: [
            {
              ...child,
              properties: {
                ...props,
                className: ['cite-link'],
                target: '_blank',
                rel: 'noopener noreferrer',
                'data-tip': tip.trim(),
                ariaLabel: `Source ${label}: ${tip.trim()}`,
              },
              children: [{ type: 'text', value: label }],
            },
          ],
        };
      }
    }
    walk(child);
    return child;
  });
}

export default function rehypeCitations() {
  return (tree) => walk(tree);
}
