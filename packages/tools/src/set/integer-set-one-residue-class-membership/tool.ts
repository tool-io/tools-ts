import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integer: number;
  readonly residue: number;
  readonly modulus: number;
};
export type Output = { readonly member: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integer: { type: "integer" },
    residue: { type: "integer", minimum: 0 },
    modulus: { type: "integer", minimum: 1 },
  },
  required: ["integer", "residue", "modulus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { member: { type: "boolean" } },
  required: ["member"],
} as const;
/** Calculate integer set one residue class membership from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integer, residue, modulus } = request;
  const compute = (): Output => {
    H.integer(modulus, 1);
    H.integer(residue, 0, modulus - 1);
    return { member: H.mod(integer, modulus) === residue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integer: -7, residue: 2, modulus: 3 },
  output: { member: true },
} satisfies ToolExample<Input, Output>;
export const integerSetOneResidueClassMembershipTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "set/integer-set-one-residue-class-membership",
      title: "Integer Set One Residue Class Membership Tool",
      description:
        "Calculate integer set one residue class membership from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          integer: { type: "integer" },
          residue: { type: "integer", minimum: 0 },
          modulus: { type: "integer", minimum: 1 },
        },
        required: ["integer", "residue", "modulus"],
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
            id: "integer",
            label: "Integer",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "residue",
            label: "Residue",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "modulus",
            label: "Modulus",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "member", label: "Member", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = integerSetOneResidueClassMembershipTool.execute;
export default integerSetOneResidueClassMembershipTool;
