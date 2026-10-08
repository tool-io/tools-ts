import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly litHoursPerBulb: readonly number[] };
export type Output = { readonly totalBulbHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    litHoursPerBulb: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["litHoursPerBulb"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalBulbHours: { type: "number" } },
  required: ["totalBulbHours"],
} as const;
/** Sum explicitly supplied per-bulb operating durations for moth light-trap effort without estimating attraction efficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { litHoursPerBulb } = request;
  const compute = (): Output => {
    litHoursPerBulb.forEach((value) => H.domain(value >= 0, "litHoursPerBulb"));
    return {
      totalBulbHours: litHoursPerBulb.reduce((sum, value) => sum + value, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { litHoursPerBulb: [4, 6, 2] },
  output: { totalBulbHours: 12 },
} satisfies ToolExample<Input, Output>;
export const mothLighttrapBulbHoursTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/moth-lighttrap-bulb-hours",
    title: "Moth Lighttrap Bulb Hours Tool",
    description:
      "Sum explicitly supplied per-bulb operating durations for moth light-trap effort without estimating attraction efficiency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        litHoursPerBulb: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["litHoursPerBulb"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalBulbHours: { type: "number" } },
      required: ["totalBulbHours"],
    },
    ports: {
      inputs: [
        {
          id: "litHoursPerBulb",
          label: "Lit Hours Per Bulb",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "totalBulbHours",
          label: "Total Bulb Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mothLighttrapBulbHoursTool.execute;
export default mothLighttrapBulbHoursTool;
