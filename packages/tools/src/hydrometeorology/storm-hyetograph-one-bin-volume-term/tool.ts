import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly depthMm: number;
  readonly areaKm2: number;
  readonly coveredFraction: number;
  readonly durationMinutes: number;
};
export type Output = {
  readonly volumeM3: number;
  readonly meanFlowM3PerSecond: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depthMm: { type: "number", minimum: 0 },
    areaKm2: { type: "number", minimum: 0 },
    coveredFraction: { type: "number", minimum: 0, maximum: 1 },
    durationMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["depthMm", "areaKm2", "coveredFraction", "durationMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeM3: { type: "number" },
    meanFlowM3PerSecond: { type: "number" },
  },
  required: ["volumeM3", "meanFlowM3PerSecond"],
} as const;
/** One precipitation-bin volume and equivalent uniform water input rate, without a runoff routing model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depthMm, areaKm2, coveredFraction, durationMinutes } = request;
  const compute = (): Output => {
    H.domain(depthMm >= 0 && areaKm2 >= 0);
    H.probability(coveredFraction);
    H.positive(durationMinutes);
    return {
      volumeM3: 1000 * depthMm * areaKm2 * coveredFraction,
      meanFlowM3PerSecond:
        (1000 * depthMm * areaKm2 * coveredFraction) / (60 * durationMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { depthMm: 10, areaKm2: 2, coveredFraction: 0.5, durationMinutes: 30 },
  output: { volumeM3: 10000, meanFlowM3PerSecond: 5.555555555555555 },
} satisfies ToolExample<Input, Output>;
export const stormHyetographOneBinVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/storm-hyetograph-one-bin-volume-term",
    title: "Storm Hyetograph One Bin Volume Term Tool",
    description:
      "One precipitation-bin volume and equivalent uniform water input rate, without a runoff routing model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depthMm: { type: "number", minimum: 0 },
        areaKm2: { type: "number", minimum: 0 },
        coveredFraction: { type: "number", minimum: 0, maximum: 1 },
        durationMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["depthMm", "areaKm2", "coveredFraction", "durationMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeM3: { type: "number" },
        meanFlowM3PerSecond: { type: "number" },
      },
      required: ["volumeM3", "meanFlowM3PerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "depthMm",
          label: "Depth Mm",
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
          id: "coveredFraction",
          label: "Covered Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationMinutes",
          label: "Duration Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
      ],
      outputs: [
        { id: "volumeM3", label: "Volume M3", valueType: { type: "number" } },
        {
          id: "meanFlowM3PerSecond",
          label: "Mean Flow M3Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stormHyetographOneBinVolumeTermTool.execute;
export default stormHyetographOneBinVolumeTermTool;
