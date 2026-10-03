import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observation: number;
  readonly center: number;
  readonly sigma: number;
  readonly suppliedMultiple: number;
};
export type Output = {
  readonly standardized: number;
  readonly lower: number;
  readonly upper: number;
  readonly outside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observation: { type: "number" },
    center: { type: "number" },
    sigma: { type: "number", exclusiveMinimum: 0 },
    suppliedMultiple: { type: "number", minimum: 0 },
  },
  required: ["observation", "center", "sigma", "suppliedMultiple"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    standardized: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    outside: { type: "boolean" },
  },
  required: ["standardized", "lower", "upper", "outside"],
} as const;
/** Compare one supplied observation to explicitly parameterized chart limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observation, center, sigma, suppliedMultiple } = request;
  const compute = (): Output => {
    H.positive(sigma);
    H.domain(suppliedMultiple >= 0);
    return {
      standardized: (observation - center) / sigma,
      lower: center - suppliedMultiple * sigma,
      upper: center + suppliedMultiple * sigma,
      outside: Math.abs(observation - center) > suppliedMultiple * sigma,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observation: 14, center: 10, sigma: 2, suppliedMultiple: 3 },
  output: { standardized: 2, lower: 4, upper: 16, outside: false },
} satisfies ToolExample<Input, Output>;
export const controlChartOnePointStandardizedGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "quality-control/control-chart-one-point-standardized-gap",
      title: "Control Chart One Point Standardized Gap Tool",
      description:
        "Compare one supplied observation to explicitly parameterized chart limits.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observation: { type: "number" },
          center: { type: "number" },
          sigma: { type: "number", exclusiveMinimum: 0 },
          suppliedMultiple: { type: "number", minimum: 0 },
        },
        required: ["observation", "center", "sigma", "suppliedMultiple"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          standardized: { type: "number" },
          lower: { type: "number" },
          upper: { type: "number" },
          outside: { type: "boolean" },
        },
        required: ["standardized", "lower", "upper", "outside"],
      },
      ports: {
        inputs: [
          {
            id: "observation",
            label: "Observation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "center",
            label: "Center",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sigma",
            label: "Sigma",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedMultiple",
            label: "Supplied Multiple",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "standardized",
            label: "Standardized",
            valueType: { type: "number" },
          },
          { id: "lower", label: "Lower", valueType: { type: "number" } },
          { id: "upper", label: "Upper", valueType: { type: "number" } },
          { id: "outside", label: "Outside", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = controlChartOnePointStandardizedGapTool.execute;
export default controlChartOnePointStandardizedGapTool;
