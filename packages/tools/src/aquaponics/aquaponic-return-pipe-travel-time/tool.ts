import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pipeLengthMeters: number;
  readonly suppliedMeanVelocityMetersPerSecond: number;
};
export type Output = { readonly travelSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pipeLengthMeters: { type: "number", minimum: 0 },
    suppliedMeanVelocityMetersPerSecond: {
      type: "number",
      exclusiveMinimum: 0,
    },
  },
  required: ["pipeLengthMeters", "suppliedMeanVelocityMetersPerSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { travelSeconds: { type: "number" } },
  required: ["travelSeconds"],
} as const;
/** Divide explicit pipe length by supplied positive mean velocity under steady uniform flow without estimating hydraulic losses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pipeLengthMeters, suppliedMeanVelocityMetersPerSecond } = request;
  const compute = (): Output => {
    H.domain(pipeLengthMeters >= 0, "pipeLengthMeters");
    (H.domain(
      suppliedMeanVelocityMetersPerSecond > 0,
      "suppliedMeanVelocityMetersPerSecond",
    ),
      suppliedMeanVelocityMetersPerSecond);
    return {
      travelSeconds: pipeLengthMeters / suppliedMeanVelocityMetersPerSecond,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pipeLengthMeters: 12, suppliedMeanVelocityMetersPerSecond: 0.5 },
  output: { travelSeconds: 24 },
} satisfies ToolExample<Input, Output>;
export const aquaponicReturnPipeTravelTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaponics", "agriculture"],
      keywords: ["aquaponics", "agriculture"],
    },
    id: "aquaponics/aquaponic-return-pipe-travel-time",
    title: "Aquaponic Return Pipe Travel Time",
    description:
      "Divide explicit pipe length by supplied positive mean velocity under steady uniform flow without estimating hydraulic losses.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pipeLengthMeters: { type: "number", minimum: 0 },
        suppliedMeanVelocityMetersPerSecond: {
          type: "number",
          exclusiveMinimum: 0,
        },
      },
      required: ["pipeLengthMeters", "suppliedMeanVelocityMetersPerSecond"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { travelSeconds: { type: "number" } },
      required: ["travelSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "pipeLengthMeters",
          label: "Pipe Length Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMeanVelocityMetersPerSecond",
          label: "Supplied Mean Velocity Meters Per Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "travelSeconds",
          label: "Travel Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaponicReturnPipeTravelTimeTool.execute;
export default aquaponicReturnPipeTravelTimeTool;
