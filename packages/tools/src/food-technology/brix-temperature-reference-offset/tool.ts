import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedBrix: number;
  readonly measuredTemperature: number;
  readonly referenceTemperature: number;
  readonly suppliedSlope: number;
};
export type Output = {
  readonly correction: number;
  readonly correctedBrix: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedBrix: { type: "number" },
    measuredTemperature: { type: "number" },
    referenceTemperature: { type: "number" },
    suppliedSlope: { type: "number" },
  },
  required: [
    "recordedBrix",
    "measuredTemperature",
    "referenceTemperature",
    "suppliedSlope",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correction: { type: "number" },
    correctedBrix: { type: "number" },
  },
  required: ["correction", "correctedBrix"],
} as const;
/** Apply a caller-supplied linear local temperature calibration; not a standard Brix correction table or composition assay. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordedBrix,
    measuredTemperature,
    referenceTemperature,
    suppliedSlope,
  } = request;
  const compute = (): Output => {
    return {
      correction: suppliedSlope * (referenceTemperature - measuredTemperature),
      correctedBrix:
        recordedBrix +
        suppliedSlope * (referenceTemperature - measuredTemperature),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedBrix: 10,
    measuredTemperature: 25,
    referenceTemperature: 20,
    suppliedSlope: 0.1,
  },
  output: { correction: -0.5, correctedBrix: 9.5 },
} satisfies ToolExample<Input, Output>;
export const brixTemperatureReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/brix-temperature-reference-offset",
    title: "Brix Temperature Reference Offset Tool",
    description:
      "Apply a caller-supplied linear local temperature calibration; not a standard Brix correction table or composition assay.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedBrix: { type: "number" },
        measuredTemperature: { type: "number" },
        referenceTemperature: { type: "number" },
        suppliedSlope: { type: "number" },
      },
      required: [
        "recordedBrix",
        "measuredTemperature",
        "referenceTemperature",
        "suppliedSlope",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correction: { type: "number" },
        correctedBrix: { type: "number" },
      },
      required: ["correction", "correctedBrix"],
    },
    ports: {
      inputs: [
        {
          id: "recordedBrix",
          label: "Recorded Brix",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredTemperature",
          label: "Measured Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceTemperature",
          label: "Reference Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSlope",
          label: "Supplied Slope",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correction",
          label: "Correction",
          valueType: { type: "number" },
        },
        {
          id: "correctedBrix",
          label: "Corrected Brix",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = brixTemperatureReferenceOffsetTool.execute;
export default brixTemperatureReferenceOffsetTool;
