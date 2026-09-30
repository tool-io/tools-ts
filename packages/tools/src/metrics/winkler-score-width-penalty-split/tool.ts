import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly lower: number;
  readonly upper: number;
  readonly alpha: number;
};
export type Output = {
  readonly width: number;
  readonly penalty: number;
  readonly score: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    alpha: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
  },
  required: ["observed", "lower", "upper", "alpha"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    penalty: { type: "number" },
    score: { type: "number" },
  },
  required: ["width", "penalty", "score"],
} as const;
/** Calculate winkler score width penalty split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, lower, upper, alpha } = request;
  const compute = (): Output => {
    H.domain(lower <= upper && alpha > 0 && alpha < 1);
    const width = upper - lower,
      penalty =
        (2 * (Math.max(0, lower - observed) + Math.max(0, observed - upper))) /
        alpha;
    return { width, penalty, score: width + penalty };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 12, lower: 5, upper: 10, alpha: 0.1 },
  output: { width: 5, penalty: 40, score: 45 },
} satisfies ToolExample<Input, Output>;
export const winklerScoreWidthPenaltySplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/winkler-score-width-penalty-split",
    title: "Winkler Score Width Penalty Split Tool",
    description:
      "Calculate winkler score width penalty split from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        alpha: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
      },
      required: ["observed", "lower", "upper", "alpha"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        penalty: { type: "number" },
        score: { type: "number" },
      },
      required: ["width", "penalty", "score"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alpha",
          label: "Alpha",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        { id: "penalty", label: "Penalty", valueType: { type: "number" } },
        { id: "score", label: "Score", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = winklerScoreWidthPenaltySplitTool.execute;
export default winklerScoreWidthPenaltySplitTool;
