import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly donation: number;
  readonly designatedFraction: number;
  readonly collectionCost: number;
  readonly costChargedToDesignated: boolean;
};
export type Output = {
  readonly designatedGross: number;
  readonly designatedNet: number;
  readonly undesignatedNet: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    donation: { type: "number", minimum: 0 },
    designatedFraction: { type: "number", minimum: 0, maximum: 1 },
    collectionCost: { type: "number", minimum: 0 },
    costChargedToDesignated: { type: "boolean" },
  },
  required: [
    "donation",
    "designatedFraction",
    "collectionCost",
    "costChargedToDesignated",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    designatedGross: { type: "number" },
    designatedNet: { type: "number" },
    undesignatedNet: { type: "number" },
  },
  required: ["designatedGross", "designatedNet", "undesignatedNet"],
} as const;
/** Explicit allocation ledger with a supplied fee-bearing bucket, without interpreting donor restrictions or religious law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    donation,
    designatedFraction,
    collectionCost,
    costChargedToDesignated,
  } = request;
  const compute = (): Output => {
    H.domain(donation >= 0 && collectionCost >= 0);
    H.probability(designatedFraction);
    return {
      designatedGross: donation * designatedFraction,
      designatedNet:
        donation * designatedFraction -
        (costChargedToDesignated ? collectionCost : 0),
      undesignatedNet:
        donation * (1 - designatedFraction) -
        (costChargedToDesignated ? 0 : collectionCost),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    donation: 1000,
    designatedFraction: 0.6,
    collectionCost: 50,
    costChargedToDesignated: true,
  },
  output: { designatedGross: 600, designatedNet: 550, undesignatedNet: 400 },
} satisfies ToolExample<Input, Output>;
export const publicReligiousDonationDesignatedShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "islamic-studies/public-religious-donation-designated-share",
      title: "Public Religious Donation Designated Share Tool",
      description:
        "Explicit allocation ledger with a supplied fee-bearing bucket, without interpreting donor restrictions or religious law.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          donation: { type: "number", minimum: 0 },
          designatedFraction: { type: "number", minimum: 0, maximum: 1 },
          collectionCost: { type: "number", minimum: 0 },
          costChargedToDesignated: { type: "boolean" },
        },
        required: [
          "donation",
          "designatedFraction",
          "collectionCost",
          "costChargedToDesignated",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          designatedGross: { type: "number" },
          designatedNet: { type: "number" },
          undesignatedNet: { type: "number" },
        },
        required: ["designatedGross", "designatedNet", "undesignatedNet"],
      },
      ports: {
        inputs: [
          {
            id: "donation",
            label: "Donation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "designatedFraction",
            label: "Designated Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "collectionCost",
            label: "Collection Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "costChargedToDesignated",
            label: "Cost Charged To Designated",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "designatedGross",
            label: "Designated Gross",
            valueType: { type: "number" },
          },
          {
            id: "designatedNet",
            label: "Designated Net",
            valueType: { type: "number" },
          },
          {
            id: "undesignatedNet",
            label: "Undesignated Net",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = publicReligiousDonationDesignatedShareTool.execute;
export default publicReligiousDonationDesignatedShareTool;
