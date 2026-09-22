import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly known: number;
  readonly unknown: number;
  readonly excluded: number;
  readonly includeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly knownShare: number;
  readonly unknownShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    known: { type: "integer", minimum: 1 },
    unknown: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    includeUnknown: { type: "boolean" },
  },
  required: ["known", "unknown", "excluded", "includeUnknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    knownShare: { type: "number" },
    unknownShare: { type: "number" },
  },
  required: ["denominator", "knownShare", "unknownShare"],
} as const;
/** Calculate trait unknown value denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { known, unknown, excluded, includeUnknown } = request;
  const compute = (): Output => {
    H.integer(known, 1);
    H.integer(unknown, 0);
    H.integer(excluded, 0);
    return {
      denominator: known + (includeUnknown ? unknown : 0),
      knownShare: known / (known + (includeUnknown ? unknown : 0)),
      unknownShare: unknown / (known + unknown + excluded),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { known: 8, unknown: 2, excluded: 0, includeUnknown: true },
  output: { denominator: 10, knownShare: 0.8, unknownShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const traitUnknownValueDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biodiversity/trait-unknown-value-denominator",
    title: "Trait Unknown Value Denominator Tool",
    description:
      "Calculate trait unknown value denominator from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        known: { type: "integer", minimum: 1 },
        unknown: { type: "integer", minimum: 0 },
        excluded: { type: "integer", minimum: 0 },
        includeUnknown: { type: "boolean" },
      },
      required: ["known", "unknown", "excluded", "includeUnknown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        knownShare: { type: "number" },
        unknownShare: { type: "number" },
      },
      required: ["denominator", "knownShare", "unknownShare"],
    },
    ports: {
      inputs: [
        {
          id: "known",
          label: "Known",
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
          id: "knownShare",
          label: "Known Share",
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "unknownShare",
          label: "Unknown Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = traitUnknownValueDenominatorTool.execute;
export default traitUnknownValueDenominatorTool;
