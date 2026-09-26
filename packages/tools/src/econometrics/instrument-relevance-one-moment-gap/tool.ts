import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly instrumentMean: number;
  readonly regressorMean: number;
  readonly meanProduct: number;
  readonly referenceCovariance: number;
};
export type Output = { readonly covariance: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instrumentMean: { type: "number" },
    regressorMean: { type: "number" },
    meanProduct: { type: "number" },
    referenceCovariance: { type: "number" },
  },
  required: [
    "instrumentMean",
    "regressorMean",
    "meanProduct",
    "referenceCovariance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { covariance: { type: "number" }, gap: { type: "number" } },
  required: ["covariance", "gap"],
} as const;
/** One supplied cross-moment covariance; relevance and exogeneity need separate statistical evidence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { instrumentMean, regressorMean, meanProduct, referenceCovariance } =
    request;
  const compute = (): Output => {
    return {
      covariance: meanProduct - instrumentMean * regressorMean,
      gap: meanProduct - instrumentMean * regressorMean - referenceCovariance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    instrumentMean: 2,
    regressorMean: 3,
    meanProduct: 8,
    referenceCovariance: 1,
  },
  output: { covariance: 2, gap: 1 },
} satisfies ToolExample<Input, Output>;
export const instrumentRelevanceOneMomentGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/instrument-relevance-one-moment-gap",
    title: "Instrument Relevance One Moment Gap Tool",
    description:
      "One supplied cross-moment covariance; relevance and exogeneity need separate statistical evidence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        instrumentMean: { type: "number" },
        regressorMean: { type: "number" },
        meanProduct: { type: "number" },
        referenceCovariance: { type: "number" },
      },
      required: [
        "instrumentMean",
        "regressorMean",
        "meanProduct",
        "referenceCovariance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { covariance: { type: "number" }, gap: { type: "number" } },
      required: ["covariance", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "instrumentMean",
          label: "Instrument Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "regressorMean",
          label: "Regressor Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "meanProduct",
          label: "Mean Product",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceCovariance",
          label: "Reference Covariance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "covariance",
          label: "Covariance",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = instrumentRelevanceOneMomentGapTool.execute;
export default instrumentRelevanceOneMomentGapTool;
