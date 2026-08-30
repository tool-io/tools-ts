import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VariablesSamplingSelectorInput = {
  readonly differenceExpected: boolean;
  readonly hasReliableBookValue: boolean;
  readonly hasReliableExpectedValue: boolean;
  readonly populationHomogeneous: boolean;
  readonly varianceHigh: boolean;
};

export type VariablesSamplingSelectorOutput = {
  readonly method:
    "judgment_required" | "mean_difference" | "not_supported" | "ratio";
  readonly supported: boolean;
};

export const selectVariablesSamplingMethod = (
  input: VariablesSamplingSelectorInput,
): VariablesSamplingSelectorOutput => {
  for (const field of [
    "differenceExpected",
    "hasReliableBookValue",
    "hasReliableExpectedValue",
    "populationHomogeneous",
    "varianceHigh",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (!input.hasReliableBookValue || !input.hasReliableExpectedValue)
    return { method: "not_supported", supported: false };
  if (input.populationHomogeneous && input.differenceExpected)
    return { method: "mean_difference", supported: true };
  if (!input.populationHomogeneous && !input.differenceExpected)
    return { method: "ratio", supported: true };
  return { method: "judgment_required", supported: true };
};

export const variablesSamplingSelectorExample = {
  input: {
    differenceExpected: true,
    hasReliableBookValue: true,
    hasReliableExpectedValue: true,
    populationHomogeneous: true,
    varianceHigh: true,
  },
  output: { method: "mean_difference", supported: true },
} satisfies ToolExample<
  VariablesSamplingSelectorInput,
  VariablesSamplingSelectorOutput
>;

export const variablesSamplingSelectorTool = createSimpleTool({
  calculate: (input) =>
    selectVariablesSamplingMethod({
      differenceExpected: input.differenceExpected as boolean,
      hasReliableBookValue: input.hasReliableBookValue as boolean,
      hasReliableExpectedValue: input.hasReliableExpectedValue as boolean,
      populationHomogeneous: input.populationHomogeneous as boolean,
      varianceHigh: input.varianceHigh as boolean,
    }),
  description:
    "Recommend mean-difference, ratio, further judgment, or no support for variables sampling from supplied reliability, homogeneity, and difference expectations.",
  id: "auditing/variables-sampling-mean-difference-ratio-selector-lookup",
  inputs: [
    { id: "differenceExpected", kind: "boolean", label: "Difference expected" },
    {
      id: "hasReliableBookValue",
      kind: "boolean",
      label: "Reliable book value",
    },
    {
      id: "hasReliableExpectedValue",
      kind: "boolean",
      label: "Reliable expected value",
    },
    {
      id: "populationHomogeneous",
      kind: "boolean",
      label: "Population homogeneous",
    },
    { id: "varianceHigh", kind: "boolean", label: "Variance high" },
  ],
  outputs: [
    {
      enum: ["judgment_required", "mean_difference", "not_supported", "ratio"],
      id: "method",
      kind: "string",
      label: "Sampling method",
    },
    { id: "supported", kind: "boolean", label: "Selection supported" },
  ],
  title: "Variables Sampling Mean Difference Ratio Selector Lookup",
});

export const runVariablesSamplingSelector =
  variablesSamplingSelectorTool.execute;
export default variablesSamplingSelectorTool;
