import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPerProtein: number;
  readonly referencePerProtein: number;
};
export type Output = { readonly ratio: number; readonly scorePercent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPerProtein: { type: "number", minimum: 0 },
    referencePerProtein: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredPerProtein", "referencePerProtein"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, scorePercent: { type: "number" } },
  required: ["ratio", "scorePercent"],
} as const;
/** One uncapped amino-acid/reference ratio on matching protein units, excluding digestibility and minimum-over-all-amino-acids aggregation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredPerProtein, referencePerProtein } = request;
  const compute = (): Output => {
    H.domain(measuredPerProtein >= 0);
    H.positive(referencePerProtein);
    return {
      ratio: measuredPerProtein / referencePerProtein,
      scorePercent: (100 * measuredPerProtein) / referencePerProtein,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredPerProtein: 30, referencePerProtein: 40 },
  output: { ratio: 0.75, scorePercent: 75 },
} satisfies ToolExample<Input, Output>;
export const aminoAcidScoreOneReferenceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/amino-acid-score-one-reference-ratio",
    title: "Amino Acid Score One Reference Ratio Tool",
    description:
      "One uncapped amino-acid/reference ratio on matching protein units, excluding digestibility and minimum-over-all-amino-acids aggregation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPerProtein: { type: "number", minimum: 0 },
        referencePerProtein: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredPerProtein", "referencePerProtein"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratio: { type: "number" },
        scorePercent: { type: "number" },
      },
      required: ["ratio", "scorePercent"],
    },
    ports: {
      inputs: [
        {
          id: "measuredPerProtein",
          label: "Measured Per Protein",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePerProtein",
          label: "Reference Per Protein",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "scorePercent",
          label: "Score Percent",
          valueType: { type: "number", unit: "%" },
        },
      ],
    },
  },
  calculate,
});
export const run = aminoAcidScoreOneReferenceRatioTool.execute;
export default aminoAcidScoreOneReferenceRatioTool;
