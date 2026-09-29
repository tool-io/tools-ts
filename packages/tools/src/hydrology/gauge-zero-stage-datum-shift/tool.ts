import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stage: number;
  readonly oldZero: number;
  readonly newZero: number;
};
export type Output = {
  readonly waterElevation: number;
  readonly shiftedStage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stage: { type: "number" },
    oldZero: { type: "number" },
    newZero: { type: "number" },
  },
  required: ["stage", "oldZero", "newZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterElevation: { type: "number" },
    shiftedStage: { type: "number" },
  },
  required: ["waterElevation", "shiftedStage"],
} as const;
/** Staff stage relative to an explicit gauge-zero elevation, shifted without changing physical water elevation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stage, oldZero, newZero } = request;
  const compute = (): Output => {
    return {
      waterElevation: stage + oldZero,
      shiftedStage: stage + oldZero - newZero,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stage: 2.5, oldZero: 100, newZero: 101 },
  output: { waterElevation: 102.5, shiftedStage: 1.5 },
} satisfies ToolExample<Input, Output>;
export const gaugeZeroStageDatumShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/gauge-zero-stage-datum-shift",
    title: "Gauge Zero Stage Datum Shift Tool",
    description:
      "Staff stage relative to an explicit gauge-zero elevation, shifted without changing physical water elevation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stage: { type: "number" },
        oldZero: { type: "number" },
        newZero: { type: "number" },
      },
      required: ["stage", "oldZero", "newZero"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterElevation: { type: "number" },
        shiftedStage: { type: "number" },
      },
      required: ["waterElevation", "shiftedStage"],
    },
    ports: {
      inputs: [
        {
          id: "stage",
          label: "Stage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldZero",
          label: "Old Zero",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newZero",
          label: "New Zero",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waterElevation",
          label: "Water Elevation",
          valueType: { type: "number" },
        },
        {
          id: "shiftedStage",
          label: "Shifted Stage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaugeZeroStageDatumShiftTool.execute;
export default gaugeZeroStageDatumShiftTool;
