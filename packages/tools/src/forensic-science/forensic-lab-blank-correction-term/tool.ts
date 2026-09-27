import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSignal: number;
  readonly blankSignal: number;
  readonly calibrationSlope: number;
  readonly dilution: number;
};
export type Output = {
  readonly correctedSignal: number;
  readonly concentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSignal: { type: "number" },
    blankSignal: { type: "number" },
    calibrationSlope: { type: "number" },
    dilution: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleSignal", "blankSignal", "calibrationSlope", "dilution"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedSignal: { type: "number" },
    concentration: { type: "number" },
  },
  required: ["correctedSignal", "concentration"],
} as const;
/** Single linear blank correction preserving negative results; calibration intercept must already have been handled consistently. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSignal, blankSignal, calibrationSlope, dilution } = request;
  const compute = (): Output => {
    H.domain(calibrationSlope !== 0);
    H.positive(dilution);
    return {
      correctedSignal: sampleSignal - blankSignal,
      concentration:
        ((sampleSignal - blankSignal) * dilution) / calibrationSlope,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleSignal: 25, blankSignal: 5, calibrationSlope: 2, dilution: 3 },
  output: { correctedSignal: 20, concentration: 30 },
} satisfies ToolExample<Input, Output>;
export const forensicLabBlankCorrectionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/forensic-lab-blank-correction-term",
    title: "Forensic Lab Blank Correction Term Tool",
    description:
      "Single linear blank correction preserving negative results; calibration intercept must already have been handled consistently.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSignal: { type: "number" },
        blankSignal: { type: "number" },
        calibrationSlope: { type: "number" },
        dilution: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sampleSignal", "blankSignal", "calibrationSlope", "dilution"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedSignal: { type: "number" },
        concentration: { type: "number" },
      },
      required: ["correctedSignal", "concentration"],
    },
    ports: {
      inputs: [
        {
          id: "sampleSignal",
          label: "Sample Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankSignal",
          label: "Blank Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "calibrationSlope",
          label: "Calibration Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dilution",
          label: "Dilution",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedSignal",
          label: "Corrected Signal",
          valueType: { type: "number" },
        },
        {
          id: "concentration",
          label: "Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = forensicLabBlankCorrectionTermTool.execute;
export default forensicLabBlankCorrectionTermTool;
