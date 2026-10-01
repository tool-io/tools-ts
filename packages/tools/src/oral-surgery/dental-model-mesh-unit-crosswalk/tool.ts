import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vertices: readonly (readonly number[])[];
  readonly unitsPerMeter: number;
  readonly targetUnitsPerMeter: number;
};
export type Output = {
  readonly vertices: readonly (readonly number[])[];
  readonly factor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertices: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
    unitsPerMeter: { type: "number", exclusiveMinimum: 0 },
    targetUnitsPerMeter: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["vertices", "unitsPerMeter", "targetUnitsPerMeter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertices: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
    factor: { type: "number" },
  },
  required: ["vertices", "factor"],
} as const;
/** Rescale explicit mesh vertices between supplied unit bases. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vertices, unitsPerMeter, targetUnitsPerMeter } = request;
  const compute = (): Output => {
    H.positive(unitsPerMeter);
    H.positive(targetUnitsPerMeter);
    H.domain(
      vertices.every((x) => x.length === 3),
      "vertices",
    );
    const factor = targetUnitsPerMeter / unitsPerMeter;
    return { vertices: vertices.map((v) => v.map((x) => x * factor)), factor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    vertices: [
      [1, 2, 3],
      [0, -1, 2],
    ],
    unitsPerMeter: 1000,
    targetUnitsPerMeter: 100,
  },
  output: {
    vertices: [
      [0.1, 0.2, 0.30000000000000004],
      [0, -0.1, 0.2],
    ],
    factor: 0.1,
  },
} satisfies ToolExample<Input, Output>;
export const dentalModelMeshUnitCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/dental-model-mesh-unit-crosswalk",
    title: "Dental Model Mesh Unit Crosswalk Tool",
    description: "Rescale explicit mesh vertices between supplied unit bases.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vertices: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
        unitsPerMeter: { type: "number", exclusiveMinimum: 0 },
        targetUnitsPerMeter: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["vertices", "unitsPerMeter", "targetUnitsPerMeter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vertices: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
        factor: { type: "number" },
      },
      required: ["vertices", "factor"],
    },
    ports: {
      inputs: [
        {
          id: "vertices",
          label: "Vertices",
          required: true,
          valueType: {
            type: "list",
            items: { type: "list", items: { type: "number" } },
          },
        },
        {
          id: "unitsPerMeter",
          label: "Units Per Meter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetUnitsPerMeter",
          label: "Target Units Per Meter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "vertices",
          label: "Vertices",
          valueType: {
            type: "list",
            items: { type: "list", items: { type: "number" } },
          },
        },
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dentalModelMeshUnitCrosswalkTool.execute;
export default dentalModelMeshUnitCrosswalkTool;
