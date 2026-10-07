import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleIntegratedSignal: number;
  readonly referenceIntegratedSignal: number;
  readonly sampleAbsorbance: number;
  readonly referenceAbsorbance: number;
  readonly referenceYield: number;
  readonly sampleRefractiveIndex: number;
  readonly referenceRefractiveIndex: number;
};
export type Output = { readonly relativeYield: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleIntegratedSignal: { type: "number", minimum: 0 },
    referenceIntegratedSignal: { type: "number", exclusiveMinimum: 0 },
    sampleAbsorbance: { type: "number", exclusiveMinimum: 0 },
    referenceAbsorbance: { type: "number", exclusiveMinimum: 0 },
    referenceYield: { type: "number", minimum: 0, maximum: 1 },
    sampleRefractiveIndex: { type: "number", exclusiveMinimum: 0 },
    referenceRefractiveIndex: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "sampleIntegratedSignal",
    "referenceIntegratedSignal",
    "sampleAbsorbance",
    "referenceAbsorbance",
    "referenceYield",
    "sampleRefractiveIndex",
    "referenceRefractiveIndex",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeYield: { type: "number" } },
  required: ["relativeYield"],
} as const;
/** Compare fluorescence quantum yield using corrected photon-integrated emission, exact absorbed-light fractions 1-10^(-A), and the refractive-index-squared correction for dilute solutions in comparable optical geometry. Returns an estimate without clamping it to unity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sampleIntegratedSignal,
    referenceIntegratedSignal,
    sampleAbsorbance,
    referenceAbsorbance,
    referenceYield,
    sampleRefractiveIndex,
    referenceRefractiveIndex,
  } = request;
  const compute = (): Output => {
    H.domain(sampleIntegratedSignal >= 0, "sampleIntegratedSignal");
    (H.domain(referenceYield >= 0 && referenceYield <= 1, "referenceYield"),
      referenceYield);
    (H.domain(referenceIntegratedSignal > 0, "referenceIntegratedSignal"),
      referenceIntegratedSignal);
    (H.domain(sampleAbsorbance > 0, "sampleAbsorbance"), sampleAbsorbance);
    (H.domain(referenceAbsorbance > 0, "referenceAbsorbance"),
      referenceAbsorbance);
    (H.domain(sampleRefractiveIndex > 0, "sampleRefractiveIndex"),
      sampleRefractiveIndex);
    (H.domain(referenceRefractiveIndex > 0, "referenceRefractiveIndex"),
      referenceRefractiveIndex);
    return {
      relativeYield:
        referenceYield *
        (sampleIntegratedSignal / referenceIntegratedSignal) *
        (-Math.expm1(-Math.LN10 * referenceAbsorbance) /
          -Math.expm1(-Math.LN10 * sampleAbsorbance)) *
        (sampleRefractiveIndex / referenceRefractiveIndex) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleIntegratedSignal: 80,
    referenceIntegratedSignal: 100,
    sampleAbsorbance: 0.1,
    referenceAbsorbance: 0.1,
    referenceYield: 0.5,
    sampleRefractiveIndex: 1.33,
    referenceRefractiveIndex: 1.33,
  },
  output: { relativeYield: 0.4 },
} satisfies ToolExample<Input, Output>;
export const fluorescenceQuantumYieldReferenceRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biophysics", "physics"],
        keywords: ["biophysics", "physics"],
      },
      id: "biophysics/fluorescence-quantum-yield-reference-ratio",
      title: "Fluorescence Quantum Yield Reference Ratio",
      description:
        "Compare fluorescence quantum yield using corrected photon-integrated emission, exact absorbed-light fractions 1-10^(-A), and the refractive-index-squared correction for dilute solutions in comparable optical geometry. Returns an estimate without clamping it to unity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleIntegratedSignal: { type: "number", minimum: 0 },
          referenceIntegratedSignal: { type: "number", exclusiveMinimum: 0 },
          sampleAbsorbance: { type: "number", exclusiveMinimum: 0 },
          referenceAbsorbance: { type: "number", exclusiveMinimum: 0 },
          referenceYield: { type: "number", minimum: 0, maximum: 1 },
          sampleRefractiveIndex: { type: "number", exclusiveMinimum: 0 },
          referenceRefractiveIndex: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "sampleIntegratedSignal",
          "referenceIntegratedSignal",
          "sampleAbsorbance",
          "referenceAbsorbance",
          "referenceYield",
          "sampleRefractiveIndex",
          "referenceRefractiveIndex",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { relativeYield: { type: "number" } },
        required: ["relativeYield"],
      },
      ports: {
        inputs: [
          {
            id: "sampleIntegratedSignal",
            label: "Sample Integrated Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceIntegratedSignal",
            label: "Reference Integrated Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampleAbsorbance",
            label: "Sample Absorbance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceAbsorbance",
            label: "Reference Absorbance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceYield",
            label: "Reference Yield",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampleRefractiveIndex",
            label: "Sample Refractive Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceRefractiveIndex",
            label: "Reference Refractive Index",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "relativeYield",
            label: "Relative Yield",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fluorescenceQuantumYieldReferenceRatioTool.execute;
export default fluorescenceQuantumYieldReferenceRatioTool;
