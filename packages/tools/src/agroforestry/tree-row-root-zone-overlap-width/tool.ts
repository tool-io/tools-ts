import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRadius: number;
  readonly secondRadius: number;
  readonly rowSpacing: number;
};
export type Output = {
  readonly overlapWidth: number;
  readonly clearWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRadius: { type: "number", minimum: 0 },
    secondRadius: { type: "number", minimum: 0 },
    rowSpacing: { type: "number", minimum: 0 },
  },
  required: ["firstRadius", "secondRadius", "rowSpacing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapWidth: { type: "number" },
    clearWidth: { type: "number" },
  },
  required: ["overlapWidth", "clearWidth"],
} as const;
/** Intersection width of the two one-dimensional root-zone intervals centered on their rows, including contained intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRadius, secondRadius, rowSpacing } = request;
  const compute = (): Output => {
    H.domain(firstRadius >= 0 && secondRadius >= 0 && rowSpacing >= 0);
    return {
      overlapWidth: Math.max(
        0,
        Math.min(firstRadius, rowSpacing + secondRadius) -
          Math.max(-firstRadius, rowSpacing - secondRadius),
      ),
      clearWidth: Math.max(0, rowSpacing - firstRadius - secondRadius),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRadius: 3, secondRadius: 2, rowSpacing: 4 },
  output: { overlapWidth: 1, clearWidth: 0 },
} satisfies ToolExample<Input, Output>;
export const treeRowRootZoneOverlapWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/tree-row-root-zone-overlap-width",
    title: "Tree Row Root Zone Overlap Width Tool",
    description:
      "Intersection width of the two one-dimensional root-zone intervals centered on their rows, including contained intervals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRadius: { type: "number", minimum: 0 },
        secondRadius: { type: "number", minimum: 0 },
        rowSpacing: { type: "number", minimum: 0 },
      },
      required: ["firstRadius", "secondRadius", "rowSpacing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapWidth: { type: "number" },
        clearWidth: { type: "number" },
      },
      required: ["overlapWidth", "clearWidth"],
    },
    ports: {
      inputs: [
        {
          id: "firstRadius",
          label: "First Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRadius",
          label: "Second Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rowSpacing",
          label: "Row Spacing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapWidth",
          label: "Overlap Width",
          valueType: { type: "number" },
        },
        {
          id: "clearWidth",
          label: "Clear Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeRowRootZoneOverlapWidthTool.execute;
export default treeRowRootZoneOverlapWidthTool;
