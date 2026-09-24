import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actionId: string;
  readonly ownerId: string;
  readonly assignedDay: number;
  readonly dueDay: number;
  readonly completedDay: number;
  readonly completed: boolean;
  readonly today: number;
};
export type Output = {
  readonly ageDays: number;
  readonly overdueDays: number;
  readonly completedLate: boolean;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actionId: { type: "string", maxLength: 8192 },
    ownerId: { type: "string", maxLength: 8192 },
    assignedDay: { type: "integer" },
    dueDay: { type: "integer" },
    completedDay: { type: "integer" },
    completed: { type: "boolean" },
    today: { type: "integer" },
  },
  required: [
    "actionId",
    "ownerId",
    "assignedDay",
    "dueDay",
    "completedDay",
    "completed",
    "today",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "integer" },
    overdueDays: { type: "integer" },
    completedLate: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["ageDays", "overdueDays", "completedLate", "key"],
} as const;
/** Audit supplied action ownership and due/completion day indices. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    actionId,
    ownerId,
    assignedDay,
    dueDay,
    completedDay,
    completed,
    today,
  } = request;
  const compute = (): Output => {
    H.domain(
      assignedDay <= dueDay &&
        today >= assignedDay &&
        (!completed || completedDay >= assignedDay),
    );
    return {
      ageDays: (completed ? completedDay : today) - assignedDay,
      overdueDays: Math.max(0, (completed ? completedDay : today) - dueDay),
      completedLate: completed && completedDay > dueDay,
      key: JSON.stringify([actionId, ownerId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    actionId: "A1",
    ownerId: "O1",
    assignedDay: 100,
    dueDay: 110,
    completedDay: 112,
    completed: true,
    today: 120,
  },
  output: {
    ageDays: 12,
    overdueDays: 2,
    completedLate: true,
    key: '["A1","O1"]',
  },
} satisfies ToolExample<Input, Output>;
export const pharmacyCareActionOwnerDueGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/pharmacy-care-action-owner-due-gap",
    title: "Pharmacy Care Action Owner Due Gap Tool",
    description:
      "Audit supplied action ownership and due/completion day indices.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actionId: { type: "string", maxLength: 8192 },
        ownerId: { type: "string", maxLength: 8192 },
        assignedDay: { type: "integer" },
        dueDay: { type: "integer" },
        completedDay: { type: "integer" },
        completed: { type: "boolean" },
        today: { type: "integer" },
      },
      required: [
        "actionId",
        "ownerId",
        "assignedDay",
        "dueDay",
        "completedDay",
        "completed",
        "today",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageDays: { type: "integer" },
        overdueDays: { type: "integer" },
        completedLate: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["ageDays", "overdueDays", "completedLate", "key"],
    },
    ports: {
      inputs: [
        {
          id: "actionId",
          label: "Action Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ownerId",
          label: "Owner Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assignedDay",
          label: "Assigned Day",
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
          id: "completedDay",
          label: "Completed Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "completed",
          label: "Completed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "today",
          label: "Today",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
        {
          id: "overdueDays",
          label: "Overdue Days",
          valueType: { type: "integer" },
        },
        {
          id: "completedLate",
          label: "Completed Late",
          valueType: { type: "boolean" },
        },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = pharmacyCareActionOwnerDueGapTool.execute;
export default pharmacyCareActionOwnerDueGapTool;
