import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly endDiastolicVolume: number;
  readonly endSystolicVolume: number;
  readonly regurgitantVolume: number;
  readonly shuntLoss: number;
};
export type Output = {
  readonly totalStrokeVolume: number;
  readonly forwardVolume: number;
  readonly forwardFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endDiastolicVolume: { type: "number" },
    endSystolicVolume: { type: "number", minimum: 0 },
    regurgitantVolume: { type: "number", minimum: 0 },
    shuntLoss: { type: "number", minimum: 0 },
  },
  required: [
    "endDiastolicVolume",
    "endSystolicVolume",
    "regurgitantVolume",
    "shuntLoss",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalStrokeVolume: { type: "number" },
    forwardVolume: { type: "number" },
    forwardFraction: { type: "number" },
  },
  required: ["totalStrokeVolume", "forwardVolume", "forwardFraction"],
} as const;
/** Explicit research stroke-volume outflow ledger; negative forward volume remains an input-consistency signal, without diagnostic interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    endDiastolicVolume,
    endSystolicVolume,
    regurgitantVolume,
    shuntLoss,
  } = request;
  const compute = (): Output => {
    H.domain(
      endDiastolicVolume > endSystolicVolume &&
        endSystolicVolume >= 0 &&
        regurgitantVolume >= 0 &&
        shuntLoss >= 0,
    );
    return {
      totalStrokeVolume: endDiastolicVolume - endSystolicVolume,
      forwardVolume:
        endDiastolicVolume - endSystolicVolume - regurgitantVolume - shuntLoss,
      forwardFraction:
        (endDiastolicVolume -
          endSystolicVolume -
          regurgitantVolume -
          shuntLoss) /
        (endDiastolicVolume - endSystolicVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    endDiastolicVolume: 120,
    endSystolicVolume: 50,
    regurgitantVolume: 10,
    shuntLoss: 5,
  },
  output: {
    totalStrokeVolume: 70,
    forwardVolume: 55,
    forwardFraction: 0.7857142857142857,
  },
} satisfies ToolExample<Input, Output>;
export const cardiacResearchStrokeVolumeBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/cardiac-research-stroke-volume-balance",
    title: "Cardiac Research Stroke Volume Balance Tool",
    description:
      "Explicit research stroke-volume outflow ledger; negative forward volume remains an input-consistency signal, without diagnostic interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endDiastolicVolume: { type: "number" },
        endSystolicVolume: { type: "number", minimum: 0 },
        regurgitantVolume: { type: "number", minimum: 0 },
        shuntLoss: { type: "number", minimum: 0 },
      },
      required: [
        "endDiastolicVolume",
        "endSystolicVolume",
        "regurgitantVolume",
        "shuntLoss",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalStrokeVolume: { type: "number" },
        forwardVolume: { type: "number" },
        forwardFraction: { type: "number" },
      },
      required: ["totalStrokeVolume", "forwardVolume", "forwardFraction"],
    },
    ports: {
      inputs: [
        {
          id: "endDiastolicVolume",
          label: "End Diastolic Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endSystolicVolume",
          label: "End Systolic Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "regurgitantVolume",
          label: "Regurgitant Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shuntLoss",
          label: "Shunt Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalStrokeVolume",
          label: "Total Stroke Volume",
          valueType: { type: "number" },
        },
        {
          id: "forwardVolume",
          label: "Forward Volume",
          valueType: { type: "number" },
        },
        {
          id: "forwardFraction",
          label: "Forward Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cardiacResearchStrokeVolumeBalanceTool.execute;
export default cardiacResearchStrokeVolumeBalanceTool;
