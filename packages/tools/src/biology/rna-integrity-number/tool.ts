import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RnaIntegrityNumberInput = {
  readonly area18s: number;
  readonly area28s: number;
};

export type RnaIntegrityNumberOutput = {
  readonly integrityProxy: number;
};

export const rnaIntegrityNumberExample = {
  input: { area18s: 100, area28s: 200 },
  output: { integrityProxy: 6.666666666666666 },
} satisfies ToolExample<RnaIntegrityNumberInput, RnaIntegrityNumberOutput>;

export const rnaIntegrityNumberTool = createSimpleTool({
  id: "biology/rna-integrity-number",
  title: "RIN Proxy",
  description:
    "Estimate an RNA integrity proxy on a one to ten scale from the ratio of 28S to total rRNA peak area.",
  inputs: [
    { id: "area28s", label: "28S peak area", kind: "number" },
    { id: "area18s", label: "18S peak area", kind: "number" },
  ],
  outputs: [{ id: "integrityProxy", label: "Integrity proxy", kind: "number" }],
  calculate: (input) => {
    const area28s = input.area28s as number;
    const area18s = input.area18s as number;
    if (!(area28s > 0) || !(area18s > 0))
      simpleError(
        "area28s",
        "Both peak areas must be greater than zero.",
        "invalid_areas",
      );
    return { integrityProxy: 10 * (area28s / (area28s + area18s)) };
  },
});
export const runRnaIntegrityNumber = rnaIntegrityNumberTool.execute;
export default rnaIntegrityNumberTool;
