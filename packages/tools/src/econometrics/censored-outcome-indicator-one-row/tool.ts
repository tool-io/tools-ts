import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latent: number;
  readonly lower: number;
  readonly upper: number;
};
export type Output = {
  readonly observed: number;
  readonly leftCensored: boolean;
  readonly rightCensored: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latent: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["latent", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    leftCensored: { type: "boolean" },
    rightCensored: { type: "boolean" },
  },
  required: ["observed", "leftCensored", "rightCensored"],
} as const;
/** Two-sided observed-value censoring with equality assigned to a boundary censor indicator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latent, lower, upper } = request;
  const compute = (): Output => {
    H.domain(upper > lower);
    return {
      observed: Math.max(lower, Math.min(upper, latent)),
      leftCensored: latent <= lower,
      rightCensored: latent >= upper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { latent: -2, lower: 0, upper: 10 },
  output: { observed: 0, leftCensored: true, rightCensored: false },
} satisfies ToolExample<Input, Output>;
export const censoredOutcomeIndicatorOneRowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/censored-outcome-indicator-one-row",
    title: "Censored Outcome Indicator One Row Tool",
    description:
      "Two-sided observed-value censoring with equality assigned to a boundary censor indicator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latent: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["latent", "lower", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "number" },
        leftCensored: { type: "boolean" },
        rightCensored: { type: "boolean" },
      },
      required: ["observed", "leftCensored", "rightCensored"],
    },
    ports: {
      inputs: [
        {
          id: "latent",
          label: "Latent",
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
      ],
      outputs: [
        { id: "observed", label: "Observed", valueType: { type: "number" } },
        {
          id: "leftCensored",
          label: "Left Censored",
          valueType: { type: "boolean" },
        },
        {
          id: "rightCensored",
          label: "Right Censored",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = censoredOutcomeIndicatorOneRowTool.execute;
export default censoredOutcomeIndicatorOneRowTool;
