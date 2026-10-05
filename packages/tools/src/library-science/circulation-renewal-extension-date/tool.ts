import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentDueDate: string;
  readonly extensionDays: number;
};
export type Output = { readonly newDueDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentDueDate: { type: "string", maxLength: 8192 },
    extensionDays: { type: "integer", minimum: 0, maximum: 36500 },
  },
  required: ["currentDueDate", "extensionDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newDueDate: { type: "string", maxLength: 8192 } },
  required: ["newDueDate"],
} as const;
/** Add a caller-selected calendar-day renewal interval to an existing due date, without applying closure-day policies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentDueDate, extensionDays } = request;
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
      Number.isSafeInteger(extensionDays) &&
        extensionDays >= 0 &&
        extensionDays <= 36500,
      "extensionDays",
    ),
      extensionDays);
    const d = namedDate(currentDueDate, "currentDueDate");
    d.setUTCDate(d.getUTCDate() + extensionDays);
    H.domain(d.getUTCFullYear() <= 9999, "");
    return { newDueDate: d.toISOString().slice(0, 10) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentDueDate: "2026-10-25", extensionDays: 14 },
  output: { newDueDate: "2026-11-08" },
} satisfies ToolExample<Input, Output>;
export const circulationRenewalExtensionDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/circulation-renewal-extension-date",
    title: "Circulation Renewal Extension Date Tool",
    description:
      "Add a caller-selected calendar-day renewal interval to an existing due date, without applying closure-day policies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentDueDate: { type: "string", maxLength: 8192 },
        extensionDays: { type: "integer", minimum: 0, maximum: 36500 },
      },
      required: ["currentDueDate", "extensionDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { newDueDate: { type: "string", maxLength: 8192 } },
      required: ["newDueDate"],
    },
    ports: {
      inputs: [
        {
          id: "currentDueDate",
          label: "Current Due Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "extensionDays",
          label: "Extension Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "newDueDate",
          label: "New Due Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = circulationRenewalExtensionDateTool.execute;
export default circulationRenewalExtensionDateTool;
