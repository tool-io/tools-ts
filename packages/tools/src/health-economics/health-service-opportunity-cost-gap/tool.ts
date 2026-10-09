import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opportunityCost: number;
  readonly valuedBenefit: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opportunityCost: { type: "number" },
    valuedBenefit: { type: "number" },
  },
  required: ["opportunityCost", "valuedBenefit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied valued health-service benefit minus explicit opportunity cost without deriving a decision threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opportunityCost, valuedBenefit } = request;
  const compute = (): Output => {
    return { signedGap: valuedBenefit - opportunityCost };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { opportunityCost: 12, valuedBenefit: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const healthServiceOpportunityCostGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/health-service-opportunity-cost-gap",
    title: "Health Service Opportunity Cost Gap Tool",
    description:
      "Calculate supplied valued health-service benefit minus explicit opportunity cost without deriving a decision threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opportunityCost: { type: "number" },
        valuedBenefit: { type: "number" },
      },
      required: ["opportunityCost", "valuedBenefit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "opportunityCost",
          label: "Opportunity Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "valuedBenefit",
          label: "Valued Benefit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = healthServiceOpportunityCostGapTool.execute;
export default healthServiceOpportunityCostGapTool;
