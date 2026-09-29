import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly runoffMm: number;
  readonly areaKm2: number;
  readonly connectedFraction: number;
};
export type Output = {
  readonly grossVolumeM3: number;
  readonly connectedVolumeM3: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    runoffMm: { type: "number", minimum: 0 },
    areaKm2: { type: "number", minimum: 0 },
    connectedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["runoffMm", "areaKm2", "connectedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossVolumeM3: { type: "number" },
    connectedVolumeM3: { type: "number" },
  },
  required: ["grossVolumeM3", "connectedVolumeM3"],
} as const;
/** One millimeter over one square kilometer is 1000 m3; connected fraction is an explicit areal assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { runoffMm, areaKm2, connectedFraction } = request;
  const compute = (): Output => {
    H.domain(runoffMm >= 0 && areaKm2 >= 0);
    H.probability(connectedFraction);
    return {
      grossVolumeM3: 1000 * runoffMm * areaKm2,
      connectedVolumeM3: 1000 * runoffMm * areaKm2 * connectedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { runoffMm: 20, areaKm2: 5, connectedFraction: 0.8 },
  output: { grossVolumeM3: 100000, connectedVolumeM3: 80000 },
} satisfies ToolExample<Input, Output>;
export const runoffDepthCatchmentVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/runoff-depth-catchment-volume",
    title: "Runoff Depth Catchment Volume Tool",
    description:
      "One millimeter over one square kilometer is 1000 m3; connected fraction is an explicit areal assumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        runoffMm: { type: "number", minimum: 0 },
        areaKm2: { type: "number", minimum: 0 },
        connectedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["runoffMm", "areaKm2", "connectedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossVolumeM3: { type: "number" },
        connectedVolumeM3: { type: "number" },
      },
      required: ["grossVolumeM3", "connectedVolumeM3"],
    },
    ports: {
      inputs: [
        {
          id: "runoffMm",
          label: "Runoff Mm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaKm2",
          label: "Area Km2",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "connectedFraction",
          label: "Connected Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossVolumeM3",
          label: "Gross Volume M3",
          valueType: { type: "number" },
        },
        {
          id: "connectedVolumeM3",
          label: "Connected Volume M3",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = runoffDepthCatchmentVolumeTool.execute;
export default runoffDepthCatchmentVolumeTool;
