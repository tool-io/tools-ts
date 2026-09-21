import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly length: number;
  readonly edgeDepth: number;
};
export type Output = { readonly coreArea: number; readonly edgeArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", minimum: 0 },
    length: { type: "number", minimum: 0 },
    edgeDepth: { type: "number", minimum: 0 },
  },
  required: ["width", "length", "edgeDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coreArea: { type: "number" }, edgeArea: { type: "number" } },
  required: ["coreArea", "edgeArea"],
} as const;
/** Rectangular habitat with an inward edge buffer and no negative core dimensions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, length, edgeDepth } = request;
  const compute = (): Output => {
    H.domain(width >= 0 && length >= 0 && edgeDepth >= 0);
    return {
      coreArea:
        Math.max(0, width - 2 * edgeDepth) *
        Math.max(0, length - 2 * edgeDepth),
      edgeArea:
        width * length -
        Math.max(0, width - 2 * edgeDepth) *
          Math.max(0, length - 2 * edgeDepth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 100, length: 200, edgeDepth: 10 },
  output: { coreArea: 14400, edgeArea: 5600 },
} satisfies ToolExample<Input, Output>;
export const fieldEdgeHabitatCoreAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/field-edge-habitat-core-area-term",
    title: "Field Edge Habitat Core Area Term Tool",
    description:
      "Rectangular habitat with an inward edge buffer and no negative core dimensions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", minimum: 0 },
        length: { type: "number", minimum: 0 },
        edgeDepth: { type: "number", minimum: 0 },
      },
      required: ["width", "length", "edgeDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coreArea: { type: "number" },
        edgeArea: { type: "number" },
      },
      required: ["coreArea", "edgeArea"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
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
          id: "edgeDepth",
          label: "Edge Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "coreArea", label: "Core Area", valueType: { type: "number" } },
        { id: "edgeArea", label: "Edge Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fieldEdgeHabitatCoreAreaTermTool.execute;
export default fieldEdgeHabitatCoreAreaTermTool;
