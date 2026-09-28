import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recognized: number;
  readonly unknown: number;
  readonly excluded: number;
  readonly includeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly unknownShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognized: { type: "integer", minimum: 0 },
    unknown: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    includeUnknown: { type: "boolean" },
  },
  required: ["recognized", "unknown", "excluded", "includeUnknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    unknownShare: { type: "number" },
  },
  required: ["denominator", "unknownShare"],
} as const;
/** Observation denominator only, without cell identification or diagnostic interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recognized, unknown, excluded, includeUnknown } = request;
  const compute = (): Output => {
    H.integer(recognized, 0);
    H.domain(recognized + unknown + excluded > 0);
    H.integer(unknown, 0);
    H.integer(excluded, 0);
    return {
      denominator: recognized + (includeUnknown ? unknown : 0),
      unknownShare: unknown / (recognized + unknown + excluded),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recognized: 80, unknown: 20, excluded: 0, includeUnknown: true },
  output: { denominator: 100, unknownShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const bloodFilmUnknownCellDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/blood-film-unknown-cell-denominator",
    title: "Blood Film Unknown Cell Denominator Tool",
    description:
      "Observation denominator only, without cell identification or diagnostic interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "integer", minimum: 0 },
        unknown: { type: "integer", minimum: 0 },
        excluded: { type: "integer", minimum: 0 },
        includeUnknown: { type: "boolean" },
      },
      required: ["recognized", "unknown", "excluded", "includeUnknown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        unknownShare: { type: "number" },
      },
      required: ["denominator", "unknownShare"],
    },
    ports: {
      inputs: [
        {
          id: "recognized",
          label: "Recognized",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknown",
          label: "Unknown",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeUnknown",
          label: "Include Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "unknownShare",
          label: "Unknown Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bloodFilmUnknownCellDenominatorTool.execute;
export default bloodFilmUnknownCellDenominatorTool;
