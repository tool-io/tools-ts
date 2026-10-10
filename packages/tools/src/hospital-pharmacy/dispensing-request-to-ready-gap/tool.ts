import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestMinutes: number;
  readonly readyMinutes: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestMinutes: { type: "number" },
    readyMinutes: { type: "number" },
  },
  required: ["requestMinutes", "readyMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit dispensing request and ready timestamps in minutes without assessing service standards. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestMinutes, readyMinutes } = request;
  const compute = (): Output => {
    return { signedGap: readyMinutes - requestMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestMinutes: 12, readyMinutes: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const dispensingRequestToReadyGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospital-pharmacy", "hospital pharmacy", "pharmacy"],
      keywords: ["hospital pharmacy", "pharmacy"],
    },
    id: "hospital-pharmacy/dispensing-request-to-ready-gap",
    title: "Dispensing Request To Ready Gap",
    description:
      "Subtract explicit dispensing request and ready timestamps in minutes without assessing service standards.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestMinutes: { type: "number" },
        readyMinutes: { type: "number" },
      },
      required: ["requestMinutes", "readyMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "requestMinutes",
          label: "Request Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "readyMinutes",
          label: "Ready Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dispensingRequestToReadyGapTool.execute;
export default dispensingRequestToReadyGapTool;
