import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QpcrQuantificationInput = {
  readonly lengthBp: number;
  readonly massNg: number;
};

export type QpcrQuantificationOutput = {
  readonly moleculeCount: number;
};

export const qpcrQuantificationExample = {
  input: { lengthBp: 500, massNg: 50 },
  output: { moleculeCount: 92646153846.15385 },
} satisfies ToolExample<QpcrQuantificationInput, QpcrQuantificationOutput>;

export const qpcrQuantificationTool = createSimpleTool({
  id: "biology/qpcr-quantification",
  title: "qPCR Copy Number",
  description:
    "Convert a double-stranded DNA mass in nanograms to molecule count using length and the mean base pair mass of 650 daltons.",
  inputs: [
    { id: "massNg", label: "DNA mass", kind: "number", unit: "ng" },
    { id: "lengthBp", label: "Template length", kind: "integer", unit: "bp" },
  ],
  outputs: [{ id: "moleculeCount", label: "Molecule count", kind: "number" }],
  calculate: (input) => {
    const massNg = input.massNg as number;
    const lengthBp = input.lengthBp as number;
    if (!(massNg > 0))
      simpleError("massNg", "Mass must be greater than zero.", "invalid_mass");
    if (!(lengthBp > 0))
      simpleError(
        "lengthBp",
        "Length must be greater than zero.",
        "invalid_length",
      );
    return { moleculeCount: (massNg * 6.022e23) / (lengthBp * 650 * 1e9) };
  },
});
export const runQpcrQuantification = qpcrQuantificationTool.execute;
export default qpcrQuantificationTool;
