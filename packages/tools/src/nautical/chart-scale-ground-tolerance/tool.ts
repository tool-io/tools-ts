import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chartTolerance: number;
  readonly scaleDenominator: number;
  readonly suppliedChartUnitInMeters: number;
};
export type Output = { readonly groundToleranceMeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chartTolerance: { type: "number", minimum: 0 },
    scaleDenominator: { type: "number", exclusiveMinimum: 0 },
    suppliedChartUnitInMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["chartTolerance", "scaleDenominator", "suppliedChartUnitInMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { groundToleranceMeters: { type: "number" } },
  required: ["groundToleranceMeters"],
} as const;
/** Convert an explicit chart measurement tolerance to ground distance without assigning navigational accuracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chartTolerance, scaleDenominator, suppliedChartUnitInMeters } =
    request;
  const compute = (): Output => {
    H.domain(chartTolerance >= 0);
    H.positive(scaleDenominator);
    H.positive(suppliedChartUnitInMeters);
    return {
      groundToleranceMeters:
        chartTolerance * scaleDenominator * suppliedChartUnitInMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    chartTolerance: 0.5,
    scaleDenominator: 50000,
    suppliedChartUnitInMeters: 0.001,
  },
  output: { groundToleranceMeters: 25 },
} satisfies ToolExample<Input, Output>;
export const chartScaleGroundToleranceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/chart-scale-ground-tolerance",
    title: "Chart Scale Ground Tolerance Tool",
    description:
      "Convert an explicit chart measurement tolerance to ground distance without assigning navigational accuracy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chartTolerance: { type: "number", minimum: 0 },
        scaleDenominator: { type: "number", exclusiveMinimum: 0 },
        suppliedChartUnitInMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "chartTolerance",
        "scaleDenominator",
        "suppliedChartUnitInMeters",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { groundToleranceMeters: { type: "number" } },
      required: ["groundToleranceMeters"],
    },
    ports: {
      inputs: [
        {
          id: "chartTolerance",
          label: "Chart Tolerance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleDenominator",
          label: "Scale Denominator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedChartUnitInMeters",
          label: "Supplied Chart Unit In Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "groundToleranceMeters",
          label: "Ground Tolerance Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chartScaleGroundToleranceTool.execute;
export default chartScaleGroundToleranceTool;
