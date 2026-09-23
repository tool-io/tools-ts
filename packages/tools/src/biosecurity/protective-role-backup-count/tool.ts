import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly role: string;
  readonly suppliedRoles: readonly string[];
  readonly isBackup: readonly boolean[];
};
export type Output = { readonly backupCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    role: { type: "string", maxLength: 8192 },
    suppliedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    isBackup: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["role", "suppliedRoles", "isBackup"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { backupCount: { type: "integer" } },
  required: ["backupCount"],
} as const;
/** Calculate protective role backup count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { role, suppliedRoles, isBackup } = request;
  const compute = (): Output => {
    H.sameLength(suppliedRoles, isBackup);
    return {
      backupCount: suppliedRoles.filter((x, i) => x === role && isBackup[i])
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    role: "A",
    suppliedRoles: ["A", "B", "A"],
    isBackup: [true, true, false],
  },
  output: { backupCount: 1 },
} satisfies ToolExample<Input, Output>;
export const protectiveRoleBackupCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosecurity/protective-role-backup-count",
    title: "Protective Role Backup Count Tool",
    description:
      "Calculate protective role backup count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        role: { type: "string", maxLength: 8192 },
        suppliedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        isBackup: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["role", "suppliedRoles", "isBackup"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { backupCount: { type: "integer" } },
      required: ["backupCount"],
    },
    ports: {
      inputs: [
        {
          id: "role",
          label: "Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedRoles",
          label: "Supplied Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "isBackup",
          label: "Is Backup",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "backupCount",
          label: "Backup Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = protectiveRoleBackupCountTool.execute;
export default protectiveRoleBackupCountTool;
