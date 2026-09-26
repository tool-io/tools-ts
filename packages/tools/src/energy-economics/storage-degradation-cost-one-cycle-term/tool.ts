import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly replacementCost: number;
  readonly residualValue: number;
  readonly lifetimeCycles: number;
  readonly dischargedMwhPerCycle: number;
};
export type Output = {
  readonly costPerCycle: number;
  readonly costPerMwh: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    replacementCost: { type: "number", minimum: 0 },
    residualValue: { type: "number", minimum: 0 },
    lifetimeCycles: { type: "number", exclusiveMinimum: 0 },
    dischargedMwhPerCycle: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "replacementCost",
    "residualValue",
    "lifetimeCycles",
    "dischargedMwhPerCycle",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    costPerCycle: { type: "number" },
    costPerMwh: { type: "number" },
  },
  required: ["costPerCycle", "costPerMwh"],
} as const;
/** Straight-line allocation across caller-supplied equivalent full cycles, excluding calendar ageing and discounting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    replacementCost,
    residualValue,
    lifetimeCycles,
    dischargedMwhPerCycle,
  } = request;
  const compute = (): Output => {
    H.domain(
      replacementCost >= 0 &&
        residualValue >= 0 &&
        residualValue <= replacementCost,
    );
    H.positive(lifetimeCycles);
    H.positive(dischargedMwhPerCycle);
    return {
      costPerCycle: (replacementCost - residualValue) / lifetimeCycles,
      costPerMwh:
        (replacementCost - residualValue) /
        (lifetimeCycles * dischargedMwhPerCycle),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    replacementCost: 120000,
    residualValue: 20000,
    lifetimeCycles: 5000,
    dischargedMwhPerCycle: 2,
  },
  output: { costPerCycle: 20, costPerMwh: 10 },
} satisfies ToolExample<Input, Output>;
export const storageDegradationCostOneCycleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/storage-degradation-cost-one-cycle-term",
    title: "Storage Degradation Cost One Cycle Term Tool",
    description:
      "Straight-line allocation across caller-supplied equivalent full cycles, excluding calendar ageing and discounting.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        replacementCost: { type: "number", minimum: 0 },
        residualValue: { type: "number", minimum: 0 },
        lifetimeCycles: { type: "number", exclusiveMinimum: 0 },
        dischargedMwhPerCycle: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "replacementCost",
        "residualValue",
        "lifetimeCycles",
        "dischargedMwhPerCycle",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        costPerCycle: { type: "number" },
        costPerMwh: { type: "number" },
      },
      required: ["costPerCycle", "costPerMwh"],
    },
    ports: {
      inputs: [
        {
          id: "replacementCost",
          label: "Replacement Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "residualValue",
          label: "Residual Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lifetimeCycles",
          label: "Lifetime Cycles",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dischargedMwhPerCycle",
          label: "Discharged Mwh Per Cycle",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "costPerCycle",
          label: "Cost Per Cycle",
          valueType: { type: "number" },
        },
        {
          id: "costPerMwh",
          label: "Cost Per Mwh",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = storageDegradationCostOneCycleTermTool.execute;
export default storageDegradationCostOneCycleTermTool;
