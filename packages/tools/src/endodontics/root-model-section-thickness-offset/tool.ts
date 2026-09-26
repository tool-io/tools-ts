import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly index: number;
  readonly nominalThickness: number;
  readonly missingBefore: number;
  readonly originDepth: number;
};
export type Output = {
  readonly nominalDepth: number;
  readonly correctedDepth: number;
  readonly lostDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer", minimum: 0 },
    nominalThickness: { type: "number", exclusiveMinimum: 0 },
    missingBefore: { type: "integer", minimum: 0 },
    originDepth: { type: "number" },
  },
  required: ["index", "nominalThickness", "missingBefore", "originDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalDepth: { type: "number" },
    correctedDepth: { type: "number" },
    lostDepth: { type: "number" },
  },
  required: ["nominalDepth", "correctedDepth", "lostDepth"],
} as const;
/** Calculate root model section thickness offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { index, nominalThickness, missingBefore, originDepth } = request;
  const compute = (): Output => {
    H.integer(index, 0);
    H.integer(missingBefore, 0);
    H.positive(nominalThickness);
    return {
      nominalDepth: originDepth + index * nominalThickness,
      correctedDepth: originDepth + (index + missingBefore) * nominalThickness,
      lostDepth: missingBefore * nominalThickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { index: 10, nominalThickness: 0.1, missingBefore: 2, originDepth: 1 },
  output: { nominalDepth: 2, correctedDepth: 2.2, lostDepth: 0.2 },
} satisfies ToolExample<Input, Output>;
export const rootModelSectionThicknessOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/root-model-section-thickness-offset",
    title: "Root Model Section Thickness Offset Tool",
    description:
      "Calculate root model section thickness offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer", minimum: 0 },
        nominalThickness: { type: "number", exclusiveMinimum: 0 },
        missingBefore: { type: "integer", minimum: 0 },
        originDepth: { type: "number" },
      },
      required: ["index", "nominalThickness", "missingBefore", "originDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalDepth: { type: "number" },
        correctedDepth: { type: "number" },
        lostDepth: { type: "number" },
      },
      required: ["nominalDepth", "correctedDepth", "lostDepth"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nominalThickness",
          label: "Nominal Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "missingBefore",
          label: "Missing Before",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "originDepth",
          label: "Origin Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalDepth",
          label: "Nominal Depth",
          valueType: { type: "number" },
        },
        {
          id: "correctedDepth",
          label: "Corrected Depth",
          valueType: { type: "number" },
        },
        { id: "lostDepth", label: "Lost Depth", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rootModelSectionThicknessOffsetTool.execute;
export default rootModelSectionThicknessOffsetTool;
