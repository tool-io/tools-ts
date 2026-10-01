import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLong: number;
  readonly firstShort: number;
  readonly secondLong: number;
  readonly secondShort: number;
};
export type Output = {
  readonly firstArea: number;
  readonly secondArea: number;
  readonly areaRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLong: { type: "number", exclusiveMinimum: 0 },
    firstShort: { type: "number", exclusiveMinimum: 0 },
    secondLong: { type: "number", minimum: 0 },
    secondShort: { type: "number", minimum: 0 },
  },
  required: ["firstLong", "firstShort", "secondLong", "secondShort"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstArea: { type: "number" },
    secondArea: { type: "number" },
    areaRatio: { type: "number" },
  },
  required: ["firstArea", "secondArea", "areaRatio"],
} as const;
/** Ideal elliptical projected-area ratio from supplied research diameters; no lesion segmentation or treatment-response classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLong, firstShort, secondLong, secondShort } = request;
  const compute = (): Output => {
    H.positive(firstLong);
    H.positive(firstShort);
    H.domain(secondLong >= 0 && secondShort >= 0);
    return {
      firstArea: (Math.PI * firstLong * firstShort) / 4,
      secondArea: (Math.PI * secondLong * secondShort) / 4,
      areaRatio: (secondLong * secondShort) / (firstLong * firstShort),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLong: 20, firstShort: 10, secondLong: 10, secondShort: 10 },
  output: {
    firstArea: 157.07963267948966,
    secondArea: 78.53981633974483,
    areaRatio: 0.5,
  },
} satisfies ToolExample<Input, Output>;
export const tumorResearchEllipseAreaChangeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/tumor-research-ellipse-area-change-term",
    title: "Tumor Research Ellipse Area Change Term Tool",
    description:
      "Ideal elliptical projected-area ratio from supplied research diameters; no lesion segmentation or treatment-response classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLong: { type: "number", exclusiveMinimum: 0 },
        firstShort: { type: "number", exclusiveMinimum: 0 },
        secondLong: { type: "number", minimum: 0 },
        secondShort: { type: "number", minimum: 0 },
      },
      required: ["firstLong", "firstShort", "secondLong", "secondShort"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstArea: { type: "number" },
        secondArea: { type: "number" },
        areaRatio: { type: "number" },
      },
      required: ["firstArea", "secondArea", "areaRatio"],
    },
    ports: {
      inputs: [
        {
          id: "firstLong",
          label: "First Long",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstShort",
          label: "First Short",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLong",
          label: "Second Long",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondShort",
          label: "Second Short",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "firstArea", label: "First Area", valueType: { type: "number" } },
        {
          id: "secondArea",
          label: "Second Area",
          valueType: { type: "number" },
        },
        { id: "areaRatio", label: "Area Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tumorResearchEllipseAreaChangeTermTool.execute;
export default tumorResearchEllipseAreaChangeTermTool;
