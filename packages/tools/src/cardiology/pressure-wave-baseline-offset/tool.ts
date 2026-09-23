import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly samplePressure: number;
  readonly suppliedBaseline: number;
  readonly suppliedReferenceOffset: number;
};
export type Output = {
  readonly baselineCorrected: number;
  readonly referenced: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samplePressure: { type: "number" },
    suppliedBaseline: { type: "number" },
    suppliedReferenceOffset: { type: "number" },
  },
  required: ["samplePressure", "suppliedBaseline", "suppliedReferenceOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineCorrected: { type: "number" },
    referenced: { type: "number" },
  },
  required: ["baselineCorrected", "referenced"],
} as const;
/** Apply supplied research pressure-wave baseline/reference arithmetic without clinical pressure interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { samplePressure, suppliedBaseline, suppliedReferenceOffset } = request;
  const compute = (): Output => {
    return {
      baselineCorrected: samplePressure - suppliedBaseline,
      referenced: samplePressure - suppliedBaseline + suppliedReferenceOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    samplePressure: 100,
    suppliedBaseline: 20,
    suppliedReferenceOffset: 5,
  },
  output: { baselineCorrected: 80, referenced: 85 },
} satisfies ToolExample<Input, Output>;
export const pressureWaveBaselineOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/pressure-wave-baseline-offset",
    title: "Pressure Wave Baseline Offset Tool",
    description:
      "Apply supplied research pressure-wave baseline/reference arithmetic without clinical pressure interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        samplePressure: { type: "number" },
        suppliedBaseline: { type: "number" },
        suppliedReferenceOffset: { type: "number" },
      },
      required: [
        "samplePressure",
        "suppliedBaseline",
        "suppliedReferenceOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineCorrected: { type: "number" },
        referenced: { type: "number" },
      },
      required: ["baselineCorrected", "referenced"],
    },
    ports: {
      inputs: [
        {
          id: "samplePressure",
          label: "Sample Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBaseline",
          label: "Supplied Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceOffset",
          label: "Supplied Reference Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "baselineCorrected",
          label: "Baseline Corrected",
          valueType: { type: "number" },
        },
        {
          id: "referenced",
          label: "Referenced",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pressureWaveBaselineOffsetTool.execute;
export default pressureWaveBaselineOffsetTool;
