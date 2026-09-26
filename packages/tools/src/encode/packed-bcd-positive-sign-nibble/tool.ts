import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly policy: string };
export type Output = { readonly nibble: number; readonly hex: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    policy: {
      type: "string",
      maxLength: 8192,
      enum: ["signed-preferred", "unsigned"],
    },
  },
  required: ["policy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nibble: { type: "integer" },
    hex: { type: "string", maxLength: 8192 },
  },
  required: ["nibble", "hex"],
} as const;
/** Write the conventional C positive signed or F unsigned packed-decimal sign nibble under an explicit policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { policy } = request;
  const compute = (): Output => {
    H.domain(["signed-preferred", "unsigned"].includes(policy));
    return {
      nibble: policy === "signed-preferred" ? 12 : 15,
      hex: policy === "signed-preferred" ? "c" : "f",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { policy: "signed-preferred" },
  output: { nibble: 12, hex: "c" },
} satisfies ToolExample<Input, Output>;
export const packedBcdPositiveSignNibbleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/packed-bcd-positive-sign-nibble",
    title: "Packed BCD Positive Sign Nibble Tool",
    description:
      "Write the conventional C positive signed or F unsigned packed-decimal sign nibble under an explicit policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        policy: {
          type: "string",
          maxLength: 8192,
          enum: ["signed-preferred", "unsigned"],
        },
      },
      required: ["policy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nibble: { type: "integer" },
        hex: { type: "string", maxLength: 8192 },
      },
      required: ["nibble", "hex"],
    },
    ports: {
      inputs: [
        {
          id: "policy",
          label: "Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "nibble", label: "Nibble", valueType: { type: "integer" } },
        { id: "hex", label: "Hex", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = packedBcdPositiveSignNibbleTool.execute;
export default packedBcdPositiveSignNibbleTool;
