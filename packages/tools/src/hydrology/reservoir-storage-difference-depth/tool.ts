import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startStorage: number;
  readonly endStorage: number;
  readonly referenceSurfaceArea: number;
};
export type Output = {
  readonly storageDelta: number;
  readonly equivalentDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startStorage: { type: "number", minimum: 0 },
    endStorage: { type: "number", minimum: 0 },
    referenceSurfaceArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["startStorage", "endStorage", "referenceSurfaceArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storageDelta: { type: "number" },
    equivalentDepth: { type: "number" },
  },
  required: ["storageDelta", "equivalentDepth"],
} as const;
/** Convert a storage change to depth on an explicit fixed reference area, not a varying-stage reservoir curve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startStorage, endStorage, referenceSurfaceArea } = request;
  const compute = (): Output => {
    H.domain(startStorage >= 0 && endStorage >= 0);
    H.positive(referenceSurfaceArea);
    return {
      storageDelta: endStorage - startStorage,
      equivalentDepth: (endStorage - startStorage) / referenceSurfaceArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startStorage: 100, endStorage: 140, referenceSurfaceArea: 20 },
  output: { storageDelta: 40, equivalentDepth: 2 },
} satisfies ToolExample<Input, Output>;
export const reservoirStorageDifferenceDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/reservoir-storage-difference-depth",
    title: "Reservoir Storage Difference Depth Tool",
    description:
      "Convert a storage change to depth on an explicit fixed reference area, not a varying-stage reservoir curve.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startStorage: { type: "number", minimum: 0 },
        endStorage: { type: "number", minimum: 0 },
        referenceSurfaceArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["startStorage", "endStorage", "referenceSurfaceArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        storageDelta: { type: "number" },
        equivalentDepth: { type: "number" },
      },
      required: ["storageDelta", "equivalentDepth"],
    },
    ports: {
      inputs: [
        {
          id: "startStorage",
          label: "Start Storage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endStorage",
          label: "End Storage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceSurfaceArea",
          label: "Reference Surface Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "storageDelta",
          label: "Storage Delta",
          valueType: { type: "number" },
        },
        {
          id: "equivalentDepth",
          label: "Equivalent Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reservoirStorageDifferenceDepthTool.execute;
export default reservoirStorageDifferenceDepthTool;
