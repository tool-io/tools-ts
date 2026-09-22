import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly citations: readonly number[];
  readonly paper: number;
};
export type Output = {
  readonly before: number;
  readonly after: number;
  readonly increases: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citations: { type: "array", maxItems: 256, items: { type: "integer" } },
    paper: { type: "integer", minimum: 0 },
  },
  required: ["citations", "paper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "integer" },
    after: { type: "integer" },
    increases: { type: "boolean" },
  },
  required: ["before", "after", "increases"],
} as const;
/** Recompute h before and after exactly one citation to a caller-selected paper. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citations, paper } = request;
  const compute = (): Output => {
    H.domain(citations.every((x) => x >= 0));
    H.integer(paper, 0, citations.length - 1);
    const h = (xs: readonly number[]) =>
        [...xs].sort((a, b) => b - a).filter((x, i) => x >= i + 1).length,
      before = h(citations),
      after = h(citations.map((x, i) => x + (i === paper ? 1 : 0)));
    return { before, after, increases: after > before };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { citations: [3, 2, 2], paper: 1 },
  output: { before: 2, after: 2, increases: false },
} satisfies ToolExample<Input, Output>;
export const hIndexOneNewCitationThresholdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/h-index-one-new-citation-threshold",
    title: "H Index One New Citation Threshold Tool",
    description:
      "Recompute h before and after exactly one citation to a caller-selected paper.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citations: { type: "array", maxItems: 256, items: { type: "integer" } },
        paper: { type: "integer", minimum: 0 },
      },
      required: ["citations", "paper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        before: { type: "integer" },
        after: { type: "integer" },
        increases: { type: "boolean" },
      },
      required: ["before", "after", "increases"],
    },
    ports: {
      inputs: [
        {
          id: "citations",
          label: "Citations",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "paper",
          label: "Paper",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "before", label: "Before", valueType: { type: "integer" } },
        { id: "after", label: "After", valueType: { type: "integer" } },
        { id: "increases", label: "Increases", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = hIndexOneNewCitationThresholdTool.execute;
export default hIndexOneNewCitationThresholdTool;
