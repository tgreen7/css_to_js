const isCSS = (item) => (item.match(/;/g) || []).length === 1;

const getBeginningWhitespace = (string) =>
  string.match(/^\s+/) !== null ? string.match(/^\s+/)[0] : "";

const toCamel = (prop) =>
  prop.replace(/-(\w|$)/g, (dash, next) => next.toUpperCase());

const toHyphen = (prop) =>
  prop.replace(/([A-Z])/g, (char) => `-${char[0].toLowerCase()}`);

const toJS = (item) => {
  const [prop, val] = item.split(":");
  return `${getBeginningWhitespace(prop)}${toCamel(
    prop.trim()
  )}: "${val.trim().replace(";", "")}",`;
};

const toCSS = (item) => {
  const [prop, val] = item.split(":");
  return `${getBeginningWhitespace(prop)}${toHyphen(
    prop.trim()
  )}: ${val.trim().replace(/'|"|,/g, "")};`;
};

module.exports = function convert(s) {
  const lines = s.split("\n");
  const someCss = lines.some((item) => isCSS(item));

  return lines
    .map((item) => {
      if (someCss) return toJS(item);
      else return toCSS(item);
    })
    .join("\n");
};
