import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: number };
export type Output = { readonly kind: string; readonly extension: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", maxLength: 8192 },
    extension: { type: "boolean" },
  },
  required: ["kind", "extension"],
} as const;
/** Compute ipv6 extension next header token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    integer(value, 0, 255);
    const known: Record<string, string> = {
      0: "hop-by-hop",
      43: "routing",
      44: "fragment",
      50: "esp",
      51: "ah",
      60: "destination-options",
    };
    return {
      kind:
        known[value] ??
        (value === 59 ? "no-next-header" : "upper-layer-or-unassigned"),
      extension: Object.hasOwn(known, value),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 44 },
  output: { kind: "fragment", extension: true },
} satisfies ToolExample<Input, Output>;
export const ipv6ExtensionNextHeaderTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/ipv6-extension-next-header-token",
  title: "IPv6 Extension Next Header Token Tool",
  description:
    "Compute ipv6 extension next header token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "kind", label: "Kind", valueType: { type: "string" } },
      { id: "extension", label: "Extension", valueType: { type: "boolean" } },
    ],
  },
});
export const run = ipv6ExtensionNextHeaderTokenTool.execute;
export default ipv6ExtensionNextHeaderTokenTool;
