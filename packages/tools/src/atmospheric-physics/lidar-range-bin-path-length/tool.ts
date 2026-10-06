import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roundTripTimeWidthSeconds: number;
  readonly propagationSpeed: number;
};
export type Output = { readonly oneWayRangeWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roundTripTimeWidthSeconds: { type: "number", minimum: 0 },
    propagationSpeed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["roundTripTimeWidthSeconds", "propagationSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { oneWayRangeWidth: { type: "number" } },
  required: ["oneWayRangeWidth"],
} as const;
/** Convert supplied two-way lidar bin time width to one-way range using an explicit positive propagation speed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roundTripTimeWidthSeconds, propagationSpeed } = request;
  const compute = (): Output => {
    H.domain(roundTripTimeWidthSeconds >= 0, "roundTripTimeWidthSeconds");
    (H.domain(
      Number.isFinite(propagationSpeed) && propagationSpeed > 0,
      "propagationSpeed",
    ),
      propagationSpeed);
    return {
      oneWayRangeWidth: (propagationSpeed * roundTripTimeWidthSeconds) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { roundTripTimeWidthSeconds: 0.000001, propagationSpeed: 300000000 },
  output: { oneWayRangeWidth: 150 },
} satisfies ToolExample<Input, Output>;
export const lidarRangeBinPathLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-physics", "atmospheric physics", "physics"],
      keywords: ["atmospheric physics", "physics"],
    },
    id: "atmospheric-physics/lidar-range-bin-path-length",
    title: "Lidar Range Bin Path Length",
    description:
      "Convert supplied two-way lidar bin time width to one-way range using an explicit positive propagation speed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roundTripTimeWidthSeconds: { type: "number", minimum: 0 },
        propagationSpeed: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["roundTripTimeWidthSeconds", "propagationSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { oneWayRangeWidth: { type: "number" } },
      required: ["oneWayRangeWidth"],
    },
    ports: {
      inputs: [
        {
          id: "roundTripTimeWidthSeconds",
          label: "Round Trip Time Width Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "propagationSpeed",
          label: "Propagation Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "oneWayRangeWidth",
          label: "One Way Range Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lidarRangeBinPathLengthTool.execute;
export default lidarRangeBinPathLengthTool;
