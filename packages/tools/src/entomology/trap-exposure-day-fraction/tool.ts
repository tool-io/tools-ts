import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activeHours: readonly number[];
  readonly suppliedHoursPerDay: number;
};
export type Output = { readonly equivalentDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeHours: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedHoursPerDay: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["activeHours", "suppliedHoursPerDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equivalentDays: { type: "number" } },
  required: ["equivalentDays"],
} as const;
/** Aggregate supplied trap-hour exposure into an explicit day-equivalent basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activeHours, suppliedHoursPerDay } = request;
  const compute = (): Output => {
    H.positive(suppliedHoursPerDay);
    H.domain(activeHours.every((x) => x >= 0));
    return {
      equivalentDays:
        activeHours.reduce((a, b) => a + b, 0) / suppliedHoursPerDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activeHours: [12, 6], suppliedHoursPerDay: 24 },
  output: { equivalentDays: 0.75 },
} satisfies ToolExample<Input, Output>;
export const trapExposureDayFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/trap-exposure-day-fraction",
    title: "Trap Exposure Day Fraction Tool",
    description:
      "Aggregate supplied trap-hour exposure into an explicit day-equivalent basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeHours: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedHoursPerDay: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["activeHours", "suppliedHoursPerDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equivalentDays: { type: "number" } },
      required: ["equivalentDays"],
    },
    ports: {
      inputs: [
        {
          id: "activeHours",
          label: "Active Hours",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedHoursPerDay",
          label: "Supplied Hours Per Day",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equivalentDays",
          label: "Equivalent Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trapExposureDayFractionTool.execute;
export default trapExposureDayFractionTool;
