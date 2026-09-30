import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly separator: string;
};
export type Output = { readonly label: string; readonly consecutive: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer", minimum: 1 },
    second: { type: "integer" },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["first", "second", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    consecutive: { type: "boolean" },
  },
  required: ["label", "consecutive"],
} as const;
/** Calculate issue combination two number label from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, separator } = request;
  const compute = (): Output => {
    H.integer(first, 1);
    H.integer(second, first + 1);
    return {
      label: String(first) + separator + String(second),
      consecutive: second === first + 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 3, second: 4, separator: "/" },
  output: { label: "3/4", consecutive: true },
} satisfies ToolExample<Input, Output>;
export const issueCombinationTwoNumberLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/issue-combination-two-number-label",
    title: "Issue Combination Two Number Label Tool",
    description:
      "Calculate issue combination two number label from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "integer", minimum: 1 },
        second: { type: "integer" },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["first", "second", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        consecutive: { type: "boolean" },
      },
      required: ["label", "consecutive"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "consecutive",
          label: "Consecutive",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = issueCombinationTwoNumberLabelTool.execute;
export default issueCombinationTwoNumberLabelTool;
