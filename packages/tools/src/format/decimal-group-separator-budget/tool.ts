import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integerDigits: number;
  readonly groupSize: number;
  readonly separatorWidth: number;
};
export type Output = {
  readonly separators: number;
  readonly separatorColumns: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integerDigits: { type: "integer", minimum: 1 },
    groupSize: { type: "integer", minimum: 1 },
    separatorWidth: { type: "integer", minimum: 0 },
  },
  required: ["integerDigits", "groupSize", "separatorWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    separators: { type: "integer" },
    separatorColumns: { type: "integer" },
  },
  required: ["separators", "separatorColumns"],
} as const;
/** Budget fixed-size integer digit grouping separators; irregular locale grouping is outside this contract. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integerDigits, groupSize, separatorWidth } = request;
  const compute = (): Output => {
    H.integer(integerDigits, 1);
    H.integer(groupSize, 1);
    H.integer(separatorWidth, 0);
    return {
      separators: Math.floor((integerDigits - 1) / groupSize),
      separatorColumns:
        Math.floor((integerDigits - 1) / groupSize) * separatorWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integerDigits: 8, groupSize: 3, separatorWidth: 1 },
  output: { separators: 2, separatorColumns: 2 },
} satisfies ToolExample<Input, Output>;
export const decimalGroupSeparatorBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/decimal-group-separator-budget",
    title: "Decimal Group Separator Budget Tool",
    description:
      "Budget fixed-size integer digit grouping separators; irregular locale grouping is outside this contract.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integerDigits: { type: "integer", minimum: 1 },
        groupSize: { type: "integer", minimum: 1 },
        separatorWidth: { type: "integer", minimum: 0 },
      },
      required: ["integerDigits", "groupSize", "separatorWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        separators: { type: "integer" },
        separatorColumns: { type: "integer" },
      },
      required: ["separators", "separatorColumns"],
    },
    ports: {
      inputs: [
        {
          id: "integerDigits",
          label: "Integer Digits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "groupSize",
          label: "Group Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "separatorWidth",
          label: "Separator Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "separators",
          label: "Separators",
          valueType: { type: "integer" },
        },
        {
          id: "separatorColumns",
          label: "Separator Columns",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = decimalGroupSeparatorBudgetTool.execute;
export default decimalGroupSeparatorBudgetTool;
