import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerArea: number;
  readonly plantedArea: number;
};
export type Output = {
  readonly edgeArea: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerArea: { type: "number", minimum: 0 },
    plantedArea: { type: "number", minimum: 0 },
  },
  required: ["outerArea", "plantedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeArea: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["edgeArea", "share", "defined"],
} as const;
/** Calculate planter edge area remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerArea, plantedArea } = request;
  const compute = (): Output => {
    H.domain(outerArea >= 0 && plantedArea >= 0 && plantedArea <= outerArea);
    return {
      edgeArea: outerArea - plantedArea,
      share: outerArea > 0 ? (outerArea - plantedArea) / outerArea : 0,
      defined: outerArea > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerArea: 20, plantedArea: 15 },
  output: { edgeArea: 5, share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const planterEdgeAreaRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/planter-edge-area-remainder",
    title: "Planter Edge Area Remainder Tool",
    description:
      "Calculate planter edge area remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerArea: { type: "number", minimum: 0 },
        plantedArea: { type: "number", minimum: 0 },
      },
      required: ["outerArea", "plantedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgeArea: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["edgeArea", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "outerArea",
          label: "Outer Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plantedArea",
          label: "Planted Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "edgeArea", label: "Edge Area", valueType: { type: "number" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = planterEdgeAreaRemainderTool.execute;
export default planterEdgeAreaRemainderTool;
