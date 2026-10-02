import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inFirst: boolean; readonly inSecond: boolean };
export type Output = {
  readonly inUnion: boolean;
  readonly disjointAtElement: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inFirst: { type: "boolean" }, inSecond: { type: "boolean" } },
  required: ["inFirst", "inSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inUnion: { type: "boolean" },
    disjointAtElement: { type: "boolean" },
  },
  required: ["inUnion", "disjointAtElement"],
} as const;
/** Calculate finite event disjoint union membership flag from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { inFirst, inSecond } = input;
  const compute = (): Output => {
    return {
      inUnion: inFirst || inSecond,
      disjointAtElement: !(inFirst && inSecond),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { inFirst: true, inSecond: false },
  output: { inUnion: true, disjointAtElement: true },
} satisfies ToolExample<Input, Output>;
export const finiteEventDisjointUnionMembershipFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "probability/finite-event-disjoint-union-membership-flag",
      title: "Finite Event Disjoint Union Membership Flag Tool",
      description:
        "Calculate finite event disjoint union membership flag from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inFirst: { type: "boolean" },
          inSecond: { type: "boolean" },
        },
        required: ["inFirst", "inSecond"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inUnion: { type: "boolean" },
          disjointAtElement: { type: "boolean" },
        },
        required: ["inUnion", "disjointAtElement"],
      },
      ports: {
        inputs: [
          {
            id: "inFirst",
            label: "In First",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "inSecond",
            label: "In Second",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "inUnion", label: "In Union", valueType: { type: "boolean" } },
          {
            id: "disjointAtElement",
            label: "Disjoint At Element",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = finiteEventDisjointUnionMembershipFlagTool.execute;
export default finiteEventDisjointUnionMembershipFlagTool;
