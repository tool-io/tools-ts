import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly submitted: number;
  readonly due: number;
  readonly grace: number;
  readonly positiveMeansLate: boolean;
};
export type Output = {
  readonly signedOffset: number;
  readonly beyondGrace: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    submitted: { type: "number" },
    due: { type: "number" },
    grace: { type: "number", minimum: 0 },
    positiveMeansLate: { type: "boolean" },
  },
  required: ["submitted", "due", "grace", "positiveMeansLate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedOffset: { type: "number" },
    beyondGrace: { type: "number" },
  },
  required: ["signedOffset", "beyondGrace"],
} as const;
/** Administrative timestamp comparison with an explicit sign/grace convention, without selecting grading policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { submitted, due, grace, positiveMeansLate } = request;
  const compute = (): Output => {
    H.domain(grace >= 0);
    return {
      signedOffset: (submitted - due) * (positiveMeansLate ? 1 : -1),
      beyondGrace: Math.max(0, submitted - due - grace),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { submitted: 12, due: 10, grace: 1, positiveMeansLate: true },
  output: { signedOffset: 2, beyondGrace: 1 },
} satisfies ToolExample<Input, Output>;
export const assignmentLateWindowOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/assignment-late-window-offset",
    title: "Assignment Late Window Offset Tool",
    description:
      "Administrative timestamp comparison with an explicit sign/grace convention, without selecting grading policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        submitted: { type: "number" },
        due: { type: "number" },
        grace: { type: "number", minimum: 0 },
        positiveMeansLate: { type: "boolean" },
      },
      required: ["submitted", "due", "grace", "positiveMeansLate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedOffset: { type: "number" },
        beyondGrace: { type: "number" },
      },
      required: ["signedOffset", "beyondGrace"],
    },
    ports: {
      inputs: [
        {
          id: "submitted",
          label: "Submitted",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "due",
          label: "Due",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grace",
          label: "Grace",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveMeansLate",
          label: "Positive Means Late",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedOffset",
          label: "Signed Offset",
          valueType: { type: "number" },
        },
        {
          id: "beyondGrace",
          label: "Beyond Grace",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assignmentLateWindowOffsetTool.execute;
export default assignmentLateWindowOffsetTool;
