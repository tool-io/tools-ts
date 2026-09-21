import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly completed: readonly string[];
  readonly requiredModule: string;
  readonly waiver: boolean;
};
export type Output = { readonly satisfied: boolean; readonly source: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completed: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredModule: { type: "string", maxLength: 8192 },
    waiver: { type: "boolean" },
  },
  required: ["completed", "requiredModule", "waiver"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    satisfied: { type: "boolean" },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["satisfied", "source"],
} as const;
/** Calculate modular course prerequisite one link from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { completed, requiredModule, waiver } = request;
  const compute = (): Output => {
    const done = completed.includes(requiredModule);
    return {
      satisfied: done || waiver,
      source: done ? "completed" : waiver ? "waiver" : "missing",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { completed: ["A", "B"], requiredModule: "B", waiver: false },
  output: { satisfied: true, source: "completed" },
} satisfies ToolExample<Input, Output>;
export const modularCoursePrerequisiteOneLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/modular-course-prerequisite-one-link",
    title: "Modular Course Prerequisite One Link Tool",
    description:
      "Calculate modular course prerequisite one link from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completed: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredModule: { type: "string", maxLength: 8192 },
        waiver: { type: "boolean" },
      },
      required: ["completed", "requiredModule", "waiver"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        satisfied: { type: "boolean" },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["satisfied", "source"],
    },
    ports: {
      inputs: [
        {
          id: "completed",
          label: "Completed",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredModule",
          label: "Required Module",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "waiver",
          label: "Waiver",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "satisfied", label: "Satisfied", valueType: { type: "boolean" } },
        { id: "source", label: "Source", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = modularCoursePrerequisiteOneLinkTool.execute;
export default modularCoursePrerequisiteOneLinkTool;
