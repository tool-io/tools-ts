import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roles: readonly string[];
  readonly allowedRoles: readonly string[];
  readonly taskIds: readonly string[];
};
export type Output = {
  readonly unsupportedRoles: readonly string[];
  readonly assistedTasks: readonly string[];
  readonly distinctRoles: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    allowedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    taskIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["roles", "allowedRoles", "taskIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unsupportedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    assistedTasks: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    distinctRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["unsupportedRoles", "assistedTasks", "distinctRoles"],
} as const;
/** Audit supplied task assistance-role tokens under an explicit role vocabulary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roles, allowedRoles, taskIds } = request;
  const compute = (): Output => {
    H.sameLength(roles, taskIds);
    const unsupportedRoles = [
      ...new Set(roles.filter((x) => !allowedRoles.includes(x))),
    ];
    return {
      unsupportedRoles,
      assistedTasks: taskIds.filter((_, i) => roles[i] !== "independent"),
      distinctRoles: [...new Set(roles)],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    roles: ["independent", "helper", "observer"],
    allowedRoles: ["independent", "helper"],
    taskIds: ["A", "B", "C"],
  },
  output: {
    unsupportedRoles: ["observer"],
    assistedTasks: ["B", "C"],
    distinctRoles: ["independent", "helper", "observer"],
  },
} satisfies ToolExample<Input, Output>;
export const rehabilitationTaskAssistanceRoleTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physiotherapy/rehabilitation-task-assistance-role-token",
      title: "Rehabilitation Task Assistance Role Token Tool",
      description:
        "Audit supplied task assistance-role tokens under an explicit role vocabulary.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          roles: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          allowedRoles: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          taskIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["roles", "allowedRoles", "taskIds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unsupportedRoles: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          assistedTasks: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          distinctRoles: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["unsupportedRoles", "assistedTasks", "distinctRoles"],
      },
      ports: {
        inputs: [
          {
            id: "roles",
            label: "Roles",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "allowedRoles",
            label: "Allowed Roles",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "taskIds",
            label: "Task Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "unsupportedRoles",
            label: "Unsupported Roles",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "assistedTasks",
            label: "Assisted Tasks",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "distinctRoles",
            label: "Distinct Roles",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = rehabilitationTaskAssistanceRoleTokenTool.execute;
export default rehabilitationTaskAssistanceRoleTokenTool;
