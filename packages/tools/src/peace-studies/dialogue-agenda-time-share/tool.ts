import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speakingDurations: readonly number[];
  readonly agendaLabels: readonly string[];
  readonly selectedAgenda: string;
  readonly totalSessionDuration: number;
};
export type Output = {
  readonly selectedDuration: number;
  readonly selectedShare: number;
  readonly unallocatedDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speakingDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    agendaLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selectedAgenda: { type: "string", maxLength: 8192 },
    totalSessionDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "speakingDurations",
    "agendaLabels",
    "selectedAgenda",
    "totalSessionDuration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedDuration: { type: "number" },
    selectedShare: { type: "number" },
    unallocatedDuration: { type: "number" },
  },
  required: ["selectedDuration", "selectedShare", "unallocatedDuration"],
} as const;
/** Calculate dialogue agenda time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    speakingDurations,
    agendaLabels,
    selectedAgenda,
    totalSessionDuration,
  } = request;
  const compute = (): Output => {
    H.sameLength(speakingDurations, agendaLabels);
    H.domain(speakingDurations.every((x) => x >= 0));
    H.positive(totalSessionDuration);
    return (() => {
      const selectedDuration = speakingDurations.reduce(
          (s, x, i) => s + (agendaLabels[i] === selectedAgenda ? x : 0),
          0,
        ),
        allocated = speakingDurations.reduce((a, b) => a + b, 0);
      H.domain(allocated <= totalSessionDuration);
      return {
        selectedDuration,
        selectedShare: selectedDuration / totalSessionDuration,
        unallocatedDuration: totalSessionDuration - allocated,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    speakingDurations: [10, 20],
    agendaLabels: ["A", "B"],
    selectedAgenda: "A",
    totalSessionDuration: 40,
  },
  output: {
    selectedDuration: 10,
    selectedShare: 0.25,
    unallocatedDuration: 10,
  },
} satisfies ToolExample<Input, Output>;
export const dialogueAgendaTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/dialogue-agenda-time-share",
    title: "Dialogue Agenda Time Share Tool",
    description:
      "Calculate dialogue agenda time share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speakingDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        agendaLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        selectedAgenda: { type: "string", maxLength: 8192 },
        totalSessionDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "speakingDurations",
        "agendaLabels",
        "selectedAgenda",
        "totalSessionDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectedDuration: { type: "number" },
        selectedShare: { type: "number" },
        unallocatedDuration: { type: "number" },
      },
      required: ["selectedDuration", "selectedShare", "unallocatedDuration"],
    },
    ports: {
      inputs: [
        {
          id: "speakingDurations",
          label: "Speaking Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "agendaLabels",
          label: "Agenda Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "selectedAgenda",
          label: "Selected Agenda",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "totalSessionDuration",
          label: "Total Session Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "selectedDuration",
          label: "Selected Duration",
          valueType: { type: "number" },
        },
        {
          id: "selectedShare",
          label: "Selected Share",
          valueType: { type: "number" },
        },
        {
          id: "unallocatedDuration",
          label: "Unallocated Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dialogueAgendaTimeShareTool.execute;
export default dialogueAgendaTimeShareTool;
