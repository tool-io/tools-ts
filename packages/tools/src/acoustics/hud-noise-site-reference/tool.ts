import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return HUD environmental-noise site categories and procedural cautions.",
  entries: {
    acceptable: {
      source: "24 CFR Part 51 Subpart B",
      statement:
        "HUD identifies sites at or below 65 dB day-night average sound level as acceptable for noise assessment purposes.",
    },
    "normally-unacceptable": {
      source: "24 CFR Part 51 Subpart B",
      statement:
        "Sites above 65 dB and not exceeding 75 dB are normally unacceptable and require the applicable mitigation and approval process.",
    },
    unacceptable: {
      source: "24 CFR Part 51 Subpart B",
      statement:
        "Sites above 75 dB are unacceptable absent the exceptional approvals and protections specified by HUD rules.",
    },
  },
  exampleTopic: "acceptable",
  id: "acoustics/hud-noise-site-reference",
  title: "HUD Noise Site Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
