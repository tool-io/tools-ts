import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly answered: number;
  readonly skipped: number;
  readonly inapplicable: number;
  readonly includeSkipped: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly unfilled: number;
  readonly answeredShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    answered: { type: "integer", minimum: 0 },
    skipped: { type: "integer", minimum: 0 },
    inapplicable: { type: "integer", minimum: 0 },
    includeSkipped: { type: "boolean" },
  },
  required: ["answered", "skipped", "inapplicable", "includeSkipped"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    unfilled: { type: "integer" },
    answeredShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "unfilled", "answeredShare", "defined"],
} as const;
/** Research form-completion denominators only, without imputing skipped item scores. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { answered, skipped, inapplicable, includeSkipped } = request;
  const compute = (): Output => {
    H.integer(answered, 0);
    H.integer(skipped, 0);
    H.integer(inapplicable, 0);
    return {
      denominator: answered + (includeSkipped ? skipped : 0),
      unfilled: skipped + inapplicable,
      answeredShare:
        answered + (includeSkipped ? skipped : 0) > 0
          ? answered / (answered + (includeSkipped ? skipped : 0))
          : 0,
      defined: answered + (includeSkipped ? skipped : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { answered: 8, skipped: 2, inapplicable: 1, includeSkipped: true },
  output: { denominator: 10, unfilled: 3, answeredShare: 0.8, defined: true },
} satisfies ToolExample<Input, Output>;
export const researchItemSkipBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/research-item-skip-base-flag",
    title: "Research Item Skip Base Flag Tool",
    description:
      "Research form-completion denominators only, without imputing skipped item scores.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        answered: { type: "integer", minimum: 0 },
        skipped: { type: "integer", minimum: 0 },
        inapplicable: { type: "integer", minimum: 0 },
        includeSkipped: { type: "boolean" },
      },
      required: ["answered", "skipped", "inapplicable", "includeSkipped"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        unfilled: { type: "integer" },
        answeredShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "unfilled", "answeredShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "answered",
          label: "Answered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "skipped",
          label: "Skipped",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inapplicable",
          label: "Inapplicable",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeSkipped",
          label: "Include Skipped",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        { id: "unfilled", label: "Unfilled", valueType: { type: "integer" } },
        {
          id: "answeredShare",
          label: "Answered Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = researchItemSkipBaseFlagTool.execute;
export default researchItemSkipBaseFlagTool;
