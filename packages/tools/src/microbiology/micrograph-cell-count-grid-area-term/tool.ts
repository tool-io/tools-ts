import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly countedSquares: number;
  readonly squareArea: number;
  readonly wholeImageArea: number;
};
export type Output = {
  readonly countedArea: number;
  readonly density: number;
  readonly imageEquivalentCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    countedSquares: { type: "integer", minimum: 1 },
    squareArea: { type: "number", exclusiveMinimum: 0 },
    wholeImageArea: { type: "number" },
  },
  required: ["count", "countedSquares", "squareArea", "wholeImageArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedArea: { type: "number" },
    density: { type: "number" },
    imageEquivalentCount: { type: "number" },
  },
  required: ["countedArea", "density", "imageEquivalentCount"],
} as const;
/** Calculate micrograph cell count grid area term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, countedSquares, squareArea, wholeImageArea } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.integer(countedSquares, 1);
    H.positive(squareArea);
    H.domain(wholeImageArea >= countedSquares * squareArea);
    return {
      countedArea: countedSquares * squareArea,
      density: count / (countedSquares * squareArea),
      imageEquivalentCount:
        (count * wholeImageArea) / (countedSquares * squareArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 100, countedSquares: 10, squareArea: 0.2, wholeImageArea: 5 },
  output: { countedArea: 2, density: 50, imageEquivalentCount: 250 },
} satisfies ToolExample<Input, Output>;
export const micrographCellCountGridAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/micrograph-cell-count-grid-area-term",
    title: "Micrograph Cell Count Grid Area Term Tool",
    description:
      "Calculate micrograph cell count grid area term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        countedSquares: { type: "integer", minimum: 1 },
        squareArea: { type: "number", exclusiveMinimum: 0 },
        wholeImageArea: { type: "number" },
      },
      required: ["count", "countedSquares", "squareArea", "wholeImageArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedArea: { type: "number" },
        density: { type: "number" },
        imageEquivalentCount: { type: "number" },
      },
      required: ["countedArea", "density", "imageEquivalentCount"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countedSquares",
          label: "Counted Squares",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "squareArea",
          label: "Square Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wholeImageArea",
          label: "Whole Image Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "countedArea",
          label: "Counted Area",
          valueType: { type: "number" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
        {
          id: "imageEquivalentCount",
          label: "Image Equivalent Count",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = micrographCellCountGridAreaTermTool.execute;
export default micrographCellCountGridAreaTermTool;
