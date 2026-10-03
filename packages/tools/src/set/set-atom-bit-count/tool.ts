import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly membership: readonly boolean[] };
export type Output = { readonly memberships: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    membership: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["membership"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { memberships: { type: "integer" } },
  required: ["memberships"],
} as const;
/** Count true membership bits in an explicit set-atom mask. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { membership } = request;
  const compute = (): Output => {
    return { memberships: membership.filter(Boolean).length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { membership: [true, false, true] },
  output: { memberships: 2 },
} satisfies ToolExample<Input, Output>;
export const setAtomBitCountTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "set/set-atom-bit-count",
    title: "Set Atom Bit Count Tool",
    description: "Count true membership bits in an explicit set-atom mask.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        membership: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["membership"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { memberships: { type: "integer" } },
      required: ["memberships"],
    },
    ports: {
      inputs: [
        {
          id: "membership",
          label: "Membership",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "memberships",
          label: "Memberships",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = setAtomBitCountTool.execute;
export default setAtomBitCountTool;
