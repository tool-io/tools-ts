import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: boolean;
  readonly second: boolean;
  readonly third: boolean;
};
export type Output = { readonly member: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "boolean" },
    second: { type: "boolean" },
    third: { type: "boolean" },
  },
  required: ["first", "second", "third"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { member: { type: "boolean" } },
  required: ["member"],
} as const;
/** Calculate symmetric difference three membership parity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, third } = request;
  const compute = (): Output => {
    return {
      member: (Number(first) + Number(second) + Number(third)) % 2 === 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: true, second: true, third: true },
  output: { member: true },
} satisfies ToolExample<Input, Output>;
export const symmetricDifferenceThreeMembershipParityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "set/symmetric-difference-three-membership-parity",
      title: "Symmetric Difference Three Membership Parity Tool",
      description:
        "Calculate symmetric difference three membership parity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "boolean" },
          second: { type: "boolean" },
          third: { type: "boolean" },
        },
        required: ["first", "second", "third"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { member: { type: "boolean" } },
        required: ["member"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "third",
            label: "Third",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "member", label: "Member", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = symmetricDifferenceThreeMembershipParityTool.execute;
export default symmetricDifferenceThreeMembershipParityTool;
