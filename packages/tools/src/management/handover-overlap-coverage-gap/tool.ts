import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outgoingEnd: number;
  readonly incomingStart: number;
  readonly requiredOverlap: number;
};
export type Output = { readonly overlap: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outgoingEnd: { type: "number" },
    incomingStart: { type: "number" },
    requiredOverlap: { type: "number", minimum: 0 },
  },
  required: ["outgoingEnd", "incomingStart", "requiredOverlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlap: { type: "number" }, margin: { type: "number" } },
  required: ["overlap", "margin"],
} as const;
/** Signed overlap is negative when a coverage gap exists. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outgoingEnd, incomingStart, requiredOverlap } = request;
  const compute = (): Output => {
    H.domain(requiredOverlap >= 0);
    return {
      overlap: outgoingEnd - incomingStart,
      margin: outgoingEnd - incomingStart - requiredOverlap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outgoingEnd: 20, incomingStart: 16, requiredOverlap: 3 },
  output: { overlap: 4, margin: 1 },
} satisfies ToolExample<Input, Output>;
export const handoverOverlapCoverageGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/handover-overlap-coverage-gap",
    title: "Handover Overlap Coverage Gap Tool",
    description: "Signed overlap is negative when a coverage gap exists.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outgoingEnd: { type: "number" },
        incomingStart: { type: "number" },
        requiredOverlap: { type: "number", minimum: 0 },
      },
      required: ["outgoingEnd", "incomingStart", "requiredOverlap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlap: { type: "number" }, margin: { type: "number" } },
      required: ["overlap", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "outgoingEnd",
          label: "Outgoing End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incomingStart",
          label: "Incoming Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredOverlap",
          label: "Required Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = handoverOverlapCoverageGapTool.execute;
export default handoverOverlapCoverageGapTool;
