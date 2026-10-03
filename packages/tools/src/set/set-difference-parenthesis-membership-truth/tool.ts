import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: boolean;
  readonly b: boolean;
  readonly c: boolean;
};
export type Output = {
  readonly leftAssociated: boolean;
  readonly rightAssociated: boolean;
  readonly differs: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "boolean" },
    b: { type: "boolean" },
    c: { type: "boolean" },
  },
  required: ["a", "b", "c"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftAssociated: { type: "boolean" },
    rightAssociated: { type: "boolean" },
    differs: { type: "boolean" },
  },
  required: ["leftAssociated", "rightAssociated", "differs"],
} as const;
/** Calculate set difference parenthesis membership truth from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { a, b, c } = request;
  const compute = (): Output => {
    const leftAssociated = a && !b && !c,
      rightAssociated = a && !(b && !c);
    return {
      leftAssociated,
      rightAssociated,
      differs: leftAssociated !== rightAssociated,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { a: true, b: true, c: true },
  output: { leftAssociated: false, rightAssociated: true, differs: true },
} satisfies ToolExample<Input, Output>;
export const setDifferenceParenthesisMembershipTruthTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "set/set-difference-parenthesis-membership-truth",
      title: "Set Difference Parenthesis Membership Truth Tool",
      description:
        "Calculate set difference parenthesis membership truth from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          a: { type: "boolean" },
          b: { type: "boolean" },
          c: { type: "boolean" },
        },
        required: ["a", "b", "c"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leftAssociated: { type: "boolean" },
          rightAssociated: { type: "boolean" },
          differs: { type: "boolean" },
        },
        required: ["leftAssociated", "rightAssociated", "differs"],
      },
      ports: {
        inputs: [
          {
            id: "a",
            label: "A",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "b",
            label: "B",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "c",
            label: "C",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "leftAssociated",
            label: "Left Associated",
            valueType: { type: "boolean" },
          },
          {
            id: "rightAssociated",
            label: "Right Associated",
            valueType: { type: "boolean" },
          },
          { id: "differs", label: "Differs", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = setDifferenceParenthesisMembershipTruthTool.execute;
export default setDifferenceParenthesisMembershipTruthTool;
