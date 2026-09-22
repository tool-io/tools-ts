import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly length: number;
  readonly includeEnds: boolean;
};
export type Output = {
  readonly volume: number;
  readonly area: number;
  readonly areaPerVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    length: { type: "number", exclusiveMinimum: 0 },
    includeEnds: { type: "boolean" },
  },
  required: ["radius", "length", "includeEnds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number" },
    area: { type: "number" },
    areaPerVolume: { type: "number" },
  },
  required: ["volume", "area", "areaPerVolume"],
} as const;
/** Calculate scaffold surface volume cylinder term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, length, includeEnds } = request;
  const compute = (): Output => {
    H.positive(radius);
    H.positive(length);
    return {
      volume: Math.PI * radius ** 2 * length,
      area:
        2 * Math.PI * radius * length +
        (includeEnds ? 2 * Math.PI * radius ** 2 : 0),
      areaPerVolume: 2 / radius + (includeEnds ? 2 / length : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 1, length: 2, includeEnds: true },
  output: {
    volume: 6.283185307179586,
    area: 18.84955592153876,
    areaPerVolume: 3,
  },
} satisfies ToolExample<Input, Output>;
export const scaffoldSurfaceVolumeCylinderTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/scaffold-surface-volume-cylinder-term",
    title: "Scaffold Surface Volume Cylinder Term Tool",
    description:
      "Calculate scaffold surface volume cylinder term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", exclusiveMinimum: 0 },
        length: { type: "number", exclusiveMinimum: 0 },
        includeEnds: { type: "boolean" },
      },
      required: ["radius", "length", "includeEnds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number" },
        area: { type: "number" },
        areaPerVolume: { type: "number" },
      },
      required: ["volume", "area", "areaPerVolume"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeEnds",
          label: "Include Ends",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "volume", label: "Volume", valueType: { type: "number" } },
        { id: "area", label: "Area", valueType: { type: "number" } },
        {
          id: "areaPerVolume",
          label: "Area Per Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scaffoldSurfaceVolumeCylinderTermTool.execute;
export default scaffoldSurfaceVolumeCylinderTermTool;
