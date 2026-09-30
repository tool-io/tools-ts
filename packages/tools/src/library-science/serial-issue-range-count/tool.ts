import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstIssue: number;
  readonly lastIssue: number;
  readonly stride: number;
};
export type Output = { readonly count: number; readonly aligned: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstIssue: { type: "integer", minimum: 0 },
    lastIssue: { type: "integer" },
    stride: { type: "integer", minimum: 1 },
  },
  required: ["firstIssue", "lastIssue", "stride"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" }, aligned: { type: "boolean" } },
  required: ["count", "aligned"],
} as const;
/** Count issue positions in an inclusive numeric progression; do not infer combined or missing issues. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstIssue, lastIssue, stride } = request;
  const compute = (): Output => {
    H.integer(firstIssue, 0);
    H.integer(lastIssue, firstIssue);
    H.integer(stride, 1);
    return {
      count: Math.floor((lastIssue - firstIssue) / stride) + 1,
      aligned: (lastIssue - firstIssue) % stride === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstIssue: 2, lastIssue: 10, stride: 2 },
  output: { count: 5, aligned: true },
} satisfies ToolExample<Input, Output>;
export const serialIssueRangeCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/serial-issue-range-count",
    title: "Serial Issue Range Count Tool",
    description:
      "Count issue positions in an inclusive numeric progression; do not infer combined or missing issues.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstIssue: { type: "integer", minimum: 0 },
        lastIssue: { type: "integer" },
        stride: { type: "integer", minimum: 1 },
      },
      required: ["firstIssue", "lastIssue", "stride"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { count: { type: "integer" }, aligned: { type: "boolean" } },
      required: ["count", "aligned"],
    },
    ports: {
      inputs: [
        {
          id: "firstIssue",
          label: "First Issue",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastIssue",
          label: "Last Issue",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stride",
          label: "Stride",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
        { id: "aligned", label: "Aligned", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = serialIssueRangeCountTool.execute;
export default serialIssueRangeCountTool;
