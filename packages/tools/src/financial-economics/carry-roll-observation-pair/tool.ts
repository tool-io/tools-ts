import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingMarkedValue: number;
  readonly endingUnchangedCurveValue: number;
  readonly accruedCash: number;
};
export type Output = {
  readonly rollValueChange: number;
  readonly carryAndRoll: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingMarkedValue: { type: "number" },
    endingUnchangedCurveValue: { type: "number" },
    accruedCash: { type: "number" },
  },
  required: ["openingMarkedValue", "endingUnchangedCurveValue", "accruedCash"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rollValueChange: { type: "number" },
    carryAndRoll: { type: "number" },
  },
  required: ["rollValueChange", "carryAndRoll"],
} as const;
/** Reconcile explicit constant-curve mark and accrued-cash inputs without projecting a market curve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingMarkedValue, endingUnchangedCurveValue, accruedCash } =
    request;
  const compute = (): Output => {
    return {
      rollValueChange: endingUnchangedCurveValue - openingMarkedValue,
      carryAndRoll:
        endingUnchangedCurveValue - openingMarkedValue + accruedCash,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingMarkedValue: 100,
    endingUnchangedCurveValue: 99.5,
    accruedCash: 1.2,
  },
  output: { rollValueChange: -0.5, carryAndRoll: 0.7 },
} satisfies ToolExample<Input, Output>;
export const carryRollObservationPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: ["financial-economics", "financial economics", "economics"],
      keywords: ["financial economics", "economics"],
    },
    id: "financial-economics/carry-roll-observation-pair",
    title: "Carry Roll Observation Pair",
    description:
      "Reconcile explicit constant-curve mark and accrued-cash inputs without projecting a market curve.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingMarkedValue: { type: "number" },
        endingUnchangedCurveValue: { type: "number" },
        accruedCash: { type: "number" },
      },
      required: [
        "openingMarkedValue",
        "endingUnchangedCurveValue",
        "accruedCash",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rollValueChange: { type: "number" },
        carryAndRoll: { type: "number" },
      },
      required: ["rollValueChange", "carryAndRoll"],
    },
    ports: {
      inputs: [
        {
          id: "openingMarkedValue",
          label: "Opening Marked Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endingUnchangedCurveValue",
          label: "Ending Unchanged Curve Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "accruedCash",
          label: "Accrued Cash",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rollValueChange",
          label: "Roll Value Change",
          valueType: { type: "number" },
        },
        {
          id: "carryAndRoll",
          label: "Carry And Roll",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = carryRollObservationPairTool.execute;
export default carryRollObservationPairTool;
