import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lastServiceDate: string;
  readonly serviceIntervalDays: number;
};
export type Output = { readonly dueDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lastServiceDate: { type: "string", maxLength: 8192 },
    serviceIntervalDays: { type: "integer", minimum: 0, maximum: 100000 },
  },
  required: ["lastServiceDate", "serviceIntervalDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dueDate: { type: "string", maxLength: 8192 } },
  required: ["dueDate"],
} as const;
/** Add an explicit calendar-day service interval to a recorded public-asset service date without choosing maintenance requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lastServiceDate, serviceIntervalDays } = request;
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
    (H.domain(
      Number.isSafeInteger(serviceIntervalDays) &&
        serviceIntervalDays >= 0 &&
        serviceIntervalDays <= 100000,
      "serviceIntervalDays",
    ),
      serviceIntervalDays);
    const d = namedDate(lastServiceDate, "lastServiceDate");
    d.setUTCDate(d.getUTCDate() + serviceIntervalDays);
    H.domain(d.getUTCFullYear() <= 9999, "");
    return { dueDate: d.toISOString().slice(0, 10) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lastServiceDate: "2026-10-01", serviceIntervalDays: 30 },
  output: { dueDate: "2026-10-31" },
} satisfies ToolExample<Input, Output>;
export const publicAssetServiceDueDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/public-asset-service-due-date",
    title: "Public Asset Service Due Date Tool",
    description:
      "Add an explicit calendar-day service interval to a recorded public-asset service date without choosing maintenance requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lastServiceDate: { type: "string", maxLength: 8192 },
        serviceIntervalDays: { type: "integer", minimum: 0, maximum: 100000 },
      },
      required: ["lastServiceDate", "serviceIntervalDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dueDate: { type: "string", maxLength: 8192 } },
      required: ["dueDate"],
    },
    ports: {
      inputs: [
        {
          id: "lastServiceDate",
          label: "Last Service Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "serviceIntervalDays",
          label: "Service Interval Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "dueDate", label: "Due Date", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = publicAssetServiceDueDateTool.execute;
export default publicAssetServiceDueDateTool;
