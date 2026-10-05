import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rankText: string;
  readonly source: string;
  readonly year: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rankText: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    year: { type: "integer", minimum: -100000, maximum: 9999 },
  },
  required: ["rankText", "source", "year"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label historical rank wording with explicit source and year without assigning equivalence to a current rank. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rankText, source, year } = request;
  const compute = (): Output => {
    H.domain(rankText.length > 0 && source.length > 0, "rankText");
    (H.domain(
      Number.isSafeInteger(year) && year >= -100000 && year <= 9999,
      "year",
    ),
      year);
    return { label: rankText + " [" + year + "; " + source + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rankText: "Recorded rank", source: "Register A", year: 1910 },
  output: { label: "Recorded rank [1910; Register A]" },
} satisfies ToolExample<Input, Output>;
export const historicalRankSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/historical-rank-source-label",
    title: "Historical Rank Source Label Tool",
    description:
      "Label historical rank wording with explicit source and year without assigning equivalence to a current rank.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rankText: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        year: { type: "integer", minimum: -100000, maximum: 9999 },
      },
      required: ["rankText", "source", "year"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "rankText",
          label: "Rank Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalRankSourceLabelTool.execute;
export default historicalRankSourceLabelTool;
