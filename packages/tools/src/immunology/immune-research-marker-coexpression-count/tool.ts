import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly both: number;
  readonly firstOnly: number;
  readonly secondOnly: number;
  readonly neither: number;
};
export type Output = {
  readonly total: number;
  readonly firstPositive: number;
  readonly secondPositive: number;
  readonly bothOfEither: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    both: { type: "integer", minimum: 0 },
    firstOnly: { type: "integer", minimum: 0 },
    secondOnly: { type: "integer", minimum: 0 },
    neither: { type: "integer", minimum: 0 },
  },
  required: ["both", "firstOnly", "secondOnly", "neither"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "integer" },
    firstPositive: { type: "integer" },
    secondPositive: { type: "integer" },
    bothOfEither: { type: "number" },
  },
  required: ["total", "firstPositive", "secondPositive", "bothOfEither"],
} as const;
/** Calculate immune research marker coexpression count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { both, firstOnly, secondOnly, neither } = request;
  const compute = (): Output => {
    H.integer(both, 0);
    H.integer(firstOnly, 0);
    H.integer(secondOnly, 0);
    H.integer(neither, 0);
    H.domain(both + firstOnly + secondOnly > 0);
    return {
      total: both + firstOnly + secondOnly + neither,
      firstPositive: both + firstOnly,
      secondPositive: both + secondOnly,
      bothOfEither: both / (both + firstOnly + secondOnly),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { both: 20, firstOnly: 30, secondOnly: 10, neither: 40 },
  output: {
    total: 100,
    firstPositive: 50,
    secondPositive: 30,
    bothOfEither: 0.3333333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const immuneResearchMarkerCoexpressionCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/immune-research-marker-coexpression-count",
      title: "Immune Research Marker Coexpression Count Tool",
      description:
        "Calculate immune research marker coexpression count from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          both: { type: "integer", minimum: 0 },
          firstOnly: { type: "integer", minimum: 0 },
          secondOnly: { type: "integer", minimum: 0 },
          neither: { type: "integer", minimum: 0 },
        },
        required: ["both", "firstOnly", "secondOnly", "neither"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          total: { type: "integer" },
          firstPositive: { type: "integer" },
          secondPositive: { type: "integer" },
          bothOfEither: { type: "number" },
        },
        required: ["total", "firstPositive", "secondPositive", "bothOfEither"],
      },
      ports: {
        inputs: [
          {
            id: "both",
            label: "Both",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "firstOnly",
            label: "First Only",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondOnly",
            label: "Second Only",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "neither",
            label: "Neither",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "total", label: "Total", valueType: { type: "integer" } },
          {
            id: "firstPositive",
            label: "First Positive",
            valueType: { type: "integer" },
          },
          {
            id: "secondPositive",
            label: "Second Positive",
            valueType: { type: "integer" },
          },
          {
            id: "bothOfEither",
            label: "Both Of Either",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = immuneResearchMarkerCoexpressionCountTool.execute;
export default immuneResearchMarkerCoexpressionCountTool;
