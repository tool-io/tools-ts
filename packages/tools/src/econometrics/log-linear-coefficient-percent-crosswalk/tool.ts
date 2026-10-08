import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly logCoefficient: number;
  readonly predictorChange: number;
};
export type Output = {
  readonly exactMultiplicativeFactor: number;
  readonly exactPercentChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logCoefficient: { type: "number" },
    predictorChange: { type: "number" },
  },
  required: ["logCoefficient", "predictorChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exactMultiplicativeFactor: { type: "number" },
    exactPercentChange: { type: "number" },
  },
  required: ["exactMultiplicativeFactor", "exactPercentChange"],
} as const;
/** Convert a supplied natural-log outcome coefficient and predictor change into an exact exponential response factor without estimating a model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logCoefficient, predictorChange } = request;
  const compute = (): Output => {
    return {
      exactMultiplicativeFactor: Math.exp(logCoefficient * predictorChange),
      exactPercentChange: 100 * Math.expm1(logCoefficient * predictorChange),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { logCoefficient: 0.1, predictorChange: 2 },
  output: {
    exactMultiplicativeFactor: 1.2214027581601699,
    exactPercentChange: 22.140275816016985,
  },
} satisfies ToolExample<Input, Output>;
export const logLinearCoefficientPercentCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["econometrics", "economics"],
        keywords: ["econometrics", "economics"],
      },
      id: "econometrics/log-linear-coefficient-percent-crosswalk",
      title: "Log Linear Coefficient Percent Crosswalk",
      description:
        "Convert a supplied natural-log outcome coefficient and predictor change into an exact exponential response factor without estimating a model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          logCoefficient: { type: "number" },
          predictorChange: { type: "number" },
        },
        required: ["logCoefficient", "predictorChange"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exactMultiplicativeFactor: { type: "number" },
          exactPercentChange: { type: "number" },
        },
        required: ["exactMultiplicativeFactor", "exactPercentChange"],
      },
      ports: {
        inputs: [
          {
            id: "logCoefficient",
            label: "Log Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "predictorChange",
            label: "Predictor Change",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "exactMultiplicativeFactor",
            label: "Exact Multiplicative Factor",
            valueType: { type: "number" },
          },
          {
            id: "exactPercentChange",
            label: "Exact Percent Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = logLinearCoefficientPercentCrosswalkTool.execute;
export default logLinearCoefficientPercentCrosswalkTool;
