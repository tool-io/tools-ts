import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actionLabels: readonly string[];
  readonly durations: readonly number[];
  readonly selectedAction: string;
  readonly excludedActions: readonly string[];
};
export type Output = {
  readonly eligibleDuration: number;
  readonly selectedDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actionLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    selectedAction: { type: "string", maxLength: 8192 },
    excludedActions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["actionLabels", "durations", "selectedAction", "excludedActions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleDuration: { type: "number" },
    selectedDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["eligibleDuration", "selectedDuration", "share", "defined"],
} as const;
/** Calculate simulation action duration share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actionLabels, durations, selectedAction, excludedActions } = request;
  const compute = (): Output => {
    H.sameLength(actionLabels, durations);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const eligibleDuration = durations.reduce(
          (s, x, i) => s + (excludedActions.includes(actionLabels[i]) ? 0 : x),
          0,
        ),
        selectedDuration = durations.reduce(
          (s, x, i) =>
            s +
            (actionLabels[i] === selectedAction &&
            !excludedActions.includes(actionLabels[i])
              ? x
              : 0),
          0,
        );
      return {
        eligibleDuration,
        selectedDuration,
        share: eligibleDuration > 0 ? selectedDuration / eligibleDuration : 0,
        defined: eligibleDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    actionLabels: ["A", "B", "pause"],
    durations: [2, 3, 5],
    selectedAction: "A",
    excludedActions: ["pause"],
  },
  output: {
    eligibleDuration: 5,
    selectedDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const simulationActionDurationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/simulation-action-duration-share",
    title: "Simulation Action Duration Share Tool",
    description:
      "Calculate simulation action duration share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actionLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        selectedAction: { type: "string", maxLength: 8192 },
        excludedActions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "actionLabels",
        "durations",
        "selectedAction",
        "excludedActions",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleDuration: { type: "number" },
        selectedDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["eligibleDuration", "selectedDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "actionLabels",
          label: "Action Labels",
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
          id: "selectedAction",
          label: "Selected Action",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "excludedActions",
          label: "Excluded Actions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "eligibleDuration",
          label: "Eligible Duration",
          valueType: { type: "number" },
        },
        {
          id: "selectedDuration",
          label: "Selected Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = simulationActionDurationShareTool.execute;
export default simulationActionDurationShareTool;
