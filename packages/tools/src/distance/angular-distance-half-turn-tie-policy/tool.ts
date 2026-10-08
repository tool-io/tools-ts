import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDegrees: number;
  readonly secondDegrees: number;
  readonly positiveHalfturn: boolean;
};
export type Output = { readonly signedShortestDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDegrees: { type: "number" },
    secondDegrees: { type: "number" },
    positiveHalfturn: { type: "boolean" },
  },
  required: ["firstDegrees", "secondDegrees", "positiveHalfturn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedShortestDegrees: { type: "number" } },
  required: ["signedShortestDegrees"],
} as const;
/** Compute the shortest signed circular displacement in degrees with an explicit half-turn tie policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDegrees, secondDegrees, positiveHalfturn } = request;
  const compute = (): Output => {
    return {
      signedShortestDegrees: (() => {
        const raw = ((secondDegrees % 360) - (firstDegrees % 360)) % 360;
        const wrapped = raw > 180 ? raw - 360 : raw < -180 ? raw + 360 : raw;
        return Math.abs(wrapped) === 180
          ? positiveHalfturn
            ? 180
            : -180
          : wrapped;
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDegrees: 350, secondDegrees: 10, positiveHalfturn: true },
  output: { signedShortestDegrees: 20 },
} satisfies ToolExample<Input, Output>;
export const angularDistanceHalfturnTiePolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["distance", "mathematics"],
      keywords: ["distance", "mathematics"],
    },
    id: "distance/angular-distance-half-turn-tie-policy",
    title: "Angular Distance Half Turn Tie Policy",
    description:
      "Compute the shortest signed circular displacement in degrees with an explicit half-turn tie policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDegrees: { type: "number" },
        secondDegrees: { type: "number" },
        positiveHalfturn: { type: "boolean" },
      },
      required: ["firstDegrees", "secondDegrees", "positiveHalfturn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedShortestDegrees: { type: "number" } },
      required: ["signedShortestDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "firstDegrees",
          label: "First Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDegrees",
          label: "Second Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveHalfturn",
          label: "Positive Halfturn",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedShortestDegrees",
          label: "Signed Shortest Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = angularDistanceHalfturnTiePolicyTool.execute;
export default angularDistanceHalfturnTiePolicyTool;
