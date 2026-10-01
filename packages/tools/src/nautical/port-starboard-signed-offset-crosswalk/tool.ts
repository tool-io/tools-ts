import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly offset: number;
  readonly positiveStarboard: boolean;
};
export type Output = { readonly side: string; readonly magnitude: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offset: { type: "number" },
    positiveStarboard: { type: "boolean" },
  },
  required: ["offset", "positiveStarboard"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    side: { type: "string", maxLength: 8192 },
    magnitude: { type: "number" },
  },
  required: ["side", "magnitude"],
} as const;
/** Calculate port starboard signed offset crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { offset, positiveStarboard } = request;
  const compute = (): Output => {
    return {
      side:
        offset === 0
          ? "center"
          : offset > 0 === positiveStarboard
            ? "starboard"
            : "port",
      magnitude: Math.abs(offset),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { offset: -3, positiveStarboard: true },
  output: { side: "port", magnitude: 3 },
} satisfies ToolExample<Input, Output>;
export const portStarboardSignedOffsetCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/port-starboard-signed-offset-crosswalk",
    title: "Port Starboard Signed Offset Crosswalk Tool",
    description:
      "Calculate port starboard signed offset crosswalk from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offset: { type: "number" },
        positiveStarboard: { type: "boolean" },
      },
      required: ["offset", "positiveStarboard"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        side: { type: "string", maxLength: 8192 },
        magnitude: { type: "number" },
      },
      required: ["side", "magnitude"],
    },
    ports: {
      inputs: [
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveStarboard",
          label: "Positive Starboard",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "side", label: "Side", valueType: { type: "string" } },
        { id: "magnitude", label: "Magnitude", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = portStarboardSignedOffsetCrosswalkTool.execute;
export default portStarboardSignedOffsetCrosswalkTool;
