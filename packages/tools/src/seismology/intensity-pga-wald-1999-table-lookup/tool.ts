import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const intensityPgaWald1999TableLookupExample = {
  input: { instrumentalMMI: 6.5 },
  output: { pgaLowG: 0.147, pgaHighG: 0.32, shakingDescriptor: "strong" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const intensityPgaWald1999TableLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ instrumentalMMI }) => {
      const mmi = Math.floor(instrumentalMMI);
      const table = {
        1: [0.0017, 0.014, "not felt"],
        2: [0.0017, 0.014, "barely felt"],
        3: [0.014, 0.037, "weak"],
        4: [0.037, 0.069, "light"],
        5: [0.069, 0.147, "moderate"],
        6: [0.147, 0.32, "strong"],
        7: [0.32, 0.68, "very strong"],
        8: [0.68, 1.28, "severe"],
        9: [1.28, 2.4, "violent"],
        10: [2.4, 5.0, "extreme"],
      };
      const row = table[Math.max(1, Math.min(10, mmi)) as keyof typeof table];
      if (!row) simpleError("instrumentalMMI", "Intensity out of range.");
      return { pgaLowG: row[0], pgaHighG: row[1], shakingDescriptor: row[2] };
    })(input as never) as Record<string, unknown>,
  description:
    "Wald et al. (1999) MMI-to-PGA bounds used in ShakeMap ground-motion to intensity conversion.",
  id: "seismology/intensity-pga-wald-1999-table-lookup",
  inputs: [
    {
      minimum: 1,
      maximum: 10,
      description: "Modified Mercalli intensity (may be fractional).",
      id: "instrumentalMMI",
      kind: "number",
      label: "MMI",
    },
  ],
  outputs: [
    {
      description: "Lower PGA bound for this intensity bin.",
      id: "pgaLowG",
      kind: "number",
      label: "PGA lo",
      unit: "g",
    },
    {
      description: "Upper PGA bound.",
      id: "pgaHighG",
      kind: "number",
      label: "PGA hi",
      unit: "g",
    },
    {
      description: "Qualitative shaking.",
      id: "shakingDescriptor",
      kind: "string",
      label: "Descriptor",
    },
  ],
  title: "Intensity PGA Wald 1999 Table Lookup",
});
export const runIntensityPgaWald1999TableLookup =
  intensityPgaWald1999TableLookupTool.execute;
export { intensityPgaWald1999TableLookupExample as example };
export default intensityPgaWald1999TableLookupTool;
