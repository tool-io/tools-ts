import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly longDiameter: number;
  readonly shortDiameter: number;
  readonly shapeCoefficient: number;
};
export type Output = { readonly volume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    longDiameter: { type: "number", minimum: 0 },
    shortDiameter: { type: "number", minimum: 0 },
    shapeCoefficient: { type: "number", minimum: 0 },
  },
  required: ["longDiameter", "shortDiameter", "shapeCoefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volume: { type: "number" } },
  required: ["volume"],
} as const;
/** Supplied rotational ellipsoid-like shape factor times long diameter and squared short diameter; the geometry coefficient is explicit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { longDiameter, shortDiameter, shapeCoefficient } = request;
  const compute = (): Output => {
    H.domain(longDiameter >= 0 && shortDiameter >= 0 && shapeCoefficient >= 0);
    return { volume: shapeCoefficient * longDiameter * shortDiameter ** 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    longDiameter: 2,
    shortDiameter: 1,
    shapeCoefficient: 0.5235987755982988,
  },
  output: { volume: 1.0471975511965976 },
} satisfies ToolExample<Input, Output>;
export const larvalFishYolkSacVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/larval-fish-yolk-sac-volume-term",
    title: "Larval Fish Yolk Sac Volume Term Tool",
    description:
      "Supplied rotational ellipsoid-like shape factor times long diameter and squared short diameter; the geometry coefficient is explicit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        longDiameter: { type: "number", minimum: 0 },
        shortDiameter: { type: "number", minimum: 0 },
        shapeCoefficient: { type: "number", minimum: 0 },
      },
      required: ["longDiameter", "shortDiameter", "shapeCoefficient"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volume: { type: "number" } },
      required: ["volume"],
    },
    ports: {
      inputs: [
        {
          id: "longDiameter",
          label: "Long Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shortDiameter",
          label: "Short Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shapeCoefficient",
          label: "Shape Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "volume", label: "Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = larvalFishYolkSacVolumeTermTool.execute;
export default larvalFishYolkSacVolumeTermTool;
