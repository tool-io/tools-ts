import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleArea: number;
  readonly suppliedWeightPerArea: number;
};
export type Output = { readonly weightedArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleArea: { type: "number", minimum: 0 },
    suppliedWeightPerArea: { type: "number", minimum: 0 },
  },
  required: ["eligibleArea", "suppliedWeightPerArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedArea: { type: "number" } },
  required: ["weightedArea"],
} as const;
/** Multiply explicit eligible area by a supplied weighting factor without selecting eligibility rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleArea, suppliedWeightPerArea } = request;
  const compute = (): Output => {
    H.domain(eligibleArea >= 0 && suppliedWeightPerArea >= 0, "eligibleArea");
    return { weightedArea: eligibleArea * suppliedWeightPerArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligibleArea: 12, suppliedWeightPerArea: 1.5 },
  output: { weightedArea: 18 },
} satisfies ToolExample<Input, Output>;
export const farmSupportAreaWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agricultural-policy", "agricultural policy", "agriculture"],
      keywords: ["agricultural policy", "agriculture"],
    },
    id: "agricultural-policy/farm-support-area-weight",
    title: "Farm Support Area Weight",
    description:
      "Multiply explicit eligible area by a supplied weighting factor without selecting eligibility rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleArea: { type: "number", minimum: 0 },
        suppliedWeightPerArea: { type: "number", minimum: 0 },
      },
      required: ["eligibleArea", "suppliedWeightPerArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedArea: { type: "number" } },
      required: ["weightedArea"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleArea",
          label: "Eligible Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWeightPerArea",
          label: "Supplied Weight Per Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedArea",
          label: "Weighted Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmSupportAreaWeightTool.execute;
export default farmSupportAreaWeightTool;
