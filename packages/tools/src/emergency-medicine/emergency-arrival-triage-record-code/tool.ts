import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly encounterCode: string;
  readonly recordedTriageCode: string;
  readonly codeSystem: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    encounterCode: { type: "string", maxLength: 8192, minLength: 1 },
    recordedTriageCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSystem: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["encounterCode", "recordedTriageCode", "codeSystem"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an already recorded arrival triage code and source system without assigning urgency or recommending care. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { encounterCode, recordedTriageCode, codeSystem } = request;
  const compute = (): Output => {
    H.domain(
      encounterCode.length > 0 &&
        recordedTriageCode.length > 0 &&
        codeSystem.length > 0,
      "encounterCode",
    );
    return {
      label:
        encounterCode +
        "; triage=" +
        recordedTriageCode +
        " [" +
        codeSystem +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    encounterCode: "E17",
    recordedTriageCode: "3",
    codeSystem: "recorded local system",
  },
  output: { label: "E17; triage=3 [recorded local system]" },
} satisfies ToolExample<Input, Output>;
export const emergencyArrivalTriageRecordCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "emergency-medicine",
        "emergency medicine",
        "health and medicine",
      ],
      keywords: ["emergency medicine", "health and medicine"],
    },
    id: "emergency-medicine/emergency-arrival-triage-record-code",
    title: "Emergency Arrival Triage Record Code",
    description:
      "Label an already recorded arrival triage code and source system without assigning urgency or recommending care.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        encounterCode: { type: "string", maxLength: 8192, minLength: 1 },
        recordedTriageCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSystem: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["encounterCode", "recordedTriageCode", "codeSystem"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "encounterCode",
          label: "Encounter Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedTriageCode",
          label: "Recorded Triage Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeSystem",
          label: "Code System",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = emergencyArrivalTriageRecordCodeTool.execute;
export default emergencyArrivalTriageRecordCodeTool;
