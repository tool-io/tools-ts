import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredRoles: readonly string[];
  readonly courseRoles: readonly string[];
  readonly completed: readonly boolean[];
  readonly current: readonly boolean[];
};
export type Output = {
  readonly requiredRoleCount: number;
  readonly supportedRoles: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    courseRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    completed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    current: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["requiredRoles", "courseRoles", "completed", "current"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredRoleCount: { type: "integer" },
    supportedRoles: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["requiredRoleCount", "supportedRoles", "share", "defined"],
} as const;
/** Calculate safety training support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredRoles, courseRoles, completed, current } = request;
  const compute = (): Output => {
    H.sameLength(courseRoles, completed);
    H.sameLength(courseRoles, current);
    return (() => {
      const r = [...new Set(requiredRoles)],
        supportedRoles = r.filter((x) =>
          courseRoles.some((v, i) => v === x && completed[i] && current[i]),
        ).length;
      return {
        requiredRoleCount: r.length,
        supportedRoles,
        share: r.length ? supportedRoles / r.length : 0,
        defined: r.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredRoles: ["A", "B"],
    courseRoles: ["A", "B"],
    completed: [true, true],
    current: [true, false],
  },
  output: {
    requiredRoleCount: 2,
    supportedRoles: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const safetyTrainingSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/safety-training-support-share",
    title: "Safety Training Support Share Tool",
    description:
      "Calculate safety training support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        courseRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        completed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        current: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["requiredRoles", "courseRoles", "completed", "current"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredRoleCount: { type: "integer" },
        supportedRoles: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["requiredRoleCount", "supportedRoles", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "requiredRoles",
          label: "Required Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "courseRoles",
          label: "Course Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "completed",
          label: "Completed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
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
          id: "requiredRoleCount",
          label: "Required Role Count",
          valueType: { type: "integer" },
        },
        {
          id: "supportedRoles",
          label: "Supported Roles",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = safetyTrainingSupportShareTool.execute;
export default safetyTrainingSupportShareTool;
