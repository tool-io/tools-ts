import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openedDay: number;
  readonly dueDay: number;
  readonly closedDay: number;
  readonly closed: boolean;
  readonly today: number;
  readonly extensionDays: number;
};
export type Output = {
  readonly ageDays: number;
  readonly effectiveDueDay: number;
  readonly overdueDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openedDay: { type: "integer" },
    dueDay: { type: "integer" },
    closedDay: { type: "integer" },
    closed: { type: "boolean" },
    today: { type: "integer" },
    extensionDays: { type: "integer", minimum: 0 },
  },
  required: [
    "openedDay",
    "dueDay",
    "closedDay",
    "closed",
    "today",
    "extensionDays",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "integer" },
    effectiveDueDay: { type: "integer" },
    overdueDays: { type: "integer" },
  },
  required: ["ageDays", "effectiveDueDay", "overdueDays"],
} as const;
/** Calculate capa action due overdue day gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openedDay, dueDay, closedDay, closed, today, extensionDays } =
    request;
  const compute = (): Output => {
    H.integer(extensionDays, 0);
    H.domain(dueDay >= openedDay && (closed ? closedDay : today) >= openedDay);
    return {
      ageDays: (closed ? closedDay : today) - openedDay,
      effectiveDueDay: dueDay + extensionDays,
      overdueDays: Math.max(
        0,
        (closed ? closedDay : today) - dueDay - extensionDays,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openedDay: 100,
    dueDay: 120,
    closedDay: 125,
    closed: true,
    today: 130,
    extensionDays: 3,
  },
  output: { ageDays: 25, effectiveDueDay: 123, overdueDays: 2 },
} satisfies ToolExample<Input, Output>;
export const capaActionDueOverdueDayGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/capa-action-due-overdue-day-gap",
    title: "CAPA Action Due Overdue Day Gap Tool",
    description:
      "Calculate capa action due overdue day gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openedDay: { type: "integer" },
        dueDay: { type: "integer" },
        closedDay: { type: "integer" },
        closed: { type: "boolean" },
        today: { type: "integer" },
        extensionDays: { type: "integer", minimum: 0 },
      },
      required: [
        "openedDay",
        "dueDay",
        "closedDay",
        "closed",
        "today",
        "extensionDays",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageDays: { type: "integer" },
        effectiveDueDay: { type: "integer" },
        overdueDays: { type: "integer" },
      },
      required: ["ageDays", "effectiveDueDay", "overdueDays"],
    },
    ports: {
      inputs: [
        {
          id: "openedDay",
          label: "Opened Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dueDay",
          label: "Due Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "closedDay",
          label: "Closed Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "closed",
          label: "Closed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "today",
          label: "Today",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "extensionDays",
          label: "Extension Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
        {
          id: "effectiveDueDay",
          label: "Effective Due Day",
          valueType: { type: "integer" },
        },
        {
          id: "overdueDays",
          label: "Overdue Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = capaActionDueOverdueDayGapTool.execute;
export default capaActionDueOverdueDayGapTool;
