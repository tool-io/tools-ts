import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly alleleCount: number;
  readonly calledAlleles: number;
  readonly suppliedFrequency: number;
};
export type Output = {
  readonly observedFrequency: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alleleCount: { type: "integer", minimum: 0 },
    calledAlleles: { type: "integer", minimum: 1 },
    suppliedFrequency: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["alleleCount", "calledAlleles", "suppliedFrequency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedFrequency: { type: "number" },
    residual: { type: "number" },
  },
  required: ["observedFrequency", "residual"],
} as const;
/** Calculate allele count frequency residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alleleCount, calledAlleles, suppliedFrequency } = request;
  const compute = (): Output => {
    H.integer(calledAlleles, 1);
    H.integer(alleleCount, 0, calledAlleles);
    H.probability(suppliedFrequency);
    return {
      observedFrequency: alleleCount / calledAlleles,
      residual: alleleCount / calledAlleles - suppliedFrequency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { alleleCount: 3, calledAlleles: 10, suppliedFrequency: 0.2 },
  output: { observedFrequency: 0.3, residual: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const alleleCountFrequencyResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/allele-count-frequency-residual",
    title: "Allele Count Frequency Residual Tool",
    description:
      "Calculate allele count frequency residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alleleCount: { type: "integer", minimum: 0 },
        calledAlleles: { type: "integer", minimum: 1 },
        suppliedFrequency: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["alleleCount", "calledAlleles", "suppliedFrequency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedFrequency: { type: "number" },
        residual: { type: "number" },
      },
      required: ["observedFrequency", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "alleleCount",
          label: "Allele Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "calledAlleles",
          label: "Called Alleles",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedFrequency",
          label: "Supplied Frequency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedFrequency",
          label: "Observed Frequency",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = alleleCountFrequencyResidualTool.execute;
export default alleleCountFrequencyResidualTool;
