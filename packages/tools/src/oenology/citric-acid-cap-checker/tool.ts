import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type CitricAcidCapCheckerInput = {
  readonly additionGramsPerLiter: number;
  readonly capGramsPerLiter: number;
};

export type CitricAcidCapCheckerOutput = {
  readonly excessGramsPerLiter: number;
  readonly withinCap: boolean;
};

export const citricAcidCapCheckerExample = {
  input: {
    additionGramsPerLiter: 0.6,
    capGramsPerLiter: 0.5,
  },
  output: {
    excessGramsPerLiter: 0.1,
    withinCap: false,
  },
} satisfies ToolExample<CitricAcidCapCheckerInput, CitricAcidCapCheckerOutput>;

export const calculateCitricAcidCap = (
  input: CitricAcidCapCheckerInput,
): CitricAcidCapCheckerOutput => {
  return {
    excessGramsPerLiter: roundStatistic(
      Math.max(0, input.additionGramsPerLiter - input.capGramsPerLiter),
    ),
    withinCap: input.additionGramsPerLiter <= input.capGramsPerLiter,
  };
};

export const citricAcidCapCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateCitricAcidCap(input as unknown as CitricAcidCapCheckerInput),
  description:
    "Compare a proposed citric-acid addition with a caller-supplied cellar or regulatory cap and report the amount over that limit.",
  id: "oenology/citric-acid-cap-checker",
  inputs: [
    {
      description: "Proposed citric acid dose.",
      id: "additionGramsPerLiter",
      kind: "number",
      label: "Proposed dose",
      minimum: 0,
      unit: "g/L",
    },
    {
      description: "Maximum dose under the applicable specification.",
      id: "capGramsPerLiter",
      kind: "number",
      label: "Dose cap",
      minimum: 0,
      unit: "g/L",
    },
  ],
  outputs: [
    {
      description: "Amount by which the proposal exceeds the cap, if any.",
      id: "excessGramsPerLiter",
      kind: "number",
      label: "Excess over cap",
      unit: "g/L",
    },
    {
      description: "Whether the proposed dose is at or below the cap.",
      id: "withinCap",
      kind: "boolean",
      label: "Within cap",
    },
  ],
  title: "Citric Acid Addition Cap Checker",
});
export const runCitricAcidCapChecker = citricAcidCapCheckerTool.execute;
export default citricAcidCapCheckerTool;
