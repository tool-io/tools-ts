import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CauseDeletedLifeExpectancyGainInput = {
  readonly expectancyCurrentYears: number;
  readonly expectancyCauseDeletedYears: number;
};

export type CauseDeletedLifeExpectancyGainOutput = {
  readonly gainYears: number;
};

export const causeDeletedLifeExpectancyGainExample = {
  input: {
    expectancyCauseDeletedYears: 79.6,
    expectancyCurrentYears: 78.2,
  },
  output: {
    gainYears: 1.3999999999999915,
  },
} satisfies ToolExample<
  CauseDeletedLifeExpectancyGainInput,
  CauseDeletedLifeExpectancyGainOutput
>;

export const calculateCauseDeletedGain = (
  input: CauseDeletedLifeExpectancyGainInput,
): CauseDeletedLifeExpectancyGainOutput => {
  if (
    !Number.isFinite(input.expectancyCurrentYears) ||
    input.expectancyCurrentYears < 0
  )
    simpleError(
      "expectancyCurrentYears",
      "Current life expectancy must be a finite nonnegative number.",
      "invalid_value",
    );
  if (
    !Number.isFinite(input.expectancyCauseDeletedYears) ||
    input.expectancyCauseDeletedYears < 0
  )
    simpleError(
      "expectancyCauseDeletedYears",
      "Cause-deleted life expectancy must be a finite nonnegative number.",
      "invalid_value",
    );
  if (input.expectancyCauseDeletedYears < input.expectancyCurrentYears)
    simpleError(
      "expectancyCauseDeletedYears",
      "Removing a cause of death cannot shorten life expectancy.",
      "invalid_value",
    );
  return {
    gainYears: input.expectancyCauseDeletedYears - input.expectancyCurrentYears,
  };
};

export const causeDeletedLifeExpectancyGainTool = createSimpleTool({
  calculate: (input) =>
    calculateCauseDeletedGain({
      expectancyCauseDeletedYears: input.expectancyCauseDeletedYears as number,
      expectancyCurrentYears: input.expectancyCurrentYears as number,
    }),
  description:
    "Report the life expectancy gained when a competing cause of death is deleted from the life table.",
  id: "sociology/cause-deleted-life-expectancy-gain",
  inputs: [
    {
      description: "Life expectancy with the cause still operating.",
      id: "expectancyCurrentYears",
      kind: "number",
      label: "Current e(x)",
      minimum: 0,
      unit: "yr",
    },
    {
      description: "Life expectancy with the cause removed.",
      id: "expectancyCauseDeletedYears",
      kind: "number",
      label: "Cause-deleted e(x)",
      minimum: 0,
      unit: "yr",
    },
  ],
  outputs: [
    {
      description: "Years of expectancy attributable to the deleted cause.",
      id: "gainYears",
      kind: "number",
      label: "Gain",
      unit: "yr",
    },
  ],
  title: "Cause-Deleted Life Expectancy Gain Calculator",
});
export const runCauseDeletedLifeExpectancyGain =
  causeDeletedLifeExpectancyGainTool.execute;
export default causeDeletedLifeExpectancyGainTool;
