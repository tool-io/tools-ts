import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionMinutes: number;
  readonly setupMinutes: number;
  readonly students: number;
  readonly responseMinutesPerStudent: number;
};
export type Output = {
  readonly presentationMinutesEach: number;
  readonly feasible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionMinutes: { type: "number", minimum: 0 },
    setupMinutes: { type: "number", minimum: 0 },
    students: { type: "integer", minimum: 1 },
    responseMinutesPerStudent: { type: "number", minimum: 0 },
  },
  required: [
    "sessionMinutes",
    "setupMinutes",
    "students",
    "responseMinutesPerStudent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentationMinutesEach: { type: "number" },
    feasible: { type: "boolean" },
  },
  required: ["presentationMinutesEach", "feasible"],
} as const;
/** Calculate peer critique turn minute budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionMinutes, setupMinutes, students, responseMinutesPerStudent } =
    request;
  const compute = (): Output => {
    H.domain(
      sessionMinutes >= 0 &&
        setupMinutes >= 0 &&
        responseMinutesPerStudent >= 0,
    );
    H.integer(students, 1);
    return {
      presentationMinutesEach:
        (sessionMinutes - setupMinutes) / students - responseMinutesPerStudent,
      feasible:
        sessionMinutes - setupMinutes >= students * responseMinutesPerStudent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sessionMinutes: 60,
    setupMinutes: 10,
    students: 5,
    responseMinutesPerStudent: 2,
  },
  output: { presentationMinutesEach: 8, feasible: true },
} satisfies ToolExample<Input, Output>;
export const peerCritiqueTurnMinuteBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/peer-critique-turn-minute-budget",
    title: "Peer Critique Turn Minute Budget Tool",
    description:
      "Calculate peer critique turn minute budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessionMinutes: { type: "number", minimum: 0 },
        setupMinutes: { type: "number", minimum: 0 },
        students: { type: "integer", minimum: 1 },
        responseMinutesPerStudent: { type: "number", minimum: 0 },
      },
      required: [
        "sessionMinutes",
        "setupMinutes",
        "students",
        "responseMinutesPerStudent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentationMinutesEach: { type: "number" },
        feasible: { type: "boolean" },
      },
      required: ["presentationMinutesEach", "feasible"],
    },
    ports: {
      inputs: [
        {
          id: "sessionMinutes",
          label: "Session Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "setupMinutes",
          label: "Setup Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "students",
          label: "Students",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "responseMinutesPerStudent",
          label: "Response Minutes Per Student",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "presentationMinutesEach",
          label: "Presentation Minutes Each",
          valueType: { type: "number" },
        },
        { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = peerCritiqueTurnMinuteBudgetTool.execute;
export default peerCritiqueTurnMinuteBudgetTool;
