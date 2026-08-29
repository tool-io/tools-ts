import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const SpontaneityCheckerTool = createSimpleTool({
  id: "chemistry/spontaneity-checker",
  title: "Spontaneity Checker",
  description: "Classify reaction spontaneity from sign of dG.",
  inputs: [
    { id: "deltaGKJPerMol", label: "dG", kind: "number", unit: "kJ/mol" },
  ],
  outputs: [{ id: "classification", label: "Classification", kind: "string" }],
  calculate: (input) => {
    const dg = input.deltaGKJPerMol as number;
    return {
      classification:
        dg < 0 ? "spontaneous" : dg > 0 ? "non-spontaneous" : "at equilibrium",
    };
  },
});
export default SpontaneityCheckerTool;
export const runSpontaneityChecker = SpontaneityCheckerTool.execute;

export type SpontaneityCheckerInput = {
  readonly deltaGKJPerMol: number;
};

export type SpontaneityCheckerOutput = {
  readonly classification: string;
};

export const spontaneityCheckerExample = {
  input: {
    deltaGKJPerMol: 1,
  },
  output: {
    classification: "non-spontaneous",
  },
} satisfies ToolExample<SpontaneityCheckerInput, SpontaneityCheckerOutput>;
