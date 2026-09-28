import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stateIds: readonly string[];
  readonly durations: readonly number[];
  readonly aliveState: readonly boolean[];
  readonly selectedState: string;
};
export type Output = {
  readonly aliveTime: number;
  readonly selectedAliveTime: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stateIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    aliveState: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedState: { type: "string", maxLength: 8192 },
  },
  required: ["stateIds", "durations", "aliveState", "selectedState"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    aliveTime: { type: "number" },
    selectedAliveTime: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["aliveTime", "selectedAliveTime", "share", "defined"],
} as const;
/** Calculate model state time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stateIds, durations, aliveState, selectedState } = request;
  const compute = (): Output => {
    H.sameLength(stateIds, durations);
    H.sameLength(stateIds, aliveState);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const aliveTime = durations.reduce(
          (s, x, i) => s + (aliveState[i] ? x : 0),
          0,
        ),
        selectedAliveTime = durations.reduce(
          (s, x, i) =>
            s + (aliveState[i] && stateIds[i] === selectedState ? x : 0),
          0,
        );
      return {
        aliveTime,
        selectedAliveTime,
        share: aliveTime > 0 ? selectedAliveTime / aliveTime : 0,
        defined: aliveTime > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stateIds: ["A", "B", "D"],
    durations: [2, 3, 5],
    aliveState: [true, true, false],
    selectedState: "A",
  },
  output: { aliveTime: 5, selectedAliveTime: 2, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const modelStateTimeShareTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "health-economics/model-state-time-share",
      title: "Model State Time Share Tool",
      description:
        "Calculate model state time share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stateIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          durations: {
            type: "array",
            maxItems: 256,
            items: { type: "number", minimum: 0 },
          },
          aliveState: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          selectedState: { type: "string", maxLength: 8192 },
        },
        required: ["stateIds", "durations", "aliveState", "selectedState"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          aliveTime: { type: "number" },
          selectedAliveTime: { type: "number" },
          share: { type: "number" },
          defined: { type: "boolean" },
        },
        required: ["aliveTime", "selectedAliveTime", "share", "defined"],
      },
      ports: {
        inputs: [
          {
            id: "stateIds",
            label: "State Ids",
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
            id: "aliveState",
            label: "Alive State",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "selectedState",
            label: "Selected State",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "aliveTime",
            label: "Alive Time",
            valueType: { type: "number" },
          },
          {
            id: "selectedAliveTime",
            label: "Selected Alive Time",
            valueType: { type: "number" },
          },
          { id: "share", label: "Share", valueType: { type: "number" } },
          { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  },
);
export const run = modelStateTimeShareTool.execute;
export default modelStateTimeShareTool;
