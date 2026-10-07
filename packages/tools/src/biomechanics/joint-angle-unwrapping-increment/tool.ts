import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousWrappedDegrees: number;
  readonly currentWrappedDegrees: number;
};
export type Output = { readonly shortestIncrementDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousWrappedDegrees: { type: "number" },
    currentWrappedDegrees: { type: "number" },
  },
  required: ["previousWrappedDegrees", "currentWrappedDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shortestIncrementDegrees: { type: "number" } },
  required: ["shortestIncrementDegrees"],
} as const;
/** Calculate the shortest signed wrapped angle increment in degrees with the exact half-turn tie assigned to -180. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousWrappedDegrees, currentWrappedDegrees } = request;
  const compute = (): Output => {
    return (() => {
      const raw =
        (currentWrappedDegrees % 360) - (previousWrappedDegrees % 360);
      return {
        shortestIncrementDegrees: ((((raw + 180) % 360) + 360) % 360) - 180,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousWrappedDegrees: 170, currentWrappedDegrees: -170 },
  output: { shortestIncrementDegrees: 20 },
} satisfies ToolExample<Input, Output>;
export const jointAngleUnwrappingIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomechanics", "engineering"],
      keywords: ["biomechanics", "engineering"],
    },
    id: "biomechanics/joint-angle-unwrapping-increment",
    title: "Joint Angle Unwrapping Increment",
    description:
      "Calculate the shortest signed wrapped angle increment in degrees with the exact half-turn tie assigned to -180.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousWrappedDegrees: { type: "number" },
        currentWrappedDegrees: { type: "number" },
      },
      required: ["previousWrappedDegrees", "currentWrappedDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { shortestIncrementDegrees: { type: "number" } },
      required: ["shortestIncrementDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "previousWrappedDegrees",
          label: "Previous Wrapped Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentWrappedDegrees",
          label: "Current Wrapped Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shortestIncrementDegrees",
          label: "Shortest Increment Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = jointAngleUnwrappingIncrementTool.execute;
export default jointAngleUnwrappingIncrementTool;
