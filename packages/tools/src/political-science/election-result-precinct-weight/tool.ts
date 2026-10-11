import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly precinctCount: number;
  readonly totalCount: number;
};
export type Output = { readonly precinctWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    precinctCount: { type: "integer", minimum: 0 },
    totalCount: { type: "integer", minimum: 1 },
  },
  required: ["precinctCount", "totalCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { precinctWeight: { type: "number" } },
  required: ["precinctWeight"],
} as const;
/** Normalize an explicit precinct count to a compatible positive total count without choosing turnout or voter denominators. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { precinctCount, totalCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalCount) &&
        totalCount >= 1 &&
        totalCount <= Number.MAX_SAFE_INTEGER,
      "totalCount",
    ),
      totalCount);
    (H.domain(
      Number.isSafeInteger(precinctCount) &&
        precinctCount >= 0 &&
        precinctCount <= totalCount,
      "precinctCount",
    ),
      precinctCount);
    return { precinctWeight: precinctCount / totalCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { precinctCount: 250, totalCount: 1000 },
  output: { precinctWeight: 0.25 },
} satisfies ToolExample<Input, Output>;
export const electionResultPrecinctWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["political-science", "political science", "social sciences"],
      keywords: ["political science", "social sciences"],
    },
    id: "political-science/election-result-precinct-weight",
    title: "Election Result Precinct Weight",
    description:
      "Normalize an explicit precinct count to a compatible positive total count without choosing turnout or voter denominators.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        precinctCount: { type: "integer", minimum: 0 },
        totalCount: { type: "integer", minimum: 1 },
      },
      required: ["precinctCount", "totalCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { precinctWeight: { type: "number" } },
      required: ["precinctWeight"],
    },
    ports: {
      inputs: [
        {
          id: "precinctCount",
          label: "Precinct Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalCount",
          label: "Total Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "precinctWeight",
          label: "Precinct Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = electionResultPrecinctWeightTool.execute;
export default electionResultPrecinctWeightTool;
