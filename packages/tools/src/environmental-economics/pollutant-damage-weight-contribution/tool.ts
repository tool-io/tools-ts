import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly emittedQuantity: number;
  readonly suppliedDamagePerUnit: number;
  readonly attributedShare: number;
};
export type Output = {
  readonly attributedQuantity: number;
  readonly damageContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emittedQuantity: { type: "number", minimum: 0 },
    suppliedDamagePerUnit: { type: "number" },
    attributedShare: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["emittedQuantity", "suppliedDamagePerUnit", "attributedShare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attributedQuantity: { type: "number" },
    damageContribution: { type: "number" },
  },
  required: ["attributedQuantity", "damageContribution"],
} as const;
/** Apply a supplied signed damage weight to attributed emissions without estimating health impacts or choosing a social valuation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { emittedQuantity, suppliedDamagePerUnit, attributedShare } = request;
  const compute = (): Output => {
    H.domain(emittedQuantity >= 0);
    H.probability(attributedShare);
    return {
      attributedQuantity: emittedQuantity * attributedShare,
      damageContribution:
        emittedQuantity * attributedShare * suppliedDamagePerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    emittedQuantity: 100,
    suppliedDamagePerUnit: 5,
    attributedShare: 0.2,
  },
  output: { attributedQuantity: 20, damageContribution: 100 },
} satisfies ToolExample<Input, Output>;
export const pollutantDamageWeightContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/pollutant-damage-weight-contribution",
    title: "Pollutant Damage Weight Contribution Tool",
    description:
      "Apply a supplied signed damage weight to attributed emissions without estimating health impacts or choosing a social valuation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        emittedQuantity: { type: "number", minimum: 0 },
        suppliedDamagePerUnit: { type: "number" },
        attributedShare: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["emittedQuantity", "suppliedDamagePerUnit", "attributedShare"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attributedQuantity: { type: "number" },
        damageContribution: { type: "number" },
      },
      required: ["attributedQuantity", "damageContribution"],
    },
    ports: {
      inputs: [
        {
          id: "emittedQuantity",
          label: "Emitted Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDamagePerUnit",
          label: "Supplied Damage Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "attributedShare",
          label: "Attributed Share",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "attributedQuantity",
          label: "Attributed Quantity",
          valueType: { type: "number" },
        },
        {
          id: "damageContribution",
          label: "Damage Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pollutantDamageWeightContributionTool.execute;
export default pollutantDamageWeightContributionTool;
