import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseAt: number;
  readonly stimulusAt: number;
  readonly suppliedClockOffset: number;
  readonly referenceLatency: number;
};
export type Output = { readonly latency: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseAt: { type: "number" },
    stimulusAt: { type: "number" },
    suppliedClockOffset: { type: "number" },
    referenceLatency: { type: "number", minimum: 0 },
  },
  required: [
    "responseAt",
    "stimulusAt",
    "suppliedClockOffset",
    "referenceLatency",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { latency: { type: "number" }, gap: { type: "number" } },
  required: ["latency", "gap"],
} as const;
/** Compare explicit research response times after a supplied clock correction; no behavioral classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseAt, stimulusAt, suppliedClockOffset, referenceLatency } =
    request;
  const compute = (): Output => {
    H.domain(referenceLatency >= 0);
    return {
      latency: responseAt - stimulusAt - suppliedClockOffset,
      gap: responseAt - stimulusAt - suppliedClockOffset - referenceLatency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responseAt: 520,
    stimulusAt: 100,
    suppliedClockOffset: 20,
    referenceLatency: 350,
  },
  output: { latency: 400, gap: 50 },
} satisfies ToolExample<Input, Output>;
export const reactionTimeOriginReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/reaction-time-origin-reference-gap",
    title: "Reaction Time Origin Reference Gap Tool",
    description:
      "Compare explicit research response times after a supplied clock correction; no behavioral classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseAt: { type: "number" },
        stimulusAt: { type: "number" },
        suppliedClockOffset: { type: "number" },
        referenceLatency: { type: "number", minimum: 0 },
      },
      required: [
        "responseAt",
        "stimulusAt",
        "suppliedClockOffset",
        "referenceLatency",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { latency: { type: "number" }, gap: { type: "number" } },
      required: ["latency", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "responseAt",
          label: "Response At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stimulusAt",
          label: "Stimulus At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClockOffset",
          label: "Supplied Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLatency",
          label: "Reference Latency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "latency", label: "Latency", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = reactionTimeOriginReferenceGapTool.execute;
export default reactionTimeOriginReferenceGapTool;
