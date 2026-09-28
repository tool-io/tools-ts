import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly binCount: number;
  readonly totalCount: number;
  readonly lower: number;
  readonly upper: number;
};
export type Output = {
  readonly probabilityMass: number;
  readonly density: number;
  readonly width: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    binCount: { type: "integer", minimum: 0 },
    totalCount: { type: "integer", minimum: 1 },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["binCount", "totalCount", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probabilityMass: { type: "number" },
    density: { type: "number" },
    width: { type: "number" },
  },
  required: ["probabilityMass", "density", "width"],
} as const;
/** Calculate hematology histogram one bin width term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { binCount, totalCount, lower, upper } = request;
  const compute = (): Output => {
    H.integer(totalCount, 1);
    H.integer(binCount, 0, totalCount);
    H.domain(upper > lower);
    return {
      probabilityMass: binCount / totalCount,
      density: binCount / (totalCount * (upper - lower)),
      width: upper - lower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { binCount: 20, totalCount: 100, lower: 5, upper: 10 },
  output: { probabilityMass: 0.2, density: 0.04, width: 5 },
} satisfies ToolExample<Input, Output>;
export const hematologyHistogramOneBinWidthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/hematology-histogram-one-bin-width-term",
    title: "Hematology Histogram One Bin Width Term Tool",
    description:
      "Calculate hematology histogram one bin width term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        binCount: { type: "integer", minimum: 0 },
        totalCount: { type: "integer", minimum: 1 },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["binCount", "totalCount", "lower", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probabilityMass: { type: "number" },
        density: { type: "number" },
        width: { type: "number" },
      },
      required: ["probabilityMass", "density", "width"],
    },
    ports: {
      inputs: [
        {
          id: "binCount",
          label: "Bin Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalCount",
          label: "Total Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "probabilityMass",
          label: "Probability Mass",
          valueType: { type: "number" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
        { id: "width", label: "Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hematologyHistogramOneBinWidthTermTool.execute;
export default hematologyHistogramOneBinWidthTermTool;
