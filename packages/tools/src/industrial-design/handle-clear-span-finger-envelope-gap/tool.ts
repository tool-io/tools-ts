import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly clearSpan: number;
  readonly envelope: number;
  readonly sideAllowance: number;
};
export type Output = { readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clearSpan: { type: "number", minimum: 0 },
    envelope: { type: "number", minimum: 0 },
    sideAllowance: { type: "number", minimum: 0 },
  },
  required: ["clearSpan", "envelope", "sideAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { margin: { type: "number" } },
  required: ["margin"],
} as const;
/** Calculate handle clear span finger envelope gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clearSpan, envelope, sideAllowance } = request;
  const compute = (): Output => {
    H.domain(clearSpan >= 0 && envelope >= 0 && sideAllowance >= 0);
    return { margin: clearSpan - envelope - 2 * sideAllowance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { clearSpan: 120, envelope: 90, sideAllowance: 10 },
  output: { margin: 10 },
} satisfies ToolExample<Input, Output>;
export const handleClearSpanFingerEnvelopeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/handle-clear-span-finger-envelope-gap",
    title: "Handle Clear Span Finger Envelope Gap Tool",
    description:
      "Calculate handle clear span finger envelope gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clearSpan: { type: "number", minimum: 0 },
        envelope: { type: "number", minimum: 0 },
        sideAllowance: { type: "number", minimum: 0 },
      },
      required: ["clearSpan", "envelope", "sideAllowance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { margin: { type: "number" } },
      required: ["margin"],
    },
    ports: {
      inputs: [
        {
          id: "clearSpan",
          label: "Clear Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "envelope",
          label: "Envelope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sideAllowance",
          label: "Side Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = handleClearSpanFingerEnvelopeGapTool.execute;
export default handleClearSpanFingerEnvelopeGapTool;
