import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const normalizedPercentageTool = createSimpleTool({
  id: "arithmetic/normalized-percentage",
  title: "Normalized Percentage Calculator",
  description:
    "Express a value as a percentage of the way from a minimum to a maximum.",
  inputs: [
    { id: "value", label: "Value", kind: "number" },
    { id: "min", label: "Minimum", kind: "number" },
    {
      description: "Must be greater than the minimum.",
      id: "max",
      label: "Maximum",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Relative position between the bounds as a percentage.",
      id: "percent",
      label: "Normalized percent",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const min = input.min as number;
    const max = input.max as number;
    if (max === min)
      simpleError(
        "max",
        "The maximum must differ from the minimum.",
        "invalid_range",
      );
    return {
      percent: (((input.value as number) - min) / (max - min)) * 100,
    };
  },
});
export const runNormalizedPercentage = normalizedPercentageTool.execute;
export default normalizedPercentageTool;

export type NormalizedPercentageInput = {
  readonly value: number;
  readonly min: number;
  readonly max: number;
};

export type NormalizedPercentageOutput = {
  readonly percent: number;
};

export const normalizedPercentageExample = {
  input: {
    value: 1,
    min: 1,
    max: 2,
  },
  output: {
    percent: 0,
  },
} satisfies ToolExample<NormalizedPercentageInput, NormalizedPercentageOutput>;
