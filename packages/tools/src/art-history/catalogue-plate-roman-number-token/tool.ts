import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly plateNumber: number };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { plateNumber: { type: "integer", minimum: 1, maximum: 3999 } },
  required: ["plateNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Format a catalogue plate number from 1 to 3999 using standard subtractive uppercase Roman numerals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plateNumber } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(plateNumber) &&
        plateNumber >= 1 &&
        plateNumber <= 3999,
      "plateNumber",
    ),
      plateNumber);
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
      symbols = [
        "M",
        "CM",
        "D",
        "CD",
        "C",
        "XC",
        "L",
        "XL",
        "X",
        "IX",
        "V",
        "IV",
        "I",
      ];
    let n = plateNumber,
      s = "";
    values.forEach((v, i) => {
      while (n >= v) {
        s += symbols[i];
        n -= v;
      }
    });
    return { token: "Plate " + s };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plateNumber: 24 },
  output: { token: "Plate XXIV" },
} satisfies ToolExample<Input, Output>;
export const cataloguePlateRomanNumberTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/catalogue-plate-roman-number-token",
    title: "Catalogue Plate Roman Number Token Tool",
    description:
      "Format a catalogue plate number from 1 to 3999 using standard subtractive uppercase Roman numerals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plateNumber: { type: "integer", minimum: 1, maximum: 3999 },
      },
      required: ["plateNumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "plateNumber",
          label: "Plate Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = cataloguePlateRomanNumberTokenTool.execute;
export default cataloguePlateRomanNumberTokenTool;
