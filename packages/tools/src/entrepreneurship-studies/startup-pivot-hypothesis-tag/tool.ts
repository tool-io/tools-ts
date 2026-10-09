import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly experimentCode: string;
  readonly previousHypothesis: string;
  readonly proposedHypothesis: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    experimentCode: { type: "string", maxLength: 8192, minLength: 1 },
    previousHypothesis: { type: "string", maxLength: 8192, minLength: 1 },
    proposedHypothesis: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["experimentCode", "previousHypothesis", "proposedHypothesis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicitly recorded previous and proposed startup hypotheses without recommending a pivot. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { experimentCode, previousHypothesis, proposedHypothesis } = request;
  const compute = (): Output => {
    H.domain(experimentCode.length > 0, "experimentCode");
    H.domain(previousHypothesis.length > 0, "previousHypothesis");
    H.domain(proposedHypothesis.length > 0, "proposedHypothesis");
    return {
      token: JSON.stringify([
        experimentCode,
        previousHypothesis,
        proposedHypothesis,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    experimentCode: "EXP17",
    previousHypothesis: "retail",
    proposedHypothesis: "wholesale",
  },
  output: { token: '["EXP17","retail","wholesale"]' },
} satisfies ToolExample<Input, Output>;
export const startupPivotHypothesisTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "entrepreneurship-studies",
        "entrepreneurship studies",
        "business and finance",
      ],
      keywords: ["entrepreneurship studies", "business and finance"],
    },
    id: "entrepreneurship-studies/startup-pivot-hypothesis-tag",
    title: "Startup Pivot Hypothesis Tag",
    description:
      "Pair explicitly recorded previous and proposed startup hypotheses without recommending a pivot.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        experimentCode: { type: "string", maxLength: 8192, minLength: 1 },
        previousHypothesis: { type: "string", maxLength: 8192, minLength: 1 },
        proposedHypothesis: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["experimentCode", "previousHypothesis", "proposedHypothesis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "experimentCode",
          label: "Experiment Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "previousHypothesis",
          label: "Previous Hypothesis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "proposedHypothesis",
          label: "Proposed Hypothesis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = startupPivotHypothesisTagTool.execute;
export default startupPivotHypothesisTagTool;
