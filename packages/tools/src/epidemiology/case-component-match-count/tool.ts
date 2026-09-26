import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly matches: readonly boolean[];
  readonly known: readonly boolean[];
};
export type Output = {
  readonly matched: number;
  readonly knownCount: number;
  readonly unknownCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "array", maxItems: 256, items: { type: "boolean" } },
    known: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["matches", "known"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matched: { type: "integer" },
    knownCount: { type: "integer" },
    unknownCount: { type: "integer" },
  },
  required: ["matched", "knownCount", "unknownCount"],
} as const;
/** Count explicit known case-component matches without determining a clinical case definition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { matches, known } = request;
  const compute = (): Output => {
    H.sameLength(matches, known);
    return {
      matched: matches.filter((x, i) => x && known[i]).length,
      knownCount: known.filter(Boolean).length,
      unknownCount: known.filter((x) => !x).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { matches: [true, true, false], known: [true, false, true] },
  output: { matched: 1, knownCount: 2, unknownCount: 1 },
} satisfies ToolExample<Input, Output>;
export const caseComponentMatchCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/case-component-match-count",
    title: "Case Component Match Count Tool",
    description:
      "Count explicit known case-component matches without determining a clinical case definition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "array", maxItems: 256, items: { type: "boolean" } },
        known: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["matches", "known"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matched: { type: "integer" },
        knownCount: { type: "integer" },
        unknownCount: { type: "integer" },
      },
      required: ["matched", "knownCount", "unknownCount"],
    },
    ports: {
      inputs: [
        {
          id: "matches",
          label: "Matches",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "known",
          label: "Known",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "matched", label: "Matched", valueType: { type: "integer" } },
        {
          id: "knownCount",
          label: "Known Count",
          valueType: { type: "integer" },
        },
        {
          id: "unknownCount",
          label: "Unknown Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = caseComponentMatchCountTool.execute;
export default caseComponentMatchCountTool;
