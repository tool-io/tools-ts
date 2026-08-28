import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReturnLossInput = {
  readonly reflectionCoefficient: number;
};

export type ReturnLossOutput = {
  readonly returnLossDb: number;
};

export const returnLossExample = {
  input: { reflectionCoefficient: 0.2 },
  output: { returnLossDb: 13.979400086720375 },
} satisfies ToolExample<ReturnLossInput, ReturnLossOutput>;

export const returnLossTool = createSimpleTool({
  calculate: (input) => {
    const { reflectionCoefficient } = input as unknown as ReturnLossInput;
    if (reflectionCoefficient === 0)
      simpleError(
        "reflectionCoefficient",
        "Reflection coefficient must be nonzero.",
        "degenerate_input",
      );
    return {
      returnLossDb: -20 * Math.log10(Math.abs(reflectionCoefficient)),
    };
  },
  description:
    "Compute the return loss in decibels from a reflection coefficient magnitude.",
  id: "electronics/return-loss",
  inputs: [
    {
      id: "reflectionCoefficient",
      kind: "number",
      label: "Reflection coefficient",
    },
  ],
  outputs: [
    { id: "returnLossDb", kind: "number", label: "Return loss", unit: "dB" },
  ],
  title: "Return Loss dB",
});
export const runReturnLoss = returnLossTool.execute;
export default returnLossTool;
