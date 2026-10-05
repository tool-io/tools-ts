import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly memberships: readonly boolean[] };
export type Output = {
  readonly signature: string;
  readonly indexDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    memberships: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["memberships"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signature: { type: "string", maxLength: 8192 },
    indexDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["signature", "indexDecimal"],
} as const;
/** Encode ordered set-membership flags as a left-to-right signature and an exact atom index, with the first set occupying the least significant bit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { memberships } = request;
  const compute = (): Output => {
    let n = 0n;
    memberships.forEach((v, i) => {
      if (v) n |= 1n << BigInt(i);
    });
    return {
      signature: memberships.map((v) => (v ? "1" : "0")).join(""),
      indexDecimal: n.toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { memberships: [true, false, true, true] },
  output: { signature: "1011", indexDecimal: "13" },
} satisfies ToolExample<Input, Output>;
export const atomMembershipBitSignatureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/atom-membership-bit-signature",
    title: "Atom Membership Bit Signature Tool",
    description:
      "Encode ordered set-membership flags as a left-to-right signature and an exact atom index, with the first set occupying the least significant bit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        memberships: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["memberships"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signature: { type: "string", maxLength: 8192 },
        indexDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["signature", "indexDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "memberships",
          label: "Memberships",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "signature", label: "Signature", valueType: { type: "string" } },
        {
          id: "indexDecimal",
          label: "Index Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = atomMembershipBitSignatureTool.execute;
export default atomMembershipBitSignatureTool;
