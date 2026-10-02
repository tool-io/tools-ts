import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startPosition: number;
  readonly endPosition: number;
  readonly blockKnown: boolean;
  readonly includeEnd: boolean;
};
export type Output = { readonly spanDefined: boolean; readonly span: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startPosition: { type: "integer" },
    endPosition: { type: "integer" },
    blockKnown: { type: "boolean" },
    includeEnd: { type: "boolean" },
  },
  required: ["startPosition", "endPosition", "blockKnown", "includeEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spanDefined: { type: "boolean" }, span: { type: "integer" } },
  required: ["spanDefined", "span"],
} as const;
/** Measure supplied research phase-block coordinates while preserving unknown-block status; no haplotype inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startPosition, endPosition, blockKnown, includeEnd } = request;
  const compute = (): Output => {
    H.domain(!blockKnown || endPosition >= startPosition);
    return {
      spanDefined: blockKnown,
      span: blockKnown ? endPosition - startPosition + (includeEnd ? 1 : 0) : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startPosition: 100,
    endPosition: 150,
    blockKnown: true,
    includeEnd: true,
  },
  output: { spanDefined: true, span: 51 },
} satisfies ToolExample<Input, Output>;
export const researchHaplotypePhaseBlockSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/research-haplotype-phase-block-span",
    title: "Research Haplotype Phase Block Span Tool",
    description:
      "Measure supplied research phase-block coordinates while preserving unknown-block status; no haplotype inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startPosition: { type: "integer" },
        endPosition: { type: "integer" },
        blockKnown: { type: "boolean" },
        includeEnd: { type: "boolean" },
      },
      required: ["startPosition", "endPosition", "blockKnown", "includeEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spanDefined: { type: "boolean" },
        span: { type: "integer" },
      },
      required: ["spanDefined", "span"],
    },
    ports: {
      inputs: [
        {
          id: "startPosition",
          label: "Start Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endPosition",
          label: "End Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "blockKnown",
          label: "Block Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeEnd",
          label: "Include End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "spanDefined",
          label: "Span Defined",
          valueType: { type: "boolean" },
        },
        { id: "span", label: "Span", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = researchHaplotypePhaseBlockSpanTool.execute;
export default researchHaplotypePhaseBlockSpanTool;
