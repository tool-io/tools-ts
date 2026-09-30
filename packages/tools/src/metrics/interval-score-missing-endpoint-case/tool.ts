import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lower: number;
  readonly upper: number;
  readonly actual: number;
  readonly alpha: number;
  readonly lowerPresent: boolean;
  readonly upperPresent: boolean;
};
export type Output = {
  readonly defined: boolean;
  readonly score: number;
  readonly missingEndpoints: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    actual: { type: "number" },
    alpha: { type: "number" },
    lowerPresent: { type: "boolean" },
    upperPresent: { type: "boolean" },
  },
  required: [
    "lower",
    "upper",
    "actual",
    "alpha",
    "lowerPresent",
    "upperPresent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defined: { type: "boolean" },
    score: { type: "number" },
    missingEndpoints: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["defined", "score", "missingEndpoints"],
} as const;
/** Central interval score with missing endpoints explicitly flagged rather than treated as zero bounds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lower, upper, actual, alpha, lowerPresent, upperPresent } = request;
  const compute = (): Output => {
    H.domain(
      alpha > 0 &&
        alpha < 1 &&
        (!lowerPresent || !upperPresent || upper >= lower),
    );
    const defined = lowerPresent && upperPresent;
    return {
      defined,
      score: defined
        ? upper -
          lower +
          (2 / alpha) * Math.max(0, lower - actual) +
          (2 / alpha) * Math.max(0, actual - upper)
        : 0,
      missingEndpoints: [
        ...(!lowerPresent ? ["lower"] : []),
        ...(!upperPresent ? ["upper"] : []),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lower: 1,
    upper: 3,
    actual: 4,
    alpha: 0.5,
    lowerPresent: true,
    upperPresent: true,
  },
  output: { defined: true, score: 6, missingEndpoints: [] },
} satisfies ToolExample<Input, Output>;
export const intervalScoreMissingEndpointCaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/interval-score-missing-endpoint-case",
    title: "Interval Score Missing Endpoint Case Tool",
    description:
      "Central interval score with missing endpoints explicitly flagged rather than treated as zero bounds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        actual: { type: "number" },
        alpha: { type: "number" },
        lowerPresent: { type: "boolean" },
        upperPresent: { type: "boolean" },
      },
      required: [
        "lower",
        "upper",
        "actual",
        "alpha",
        "lowerPresent",
        "upperPresent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        score: { type: "number" },
        missingEndpoints: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["defined", "score", "missingEndpoints"],
    },
    ports: {
      inputs: [
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
        {
          id: "actual",
          label: "Actual",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alpha",
          label: "Alpha",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerPresent",
          label: "Lower Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "upperPresent",
          label: "Upper Present",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        { id: "score", label: "Score", valueType: { type: "number" } },
        {
          id: "missingEndpoints",
          label: "Missing Endpoints",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = intervalScoreMissingEndpointCaseTool.execute;
export default intervalScoreMissingEndpointCaseTool;
