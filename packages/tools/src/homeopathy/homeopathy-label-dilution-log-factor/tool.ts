import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly stages: number; readonly base: number };
export type Output = {
  readonly log10Fraction: number;
  readonly log10Dilution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stages: { type: "integer", minimum: 0 },
    base: { type: "number", exclusiveMinimum: 1 },
  },
  required: ["stages", "base"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    log10Fraction: { type: "number" },
    log10Dilution: { type: "number" },
  },
  required: ["log10Fraction", "log10Dilution"],
} as const;
/** Formal repeated-dilution label arithmetic, independent of any therapeutic claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stages, base } = request;
  const compute = (): Output => {
    H.integer(stages, 0);
    H.domain(base > 1);
    return {
      log10Fraction: -stages * Math.log10(base),
      log10Dilution: stages * Math.log10(base),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stages: 12, base: 100 },
  output: { log10Fraction: -24, log10Dilution: 24 },
} satisfies ToolExample<Input, Output>;
export const homeopathyLabelDilutionLogFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "homeopathy/homeopathy-label-dilution-log-factor",
    title: "Homeopathy Label Dilution Log Factor Tool",
    description:
      "Formal repeated-dilution label arithmetic, independent of any therapeutic claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stages: { type: "integer", minimum: 0 },
        base: { type: "number", exclusiveMinimum: 1 },
      },
      required: ["stages", "base"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        log10Fraction: { type: "number" },
        log10Dilution: { type: "number" },
      },
      required: ["log10Fraction", "log10Dilution"],
    },
    ports: {
      inputs: [
        {
          id: "stages",
          label: "Stages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "base",
          label: "Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "log10Fraction",
          label: "Log10Fraction",
          valueType: { type: "number" },
        },
        {
          id: "log10Dilution",
          label: "Log10Dilution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = homeopathyLabelDilutionLogFactorTool.execute;
export default homeopathyLabelDilutionLogFactorTool;
