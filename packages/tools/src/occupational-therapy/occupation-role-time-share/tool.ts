import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roleMinutes: number;
  readonly totalRecordedMinutes: number;
};
export type Output = {
  readonly roleShare: number;
  readonly otherMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roleMinutes: { type: "number", minimum: 0 },
    totalRecordedMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["roleMinutes", "totalRecordedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roleShare: { type: "number" },
    otherMinutes: { type: "number" },
  },
  required: ["roleShare", "otherMinutes"],
} as const;
/** Normalize an explicit occupation-role duration to a compatible recorded-time denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roleMinutes, totalRecordedMinutes } = request;
  const compute = (): Output => {
    (H.domain(totalRecordedMinutes > 0, "totalRecordedMinutes"),
      totalRecordedMinutes);
    H.domain(
      roleMinutes >= 0 && roleMinutes <= totalRecordedMinutes,
      "roleMinutes",
    );
    return {
      roleShare: roleMinutes / totalRecordedMinutes,
      otherMinutes: totalRecordedMinutes - roleMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { roleMinutes: 120, totalRecordedMinutes: 480 },
  output: { roleShare: 0.25, otherMinutes: 360 },
} satisfies ToolExample<Input, Output>;
export const occupationRoleTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-therapy",
        "occupational therapy",
        "health and medicine",
      ],
      keywords: ["occupational therapy", "health and medicine"],
    },
    id: "occupational-therapy/occupation-role-time-share",
    title: "Occupation Role Time Share",
    description:
      "Normalize an explicit occupation-role duration to a compatible recorded-time denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roleMinutes: { type: "number", minimum: 0 },
        totalRecordedMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["roleMinutes", "totalRecordedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roleShare: { type: "number" },
        otherMinutes: { type: "number" },
      },
      required: ["roleShare", "otherMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "roleMinutes",
          label: "Role Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalRecordedMinutes",
          label: "Total Recorded Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "roleShare", label: "Role Share", valueType: { type: "number" } },
        {
          id: "otherMinutes",
          label: "Other Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = occupationRoleTimeShareTool.execute;
export default occupationRoleTimeShareTool;
