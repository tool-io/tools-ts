import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceId: string;
  readonly interrogationDate: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceId: { type: "string", maxLength: 8192, minLength: 1 },
    interrogationDate: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["deviceId", "interrogationDate", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded device interrogation date without assessing function or setting a follow-up schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceId, interrogationDate, source } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(deviceId.length > 0 && source.length > 0, "deviceId");
    namedDate(interrogationDate, "interrogationDate");
    return {
      label:
        deviceId + "; interrogation=" + interrogationDate + " [" + source + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deviceId: "DEV17",
    interrogationDate: "2026-11-01",
    source: "Device report",
  },
  output: { label: "DEV17; interrogation=2026-11-01 [Device report]" },
} satisfies ToolExample<Input, Output>;
export const cardiacDeviceInterrogationDateLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["cardiology", "health and medicine"],
        keywords: ["cardiology", "health and medicine"],
      },
      id: "cardiology/cardiac-device-interrogation-date-label",
      title: "Cardiac Device Interrogation Date Label",
      description:
        "Label an explicitly recorded device interrogation date without assessing function or setting a follow-up schedule.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          deviceId: { type: "string", maxLength: 8192, minLength: 1 },
          interrogationDate: { type: "string", maxLength: 8192 },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["deviceId", "interrogationDate", "source"],
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
            id: "deviceId",
            label: "Device Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "interrogationDate",
            label: "Interrogation Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = cardiacDeviceInterrogationDateLabelTool.execute;
export default cardiacDeviceInterrogationDateLabelTool;
