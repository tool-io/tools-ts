import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previous: string;
  readonly next: string;
  readonly width: number;
};
export type Output = {
  readonly gapDecimal: string;
  readonly consecutive: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "string", maxLength: 8192 },
    next: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 64 },
  },
  required: ["previous", "next", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapDecimal: { type: "string", maxLength: 8192 },
    consecutive: { type: "boolean" },
  },
  required: ["gapDecimal", "consecutive"],
} as const;
/** Compare explicitly formatted dossier sequence tokens without enforcing a regulator-specific submission rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previous, next, width } = request;
  const compute = (): Output => {
    H.integer(width, 1, 64);
    const valid = (s: string) => s.length === width && /^\d+(?![\s\S])/.test(s);
    H.domain(valid(previous) && valid(next), "sequence");
    const d = BigInt(next) - BigInt(previous);
    return { gapDecimal: d.toString(), consecutive: d === 1n };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previous: "0007", next: "0009", width: 4 },
  output: { gapDecimal: "2", consecutive: false },
} satisfies ToolExample<Input, Output>;
export const dossierSequenceGapTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/dossier-sequence-gap-token",
    title: "Dossier Sequence Gap Token Tool",
    description:
      "Compare explicitly formatted dossier sequence tokens without enforcing a regulator-specific submission rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previous: { type: "string", maxLength: 8192 },
        next: { type: "string", maxLength: 8192 },
        width: { type: "integer", minimum: 1, maximum: 64 },
      },
      required: ["previous", "next", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapDecimal: { type: "string", maxLength: 8192 },
        consecutive: { type: "boolean" },
      },
      required: ["gapDecimal", "consecutive"],
    },
    ports: {
      inputs: [
        {
          id: "previous",
          label: "Previous",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "next",
          label: "Next",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "gapDecimal",
          label: "Gap Decimal",
          valueType: { type: "string" },
        },
        {
          id: "consecutive",
          label: "Consecutive",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = dossierSequenceGapTokenTool.execute;
export default dossierSequenceGapTokenTool;
