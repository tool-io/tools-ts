import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReflectionCoefficientInput = {
  readonly loadOhms: number;
  readonly sourceOhms: number;
};

export type ReflectionCoefficientOutput = {
  readonly reflectionCoefficient: number;
};

export const reflectionCoefficientExample = {
  input: { loadOhms: 75, sourceOhms: 50 },
  output: { reflectionCoefficient: 0.2 },
} satisfies ToolExample<
  ReflectionCoefficientInput,
  ReflectionCoefficientOutput
>;

export const reflectionCoefficientTool = createSimpleTool({
  calculate: (input) => {
    const { loadOhms, sourceOhms } =
      input as unknown as ReflectionCoefficientInput;
    if (loadOhms <= 0)
      simpleError(
        "loadOhms",
        "Load impedance must be positive.",
        "degenerate_input",
      );
    if (sourceOhms <= 0)
      simpleError(
        "sourceOhms",
        "Source impedance must be positive.",
        "degenerate_input",
      );
    return {
      reflectionCoefficient: (loadOhms - sourceOhms) / (loadOhms + sourceOhms),
    };
  },
  description:
    "Compute the voltage reflection coefficient at the junction of a source and load impedance.",
  id: "electronics/reflection-coefficient",
  inputs: [
    { id: "loadOhms", kind: "number", label: "Load impedance", unit: "ohm" },
    {
      id: "sourceOhms",
      kind: "number",
      label: "Source impedance",
      unit: "ohm",
    },
  ],
  outputs: [
    {
      id: "reflectionCoefficient",
      kind: "number",
      label: "Reflection coefficient",
    },
  ],
  title: "Reflection Coefficient",
});
export const runReflectionCoefficient = reflectionCoefficientTool.execute;
export default reflectionCoefficientTool;
