import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly firstThickness: number;
  readonly secondThickness: number;
};
export type Output = {
  readonly averageThickness: number;
  readonly volume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    firstThickness: { type: "number", minimum: 0 },
    secondThickness: { type: "number", minimum: 0 },
  },
  required: ["area", "firstThickness", "secondThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    averageThickness: { type: "number" },
    volume: { type: "number" },
  },
  required: ["averageThickness", "volume"],
} as const;
/** Calculate floor screed taper average thickness from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, firstThickness, secondThickness } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && firstThickness >= 0 && secondThickness >= 0);
    return {
      averageThickness: (firstThickness + secondThickness) / 2,
      volume: (area * (firstThickness + secondThickness)) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 100, firstThickness: 0.02, secondThickness: 0.04 },
  output: { averageThickness: 0.03, volume: 3 },
} satisfies ToolExample<Input, Output>;
export const floorScreedTaperAverageThicknessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/floor-screed-taper-average-thickness",
    title: "Floor Screed Taper Average Thickness Tool",
    description:
      "Calculate floor screed taper average thickness from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        firstThickness: { type: "number", minimum: 0 },
        secondThickness: { type: "number", minimum: 0 },
      },
      required: ["area", "firstThickness", "secondThickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        averageThickness: { type: "number" },
        volume: { type: "number" },
      },
      required: ["averageThickness", "volume"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstThickness",
          label: "First Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondThickness",
          label: "Second Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "averageThickness",
          label: "Average Thickness",
          valueType: { type: "number" },
        },
        { id: "volume", label: "Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = floorScreedTaperAverageThicknessTool.execute;
export default floorScreedTaperAverageThicknessTool;
