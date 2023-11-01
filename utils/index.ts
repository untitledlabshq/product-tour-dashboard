import { Parser } from "@json2csv/plainjs";

export function shortAddress(address: string) {
  if (address.length < 42) return address;
  return address.slice(0, 4) + "..." + address.slice(-4);
}

/**
 * Download a String as a file
 * @param {String} filename Exact name of the file
 * @param {String} text Data in plaintext
 */
export function downloadAs(filename: string, text: string) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function downloadAsCSV(obj: any) {
  const opts = {};
  const parser = new Parser(opts);
  const csv = parser.parse(obj);

  downloadAs("download.csv", csv);
}
