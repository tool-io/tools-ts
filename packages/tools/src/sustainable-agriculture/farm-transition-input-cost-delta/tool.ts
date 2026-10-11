import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceInputCost: number;
  readonly transitionInputCost: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceInputCost: { type: "number" },
    transitionInputCost: { type: "number" },
  },
  required: ["referenceInputCost", "transitionInputCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit reference input cost from transition cost in the same currency and accounting scope. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceInputCost, transitionInputCost } = request;
  const compute = (): Output => {
    return { signedGap: transitionInputCost - referenceInputCost };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceInputCost: 12, transitionInputCost: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const farmTransitionInputCostDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: [
        "sustainable-agriculture",
        "sustainable agriculture",
        "agriculture",
      ],
      keywords: ["sustainable agriculture", "agriculture"],
    },
    id: "sustainable-agriculture/farm-transition-input-cost-delta",
    title: "Farm Transition Input Cost Delta",
    description:
      "Subtract explicit reference input cost from transition cost in the same currency and accounting scope.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceInputCost: { type: "number" },
        transitionInputCost: { type: "number" },
      },
      required: ["referenceInputCost", "transitionInputCost"],
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
          id: "referenceInputCost",
          label: "Reference Input Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transitionInputCost",
          label: "Transition Input Cost",
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
export const run = farmTransitionInputCostDeltaTool.execute;
export default farmTransitionInputCostDeltaTool;
