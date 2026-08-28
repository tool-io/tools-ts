import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VswrFromReflectionInput = {
  readonly reflectionCoefficient: number;
};

export type VswrFromReflectionOutput = {
  readonly vswr: number;
};

export const vswrFromReflectionExample = {
  input: { reflectionCoefficient: 0.2 },
  output: { vswr: 1.4999999999999998 },
} satisfies ToolExample<VswrFromReflectionInput, VswrFromReflectionOutput>;

export const vswrFromReflectionTool = createSimpleTool({
  calculate: (input) => {
    const { reflectionCoefficient } =
      input as unknown as VswrFromReflectionInput;
    const magnitude = Math.abs(reflectionCoefficient);
    if (magnitude >= 1)
      simpleError(
        "reflectionCoefficient",
        "Reflection coefficient magnitude must be below 1.",
        "invalid_reflection",
      );
    return { vswr: (1 + magnitude) / (1 - magnitude) };
  },
  description:
    "Compute the voltage standing wave ratio from a reflection coefficient magnitude.",
  id: "electronics/vswr-from-reflection",
  inputs: [
    {
      id: "reflectionCoefficient",
      kind: "number",
      label: "Reflection coefficient",
    },
  ],
  outputs: [{ id: "vswr", kind: "number", label: "VSWR" }],
  title: "VSWR From Gamma",
});
export const runVswrFromReflection = vswrFromReflectionTool.execute;
export default vswrFromReflectionTool;
