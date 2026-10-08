import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingBenefit: number;
  readonly suppliedIndexationRate: number;
};
export type Output = {
  readonly indexedBenefit: number;
  readonly change: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingBenefit: { type: "number", minimum: 0 },
    suppliedIndexationRate: { type: "number", minimum: -1 },
  },
  required: ["openingBenefit", "suppliedIndexationRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indexedBenefit: { type: "number" },
    change: { type: "number" },
  },
  required: ["indexedBenefit", "change"],
} as const;
/** Apply a supplied signed single-period pension indexation rate without selecting statutory indexation rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingBenefit, suppliedIndexationRate } = request;
  const compute = (): Output => {
    H.domain(openingBenefit >= 0, "openingBenefit");
    H.domain(suppliedIndexationRate >= -1, "suppliedIndexationRate");
    return {
      indexedBenefit: openingBenefit * (1 + suppliedIndexationRate),
      change: openingBenefit * suppliedIndexationRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingBenefit: 1000, suppliedIndexationRate: 0.03 },
  output: { indexedBenefit: 1030, change: 30 },
} satisfies ToolExample<Input, Output>;
export const pensionBenefitIndexationPeriodTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/pension-benefit-indexation-period",
    title: "Pension Benefit Indexation Period Tool",
    description:
      "Apply a supplied signed single-period pension indexation rate without selecting statutory indexation rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingBenefit: { type: "number", minimum: 0 },
        suppliedIndexationRate: { type: "number", minimum: -1 },
      },
      required: ["openingBenefit", "suppliedIndexationRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        indexedBenefit: { type: "number" },
        change: { type: "number" },
      },
      required: ["indexedBenefit", "change"],
    },
    ports: {
      inputs: [
        {
          id: "openingBenefit",
          label: "Opening Benefit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedIndexationRate",
          label: "Supplied Indexation Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "indexedBenefit",
          label: "Indexed Benefit",
          valueType: { type: "number" },
        },
        { id: "change", label: "Change", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pensionBenefitIndexationPeriodTool.execute;
export default pensionBenefitIndexationPeriodTool;
