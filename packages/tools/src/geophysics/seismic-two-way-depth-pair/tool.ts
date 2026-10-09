import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly twoWaySeconds: number;
  readonly suppliedVelocityMetersPerSecond: number;
};
export type Output = { readonly depthMeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    twoWaySeconds: { type: "number", minimum: 0 },
    suppliedVelocityMetersPerSecond: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["twoWaySeconds", "suppliedVelocityMetersPerSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depthMeters: { type: "number" } },
  required: ["depthMeters"],
} as const;
/** Convert explicit two-way travel time to depth under a supplied constant velocity and vertical straight-path assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { twoWaySeconds, suppliedVelocityMetersPerSecond } = request;
  const compute = (): Output => {
    H.domain(twoWaySeconds >= 0, "twoWaySeconds");
    (H.domain(
      suppliedVelocityMetersPerSecond > 0,
      "suppliedVelocityMetersPerSecond",
    ),
      suppliedVelocityMetersPerSecond);
    return {
      depthMeters: (twoWaySeconds * suppliedVelocityMetersPerSecond) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { twoWaySeconds: 0.4, suppliedVelocityMetersPerSecond: 2000 },
  output: { depthMeters: 400 },
} satisfies ToolExample<Input, Output>;
export const seismicTwoWayDepthPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geophysics", "physics"],
      keywords: ["geophysics", "physics"],
    },
    id: "geophysics/seismic-two-way-depth-pair",
    title: "Seismic Two Way Depth Pair",
    description:
      "Convert explicit two-way travel time to depth under a supplied constant velocity and vertical straight-path assumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        twoWaySeconds: { type: "number", minimum: 0 },
        suppliedVelocityMetersPerSecond: {
          type: "number",
          exclusiveMinimum: 0,
        },
      },
      required: ["twoWaySeconds", "suppliedVelocityMetersPerSecond"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { depthMeters: { type: "number" } },
      required: ["depthMeters"],
    },
    ports: {
      inputs: [
        {
          id: "twoWaySeconds",
          label: "Two Way Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedVelocityMetersPerSecond",
          label: "Supplied Velocity Meters Per Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "depthMeters",
          label: "Depth Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seismicTwoWayDepthPairTool.execute;
export default seismicTwoWayDepthPairTool;
