import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: readonly number[];
  readonly referenceCenter: readonly number[];
  readonly unitToCommon: number;
};
export type Output = {
  readonly relativeCoordinate: readonly number[];
  readonly distance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceCenter: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    unitToCommon: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coordinate", "referenceCenter", "unitToCommon"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeCoordinate: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    distance: { type: "number" },
  },
  required: ["relativeCoordinate", "distance"],
} as const;
/** Calculate atomic center coordinate reference from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, referenceCenter, unitToCommon } = request;
  const compute = (): Output => {
    H.domain(coordinate.length === 3 && referenceCenter.length === 3);
    H.positive(unitToCommon);
    return (() => {
      const relativeCoordinate = coordinate.map(
        (x, i) => (x - referenceCenter[i]) * unitToCommon,
      );
      return {
        relativeCoordinate,
        distance: Math.hypot(...relativeCoordinate),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: [4, 6, 3], referenceCenter: [1, 2, 3], unitToCommon: 2 },
  output: { relativeCoordinate: [6, 8, 0], distance: 10 },
} satisfies ToolExample<Input, Output>;
export const atomicCenterCoordinateReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-chemistry/atomic-center-coordinate-reference",
    title: "Atomic Center Coordinate Reference Tool",
    description:
      "Calculate atomic center coordinate reference from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "array", maxItems: 256, items: { type: "number" } },
        referenceCenter: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        unitToCommon: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["coordinate", "referenceCenter", "unitToCommon"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeCoordinate: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        distance: { type: "number" },
      },
      required: ["relativeCoordinate", "distance"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceCenter",
          label: "Reference Center",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "unitToCommon",
          label: "Unit To Common",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeCoordinate",
          label: "Relative Coordinate",
          valueType: { type: "list", items: { type: "number" } },
        },
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = atomicCenterCoordinateReferenceTool.execute;
export default atomicCenterCoordinateReferenceTool;
