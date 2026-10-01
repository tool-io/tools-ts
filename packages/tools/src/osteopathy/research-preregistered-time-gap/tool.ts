import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly registrationTime: number;
  readonly enrollmentStart: number;
  readonly analysisTime: number;
};
export type Output = {
  readonly registrationLead: number;
  readonly analysisLag: number;
  readonly registeredBeforeEnrollment: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registrationTime: { type: "number" },
    enrollmentStart: { type: "number" },
    analysisTime: { type: "number" },
  },
  required: ["registrationTime", "enrollmentStart", "analysisTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registrationLead: { type: "number" },
    analysisLag: { type: "number" },
    registeredBeforeEnrollment: { type: "boolean" },
  },
  required: ["registrationLead", "analysisLag", "registeredBeforeEnrollment"],
} as const;
/** Compare explicit research timeline timestamps without certifying preregistration quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { registrationTime, enrollmentStart, analysisTime } = request;
  const compute = (): Output => {
    return {
      registrationLead: enrollmentStart - registrationTime,
      analysisLag: analysisTime - enrollmentStart,
      registeredBeforeEnrollment: registrationTime < enrollmentStart,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { registrationTime: 5, enrollmentStart: 10, analysisTime: 30 },
  output: {
    registrationLead: 5,
    analysisLag: 20,
    registeredBeforeEnrollment: true,
  },
} satisfies ToolExample<Input, Output>;
export const researchPreregisteredTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/research-preregistered-time-gap",
    title: "Research Preregistered Time Gap Tool",
    description:
      "Compare explicit research timeline timestamps without certifying preregistration quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        registrationTime: { type: "number" },
        enrollmentStart: { type: "number" },
        analysisTime: { type: "number" },
      },
      required: ["registrationTime", "enrollmentStart", "analysisTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        registrationLead: { type: "number" },
        analysisLag: { type: "number" },
        registeredBeforeEnrollment: { type: "boolean" },
      },
      required: [
        "registrationLead",
        "analysisLag",
        "registeredBeforeEnrollment",
      ],
    },
    ports: {
      inputs: [
        {
          id: "registrationTime",
          label: "Registration Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "enrollmentStart",
          label: "Enrollment Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "analysisTime",
          label: "Analysis Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "registrationLead",
          label: "Registration Lead",
          valueType: { type: "number" },
        },
        {
          id: "analysisLag",
          label: "Analysis Lag",
          valueType: { type: "number" },
        },
        {
          id: "registeredBeforeEnrollment",
          label: "Registered Before Enrollment",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchPreregisteredTimeGapTool.execute;
export default researchPreregisteredTimeGapTool;
