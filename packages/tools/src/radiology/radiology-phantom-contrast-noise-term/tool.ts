import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMean: number;
  readonly secondMean: number;
  readonly noiseSd: number;
};
export type Output = {
  readonly contrast: number;
  readonly cnr: number;
  readonly signedCnr: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMean: { type: "number" },
    secondMean: { type: "number" },
    noiseSd: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstMean", "secondMean", "noiseSd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contrast: { type: "number" },
    cnr: { type: "number" },
    signedCnr: { type: "number" },
  },
  required: ["contrast", "cnr", "signedCnr"],
} as const;
/** Phantom CNR using an explicitly supplied common noise standard deviation; no modality-dependent noise estimator or quality threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstMean, secondMean, noiseSd } = request;
  const compute = (): Output => {
    H.positive(noiseSd);
    return {
      contrast: firstMean - secondMean,
      cnr: Math.abs(firstMean - secondMean) / noiseSd,
      signedCnr: (firstMean - secondMean) / noiseSd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstMean: 120, secondMean: 100, noiseSd: 5 },
  output: { contrast: 20, cnr: 4, signedCnr: 4 },
} satisfies ToolExample<Input, Output>;
export const radiologyPhantomContrastNoiseTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/radiology-phantom-contrast-noise-term",
    title: "Radiology Phantom Contrast Noise Term Tool",
    description:
      "Phantom CNR using an explicitly supplied common noise standard deviation; no modality-dependent noise estimator or quality threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMean: { type: "number" },
        secondMean: { type: "number" },
        noiseSd: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstMean", "secondMean", "noiseSd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contrast: { type: "number" },
        cnr: { type: "number" },
        signedCnr: { type: "number" },
      },
      required: ["contrast", "cnr", "signedCnr"],
    },
    ports: {
      inputs: [
        {
          id: "firstMean",
          label: "First Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMean",
          label: "Second Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "noiseSd",
          label: "Noise Sd",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "contrast", label: "Contrast", valueType: { type: "number" } },
        { id: "cnr", label: "Cnr", valueType: { type: "number" } },
        { id: "signedCnr", label: "Signed Cnr", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = radiologyPhantomContrastNoiseTermTool.execute;
export default radiologyPhantomContrastNoiseTermTool;
