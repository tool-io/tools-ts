import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly octet: number };
export type Output = { readonly variant: string; readonly rfcVariant: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["octet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variant: { type: "string", maxLength: 8192 },
    rfcVariant: { type: "boolean" },
  },
  required: ["variant", "rfcVariant"],
} as const;
/** Calculate uuid variant bit pattern check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { octet } = request;
  const compute = (): Output => {
    H.integer(octet, 0, 255);
    const variant =
      octet < 128
        ? "ncs"
        : octet < 192
          ? "rfc"
          : octet < 224
            ? "microsoft"
            : "future";
    return { variant, rfcVariant: variant === "rfc" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { octet: 154 },
  output: { variant: "rfc", rfcVariant: true },
} satisfies ToolExample<Input, Output>;
export const uuidVariantBitPatternCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/uuid-variant-bit-pattern-check",
    title: "Uuid Variant Bit Pattern Check Tool",
    description:
      "Calculate uuid variant bit pattern check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { octet: { type: "integer", minimum: 0, maximum: 255 } },
      required: ["octet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        variant: { type: "string", maxLength: 8192 },
        rfcVariant: { type: "boolean" },
      },
      required: ["variant", "rfcVariant"],
    },
    ports: {
      inputs: [
        {
          id: "octet",
          label: "Octet",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "variant", label: "Variant", valueType: { type: "string" } },
        {
          id: "rfcVariant",
          label: "Rfc Variant",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = uuidVariantBitPatternCheckTool.execute;
export default uuidVariantBitPatternCheckTool;
