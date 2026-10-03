import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inFirst: boolean; readonly inSecond: boolean };
export type Output = {
  readonly inFirstMinusSecond: boolean;
  readonly disprovesFirstSubset: boolean;
  readonly disprovesSecondSubset: boolean;
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
    inFirstMinusSecond: { type: "boolean" },
    disprovesFirstSubset: { type: "boolean" },
    disprovesSecondSubset: { type: "boolean" },
  },
  required: [
    "inFirstMinusSecond",
    "disprovesFirstSubset",
    "disprovesSecondSubset",
  ],
} as const;
/** Calculate set difference counterexample role label from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inFirst, inSecond } = request;
  const compute = (): Output => {
    return {
      inFirstMinusSecond: inFirst && !inSecond,
      disprovesFirstSubset: inFirst && !inSecond,
      disprovesSecondSubset: inSecond && !inFirst,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inFirst: true, inSecond: false },
  output: {
    inFirstMinusSecond: true,
    disprovesFirstSubset: true,
    disprovesSecondSubset: false,
  },
} satisfies ToolExample<Input, Output>;
export const setDifferenceCounterexampleRoleLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "set/set-difference-counterexample-role-label",
      title: "Set Difference Counterexample Role Label Tool",
      description:
        "Calculate set difference counterexample role label from explicit caller-supplied inputs.",
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
          inFirstMinusSecond: { type: "boolean" },
          disprovesFirstSubset: { type: "boolean" },
          disprovesSecondSubset: { type: "boolean" },
        },
        required: [
          "inFirstMinusSecond",
          "disprovesFirstSubset",
          "disprovesSecondSubset",
        ],
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
          {
            id: "inFirstMinusSecond",
            label: "In First Minus Second",
            valueType: { type: "boolean" },
          },
          {
            id: "disprovesFirstSubset",
            label: "Disproves First Subset",
            valueType: { type: "boolean" },
          },
          {
            id: "disprovesSecondSubset",
            label: "Disproves Second Subset",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = setDifferenceCounterexampleRoleLabelTool.execute;
export default setDifferenceCounterexampleRoleLabelTool;
