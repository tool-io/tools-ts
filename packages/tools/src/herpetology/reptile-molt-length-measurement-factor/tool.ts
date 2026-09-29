import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shedLength: number;
  readonly stretchFactor: number;
  readonly originalBodyLength: number;
};
export type Output = {
  readonly relaxedShedLength: number;
  readonly shedBodyRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shedLength: { type: "number", minimum: 0 },
    stretchFactor: { type: "number", exclusiveMinimum: 0 },
    originalBodyLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["shedLength", "stretchFactor", "originalBodyLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relaxedShedLength: { type: "number" },
    shedBodyRatio: { type: "number" },
  },
  required: ["relaxedShedLength", "shedBodyRatio"],
} as const;
/** Explicit shed-skin stretch correction, with no universal skin-to-body conversion selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shedLength, stretchFactor, originalBodyLength } = request;
  const compute = (): Output => {
    H.domain(shedLength >= 0);
    H.positive(stretchFactor);
    H.positive(originalBodyLength);
    return {
      relaxedShedLength: shedLength / stretchFactor,
      shedBodyRatio: shedLength / (stretchFactor * originalBodyLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shedLength: 120, stretchFactor: 1.2, originalBodyLength: 100 },
  output: { relaxedShedLength: 100, shedBodyRatio: 1 },
} satisfies ToolExample<Input, Output>;
export const reptileMoltLengthMeasurementFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/reptile-molt-length-measurement-factor",
    title: "Reptile Molt Length Measurement Factor Tool",
    description:
      "Explicit shed-skin stretch correction, with no universal skin-to-body conversion selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shedLength: { type: "number", minimum: 0 },
        stretchFactor: { type: "number", exclusiveMinimum: 0 },
        originalBodyLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["shedLength", "stretchFactor", "originalBodyLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relaxedShedLength: { type: "number" },
        shedBodyRatio: { type: "number" },
      },
      required: ["relaxedShedLength", "shedBodyRatio"],
    },
    ports: {
      inputs: [
        {
          id: "shedLength",
          label: "Shed Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stretchFactor",
          label: "Stretch Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originalBodyLength",
          label: "Original Body Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relaxedShedLength",
          label: "Relaxed Shed Length",
          valueType: { type: "number" },
        },
        {
          id: "shedBodyRatio",
          label: "Shed Body Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reptileMoltLengthMeasurementFactorTool.execute;
export default reptileMoltLengthMeasurementFactorTool;
