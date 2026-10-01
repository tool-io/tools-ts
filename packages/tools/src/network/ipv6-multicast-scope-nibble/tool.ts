import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly flagsScopeOctet: number };
export type Output = { readonly flags: number; readonly scope: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flagsScopeOctet: { type: "integer", minimum: 0, maximum: 255 },
  },
  required: ["flagsScopeOctet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { flags: { type: "integer" }, scope: { type: "integer" } },
  required: ["flags", "scope"],
} as const;
/** Calculate ipv6 multicast scope nibble from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flagsScopeOctet } = request;
  const compute = (): Output => {
    H.integer(flagsScopeOctet, 0, 255);
    return { flags: flagsScopeOctet >>> 4, scope: flagsScopeOctet & 15 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flagsScopeOctet: 50 },
  output: { flags: 3, scope: 2 },
} satisfies ToolExample<Input, Output>;
export const ipv6MulticastScopeNibbleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/ipv6-multicast-scope-nibble",
    title: "IPv6 Multicast Scope Nibble Tool",
    description:
      "Calculate ipv6 multicast scope nibble from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flagsScopeOctet: { type: "integer", minimum: 0, maximum: 255 },
      },
      required: ["flagsScopeOctet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { flags: { type: "integer" }, scope: { type: "integer" } },
      required: ["flags", "scope"],
    },
    ports: {
      inputs: [
        {
          id: "flagsScopeOctet",
          label: "Flags Scope Octet",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "flags", label: "Flags", valueType: { type: "integer" } },
        { id: "scope", label: "Scope", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = ipv6MulticastScopeNibbleTool.execute;
export default ipv6MulticastScopeNibbleTool;
