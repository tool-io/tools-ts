import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly code: number };
export type Output = {
  readonly kind: string;
  readonly consumesLengthByte: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["code"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", maxLength: 8192 },
    consumesLengthByte: { type: "boolean" },
  },
  required: ["kind", "consumesLengthByte"],
} as const;
/** Calculate dhcp option pad end token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { code } = request;
  const compute = (): Output => {
    H.integer(code, 0, 255);
    return {
      kind: code === 0 ? "pad" : code === 255 ? "end" : "option",
      consumesLengthByte: code !== 0 && code !== 255,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { code: 0 },
  output: { kind: "pad", consumesLengthByte: false },
} satisfies ToolExample<Input, Output>;
export const dhcpOptionPadEndTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/dhcp-option-pad-end-token",
    title: "DHCP Option Pad End Token Tool",
    description:
      "Calculate dhcp option pad end token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { code: { type: "integer", minimum: 0, maximum: 255 } },
      required: ["code"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        kind: { type: "string", maxLength: 8192 },
        consumesLengthByte: { type: "boolean" },
      },
      required: ["kind", "consumesLengthByte"],
    },
    ports: {
      inputs: [
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "kind", label: "Kind", valueType: { type: "string" } },
        {
          id: "consumesLengthByte",
          label: "Consumes Length Byte",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = dhcpOptionPadEndTokenTool.execute;
export default dhcpOptionPadEndTokenTool;
