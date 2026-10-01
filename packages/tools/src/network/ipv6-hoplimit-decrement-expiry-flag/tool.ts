import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly hopLimit: number };
export type Output = { readonly remaining: number; readonly expired: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { hopLimit: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["hopLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "integer" }, expired: { type: "boolean" } },
  required: ["remaining", "expired"],
} as const;
/** Calculate ipv6 hoplimit decrement expiry flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hopLimit } = request;
  const compute = (): Output => {
    H.integer(hopLimit, 0, 255);
    return { remaining: Math.max(0, hopLimit - 1), expired: hopLimit <= 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hopLimit: 1 },
  output: { remaining: 0, expired: true },
} satisfies ToolExample<Input, Output>;
export const ipv6HoplimitDecrementExpiryFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/ipv6-hoplimit-decrement-expiry-flag",
    title: "IPv6 Hoplimit Decrement Expiry Flag Tool",
    description:
      "Calculate ipv6 hoplimit decrement expiry flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { hopLimit: { type: "integer", minimum: 0, maximum: 255 } },
      required: ["hopLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "integer" },
        expired: { type: "boolean" },
      },
      required: ["remaining", "expired"],
    },
    ports: {
      inputs: [
        {
          id: "hopLimit",
          label: "Hop Limit",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        { id: "expired", label: "Expired", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ipv6HoplimitDecrementExpiryFlagTool.execute;
export default ipv6HoplimitDecrementExpiryFlagTool;
