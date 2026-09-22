import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly candidateUnits: readonly string[];
  readonly sourceUnitKnown: boolean;
};
export type Output = {
  readonly ambiguous: boolean;
  readonly candidateCount: number;
  readonly resolvedUnit: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    candidateUnits: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceUnitKnown: { type: "boolean" },
  },
  required: ["token", "candidateUnits", "sourceUnitKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ambiguous: { type: "boolean" },
    candidateCount: { type: "integer" },
    resolvedUnit: { type: "string", maxLength: 8192 },
  },
  required: ["ambiguous", "candidateCount", "resolvedUnit"],
} as const;
/** Expose supplied historical-unit ambiguity without choosing a conversion from spelling alone. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, candidateUnits, sourceUnitKnown } = request;
  const compute = (): Output => {
    const unique = [...new Set(candidateUnits)];
    H.domain(token.length > 0);
    return {
      ambiguous: !sourceUnitKnown && unique.length !== 1,
      candidateCount: unique.length,
      resolvedUnit: sourceUnitKnown
        ? token
        : unique.length === 1
          ? unique[0]
          : "",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    token: "ton",
    candidateUnits: ["short-ton", "long-ton"],
    sourceUnitKnown: false,
  },
  output: { ambiguous: true, candidateCount: 2, resolvedUnit: "" },
} satisfies ToolExample<Input, Output>;
export const historicalMeasureUnitAmbiguityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "area-studies/historical-measure-unit-ambiguity",
    title: "Historical Measure Unit Ambiguity Tool",
    description:
      "Expose supplied historical-unit ambiguity without choosing a conversion from spelling alone.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        candidateUnits: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceUnitKnown: { type: "boolean" },
      },
      required: ["token", "candidateUnits", "sourceUnitKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ambiguous: { type: "boolean" },
        candidateCount: { type: "integer" },
        resolvedUnit: { type: "string", maxLength: 8192 },
      },
      required: ["ambiguous", "candidateCount", "resolvedUnit"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "candidateUnits",
          label: "Candidate Units",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceUnitKnown",
          label: "Source Unit Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "ambiguous", label: "Ambiguous", valueType: { type: "boolean" } },
        {
          id: "candidateCount",
          label: "Candidate Count",
          valueType: { type: "integer" },
        },
        {
          id: "resolvedUnit",
          label: "Resolved Unit",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalMeasureUnitAmbiguityTool.execute;
export default historicalMeasureUnitAmbiguityTool;
