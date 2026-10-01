import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly type: number; readonly code: number };
export type Output = { readonly composite: number; readonly hex: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    type: { type: "integer", minimum: 0, maximum: 255 },
    code: { type: "integer", minimum: 0, maximum: 255 },
  },
  required: ["type", "code"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    composite: { type: "integer" },
    hex: { type: "string", maxLength: 8192 },
  },
  required: ["composite", "hex"],
} as const;
/** Pack the two supplied ICMP octets without assigning protocol-version-specific meanings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { type, code } = request;
  const compute = (): Output => {
    H.integer(type, 0, 255);
    H.integer(code, 0, 255);
    return {
      composite: type * 256 + code,
      hex:
        type.toString(16).padStart(2, "0") + code.toString(16).padStart(2, "0"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { type: 3, code: 1 },
  output: { composite: 769, hex: "0301" },
} satisfies ToolExample<Input, Output>;
export const icmpTypeCodeCompositeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/icmp-type-code-composite-token",
    title: "ICMP Type Code Composite Token Tool",
    description:
      "Pack the two supplied ICMP octets without assigning protocol-version-specific meanings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        type: { type: "integer", minimum: 0, maximum: 255 },
        code: { type: "integer", minimum: 0, maximum: 255 },
      },
      required: ["type", "code"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        composite: { type: "integer" },
        hex: { type: "string", maxLength: 8192 },
      },
      required: ["composite", "hex"],
    },
    ports: {
      inputs: [
        {
          id: "type",
          label: "Type",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "composite", label: "Composite", valueType: { type: "integer" } },
        { id: "hex", label: "Hex", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = icmpTypeCodeCompositeTokenTool.execute;
export default icmpTypeCodeCompositeTokenTool;
