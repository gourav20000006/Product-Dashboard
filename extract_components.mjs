import fs from 'fs';

const code = fs.readFileSync("/site-bundle.js", "utf8");

// Let's locate the main component definition and all subcomponents
// The search starts from where presets or search state is defined
const startIdx = code.indexOf("function D("); // product generator
console.log("Start idx:", startIdx);
if (startIdx !== -1) {
  const slice = code.slice(startIdx, startIdx + 30000);
  fs.writeFileSync("/component_slice.js", slice);
  console.log("Wrote /component_slice.js, length:", slice.length);
}
