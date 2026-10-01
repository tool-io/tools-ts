import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personIds: readonly string[];
  readonly roles: readonly string[];
  readonly allowedRoles: readonly string[];
};
export type Output = {
  readonly unknownRolePositions: readonly number[];
  readonly conflictingIds: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
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
  },
  required: ["personIds", "roles", "allowedRoles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unknownRolePositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    conflictingIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["unknownRolePositions", "conflictingIds"],
} as const;
/** Find inconsistent literal linkage roles in supplied records without establishing identity or relationships. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personIds, roles, allowedRoles } = request;
  const compute = (): Output => {
    H.sameLength(personIds, roles);
    const groups = new Map<string, Set<string>>();
    personIds.forEach((id, i) => {
      const s = groups.get(id) ?? new Set<string>();
      s.add(roles[i]);
      groups.set(id, s);
    });
    return {
      unknownRolePositions: roles.flatMap((x, i) =>
        allowedRoles.includes(x) ? [] : [i],
      ),
      conflictingIds: [...groups]
        .filter(([, s]) => s.size > 1)
        .map(([id]) => id),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personIds: ["P1", "P2", "P1"],
    roles: ["maternal", "infant", "infant"],
    allowedRoles: ["maternal", "infant"],
  },
  output: { unknownRolePositions: [], conflictingIds: ["P1"] },
} satisfies ToolExample<Input, Output>;
export const maternalInfantLinkRoleConflictTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/maternal-infant-link-role-conflict",
    title: "Maternal Infant Link Role Conflict Tool",
    description:
      "Find inconsistent literal linkage roles in supplied records without establishing identity or relationships.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
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
      },
      required: ["personIds", "roles", "allowedRoles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unknownRolePositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        conflictingIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["unknownRolePositions", "conflictingIds"],
    },
    ports: {
      inputs: [
        {
          id: "personIds",
          label: "Person Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
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
      ],
      outputs: [
        {
          id: "unknownRolePositions",
          label: "Unknown Role Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "conflictingIds",
          label: "Conflicting Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = maternalInfantLinkRoleConflictTool.execute;
export default maternalInfantLinkRoleConflictTool;
