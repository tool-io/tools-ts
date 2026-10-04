import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bottomArea: number;
  readonly topArea: number;
  readonly overlap: number;
};
export type Output = {
  readonly visibleBottom: number;
  readonly visibleTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bottomArea: { type: "number" },
    topArea: { type: "number" },
    overlap: { type: "number", minimum: 0 },
  },
  required: ["bottomArea", "topArea", "overlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleBottom: { type: "number" },
    visibleTotal: { type: "number" },
  },
  required: ["visibleBottom", "visibleTotal"],
} as const;
/** Calculate collage overlap visible area term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bottomArea, topArea, overlap } = request;
  const compute = (): Output => {
    H.domain(overlap >= 0 && bottomArea >= overlap && topArea >= overlap);
    return {
      visibleBottom: bottomArea - overlap,
      visibleTotal: bottomArea + topArea - overlap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bottomArea: 100, topArea: 60, overlap: 20 },
  output: { visibleBottom: 80, visibleTotal: 140 },
} satisfies ToolExample<Input, Output>;
export const collageOverlapVisibleAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/collage-overlap-visible-area-term",
    title: "Collage Overlap Visible Area Term Tool",
    description:
      "Calculate collage overlap visible area term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bottomArea: { type: "number" },
        topArea: { type: "number" },
        overlap: { type: "number", minimum: 0 },
      },
      required: ["bottomArea", "topArea", "overlap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleBottom: { type: "number" },
        visibleTotal: { type: "number" },
      },
      required: ["visibleBottom", "visibleTotal"],
    },
    ports: {
      inputs: [
        {
          id: "bottomArea",
          label: "Bottom Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "topArea",
          label: "Top Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlap",
          label: "Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "visibleBottom",
          label: "Visible Bottom",
          valueType: { type: "number" },
        },
        {
          id: "visibleTotal",
          label: "Visible Total",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = collageOverlapVisibleAreaTermTool.execute;
export default collageOverlapVisibleAreaTermTool;
