import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly response: number;
  readonly reference: number;
  readonly higherMeansMore: boolean;
};
export type Output = { readonly orientedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: { type: "number" },
    reference: { type: "number" },
    higherMeansMore: { type: "boolean" },
  },
  required: ["response", "reference", "higherMeansMore"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { orientedGap: { type: "number" } },
  required: ["orientedGap"],
} as const;
/** Orient one supplied research-item difference without a clinical score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { response, reference, higherMeansMore } = request;
  const compute = (): Output => {
    return { orientedGap: (response - reference) * (higherMeansMore ? 1 : -1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { response: 4, reference: 2, higherMeansMore: true },
  output: { orientedGap: 2 },
} satisfies ToolExample<Input, Output>;
export const itemResponseDirectionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/item-response-direction-gap",
    title: "Item Response Direction Gap Tool",
    description:
      "Orient one supplied research-item difference without a clinical score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        response: { type: "number" },
        reference: { type: "number" },
        higherMeansMore: { type: "boolean" },
      },
      required: ["response", "reference", "higherMeansMore"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { orientedGap: { type: "number" } },
      required: ["orientedGap"],
    },
    ports: {
      inputs: [
        {
          id: "response",
          label: "Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "higherMeansMore",
          label: "Higher Means More",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "orientedGap",
          label: "Oriented Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = itemResponseDirectionGapTool.execute;
export default itemResponseDirectionGapTool;
