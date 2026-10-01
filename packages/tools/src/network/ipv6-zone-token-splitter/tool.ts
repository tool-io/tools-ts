import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly literal: string };
export type Output = {
  readonly addressToken: string;
  readonly zoneToken: string;
  readonly hasZone: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { literal: { type: "string", maxLength: 8192 } },
  required: ["literal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    addressToken: { type: "string", maxLength: 8192 },
    zoneToken: { type: "string", maxLength: 8192 },
    hasZone: { type: "boolean" },
  },
  required: ["addressToken", "zoneToken", "hasZone"],
} as const;
/** Split a raw unbracketed IPv6 zone suffix; address and interface validity are separate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { literal } = request;
  const compute = (): Output => {
    H.domain(
      literal.length > 0 && !literal.includes("[") && !literal.includes("]"),
    );
    const i = literal.indexOf("%");
    H.domain(
      i < 0 ||
        (i > 0 && i < literal.length - 1 && literal.indexOf("%", i + 1) < 0),
    );
    return {
      addressToken: i < 0 ? literal : literal.slice(0, i),
      zoneToken: i < 0 ? "" : literal.slice(i + 1),
      hasZone: i >= 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { literal: "fe80::1%eth0" },
  output: { addressToken: "fe80::1", zoneToken: "eth0", hasZone: true },
} satisfies ToolExample<Input, Output>;
export const ipv6ZoneTokenSplitterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/ipv6-zone-token-splitter",
    title: "IPv6 Zone Token Splitter Tool",
    description:
      "Split a raw unbracketed IPv6 zone suffix; address and interface validity are separate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { literal: { type: "string", maxLength: 8192 } },
      required: ["literal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        addressToken: { type: "string", maxLength: 8192 },
        zoneToken: { type: "string", maxLength: 8192 },
        hasZone: { type: "boolean" },
      },
      required: ["addressToken", "zoneToken", "hasZone"],
    },
    ports: {
      inputs: [
        {
          id: "literal",
          label: "Literal",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "addressToken",
          label: "Address Token",
          valueType: { type: "string" },
        },
        { id: "zoneToken", label: "Zone Token", valueType: { type: "string" } },
        { id: "hasZone", label: "Has Zone", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ipv6ZoneTokenSplitterTool.execute;
export default ipv6ZoneTokenSplitterTool;
