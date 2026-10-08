import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousBoutEndSeconds: number;
  readonly nextBoutStartSeconds: number;
};
export type Output = {
  readonly signedGapSeconds: number;
  readonly overlap: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousBoutEndSeconds: { type: "number" },
    nextBoutStartSeconds: { type: "number" },
  },
  required: ["previousBoutEndSeconds", "nextBoutStartSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGapSeconds: { type: "number" },
    overlap: { type: "boolean" },
  },
  required: ["signedGapSeconds", "overlap"],
} as const;
/** Measure the signed interval between two supplied insect call bouts on the same clock. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousBoutEndSeconds, nextBoutStartSeconds } = request;
  const compute = (): Output => {
    return {
      signedGapSeconds: nextBoutStartSeconds - previousBoutEndSeconds,
      overlap: nextBoutStartSeconds < previousBoutEndSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousBoutEndSeconds: 12.5, nextBoutStartSeconds: 15 },
  output: { signedGapSeconds: 2.5, overlap: false },
} satisfies ToolExample<Input, Output>;
export const insectCallBoutGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["entomology", "biology"],
      keywords: ["entomology", "biology"],
    },
    id: "entomology/insect-call-bout-gap",
    title: "Insect Call Bout Gap",
    description:
      "Measure the signed interval between two supplied insect call bouts on the same clock.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousBoutEndSeconds: { type: "number" },
        nextBoutStartSeconds: { type: "number" },
      },
      required: ["previousBoutEndSeconds", "nextBoutStartSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGapSeconds: { type: "number" },
        overlap: { type: "boolean" },
      },
      required: ["signedGapSeconds", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "previousBoutEndSeconds",
          label: "Previous Bout End Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextBoutStartSeconds",
          label: "Next Bout Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedGapSeconds",
          label: "Signed Gap Seconds",
          valueType: { type: "number" },
        },
        { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = insectCallBoutGapTool.execute;
export default insectCallBoutGapTool;
