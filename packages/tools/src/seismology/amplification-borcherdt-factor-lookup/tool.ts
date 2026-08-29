import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const amplificationBorcherdtFactorLookupExample = {
  input: { siteClass: "D" },
  output: { amplificationFactor: 1.6 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const amplificationBorcherdtFactorLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ siteClass }) => {
      const fa = { A: 0.8, B: 1.0, C: 1.2, D: 1.6, E: 2.4 }[siteClass];
      if (fa === undefined) simpleError("siteClass", "Unknown NEHRP class.");
      return { amplificationFactor: fa };
    })(input as never) as Record<string, unknown>,
  description:
    "Borcherdt-style short-period amplification factor from NEHRP class.",
  id: "seismology/amplification-borcherdt-factor-lookup",
  inputs: [
    {
      description: "NEHRP site class letter.",
      id: "siteClass",
      kind: "string",
      label: "Class",
    },
  ],
  outputs: [
    {
      description: "Short-period site amplification factor.",
      id: "amplificationFactor",
      kind: "number",
      label: "F_a",
    },
  ],
  title: "Amplification Borcherdt Factor Lookup",
});
export const runAmplificationBorcherdtFactorLookup =
  amplificationBorcherdtFactorLookupTool.execute;
export { amplificationBorcherdtFactorLookupExample as example };
export default amplificationBorcherdtFactorLookupTool;
