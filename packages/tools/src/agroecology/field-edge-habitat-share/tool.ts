import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalArea: number;
  readonly edgeArea: number;
  readonly excludedEdgeArea: number;
};
export type Output = { readonly usableEdge: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalArea: { type: "number", exclusiveMinimum: 0 },
    edgeArea: { type: "number", minimum: 0 },
    excludedEdgeArea: { type: "number", minimum: 0 },
  },
  required: ["totalArea", "edgeArea", "excludedEdgeArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { usableEdge: { type: "number" }, share: { type: "number" } },
  required: ["usableEdge", "share"],
} as const;
/** Calculate field edge habitat share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalArea, edgeArea, excludedEdgeArea } = request;
  const compute = (): Output => {
    H.positive(totalArea);
    H.domain(
      edgeArea >= 0 &&
        edgeArea <= totalArea &&
        excludedEdgeArea >= 0 &&
        excludedEdgeArea <= edgeArea,
    );
    return {
      usableEdge: edgeArea - excludedEdgeArea,
      share: (edgeArea - excludedEdgeArea) / totalArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalArea: 100, edgeArea: 20, excludedEdgeArea: 5 },
  output: { usableEdge: 15, share: 0.15 },
} satisfies ToolExample<Input, Output>;
export const fieldEdgeHabitatShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/field-edge-habitat-share",
    title: "Field Edge Habitat Share Tool",
    description:
      "Calculate field edge habitat share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalArea: { type: "number", exclusiveMinimum: 0 },
        edgeArea: { type: "number", minimum: 0 },
        excludedEdgeArea: { type: "number", minimum: 0 },
      },
      required: ["totalArea", "edgeArea", "excludedEdgeArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { usableEdge: { type: "number" }, share: { type: "number" } },
      required: ["usableEdge", "share"],
    },
    ports: {
      inputs: [
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "edgeArea",
          label: "Edge Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedEdgeArea",
          label: "Excluded Edge Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableEdge",
          label: "Usable Edge",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fieldEdgeHabitatShareTool.execute;
export default fieldEdgeHabitatShareTool;
