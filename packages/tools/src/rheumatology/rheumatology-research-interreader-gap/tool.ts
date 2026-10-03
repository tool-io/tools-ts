import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
  readonly maximumGap: number;
};
export type Output = {
  readonly differences: readonly number[];
  readonly meanDifference: number;
  readonly outsideIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
    maximumGap: { type: "number", minimum: 0 },
  },
  required: ["first", "second", "maximumGap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    differences: { type: "array", maxItems: 256, items: { type: "number" } },
    meanDifference: { type: "number" },
    outsideIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["differences", "meanDifference", "outsideIndices"],
} as const;
/** Calculate rheumatology research interreader gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, maximumGap } = request;
  const compute = (): Output => {
    H.sameLength(first, second);
    H.domain(first.length > 0 && maximumGap >= 0);
    return {
      differences: second.map((x, i) => x - first[i]),
      meanDifference: second.reduce(
        (a, x, i) => a + (x - first[i]) / second.length,
        0,
      ),
      outsideIndices: second.flatMap((x, i) =>
        Math.abs(x - first[i]) > maximumGap ? [i] : [],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: [2, 4, 6], second: [3, 2, 6], maximumGap: 1 },
  output: {
    differences: [1, -2, 0],
    meanDifference: -0.3333333333333333,
    outsideIndices: [1],
  },
} satisfies ToolExample<Input, Output>;
export const rheumatologyResearchInterreaderGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/rheumatology-research-interreader-gap",
    title: "Rheumatology Research Interreader Gap Tool",
    description:
      "Calculate rheumatology research interreader gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", maxItems: 256, items: { type: "number" } },
        second: { type: "array", maxItems: 256, items: { type: "number" } },
        maximumGap: { type: "number", minimum: 0 },
      },
      required: ["first", "second", "maximumGap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        differences: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        meanDifference: { type: "number" },
        outsideIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["differences", "meanDifference", "outsideIndices"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "maximumGap",
          label: "Maximum Gap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "differences",
          label: "Differences",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "meanDifference",
          label: "Mean Difference",
          valueType: { type: "number" },
        },
        {
          id: "outsideIndices",
          label: "Outside Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = rheumatologyResearchInterreaderGapTool.execute;
export default rheumatologyResearchInterreaderGapTool;
