import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SternVolmerQuenchingInput = {
  readonly ksv: number;
  readonly quencherM: number;
};

export type SternVolmerQuenchingOutput = {
  readonly sternVolmerRatio: number;
};

export const sternVolmerQuenchingExample = {
  input: { ksv: 200, quencherM: 0.002 },
  output: { sternVolmerRatio: 1.4 },
} satisfies ToolExample<SternVolmerQuenchingInput, SternVolmerQuenchingOutput>;

export const sternVolmerQuenchingTool = createSimpleTool({
  id: "chemistry/stern-volmer-quenching",
  title: "Stern-Volmer Ratio",
  description:
    "Compute the Stern-Volmer ratio F0/F as one plus the Stern-Volmer constant times the quencher concentration.",
  inputs: [
    { id: "ksv", label: "Stern-Volmer constant", kind: "number", unit: "1/M" },
    {
      id: "quencherM",
      label: "Quencher concentration",
      kind: "number",
      minimum: 0,
      unit: "M",
    },
  ],
  outputs: [
    { id: "sternVolmerRatio", label: "Stern-Volmer ratio", kind: "number" },
  ],
  calculate: (input) => {
    const ksv = input.ksv as number;
    if (ksv < 0)
      simpleError(
        "ksv",
        "Stern-Volmer constant cannot be negative.",
        "invalid_ksv",
      );
    return { sternVolmerRatio: 1 + ksv * (input.quencherM as number) };
  },
});
export const runSternVolmerQuenching = sternVolmerQuenchingTool.execute;
export default sternVolmerQuenchingTool;
