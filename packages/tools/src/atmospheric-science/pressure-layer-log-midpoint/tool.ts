import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bottomPressure: number;
  readonly topPressure: number;
};
export type Output = {
  readonly midPressure: number;
  readonly logThickness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bottomPressure: { type: "number", exclusiveMinimum: 0 },
    topPressure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["bottomPressure", "topPressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    midPressure: { type: "number" },
    logThickness: { type: "number" },
  },
  required: ["midPressure", "logThickness"],
} as const;
/** Find the midpoint in log-pressure coordinates using positive supplied pressures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bottomPressure, topPressure } = request;
  const compute = (): Output => {
    H.positive(bottomPressure);
    H.positive(topPressure);
    return {
      midPressure: Math.exp(
        (Math.log(bottomPressure) + Math.log(topPressure)) / 2,
      ),
      logThickness: Math.log(bottomPressure / topPressure),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bottomPressure: 1000, topPressure: 250 },
  output: { midPressure: 499.99999999999983, logThickness: 1.3862943611198906 },
} satisfies ToolExample<Input, Output>;
export const pressureLayerLogMidpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/pressure-layer-log-midpoint",
    title: "Pressure Layer Log Midpoint Tool",
    description:
      "Find the midpoint in log-pressure coordinates using positive supplied pressures.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bottomPressure: { type: "number", exclusiveMinimum: 0 },
        topPressure: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["bottomPressure", "topPressure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midPressure: { type: "number" },
        logThickness: { type: "number" },
      },
      required: ["midPressure", "logThickness"],
    },
    ports: {
      inputs: [
        {
          id: "bottomPressure",
          label: "Bottom Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "topPressure",
          label: "Top Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "midPressure",
          label: "Mid Pressure",
          valueType: { type: "number" },
        },
        {
          id: "logThickness",
          label: "Log Thickness",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pressureLayerLogMidpointTool.execute;
export default pressureLayerLogMidpointTool;
