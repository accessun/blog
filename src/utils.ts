/**
 * Truncates a string to a specified length and adds an ellipsis
 * @param text The text to truncate
 * @param length The maximum length of the truncated text (including ellipsis)
 * @param suffix The string to append at the end (default: '...')
 * @returns The truncated text with ellipsis
 */
export function truncateText(
  text: string,
  length: number,
  suffix: string = "..."
): string {
  if (text.length <= length) return text;
  return text.slice(0, length - suffix.length) + suffix;
}

export const plainify = (content: string) => {
  const filterBrackets = content.replace(/<\/?[^>]+(>|$)/gm, "");
  const filterSpaces = filterBrackets.replace(/[\r\n]\s*[\r\n]/gm, "");
  const stripHTML = htmlEntityDecoder(filterSpaces);
  return stripHTML;
};

// strip entities for plainify
const htmlEntityDecoder = (htmlWithEntities: string) => {
  let entityList: { [key: string]: string } = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
  };
  let htmlWithoutEntities: string = htmlWithEntities.replace(
    /(&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    (entity: string): string => {
      return entityList[entity];
    }
  );
  return htmlWithoutEntities;
};
