import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type YanRequirementInput = {
  readonly brix: number;
  readonly yanMgPerLPerBrix?: number;
};

export type YanRequirementOutput = {
  readonly yanRequirementMgPerL: number;
};

export const yanRequirementExample = {
  input: {
    brix: 21,
  },
  output: {
    yanRequirementMgPerL: 210,
  },
} satisfies ToolExample<YanRequirementInput, YanRequirementOutput>;

export const calculateYanRequirement = (
  input: YanRequirementInput,
): YanRequirementOutput => {
  if (input.brix < 0)
    simpleError("brix", "Brix cannot be negative.", "invalid_value");
  return {
    yanRequirementMgPerL: roundStatistic(
      input.brix * (input.yanMgPerLPerBrix ?? 10),
    ),
  };
};

export const yanRequirementTool = createSimpleTool({
  calculate: (input) =>
    calculateYanRequirement(input as unknown as YanRequirementInput),
  description:
    "Estimate a YAN target from must sugar and a selectable milligrams-per-liter-per-Brix planning factor. Adjust the factor for yeast strain, fermentation rate, and wine style.",
  id: "oenology/yan-requirement",
  inputs: [
    {
      description: "Must dissolved sugar in degrees Brix.",
      id: "brix",
      kind: "number",
      label: "Brix",
      minimum: 0,
    },
    {
      default: 10,
      description:
        "Planning factor supplied by the fermentation protocol or yeast producer.",
      id: "yanMgPerLPerBrix",
      kind: "number",
      label: "YAN factor",
      minimum: 0,
      unit: "mg/L/°Bx",
    },
  ],
  outputs: [
    {
      description: "YAN target for a clean fermentation.",
      id: "yanRequirementMgPerL",
      kind: "number",
      label: "YAN requirement",
      unit: "mg/L",
    },
  ],
  title: "YAN Requirement Calculator",
});
export const runYanRequirement = yanRequirementTool.execute;
export default yanRequirementTool;
