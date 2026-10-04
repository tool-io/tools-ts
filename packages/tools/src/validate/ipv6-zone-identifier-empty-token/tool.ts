import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly address: string };
export type Output = {
  readonly hasZone: boolean;
  readonly emptyZone: boolean;
  readonly zone: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { address: { type: "string", maxLength: 8192 } },
  required: ["address"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hasZone: { type: "boolean" },
    emptyZone: { type: "boolean" },
    zone: { type: "string", maxLength: 8192 },
  },
  required: ["hasZone", "emptyZone", "zone"],
} as const;
/** Inspect a raw IPv6-zone delimiter without validating the address or decoding a URI percent escape. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { address } = request;
  const compute = (): Output => {
    const i = address.indexOf("%"),
      hasZone = i >= 0,
      zone = hasZone ? address.slice(i + 1) : "";
    return { hasZone, emptyZone: hasZone && zone.length === 0, zone };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { address: "fe80::1%" },
  output: { hasZone: true, emptyZone: true, zone: "" },
} satisfies ToolExample<Input, Output>;
export const ipv6ZoneIdentifierEmptyTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/ipv6-zone-identifier-empty-token",
    title: "IPv6 Zone Identifier Empty Token Tool",
    description:
      "Inspect a raw IPv6-zone delimiter without validating the address or decoding a URI percent escape.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { address: { type: "string", maxLength: 8192 } },
      required: ["address"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hasZone: { type: "boolean" },
        emptyZone: { type: "boolean" },
        zone: { type: "string", maxLength: 8192 },
      },
      required: ["hasZone", "emptyZone", "zone"],
    },
    ports: {
      inputs: [
        {
          id: "address",
          label: "Address",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "hasZone", label: "Has Zone", valueType: { type: "boolean" } },
        {
          id: "emptyZone",
          label: "Empty Zone",
          valueType: { type: "boolean" },
        },
        { id: "zone", label: "Zone", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = ipv6ZoneIdentifierEmptyTokenTool.execute;
export default ipv6ZoneIdentifierEmptyTokenTool;
