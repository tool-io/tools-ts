import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cohortCounts: readonly number[];
  readonly taxablePerPerson: readonly number[];
  readonly participationFractions: readonly number[];
};
export type Output = { readonly taxBase: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cohortCounts: { type: "array", maxItems: 256, items: { type: "number" } },
    taxablePerPerson: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    participationFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["cohortCounts", "taxablePerPerson", "participationFractions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { taxBase: { type: "number" } },
  required: ["taxBase"],
} as const;
/** Calculate cohort tax base age weight term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cohortCounts, taxablePerPerson, participationFractions } = request;
  const compute = (): Output => {
    H.sameLength(cohortCounts, taxablePerPerson);
    H.sameLength(cohortCounts, participationFractions);
    H.domain(
      cohortCounts.every((x) => x >= 0) &&
        taxablePerPerson.every((x) => x >= 0) &&
        participationFractions.every((x) => x >= 0 && x <= 1),
    );
    return {
      taxBase: cohortCounts.reduce(
        (s, x, i) => s + x * taxablePerPerson[i] * participationFractions[i],
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cohortCounts: [10, 20],
    taxablePerPerson: [100, 200],
    participationFractions: [0.5, 1],
  },
  output: { taxBase: 4500 },
} satisfies ToolExample<Input, Output>;
export const cohortTaxBaseAgeWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/cohort-tax-base-age-weight-term",
    title: "Cohort Tax Base Age Weight Term Tool",
    description:
      "Calculate cohort tax base age weight term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cohortCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        taxablePerPerson: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        participationFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["cohortCounts", "taxablePerPerson", "participationFractions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { taxBase: { type: "number" } },
      required: ["taxBase"],
    },
    ports: {
      inputs: [
        {
          id: "cohortCounts",
          label: "Cohort Counts",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "taxablePerPerson",
          label: "Taxable Per Person",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "participationFractions",
          label: "Participation Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "taxBase", label: "Tax Base", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cohortTaxBaseAgeWeightTermTool.execute;
export default cohortTaxBaseAgeWeightTermTool;
