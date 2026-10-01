import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly registeredCode: string;
  readonly reportedCode: string;
  readonly registeredTime: number;
  readonly reportedTime: number;
  readonly allowedShift: number;
};
export type Output = {
  readonly sameOutcome: boolean;
  readonly timeShift: number;
  readonly withinSuppliedShift: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registeredCode: { type: "string", maxLength: 8192 },
    reportedCode: { type: "string", maxLength: 8192 },
    registeredTime: { type: "number" },
    reportedTime: { type: "number" },
    allowedShift: { type: "number", minimum: 0 },
  },
  required: [
    "registeredCode",
    "reportedCode",
    "registeredTime",
    "reportedTime",
    "allowedShift",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameOutcome: { type: "boolean" },
    timeShift: { type: "number" },
    withinSuppliedShift: { type: "boolean" },
  },
  required: ["sameOutcome", "timeShift", "withinSuppliedShift"],
} as const;
/** Compare supplied outcome identity and assessment-time metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    registeredCode,
    reportedCode,
    registeredTime,
    reportedTime,
    allowedShift,
  } = request;
  const compute = (): Output => {
    H.domain(allowedShift >= 0);
    return {
      sameOutcome: registeredCode === reportedCode,
      timeShift: reportedTime - registeredTime,
      withinSuppliedShift:
        Math.abs(reportedTime - registeredTime) <= allowedShift,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    registeredCode: "pain",
    reportedCode: "pain",
    registeredTime: 30,
    reportedTime: 32,
    allowedShift: 3,
  },
  output: { sameOutcome: true, timeShift: 2, withinSuppliedShift: true },
} satisfies ToolExample<Input, Output>;
export const osteopathyStudyProtocolOutcomePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/osteopathy-study-protocol-outcome-pair",
    title: "Osteopathy Study Protocol Outcome Pair Tool",
    description:
      "Compare supplied outcome identity and assessment-time metadata.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        registeredCode: { type: "string", maxLength: 8192 },
        reportedCode: { type: "string", maxLength: 8192 },
        registeredTime: { type: "number" },
        reportedTime: { type: "number" },
        allowedShift: { type: "number", minimum: 0 },
      },
      required: [
        "registeredCode",
        "reportedCode",
        "registeredTime",
        "reportedTime",
        "allowedShift",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameOutcome: { type: "boolean" },
        timeShift: { type: "number" },
        withinSuppliedShift: { type: "boolean" },
      },
      required: ["sameOutcome", "timeShift", "withinSuppliedShift"],
    },
    ports: {
      inputs: [
        {
          id: "registeredCode",
          label: "Registered Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedCode",
          label: "Reported Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "registeredTime",
          label: "Registered Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportedTime",
          label: "Reported Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedShift",
          label: "Allowed Shift",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sameOutcome",
          label: "Same Outcome",
          valueType: { type: "boolean" },
        },
        { id: "timeShift", label: "Time Shift", valueType: { type: "number" } },
        {
          id: "withinSuppliedShift",
          label: "Within Supplied Shift",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = osteopathyStudyProtocolOutcomePairTool.execute;
export default osteopathyStudyProtocolOutcomePairTool;
