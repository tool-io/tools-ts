import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly results: readonly number[];
  readonly areas: readonly number[];
};
export type Output = { readonly areaWeighted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    results: { type: "array", maxItems: 256, items: { type: "number" } },
    areas: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["results", "areas"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { areaWeighted: { type: "number" } },
  required: ["areaWeighted"],
} as const;
/** Calculate urban soil test sample area weight term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { results, areas } = request;
  const compute = (): Output => {
    H.sameLength(results, areas);
    H.domain(areas.every((x) => x >= 0) && areas.some((x) => x > 0));
    return {
      areaWeighted: H.dot(results, areas) / areas.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { results: [2, 6], areas: [10, 30] },
  output: { areaWeighted: 5 },
} satisfies ToolExample<Input, Output>;
export const urbanSoilTestSampleAreaWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/urban-soil-test-sample-area-weight-term",
    title: "Urban Soil Test Sample Area Weight Term Tool",
    description:
      "Calculate urban soil test sample area weight term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        results: { type: "array", maxItems: 256, items: { type: "number" } },
        areas: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["results", "areas"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { areaWeighted: { type: "number" } },
      required: ["areaWeighted"],
    },
    ports: {
      inputs: [
        {
          id: "results",
          label: "Results",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "areas",
          label: "Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "areaWeighted",
          label: "Area Weighted",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urbanSoilTestSampleAreaWeightTermTool.execute;
export default urbanSoilTestSampleAreaWeightTermTool;
