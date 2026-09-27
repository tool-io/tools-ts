import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedAlleles: number;
  readonly individuals: number;
  readonly suppliedPloidy: number;
};
export type Output = {
  readonly expectedAlleles: number;
  readonly missing: number;
  readonly exceedsExpected: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedAlleles: { type: "integer", minimum: 0 },
    individuals: { type: "integer", minimum: 0 },
    suppliedPloidy: { type: "integer", minimum: 1 },
  },
  required: ["observedAlleles", "individuals", "suppliedPloidy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedAlleles: { type: "integer" },
    missing: { type: "integer" },
    exceedsExpected: { type: "boolean" },
  },
  required: ["expectedAlleles", "missing", "exceedsExpected"],
} as const;
/** Count support under an explicit ploidy assumption without inferring genotype or species ploidy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedAlleles, individuals, suppliedPloidy } = request;
  const compute = (): Output => {
    H.integer(observedAlleles, 0);
    H.integer(individuals, 0);
    H.integer(suppliedPloidy, 1);
    return {
      expectedAlleles: individuals * suppliedPloidy,
      missing: Math.max(0, individuals * suppliedPloidy - observedAlleles),
      exceedsExpected: observedAlleles > individuals * suppliedPloidy,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedAlleles: 18, individuals: 10, suppliedPloidy: 2 },
  output: { expectedAlleles: 20, missing: 2, exceedsExpected: false },
} satisfies ToolExample<Input, Output>;
export const alleleMissingPloidySupportFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/allele-missing-ploidy-support-flag",
    title: "Allele Missing Ploidy Support Flag Tool",
    description:
      "Count support under an explicit ploidy assumption without inferring genotype or species ploidy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedAlleles: { type: "integer", minimum: 0 },
        individuals: { type: "integer", minimum: 0 },
        suppliedPloidy: { type: "integer", minimum: 1 },
      },
      required: ["observedAlleles", "individuals", "suppliedPloidy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedAlleles: { type: "integer" },
        missing: { type: "integer" },
        exceedsExpected: { type: "boolean" },
      },
      required: ["expectedAlleles", "missing", "exceedsExpected"],
    },
    ports: {
      inputs: [
        {
          id: "observedAlleles",
          label: "Observed Alleles",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "individuals",
          label: "Individuals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedPloidy",
          label: "Supplied Ploidy",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "expectedAlleles",
          label: "Expected Alleles",
          valueType: { type: "integer" },
        },
        { id: "missing", label: "Missing", valueType: { type: "integer" } },
        {
          id: "exceedsExpected",
          label: "Exceeds Expected",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = alleleMissingPloidySupportFlagTool.execute;
export default alleleMissingPloidySupportFlagTool;
