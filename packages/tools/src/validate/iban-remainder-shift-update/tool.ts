import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly remainder: number;
  readonly appendedDigits: string;
};
export type Output = { readonly updatedRemainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainder: { type: "integer", minimum: 0, maximum: 96 },
    appendedDigits: { type: "string", maxLength: 8192 },
  },
  required: ["remainder", "appendedDigits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { updatedRemainder: { type: "integer" } },
  required: ["updatedRemainder"],
} as const;
/** Append supplied decimal expansion digits to a modulo-97 remainder; does not rearrange or validate an IBAN. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { remainder, appendedDigits } = request;
  const compute = (): Output => {
    H.integer(remainder, 0, 96);
    H.domain(/^\d+(?![\s\S])/.test(appendedDigits));
    let updatedRemainder = remainder;
    for (const x of appendedDigits)
      updatedRemainder = (updatedRemainder * 10 + Number(x)) % 97;
    return { updatedRemainder };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { remainder: 1, appendedDigits: "23" },
  output: { updatedRemainder: 26 },
} satisfies ToolExample<Input, Output>;
export const ibanRemainderShiftUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/iban-remainder-shift-update",
    title: "Iban Remainder Shift Update Tool",
    description:
      "Append supplied decimal expansion digits to a modulo-97 remainder; does not rearrange or validate an IBAN.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainder: { type: "integer", minimum: 0, maximum: 96 },
        appendedDigits: { type: "string", maxLength: 8192 },
      },
      required: ["remainder", "appendedDigits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { updatedRemainder: { type: "integer" } },
      required: ["updatedRemainder"],
    },
    ports: {
      inputs: [
        {
          id: "remainder",
          label: "Remainder",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "appendedDigits",
          label: "Appended Digits",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "updatedRemainder",
          label: "Updated Remainder",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = ibanRemainderShiftUpdateTool.execute;
export default ibanRemainderShiftUpdateTool;
