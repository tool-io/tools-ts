import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

// Shannon effective ionic radii for six-coordinate ions, in picometres.
const OCTAHEDRAL_RADII_PM: Readonly<Record<string, number>> = {
  "al3+": 53.5,
  "ca2+": 100,
  "cl-": 181,
  "f-": 133,
  "k+": 138,
  "li+": 76,
  "mg2+": 72,
  "na+": 102,
  "o2-": 140,
};

export const ionicRadiusLookupTool = createSimpleTool({
  id: "chemistry/ionic-radius-lookup",
  title: "Ionic Radius Lookup",
  description:
    "Look up a Shannon effective ionic radius for a common six-coordinate ion; ionic radius depends on oxidation state and coordination number.",
  inputs: [
    {
      description: "Ion formula including charge, such as Na+, Mg2+, or Cl-.",
      id: "ion",
      kind: "string",
      label: "Ion",
    },
  ],
  outputs: [
    {
      description: "Effective ionic radius for coordination number 6.",
      id: "ionicRadiusPm",
      kind: "number",
      label: "Ionic radius",
      unit: "pm",
    },
  ],
  calculate: (input) => {
    const key = String(input.ion)
      .trim()
      .toLowerCase()
      .replace(/\s+/gu, "")
      .replace(/−/gu, "-");
    const ionicRadiusPm = OCTAHEDRAL_RADII_PM[key];
    if (ionicRadiusPm === undefined)
      simpleError(
        "ion",
        "No six-coordinate radius is available for that ion.",
        "not_found",
      );
    return { ionicRadiusPm };
  },
});
export default ionicRadiusLookupTool;
export const runIonicRadiusLookup = ionicRadiusLookupTool.execute;

export type IonicRadiusLookupInput = { readonly ion: string };
export type IonicRadiusLookupOutput = { readonly ionicRadiusPm: number };

export const ionicRadiusLookupExample = {
  input: { ion: "Na+" },
  output: { ionicRadiusPm: 102 },
} satisfies ToolExample<IonicRadiusLookupInput, IonicRadiusLookupOutput>;
