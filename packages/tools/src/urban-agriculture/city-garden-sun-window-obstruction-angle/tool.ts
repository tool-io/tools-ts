import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wallHeight: number;
  readonly bedHeight: number;
  readonly separation: number;
};
export type Output = { readonly obstructionRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wallHeight: { type: "number" },
    bedHeight: { type: "number" },
    separation: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wallHeight", "bedHeight", "separation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { obstructionRadians: { type: "number" } },
  required: ["obstructionRadians"],
} as const;
/** Calculate city garden sun window obstruction angle from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wallHeight, bedHeight, separation } = request;
  const compute = (): Output => {
    H.positive(separation);
    return {
      obstructionRadians: Math.atan2(wallHeight - bedHeight, separation),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wallHeight: 5, bedHeight: 1, separation: 4 },
  output: { obstructionRadians: 0.7853981633974483 },
} satisfies ToolExample<Input, Output>;
export const cityGardenSunWindowObstructionAngleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "urban-agriculture/city-garden-sun-window-obstruction-angle",
      title: "City Garden Sun Window Obstruction Angle Tool",
      description:
        "Calculate city garden sun window obstruction angle from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wallHeight: { type: "number" },
          bedHeight: { type: "number" },
          separation: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["wallHeight", "bedHeight", "separation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { obstructionRadians: { type: "number" } },
        required: ["obstructionRadians"],
      },
      ports: {
        inputs: [
          {
            id: "wallHeight",
            label: "Wall Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bedHeight",
            label: "Bed Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "separation",
            label: "Separation",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "obstructionRadians",
            label: "Obstruction Radians",
            valueType: { type: "number", unit: "rad" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cityGardenSunWindowObstructionAngleTool.execute;
export default cityGardenSunWindowObstructionAngleTool;
