import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weight: number;
  readonly inclusionFlag: boolean;
};
export type Output = {
  readonly effectiveWeight: number;
  readonly squaredWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weight: { type: "number", minimum: 0 },
    inclusionFlag: { type: "boolean" },
  },
  required: ["weight", "inclusionFlag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveWeight: { type: "number" },
    squaredWeight: { type: "number" },
  },
  required: ["effectiveWeight", "squaredWeight"],
} as const;
/** Return one nonnegative sample weight’s first and second moments after an explicit inclusion mask, without computing a full effective sample size. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weight, inclusionFlag } = request;
  const compute = (): Output => {
    H.domain(weight >= 0, "weight");
    return {
      effectiveWeight: inclusionFlag ? weight : 0,
      squaredWeight: inclusionFlag ? weight * weight : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weight: 2.5, inclusionFlag: true },
  output: { effectiveWeight: 2.5, squaredWeight: 6.25 },
} satisfies ToolExample<Input, Output>;
export const sampleWeightSingleEffectiveMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["data-science", "data science", "computer science"],
      keywords: ["data science", "computer science"],
    },
    id: "data-science/sample-weight-single-effective-mass",
    title: "Sample Weight Single Effective Mass",
    description:
      "Return one nonnegative sample weight’s first and second moments after an explicit inclusion mask, without computing a full effective sample size.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weight: { type: "number", minimum: 0 },
        inclusionFlag: { type: "boolean" },
      },
      required: ["weight", "inclusionFlag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveWeight: { type: "number" },
        squaredWeight: { type: "number" },
      },
      required: ["effectiveWeight", "squaredWeight"],
    },
    ports: {
      inputs: [
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusionFlag",
          label: "Inclusion Flag",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "effectiveWeight",
          label: "Effective Weight",
          valueType: { type: "number" },
        },
        {
          id: "squaredWeight",
          label: "Squared Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleWeightSingleEffectiveMassTool.execute;
export default sampleWeightSingleEffectiveMassTool;
