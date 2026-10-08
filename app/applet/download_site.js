import fs from 'fs';

async function main() {
  const res = await fetch("https://app-mg11.vercel.app/assets/index-BhdgY1ig.js");
  const code = await res.text();
  fs.writeFileSync("site-bundle.js", code);
  console.log("Downloaded bundle, length:", code.length);

  const cssRes = await fetch("https://app-mg11.vercel.app/assets/index-BiRXx-YT.css");
  const css = await cssRes.text();
  fs.writeFileSync("site-bundle.css", css);
  console.log("Downloaded css, length:", css.length);
}

main().catch(console.error);
