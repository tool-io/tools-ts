import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseSpeciesAmount: number;
  readonly acidSpeciesAmount: number;
};
export type Output = {
  readonly baseToAcidRatio: number;
  readonly log10Ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseSpeciesAmount: { type: "number", exclusiveMinimum: 0 },
    acidSpeciesAmount: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["baseSpeciesAmount", "acidSpeciesAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseToAcidRatio: { type: "number" },
    log10Ratio: { type: "number" },
  },
  required: ["baseToAcidRatio", "log10Ratio"],
} as const;
/** Describe an explicit conjugate-base/acid amount ratio and its common logarithm without choosing a pKa or prescribing buffer preparation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseSpeciesAmount, acidSpeciesAmount } = request;
  const compute = (): Output => {
    (H.domain(baseSpeciesAmount > 0, "baseSpeciesAmount"), baseSpeciesAmount);
    (H.domain(acidSpeciesAmount > 0, "acidSpeciesAmount"), acidSpeciesAmount);
    return {
      baseToAcidRatio: baseSpeciesAmount / acidSpeciesAmount,
      log10Ratio: Math.log10(baseSpeciesAmount) - Math.log10(acidSpeciesAmount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseSpeciesAmount: 20, acidSpeciesAmount: 5 },
  output: { baseToAcidRatio: 4, log10Ratio: 0.6020599913279624 },
} satisfies ToolExample<Input, Output>;
export const bufferAcidBaseSpeciesRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/buffer-acid-base-species-ratio",
    title: "Buffer Acid Base Species Ratio",
    description:
      "Describe an explicit conjugate-base/acid amount ratio and its common logarithm without choosing a pKa or prescribing buffer preparation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseSpeciesAmount: { type: "number", exclusiveMinimum: 0 },
        acidSpeciesAmount: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["baseSpeciesAmount", "acidSpeciesAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseToAcidRatio: { type: "number" },
        log10Ratio: { type: "number" },
      },
      required: ["baseToAcidRatio", "log10Ratio"],
    },
    ports: {
      inputs: [
        {
          id: "baseSpeciesAmount",
          label: "Base Species Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "acidSpeciesAmount",
          label: "Acid Species Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "baseToAcidRatio",
          label: "Base To Acid Ratio",
          valueType: { type: "number" },
        },
        {
          id: "log10Ratio",
          label: "Log10Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bufferAcidBaseSpeciesRatioTool.execute;
export default bufferAcidBaseSpeciesRatioTool;
