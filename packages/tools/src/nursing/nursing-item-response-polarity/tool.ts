import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly response: number;
  readonly lower: number;
  readonly upper: number;
  readonly higherOriented: boolean;
};
export type Output = { readonly oriented: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    higherOriented: { type: "boolean" },
  },
  required: ["response", "lower", "upper", "higherOriented"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { oriented: { type: "number" } },
  required: ["oriented"],
} as const;
/** Orient a supplied bounded research item without a validated nursing scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { response, lower, upper, higherOriented } = request;
  const compute = (): Output => {
    H.domain(lower <= response && response <= upper);
    return { oriented: higherOriented ? response : lower + (upper - response) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { response: 2, lower: 1, upper: 5, higherOriented: false },
  output: { oriented: 4 },
} satisfies ToolExample<Input, Output>;
export const nursingItemResponsePolarityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/nursing-item-response-polarity",
    title: "Nursing Item Response Polarity Tool",
    description:
      "Orient a supplied bounded research item without a validated nursing scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        response: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        higherOriented: { type: "boolean" },
      },
      required: ["response", "lower", "upper", "higherOriented"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { oriented: { type: "number" } },
      required: ["oriented"],
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
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "higherOriented",
          label: "Higher Oriented",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "oriented", label: "Oriented", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nursingItemResponsePolarityTool.execute;
export default nursingItemResponsePolarityTool;
