import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tasks: readonly string[];
  readonly firstResponsible: readonly boolean[];
  readonly secondResponsible: readonly boolean[];
  readonly sharedAllowed: readonly boolean[];
};
export type Output = {
  readonly unowned: readonly string[];
  readonly conflicting: readonly string[];
  readonly validShared: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tasks: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    firstResponsible: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    secondResponsible: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    sharedAllowed: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["tasks", "firstResponsible", "secondResponsible", "sharedAllowed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unowned: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    conflicting: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    validShared: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["unowned", "conflicting", "validShared"],
} as const;
/** Audit explicit responsibility flags against task-specific shared-ownership rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tasks, firstResponsible, secondResponsible, sharedAllowed } = request;
  const compute = (): Output => {
    H.sameLength(tasks, firstResponsible);
    H.sameLength(tasks, secondResponsible);
    H.sameLength(tasks, sharedAllowed);
    return {
      unowned: tasks.filter(
        (_, i) => !firstResponsible[i] && !secondResponsible[i],
      ),
      conflicting: tasks.filter(
        (_, i) =>
          firstResponsible[i] && secondResponsible[i] && !sharedAllowed[i],
      ),
      validShared: tasks.filter(
        (_, i) =>
          firstResponsible[i] && secondResponsible[i] && sharedAllowed[i],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tasks: ["A", "B", "C"],
    firstResponsible: [true, true, false],
    secondResponsible: [true, true, false],
    sharedAllowed: [false, true, false],
  },
  output: { unowned: ["C"], conflicting: ["A"], validShared: ["B"] },
} satisfies ToolExample<Input, Output>;
export const qualityAgreementResponsibilityOverlapCheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "quality-assurance/quality-agreement-responsibility-overlap-check",
      title: "Quality Agreement Responsibility Overlap Check Tool",
      description:
        "Audit explicit responsibility flags against task-specific shared-ownership rules.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tasks: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          firstResponsible: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          secondResponsible: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          sharedAllowed: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: [
          "tasks",
          "firstResponsible",
          "secondResponsible",
          "sharedAllowed",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unowned: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          conflicting: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          validShared: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["unowned", "conflicting", "validShared"],
      },
      ports: {
        inputs: [
          {
            id: "tasks",
            label: "Tasks",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "firstResponsible",
            label: "First Responsible",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "secondResponsible",
            label: "Second Responsible",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "sharedAllowed",
            label: "Shared Allowed",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "unowned",
            label: "Unowned",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "conflicting",
            label: "Conflicting",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "validShared",
            label: "Valid Shared",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = qualityAgreementResponsibilityOverlapCheckTool.execute;
export default qualityAgreementResponsibilityOverlapCheckTool;
