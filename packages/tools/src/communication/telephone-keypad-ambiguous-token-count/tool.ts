import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly digits: string };
export type Output = { readonly possibilities: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digits: { type: "string", maxLength: 8192 } },
  required: ["digits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { possibilities: { type: "string", maxLength: 8192 } },
  required: ["possibilities"],
} as const;
/** Count Latin telephone-keypad letter combinations for digits 2..9 without selecting a language dictionary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { digits } = request;
  const compute = (): Output => {
    H.domain(/^[2-9]+(?![\s\S])/.test(digits));
    let possibilities = 1n;
    for (const digit of digits)
      possibilities *= digit === "7" || digit === "9" ? 4n : 3n;
    return { possibilities: String(possibilities) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { digits: "279" },
  output: { possibilities: "48" },
} satisfies ToolExample<Input, Output>;
export const telephoneKeypadAmbiguousTokenCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/telephone-keypad-ambiguous-token-count",
    title: "Telephone Keypad Ambiguous Token Count Tool",
    description:
      "Count Latin telephone-keypad letter combinations for digits 2..9 without selecting a language dictionary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { digits: { type: "string", maxLength: 8192 } },
      required: ["digits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { possibilities: { type: "string", maxLength: 8192 } },
      required: ["possibilities"],
    },
    ports: {
      inputs: [
        {
          id: "digits",
          label: "Digits",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "possibilities",
          label: "Possibilities",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = telephoneKeypadAmbiguousTokenCountTool.execute;
export default telephoneKeypadAmbiguousTokenCountTool;
