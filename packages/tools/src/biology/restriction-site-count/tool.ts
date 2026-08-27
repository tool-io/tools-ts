import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const restrictionSiteCountExample = {
  input: { sequence: "GAATTCGGAATTC", site: "GAATTC" },
} satisfies ToolExample<{ readonly sequence: string; readonly site: string }>;

export const restrictionSiteCountTool = createSimpleTool({
  id: "biology/restriction-site-count",
  title: "Restriction Site Count",
  description:
    "Count non-overlapping occurrences of a restriction site inside a DNA sequence.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "site", label: "Restriction site", kind: "string" },
  ],
  outputs: [
    { id: "siteCount", label: "Sites found", kind: "integer", format: "count" },
  ],
  calculate: (input) => {
    const sequence = input.sequence as string;
    const site = input.site as string;
    if (sequence === "")
      simpleError("sequence", "Sequence must not be empty.", "empty_sequence");
    if (!/^[ACGT]+$/.test(sequence))
      simpleError(
        "sequence",
        "Sequence must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    if (site === "")
      simpleError(
        "site",
        "Restriction site must not be empty.",
        "empty_sequence",
      );
    if (!/^[ACGT]+$/.test(site))
      simpleError(
        "site",
        "Restriction site must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    let siteCount = 0;
    let searchIndex = 0;
    while ((searchIndex = sequence.indexOf(site, searchIndex)) !== -1) {
      siteCount += 1;
      searchIndex += site.length;
    }
    return { siteCount };
  },
});
export const runRestrictionSiteCount = restrictionSiteCountTool.execute;
export default restrictionSiteCountTool;
