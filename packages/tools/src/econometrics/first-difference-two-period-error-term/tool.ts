import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOutcome: number;
  readonly secondOutcome: number;
  readonly firstRegressor: number;
  readonly secondRegressor: number;
  readonly slope: number;
};
export type Output = {
  readonly outcomeDifference: number;
  readonly regressorDifference: number;
  readonly residualDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOutcome: { type: "number" },
    secondOutcome: { type: "number" },
    firstRegressor: { type: "number" },
    secondRegressor: { type: "number" },
    slope: { type: "number" },
  },
  required: [
    "firstOutcome",
    "secondOutcome",
    "firstRegressor",
    "secondRegressor",
    "slope",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outcomeDifference: { type: "number" },
    regressorDifference: { type: "number" },
    residualDifference: { type: "number" },
  },
  required: ["outcomeDifference", "regressorDifference", "residualDifference"],
} as const;
/** Calculate first difference two period error term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstOutcome,
    secondOutcome,
    firstRegressor,
    secondRegressor,
    slope,
  } = request;
  const compute = (): Output => {
    return {
      outcomeDifference: secondOutcome - firstOutcome,
      regressorDifference: secondRegressor - firstRegressor,
      residualDifference:
        secondOutcome -
        firstOutcome -
        slope * (secondRegressor - firstRegressor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstOutcome: 10,
    secondOutcome: 18,
    firstRegressor: 2,
    secondRegressor: 5,
    slope: 2,
  },
  output: {
    outcomeDifference: 8,
    regressorDifference: 3,
    residualDifference: 2,
  },
} satisfies ToolExample<Input, Output>;
export const firstDifferenceTwoPeriodErrorTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/first-difference-two-period-error-term",
    title: "First Difference Two Period Error Term Tool",
    description:
      "Calculate first difference two period error term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOutcome: { type: "number" },
        secondOutcome: { type: "number" },
        firstRegressor: { type: "number" },
        secondRegressor: { type: "number" },
        slope: { type: "number" },
      },
      required: [
        "firstOutcome",
        "secondOutcome",
        "firstRegressor",
        "secondRegressor",
        "slope",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outcomeDifference: { type: "number" },
        regressorDifference: { type: "number" },
        residualDifference: { type: "number" },
      },
      required: [
        "outcomeDifference",
        "regressorDifference",
        "residualDifference",
      ],
    },
    ports: {
      inputs: [
        {
          id: "firstOutcome",
          label: "First Outcome",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOutcome",
          label: "Second Outcome",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstRegressor",
          label: "First Regressor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRegressor",
          label: "Second Regressor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "outcomeDifference",
          label: "Outcome Difference",
          valueType: { type: "number" },
        },
        {
          id: "regressorDifference",
          label: "Regressor Difference",
          valueType: { type: "number" },
        },
        {
          id: "residualDifference",
          label: "Residual Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = firstDifferenceTwoPeriodErrorTermTool.execute;
export default firstDifferenceTwoPeriodErrorTermTool;
