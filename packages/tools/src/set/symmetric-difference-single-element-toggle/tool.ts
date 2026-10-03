import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inFirst: boolean;
  readonly inSecond: boolean;
  readonly toggleFirst: boolean;
};
export type Output = { readonly before: boolean; readonly after: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inFirst: { type: "boolean" },
    inSecond: { type: "boolean" },
    toggleFirst: { type: "boolean" },
  },
  required: ["inFirst", "inSecond", "toggleFirst"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { before: { type: "boolean" }, after: { type: "boolean" } },
  required: ["before", "after"],
} as const;
/** Calculate symmetric difference single element toggle from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inFirst, inSecond, toggleFirst } = request;
  const compute = (): Output => {
    return {
      before: inFirst !== inSecond,
      after: (toggleFirst ? !inFirst : inFirst) !== inSecond,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inFirst: true, inSecond: true, toggleFirst: true },
  output: { before: false, after: true },
} satisfies ToolExample<Input, Output>;
export const symmetricDifferenceSingleElementToggleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "set/symmetric-difference-single-element-toggle",
      title: "Symmetric Difference Single Element Toggle Tool",
      description:
        "Calculate symmetric difference single element toggle from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inFirst: { type: "boolean" },
          inSecond: { type: "boolean" },
          toggleFirst: { type: "boolean" },
        },
        required: ["inFirst", "inSecond", "toggleFirst"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { before: { type: "boolean" }, after: { type: "boolean" } },
        required: ["before", "after"],
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
          {
            id: "toggleFirst",
            label: "Toggle First",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "before", label: "Before", valueType: { type: "boolean" } },
          { id: "after", label: "After", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = symmetricDifferenceSingleElementToggleTool.execute;
export default symmetricDifferenceSingleElementToggleTool;
