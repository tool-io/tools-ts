import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitorId: string;
  readonly inductionRequired: boolean;
  readonly inductionRecorded: boolean;
};
export type Output = { readonly outstandingInduction: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitorId: { type: "string", maxLength: 8192, minLength: 1 },
    inductionRequired: { type: "boolean" },
    inductionRecorded: { type: "boolean" },
  },
  required: ["visitorId", "inductionRequired", "inductionRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outstandingInduction: { type: "boolean" } },
  required: ["outstandingInduction"],
} as const;
/** Combine explicit visitor-induction requirement and completion flags without granting site access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitorId, inductionRequired, inductionRecorded } = request;
  const compute = (): Output => {
    H.domain(visitorId.length > 0, "visitorId");
    return { outstandingInduction: inductionRequired && !inductionRecorded };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    visitorId: "V17",
    inductionRequired: true,
    inductionRecorded: false,
  },
  output: { outstandingInduction: true },
} satisfies ToolExample<Input, Output>;
export const biosafetyVisitorInductionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biosafety", "research and quality management"],
      keywords: ["biosafety", "research and quality management"],
    },
    id: "biosafety/biosafety-visitor-induction-flag",
    title: "Biosafety Visitor Induction Flag",
    description:
      "Combine explicit visitor-induction requirement and completion flags without granting site access.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitorId: { type: "string", maxLength: 8192, minLength: 1 },
        inductionRequired: { type: "boolean" },
        inductionRecorded: { type: "boolean" },
      },
      required: ["visitorId", "inductionRequired", "inductionRecorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { outstandingInduction: { type: "boolean" } },
      required: ["outstandingInduction"],
    },
    ports: {
      inputs: [
        {
          id: "visitorId",
          label: "Visitor Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "inductionRequired",
          label: "Induction Required",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "inductionRecorded",
          label: "Induction Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "outstandingInduction",
          label: "Outstanding Induction",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = biosafetyVisitorInductionFlagTool.execute;
export default biosafetyVisitorInductionFlagTool;
