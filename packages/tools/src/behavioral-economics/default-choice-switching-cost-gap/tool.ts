import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly defaultChoiceCost: number;
  readonly alternativeChoiceCost: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defaultChoiceCost: { type: "number" },
    alternativeChoiceCost: { type: "number" },
  },
  required: ["defaultChoiceCost", "alternativeChoiceCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied alternative-minus-default choice cost without modeling preferences or behavioral effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { defaultChoiceCost, alternativeChoiceCost } = request;
  const compute = (): Output => {
    return { signedGap: alternativeChoiceCost - defaultChoiceCost };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { defaultChoiceCost: 12, alternativeChoiceCost: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const defaultChoiceSwitchingCostGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/default-choice-switching-cost-gap",
    title: "Default Choice Switching Cost Gap",
    description:
      "Calculate supplied alternative-minus-default choice cost without modeling preferences or behavioral effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defaultChoiceCost: { type: "number" },
        alternativeChoiceCost: { type: "number" },
      },
      required: ["defaultChoiceCost", "alternativeChoiceCost"],
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
          id: "defaultChoiceCost",
          label: "Default Choice Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alternativeChoiceCost",
          label: "Alternative Choice Cost",
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
export const run = defaultChoiceSwitchingCostGapTool.execute;
export default defaultChoiceSwitchingCostGapTool;
