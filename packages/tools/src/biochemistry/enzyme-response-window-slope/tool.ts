import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startResponse: number;
  readonly endResponse: number;
  readonly elapsedTime: number;
  readonly blankSlope: number;
};
export type Output = {
  readonly rawSlope: number;
  readonly correctedSlope: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startResponse: { type: "number" },
    endResponse: { type: "number" },
    elapsedTime: { type: "number", exclusiveMinimum: 0 },
    blankSlope: { type: "number" },
  },
  required: ["startResponse", "endResponse", "elapsedTime", "blankSlope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawSlope: { type: "number" },
    correctedSlope: { type: "number" },
  },
  required: ["rawSlope", "correctedSlope"],
} as const;
/** Calculate a two-point bench response slope with an explicit blank correction, not enzyme kinetics parameters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startResponse, endResponse, elapsedTime, blankSlope } = request;
  const compute = (): Output => {
    H.positive(elapsedTime);
    return {
      rawSlope: (endResponse - startResponse) / elapsedTime,
      correctedSlope: (endResponse - startResponse) / elapsedTime - blankSlope,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startResponse: 2, endResponse: 8, elapsedTime: 3, blankSlope: 0.5 },
  output: { rawSlope: 2, correctedSlope: 1.5 },
} satisfies ToolExample<Input, Output>;
export const enzymeResponseWindowSlopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/enzyme-response-window-slope",
    title: "Enzyme Response Window Slope Tool",
    description:
      "Calculate a two-point bench response slope with an explicit blank correction, not enzyme kinetics parameters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startResponse: { type: "number" },
        endResponse: { type: "number" },
        elapsedTime: { type: "number", exclusiveMinimum: 0 },
        blankSlope: { type: "number" },
      },
      required: ["startResponse", "endResponse", "elapsedTime", "blankSlope"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawSlope: { type: "number" },
        correctedSlope: { type: "number" },
      },
      required: ["rawSlope", "correctedSlope"],
    },
    ports: {
      inputs: [
        {
          id: "startResponse",
          label: "Start Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endResponse",
          label: "End Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedTime",
          label: "Elapsed Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankSlope",
          label: "Blank Slope",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rawSlope", label: "Raw Slope", valueType: { type: "number" } },
        {
          id: "correctedSlope",
          label: "Corrected Slope",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = enzymeResponseWindowSlopeTool.execute;
export default enzymeResponseWindowSlopeTool;
