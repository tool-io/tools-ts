import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dates: readonly string[];
  readonly open: readonly boolean[];
  readonly requiredOpenDays: number;
};
export type Output = {
  readonly pickupDeadline: string;
  readonly found: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dates: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    open: { type: "array", maxItems: 256, items: { type: "boolean" } },
    requiredOpenDays: { type: "integer", minimum: 1 },
  },
  required: ["dates", "open", "requiredOpenDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pickupDeadline: { type: "string", maxLength: 8192 },
    found: { type: "boolean" },
  },
  required: ["pickupDeadline", "found"],
} as const;
/** Select the nth supplied open calendar date, returning an empty deadline and found=false when the supplied calendar is insufficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dates, open, requiredOpenDays } = request;
  const compute = (): Output => {
    H.sameLength(dates, open);
    H.integer(requiredOpenDays, 1);
    const times = dates.map((x) => H.dateOnly(x).getTime());
    H.domain(times.every((x, i) => i === 0 || x > times[i - 1]));
    let count = 0,
      index = -1;
    for (let i = 0; i < open.length; i++)
      if (open[i] && ++count === requiredOpenDays) {
        index = i;
        break;
      }
    return { pickupDeadline: index < 0 ? "" : dates[index], found: index >= 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dates: ["2026-10-26", "2026-10-27", "2026-10-28"],
    open: [true, false, true],
    requiredOpenDays: 2,
  },
  output: { pickupDeadline: "2026-10-28", found: true },
} satisfies ToolExample<Input, Output>;
export const holdPickupWindowExplicitCalendarTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/hold-pickup-window-explicit-calendar",
    title: "Hold Pickup Window Explicit Calendar Tool",
    description:
      "Select the nth supplied open calendar date, returning an empty deadline and found=false when the supplied calendar is insufficient.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dates: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        open: { type: "array", maxItems: 256, items: { type: "boolean" } },
        requiredOpenDays: { type: "integer", minimum: 1 },
      },
      required: ["dates", "open", "requiredOpenDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pickupDeadline: { type: "string", maxLength: 8192 },
        found: { type: "boolean" },
      },
      required: ["pickupDeadline", "found"],
    },
    ports: {
      inputs: [
        {
          id: "dates",
          label: "Dates",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "open",
          label: "Open",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "requiredOpenDays",
          label: "Required Open Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "pickupDeadline",
          label: "Pickup Deadline",
          valueType: { type: "string" },
        },
        { id: "found", label: "Found", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = holdPickupWindowExplicitCalendarTool.execute;
export default holdPickupWindowExplicitCalendarTool;
