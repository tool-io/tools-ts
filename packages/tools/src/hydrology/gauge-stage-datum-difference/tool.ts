import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStage: number;
  readonly firstDatum: number;
  readonly secondStage: number;
  readonly secondDatum: number;
};
export type Output = {
  readonly firstElevation: number;
  readonly secondElevation: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStage: { type: "number" },
    firstDatum: { type: "number" },
    secondStage: { type: "number" },
    secondDatum: { type: "number" },
  },
  required: ["firstStage", "firstDatum", "secondStage", "secondDatum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstElevation: { type: "number" },
    secondElevation: { type: "number" },
    difference: { type: "number" },
  },
  required: ["firstElevation", "secondElevation", "difference"],
} as const;
/** Compare gauge elevations after translating both supplied stage/datum pairs into one reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStage, firstDatum, secondStage, secondDatum } = request;
  const compute = (): Output => {
    return {
      firstElevation: firstStage + firstDatum,
      secondElevation: secondStage + secondDatum,
      difference: secondStage + secondDatum - firstStage - firstDatum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStage: 3, firstDatum: 100, secondStage: 5, secondDatum: 98 },
  output: { firstElevation: 103, secondElevation: 103, difference: 0 },
} satisfies ToolExample<Input, Output>;
export const gaugeStageDatumDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/gauge-stage-datum-difference",
    title: "Gauge Stage Datum Difference Tool",
    description:
      "Compare gauge elevations after translating both supplied stage/datum pairs into one reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStage: { type: "number" },
        firstDatum: { type: "number" },
        secondStage: { type: "number" },
        secondDatum: { type: "number" },
      },
      required: ["firstStage", "firstDatum", "secondStage", "secondDatum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstElevation: { type: "number" },
        secondElevation: { type: "number" },
        difference: { type: "number" },
      },
      required: ["firstElevation", "secondElevation", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "firstStage",
          label: "First Stage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstDatum",
          label: "First Datum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStage",
          label: "Second Stage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDatum",
          label: "Second Datum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstElevation",
          label: "First Elevation",
          valueType: { type: "number" },
        },
        {
          id: "secondElevation",
          label: "Second Elevation",
          valueType: { type: "number" },
        },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaugeStageDatumDifferenceTool.execute;
export default gaugeStageDatumDifferenceTool;
