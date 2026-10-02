import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activity: number;
  readonly lower: readonly number[];
  readonly upper: readonly number[];
  readonly labels: readonly string[];
};
export type Output = {
  readonly matches: readonly string[];
  readonly ambiguous: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activity: { type: "number" },
    lower: { type: "array", maxItems: 256, items: { type: "number" } },
    upper: { type: "array", maxItems: 256, items: { type: "number" } },
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["activity", "lower", "upper", "labels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    ambiguous: { type: "boolean" },
  },
  required: ["matches", "ambiguous"],
} as const;
/** Match supplied half-open phenotype-rule intervals without embedding clinical rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activity, lower, upper, labels } = request;
  const compute = (): Output => {
    H.sameLength(lower, upper);
    H.sameLength(lower, labels);
    H.domain(
      lower.every((x, i) => upper[i] >= x),
      "upper",
    );
    const matches = labels.filter(
      (_, i) => activity >= lower[i] && activity < upper[i],
    );
    return { matches, ambiguous: matches.length > 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activity: 1,
    lower: [0, 1, 2],
    upper: [1, 2, 3],
    labels: ["A", "B", "C"],
  },
  output: { matches: ["B"], ambiguous: false },
} satisfies ToolExample<Input, Output>;
export const pharmacogenePhenotypeCallerRuleMatchTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacogenomics/pharmacogene-phenotype-caller-rule-match",
      title: "Pharmacogene Phenotype Caller Rule Match Tool",
      description:
        "Match supplied half-open phenotype-rule intervals without embedding clinical rules.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activity: { type: "number" },
          lower: { type: "array", maxItems: 256, items: { type: "number" } },
          upper: { type: "array", maxItems: 256, items: { type: "number" } },
          labels: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["activity", "lower", "upper", "labels"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          matches: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          ambiguous: { type: "boolean" },
        },
        required: ["matches", "ambiguous"],
      },
      ports: {
        inputs: [
          {
            id: "activity",
            label: "Activity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lower",
            label: "Lower",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "upper",
            label: "Upper",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "labels",
            label: "Labels",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "matches",
            label: "Matches",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "ambiguous",
            label: "Ambiguous",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacogenePhenotypeCallerRuleMatchTool.execute;
export default pharmacogenePhenotypeCallerRuleMatchTool;
