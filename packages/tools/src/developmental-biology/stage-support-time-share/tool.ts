import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stageLabels: readonly string[];
  readonly durations: readonly number[];
  readonly verifiedStage: readonly boolean[];
  readonly selectedStage: string;
};
export type Output = {
  readonly stageDuration: number;
  readonly supportedDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stageLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    verifiedStage: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedStage: { type: "string", maxLength: 8192 },
  },
  required: ["stageLabels", "durations", "verifiedStage", "selectedStage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stageDuration: { type: "number" },
    supportedDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["stageDuration", "supportedDuration", "share", "defined"],
} as const;
/** Calculate stage support time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stageLabels, durations, verifiedStage, selectedStage } = request;
  const compute = (): Output => {
    H.sameLength(stageLabels, durations);
    H.sameLength(stageLabels, verifiedStage);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const stageDuration = durations.reduce(
          (s, x, i) => s + (stageLabels[i] === selectedStage ? x : 0),
          0,
        ),
        supportedDuration = durations.reduce(
          (s, x, i) =>
            s + (stageLabels[i] === selectedStage && verifiedStage[i] ? x : 0),
          0,
        );
      return {
        stageDuration,
        supportedDuration,
        share: stageDuration > 0 ? supportedDuration / stageDuration : 0,
        defined: stageDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stageLabels: ["A", "A", "B"],
    durations: [2, 3, 4],
    verifiedStage: [true, false, true],
    selectedStage: "A",
  },
  output: { stageDuration: 5, supportedDuration: 2, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const stageSupportTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/stage-support-time-share",
    title: "Stage Support Time Share Tool",
    description:
      "Calculate stage support time share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stageLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        verifiedStage: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        selectedStage: { type: "string", maxLength: 8192 },
      },
      required: ["stageLabels", "durations", "verifiedStage", "selectedStage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stageDuration: { type: "number" },
        supportedDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["stageDuration", "supportedDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "stageLabels",
          label: "Stage Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "verifiedStage",
          label: "Verified Stage",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedStage",
          label: "Selected Stage",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "stageDuration",
          label: "Stage Duration",
          valueType: { type: "number" },
        },
        {
          id: "supportedDuration",
          label: "Supported Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = stageSupportTimeShareTool.execute;
export default stageSupportTimeShareTool;
