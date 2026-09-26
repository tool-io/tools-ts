import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSignal: number;
  readonly blankSignal: number;
};
export type Output = {
  readonly blankFraction: number;
  readonly correctedSignal: number;
  readonly fractionDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSignal: { type: "number" },
    blankSignal: { type: "number" },
  },
  required: ["sampleSignal", "blankSignal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blankFraction: { type: "number" },
    correctedSignal: { type: "number" },
    fractionDefined: { type: "boolean" },
  },
  required: ["blankFraction", "correctedSignal", "fractionDefined"],
} as const;
/** Audit supplied sample/blank signals while retaining signed correction and zero-domain flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSignal, blankSignal } = request;
  const compute = (): Output => {
    return {
      blankFraction: sampleSignal !== 0 ? blankSignal / sampleSignal : 0,
      correctedSignal: sampleSignal - blankSignal,
      fractionDefined: sampleSignal !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleSignal: 10, blankSignal: 2 },
  output: { blankFraction: 0.2, correctedSignal: 8, fractionDefined: true },
} satisfies ToolExample<Input, Output>;
export const drinkingWaterSamplerBlankShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/drinking-water-sampler-blank-share",
    title: "Drinking Water Sampler Blank Share Tool",
    description:
      "Audit supplied sample/blank signals while retaining signed correction and zero-domain flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSignal: { type: "number" },
        blankSignal: { type: "number" },
      },
      required: ["sampleSignal", "blankSignal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blankFraction: { type: "number" },
        correctedSignal: { type: "number" },
        fractionDefined: { type: "boolean" },
      },
      required: ["blankFraction", "correctedSignal", "fractionDefined"],
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
      ],
      outputs: [
        {
          id: "blankFraction",
          label: "Blank Fraction",
          valueType: { type: "number" },
        },
        {
          id: "correctedSignal",
          label: "Corrected Signal",
          valueType: { type: "number" },
        },
        {
          id: "fractionDefined",
          label: "Fraction Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = drinkingWaterSamplerBlankShareTool.execute;
export default drinkingWaterSamplerBlankShareTool;
