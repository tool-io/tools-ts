import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStep: number;
  readonly lastStep: number;
  readonly excludedSteps: readonly number[];
};
export type Output = {
  readonly nominalSteps: number;
  readonly usableSteps: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStep: { type: "integer", minimum: 0 },
    lastStep: { type: "integer" },
    excludedSteps: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["firstStep", "lastStep", "excludedSteps"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalSteps: { type: "integer" },
    usableSteps: { type: "integer" },
  },
  required: ["nominalSteps", "usableSteps"],
} as const;
/** Count supplied chart index steps inclusively; no visual acuity conversion or scoring is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStep, lastStep, excludedSteps } = request;
  const compute = (): Output => {
    H.integer(firstStep, 0);
    H.integer(lastStep, firstStep);
    H.domain(excludedSteps.every((x) => x >= firstStep && x <= lastStep));
    return {
      nominalSteps: lastStep - firstStep + 1,
      usableSteps: lastStep - firstStep + 1 - new Set(excludedSteps).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStep: 2, lastStep: 8, excludedSteps: [3, 5, 5] },
  output: { nominalSteps: 7, usableSteps: 5 },
} satisfies ToolExample<Input, Output>;
export const chartAcuityStepBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/chart-acuity-step-budget",
    title: "Chart Acuity Step Budget Tool",
    description:
      "Count supplied chart index steps inclusively; no visual acuity conversion or scoring is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStep: { type: "integer", minimum: 0 },
        lastStep: { type: "integer" },
        excludedSteps: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["firstStep", "lastStep", "excludedSteps"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalSteps: { type: "integer" },
        usableSteps: { type: "integer" },
      },
      required: ["nominalSteps", "usableSteps"],
    },
    ports: {
      inputs: [
        {
          id: "firstStep",
          label: "First Step",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastStep",
          label: "Last Step",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedSteps",
          label: "Excluded Steps",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "nominalSteps",
          label: "Nominal Steps",
          valueType: { type: "integer" },
        },
        {
          id: "usableSteps",
          label: "Usable Steps",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = chartAcuityStepBudgetTool.execute;
export default chartAcuityStepBudgetTool;
