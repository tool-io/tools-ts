import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialIds: readonly string[];
  readonly responsePresent: readonly boolean[];
  readonly taskValid: readonly boolean[];
};
export type Output = {
  readonly validTrials: number;
  readonly supportedValidTrials: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    responsePresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    taskValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["trialIds", "responsePresent", "taskValid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validTrials: { type: "integer" },
    supportedValidTrials: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["validTrials", "supportedValidTrials", "share", "defined"],
} as const;
/** Calculate child task response support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialIds, responsePresent, taskValid } = request;
  const compute = (): Output => {
    H.sameLength(trialIds, responsePresent);
    H.sameLength(trialIds, taskValid);
    return (() => {
      const all = new Set(trialIds.filter((x, i) => taskValid[i])),
        yes = new Set(
          trialIds.filter((x, i) => taskValid[i] && responsePresent[i]),
        );
      return {
        validTrials: all.size,
        supportedValidTrials: yes.size,
        share: all.size > 0 ? yes.size / all.size : 0,
        defined: all.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    trialIds: ["a", "a", "b"],
    responsePresent: [true, false, false],
    taskValid: [true, true, true],
  },
  output: {
    validTrials: 2,
    supportedValidTrials: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const childTaskResponseSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pediatrics/child-task-response-support-share",
    title: "Child Task Response Support Share Tool",
    description:
      "Calculate child task response support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        responsePresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        taskValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["trialIds", "responsePresent", "taskValid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validTrials: { type: "integer" },
        supportedValidTrials: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["validTrials", "supportedValidTrials", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "trialIds",
          label: "Trial Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "responsePresent",
          label: "Response Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "taskValid",
          label: "Task Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "validTrials",
          label: "Valid Trials",
          valueType: { type: "integer" },
        },
        {
          id: "supportedValidTrials",
          label: "Supported Valid Trials",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = childTaskResponseSupportShareTool.execute;
export default childTaskResponseSupportShareTool;
