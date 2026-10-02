import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly auc: number;
  readonly amountUnitFactor: number;
  readonly aucUnitFactor: number;
  readonly bioavailableFraction: number;
};
export type Output = {
  readonly coherentAmount: number;
  readonly coherentAuc: number;
  readonly apparentClearance: number;
  readonly clearance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number", minimum: 0 },
    auc: { type: "number", exclusiveMinimum: 0 },
    amountUnitFactor: { type: "number", exclusiveMinimum: 0 },
    aucUnitFactor: { type: "number", exclusiveMinimum: 0 },
    bioavailableFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "amount",
    "auc",
    "amountUnitFactor",
    "aucUnitFactor",
    "bioavailableFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coherentAmount: { type: "number" },
    coherentAuc: { type: "number" },
    apparentClearance: { type: "number" },
    clearance: { type: "number" },
  },
  required: ["coherentAmount", "coherentAuc", "apparentClearance", "clearance"],
} as const;
/** Research amount/AUC arithmetic with supplied unit bases and bioavailability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, auc, amountUnitFactor, aucUnitFactor, bioavailableFraction } =
    request;
  const compute = (): Output => {
    H.domain(amount >= 0);
    H.positive(auc);
    H.positive(amountUnitFactor);
    H.positive(aucUnitFactor);
    H.probability(bioavailableFraction);
    return {
      coherentAmount: amount * amountUnitFactor,
      coherentAuc: auc * aucUnitFactor,
      apparentClearance: (amount * amountUnitFactor) / (auc * aucUnitFactor),
      clearance:
        (amount * amountUnitFactor * bioavailableFraction) /
        (auc * aucUnitFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    amount: 100,
    auc: 20,
    amountUnitFactor: 1,
    aucUnitFactor: 1,
    bioavailableFraction: 0.8,
  },
  output: {
    coherentAmount: 100,
    coherentAuc: 20,
    apparentClearance: 5,
    clearance: 4,
  },
} satisfies ToolExample<Input, Output>;
export const pkClearanceResearchAucUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/pk-clearance-research-auc-unit-factor",
    title: "PK Clearance Research AUC Unit Factor Tool",
    description:
      "Research amount/AUC arithmetic with supplied unit bases and bioavailability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number", minimum: 0 },
        auc: { type: "number", exclusiveMinimum: 0 },
        amountUnitFactor: { type: "number", exclusiveMinimum: 0 },
        aucUnitFactor: { type: "number", exclusiveMinimum: 0 },
        bioavailableFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "amount",
        "auc",
        "amountUnitFactor",
        "aucUnitFactor",
        "bioavailableFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coherentAmount: { type: "number" },
        coherentAuc: { type: "number" },
        apparentClearance: { type: "number" },
        clearance: { type: "number" },
      },
      required: [
        "coherentAmount",
        "coherentAuc",
        "apparentClearance",
        "clearance",
      ],
    },
    ports: {
      inputs: [
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "auc",
          label: "Auc",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "amountUnitFactor",
          label: "Amount Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aucUnitFactor",
          label: "Auc Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bioavailableFraction",
          label: "Bioavailable Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coherentAmount",
          label: "Coherent Amount",
          valueType: { type: "number" },
        },
        {
          id: "coherentAuc",
          label: "Coherent Auc",
          valueType: { type: "number" },
        },
        {
          id: "apparentClearance",
          label: "Apparent Clearance",
          valueType: { type: "number" },
        },
        { id: "clearance", label: "Clearance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pkClearanceResearchAucUnitFactorTool.execute;
export default pkClearanceResearchAucUnitFactorTool;
