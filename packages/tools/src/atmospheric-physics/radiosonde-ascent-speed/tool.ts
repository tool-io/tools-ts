import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstHeightMeters: number;
  readonly secondHeightMeters: number;
  readonly elapsedSeconds: number;
};
export type Output = { readonly verticalSpeedMetersPerSecond: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstHeightMeters: { type: "number" },
    secondHeightMeters: { type: "number" },
    elapsedSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstHeightMeters", "secondHeightMeters", "elapsedSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { verticalSpeedMetersPerSecond: { type: "number" } },
  required: ["verticalSpeedMetersPerSecond"],
} as const;
/** Compute a signed mean radiosonde vertical speed between two heights over a positive elapsed interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstHeightMeters, secondHeightMeters, elapsedSeconds } = request;
  const compute = (): Output => {
    (H.domain(elapsedSeconds > 0, "elapsedSeconds"), elapsedSeconds);
    return {
      verticalSpeedMetersPerSecond:
        (secondHeightMeters - firstHeightMeters) / elapsedSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstHeightMeters: 100,
    secondHeightMeters: 400,
    elapsedSeconds: 60,
  },
  output: { verticalSpeedMetersPerSecond: 5 },
} satisfies ToolExample<Input, Output>;
export const radiosondeAscentSpeedTool = H.defineSchemaCalculation<
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
    id: "atmospheric-physics/radiosonde-ascent-speed",
    title: "Radiosonde Ascent Speed",
    description:
      "Compute a signed mean radiosonde vertical speed between two heights over a positive elapsed interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstHeightMeters: { type: "number" },
        secondHeightMeters: { type: "number" },
        elapsedSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstHeightMeters", "secondHeightMeters", "elapsedSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { verticalSpeedMetersPerSecond: { type: "number" } },
      required: ["verticalSpeedMetersPerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "firstHeightMeters",
          label: "First Height Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondHeightMeters",
          label: "Second Height Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedSeconds",
          label: "Elapsed Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "verticalSpeedMetersPerSecond",
          label: "Vertical Speed Meters Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = radiosondeAscentSpeedTool.execute;
export default radiosondeAscentSpeedTool;
