import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly taskActive: readonly boolean[];
  readonly validObservation: readonly boolean[];
  readonly attentive: readonly boolean[];
};
export type Output = {
  readonly validTaskDuration: number;
  readonly attentiveDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    taskActive: { type: "array", maxItems: 256, items: { type: "boolean" } },
    validObservation: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    attentive: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["durations", "taskActive", "validObservation", "attentive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validTaskDuration: { type: "number" },
    attentiveDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["validTaskDuration", "attentiveDuration", "share", "defined"],
} as const;
/** Calculate trial attention support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, taskActive, validObservation, attentive } = request;
  const compute = (): Output => {
    H.sameLength(durations, taskActive);
    H.sameLength(durations, validObservation);
    H.sameLength(durations, attentive);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const validTaskDuration = durations.reduce(
          (s, x, i) => s + (taskActive[i] && validObservation[i] ? x : 0),
          0,
        ),
        attentiveDuration = durations.reduce(
          (s, x, i) =>
            s + (taskActive[i] && validObservation[i] && attentive[i] ? x : 0),
          0,
        );
      return {
        validTaskDuration,
        attentiveDuration,
        share:
          validTaskDuration > 0 ? attentiveDuration / validTaskDuration : 0,
        defined: validTaskDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    durations: [2, 3, 5],
    taskActive: [true, true, false],
    validObservation: [true, true, true],
    attentive: [true, false, true],
  },
  output: {
    validTaskDuration: 5,
    attentiveDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const trialAttentionSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/trial-attention-support-share",
    title: "Trial Attention Support Share Tool",
    description:
      "Calculate trial attention support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        taskActive: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        validObservation: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        attentive: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["durations", "taskActive", "validObservation", "attentive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validTaskDuration: { type: "number" },
        attentiveDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["validTaskDuration", "attentiveDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "taskActive",
          label: "Task Active",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "validObservation",
          label: "Valid Observation",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "attentive",
          label: "Attentive",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "validTaskDuration",
          label: "Valid Task Duration",
          valueType: { type: "number" },
        },
        {
          id: "attentiveDuration",
          label: "Attentive Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = trialAttentionSupportShareTool.execute;
export default trialAttentionSupportShareTool;
