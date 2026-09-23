import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roleIds: readonly string[];
  readonly requiredSourceIds: readonly string[];
  readonly recordedSourceIds: readonly string[];
  readonly current: readonly boolean[];
};
export type Output = {
  readonly sourceMismatches: number;
  readonly notCurrent: number;
  readonly supportedRoles: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roleIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredSourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recordedSourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    current: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["roleIds", "requiredSourceIds", "recordedSourceIds", "current"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceMismatches: { type: "integer" },
    notCurrent: { type: "integer" },
    supportedRoles: { type: "integer" },
  },
  required: ["sourceMismatches", "notCurrent", "supportedRoles"],
} as const;
/** Compare supplied protective-role provenance only; no access bypass or operational biological detail. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roleIds, requiredSourceIds, recordedSourceIds, current } = request;
  const compute = (): Output => {
    H.sameLength(roleIds, requiredSourceIds);
    H.sameLength(roleIds, recordedSourceIds);
    H.sameLength(roleIds, current);
    return {
      sourceMismatches: requiredSourceIds.filter(
        (x, i) => x !== recordedSourceIds[i],
      ).length,
      notCurrent: current.filter((x) => !x).length,
      supportedRoles: roleIds.filter(
        (x, i) => current[i] && requiredSourceIds[i] === recordedSourceIds[i],
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    roleIds: ["a", "b"],
    requiredSourceIds: ["s1", "s2"],
    recordedSourceIds: ["s1", "s1"],
    current: [true, true],
  },
  output: { sourceMismatches: 1, notCurrent: 0, supportedRoles: 1 },
} satisfies ToolExample<Input, Output>;
export const protectiveRoleSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosecurity/protective-role-source-gap",
    title: "Protective Role Source Gap Tool",
    description:
      "Compare supplied protective-role provenance only; no access bypass or operational biological detail.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roleIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredSourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        recordedSourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        current: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: [
        "roleIds",
        "requiredSourceIds",
        "recordedSourceIds",
        "current",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceMismatches: { type: "integer" },
        notCurrent: { type: "integer" },
        supportedRoles: { type: "integer" },
      },
      required: ["sourceMismatches", "notCurrent", "supportedRoles"],
    },
    ports: {
      inputs: [
        {
          id: "roleIds",
          label: "Role Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredSourceIds",
          label: "Required Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "recordedSourceIds",
          label: "Recorded Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "sourceMismatches",
          label: "Source Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "notCurrent",
          label: "Not Current",
          valueType: { type: "integer" },
        },
        {
          id: "supportedRoles",
          label: "Supported Roles",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = protectiveRoleSourceGapTool.execute;
export default protectiveRoleSourceGapTool;
