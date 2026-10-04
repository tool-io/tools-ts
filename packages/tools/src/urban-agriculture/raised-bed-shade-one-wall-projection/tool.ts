import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wallAboveBed: number;
  readonly solarAltitude: number;
  readonly bedWidth: number;
};
export type Output = {
  readonly shadowLength: number;
  readonly shadedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wallAboveBed: { type: "number", minimum: 0 },
    solarAltitude: { type: "number", exclusiveMinimum: 0 },
    bedWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wallAboveBed", "solarAltitude", "bedWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shadowLength: { type: "number" },
    shadedFraction: { type: "number" },
  },
  required: ["shadowLength", "shadedFraction"],
} as const;
/** Calculate raised bed shade one wall projection from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wallAboveBed, solarAltitude, bedWidth } = request;
  const compute = (): Output => {
    H.domain(
      wallAboveBed >= 0 && solarAltitude > 0 && solarAltitude < Math.PI / 2,
    );
    H.positive(bedWidth);
    return {
      shadowLength: wallAboveBed / Math.tan(solarAltitude),
      shadedFraction: Math.min(
        1,
        wallAboveBed / (Math.tan(solarAltitude) * bedWidth),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wallAboveBed: 2, solarAltitude: 0.7853981633974483, bedWidth: 4 },
  output: {
    shadowLength: 2.0000000000000004,
    shadedFraction: 0.5000000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const raisedBedShadeOneWallProjectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/raised-bed-shade-one-wall-projection",
    title: "Raised BED Shade One Wall Projection Tool",
    description:
      "Calculate raised bed shade one wall projection from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wallAboveBed: { type: "number", minimum: 0 },
        solarAltitude: { type: "number", exclusiveMinimum: 0 },
        bedWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wallAboveBed", "solarAltitude", "bedWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shadowLength: { type: "number" },
        shadedFraction: { type: "number" },
      },
      required: ["shadowLength", "shadedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "wallAboveBed",
          label: "Wall Above Bed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solarAltitude",
          label: "Solar Altitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bedWidth",
          label: "Bed Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shadowLength",
          label: "Shadow Length",
          valueType: { type: "number" },
        },
        {
          id: "shadedFraction",
          label: "Shaded Fraction",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = raisedBedShadeOneWallProjectionTool.execute;
export default raisedBedShadeOneWallProjectionTool;
