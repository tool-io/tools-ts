import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowPreferred: number;
  readonly rowOther: number;
  readonly columnPreferred: number;
  readonly columnOther: number;
};
export type Output = {
  readonly rowFirstProbability: number;
  readonly columnFirstProbability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowPreferred: { type: "number", exclusiveMinimum: 0 },
    rowOther: { type: "number", exclusiveMinimum: 0 },
    columnPreferred: { type: "number", exclusiveMinimum: 0 },
    columnOther: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["rowPreferred", "rowOther", "columnPreferred", "columnOther"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowFirstProbability: { type: "number" },
    columnFirstProbability: { type: "number" },
  },
  required: ["rowFirstProbability", "columnFirstProbability"],
} as const;
/** Coordination diagonals (rowPreferred,columnOther) and (rowOther,columnPreferred), both off-diagonal payoffs zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rowPreferred, rowOther, columnPreferred, columnOther } = request;
  const compute = (): Output => {
    H.positive(rowPreferred);
    H.positive(rowOther);
    H.positive(columnPreferred);
    H.positive(columnOther);
    return {
      rowFirstProbability: columnPreferred / (columnPreferred + columnOther),
      columnFirstProbability: rowOther / (rowPreferred + rowOther),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rowPreferred: 2, rowOther: 1, columnPreferred: 2, columnOther: 1 },
  output: {
    rowFirstProbability: 0.6666666666666666,
    columnFirstProbability: 0.3333333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const battleOfSexesMixedProbabilityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/battle-of-sexes-mixed-probability-term",
    title: "Battle Of Sexes Mixed Probability Term Tool",
    description:
      "Coordination diagonals (rowPreferred,columnOther) and (rowOther,columnPreferred), both off-diagonal payoffs zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowPreferred: { type: "number", exclusiveMinimum: 0 },
        rowOther: { type: "number", exclusiveMinimum: 0 },
        columnPreferred: { type: "number", exclusiveMinimum: 0 },
        columnOther: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["rowPreferred", "rowOther", "columnPreferred", "columnOther"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowFirstProbability: { type: "number" },
        columnFirstProbability: { type: "number" },
      },
      required: ["rowFirstProbability", "columnFirstProbability"],
    },
    ports: {
      inputs: [
        {
          id: "rowPreferred",
          label: "Row Preferred",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rowOther",
          label: "Row Other",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "columnPreferred",
          label: "Column Preferred",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "columnOther",
          label: "Column Other",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rowFirstProbability",
          label: "Row First Probability",
          valueType: { type: "number" },
        },
        {
          id: "columnFirstProbability",
          label: "Column First Probability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = battleOfSexesMixedProbabilityTermTool.execute;
export default battleOfSexesMixedProbabilityTermTool;
