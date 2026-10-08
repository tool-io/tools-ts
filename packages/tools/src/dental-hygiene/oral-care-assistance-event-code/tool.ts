import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventId: string;
  readonly suppliedAssistanceCode: string;
  readonly recorderId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAssistanceCode: { type: "string", maxLength: 8192, minLength: 1 },
    recorderId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["eventId", "suppliedAssistanceCode", "recorderId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit oral-care assistance event code and recorder identifier without assessing care needs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventId, suppliedAssistanceCode, recorderId } = request;
  const compute = (): Output => {
    H.domain(eventId.length > 0, "eventId");
    H.domain(suppliedAssistanceCode.length > 0, "suppliedAssistanceCode");
    H.domain(recorderId.length > 0, "recorderId");
    return {
      token: JSON.stringify([eventId, suppliedAssistanceCode, recorderId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventId: "E17",
    suppliedAssistanceCode: "assisted",
    recorderId: "R4",
  },
  output: { token: '["E17","assisted","R4"]' },
} satisfies ToolExample<Input, Output>;
export const oralCareAssistanceEventCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/oral-care-assistance-event-code",
    title: "Oral Care Assistance Event Code Tool",
    description:
      "Preserve an explicit oral-care assistance event code and recorder identifier without assessing care needs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAssistanceCode: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        recorderId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["eventId", "suppliedAssistanceCode", "recorderId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "eventId",
          label: "Event Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAssistanceCode",
          label: "Supplied Assistance Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recorderId",
          label: "Recorder Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = oralCareAssistanceEventCodeTool.execute;
export default oralCareAssistanceEventCodeTool;
