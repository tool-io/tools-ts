import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rackFootprints: readonly number[];
  readonly aisleArea: number;
  readonly otherArea: number;
  readonly layers: number;
};
export type Output = {
  readonly floorFraction: number;
  readonly canopyFloorRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rackFootprints: { type: "array", maxItems: 256, items: { type: "number" } },
    aisleArea: { type: "number", minimum: 0 },
    otherArea: { type: "number", minimum: 0 },
    layers: { type: "integer", minimum: 0 },
  },
  required: ["rackFootprints", "aisleArea", "otherArea", "layers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    floorFraction: { type: "number" },
    canopyFloorRatio: { type: "number" },
  },
  required: ["floorFraction", "canopyFloorRatio"],
} as const;
/** Calculate aisle rack floor utilization share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rackFootprints, aisleArea, otherArea, layers } = request;
  const compute = (): Output => {
    H.integer(layers, 0);
    H.domain(
      rackFootprints.every((x) => x >= 0) &&
        aisleArea >= 0 &&
        otherArea >= 0 &&
        rackFootprints.reduce((a, b) => a + b, 0) + aisleArea + otherArea > 0,
    );
    return {
      floorFraction:
        rackFootprints.reduce((a, b) => a + b, 0) /
        (rackFootprints.reduce((a, b) => a + b, 0) + aisleArea + otherArea),
      canopyFloorRatio:
        (rackFootprints.reduce((a, b) => a + b, 0) * layers) /
        (rackFootprints.reduce((a, b) => a + b, 0) + aisleArea + otherArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rackFootprints: [10, 20], aisleArea: 10, otherArea: 10, layers: 4 },
  output: { floorFraction: 0.6, canopyFloorRatio: 2.4 },
} satisfies ToolExample<Input, Output>;
export const aisleRackFloorUtilizationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/aisle-rack-floor-utilization-share",
    title: "Aisle Rack Floor Utilization Share Tool",
    description:
      "Calculate aisle rack floor utilization share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rackFootprints: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        aisleArea: { type: "number", minimum: 0 },
        otherArea: { type: "number", minimum: 0 },
        layers: { type: "integer", minimum: 0 },
      },
      required: ["rackFootprints", "aisleArea", "otherArea", "layers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        floorFraction: { type: "number" },
        canopyFloorRatio: { type: "number" },
      },
      required: ["floorFraction", "canopyFloorRatio"],
    },
    ports: {
      inputs: [
        {
          id: "rackFootprints",
          label: "Rack Footprints",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "aisleArea",
          label: "Aisle Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherArea",
          label: "Other Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "layers",
          label: "Layers",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "floorFraction",
          label: "Floor Fraction",
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "canopyFloorRatio",
          label: "Canopy Floor Ratio",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = aisleRackFloorUtilizationShareTool.execute;
export default aisleRackFloorUtilizationShareTool;
