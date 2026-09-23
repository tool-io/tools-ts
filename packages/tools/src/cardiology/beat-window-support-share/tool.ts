import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beatDurations: readonly number[];
  readonly inWindow: readonly boolean[];
  readonly validSignal: readonly boolean[];
};
export type Output = {
  readonly windowDuration: number;
  readonly validBeatDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beatDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    inWindow: { type: "array", maxItems: 256, items: { type: "boolean" } },
    validSignal: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["beatDurations", "inWindow", "validSignal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowDuration: { type: "number" },
    validBeatDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["windowDuration", "validBeatDuration", "share", "defined"],
} as const;
/** Calculate beat window support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beatDurations, inWindow, validSignal } = request;
  const compute = (): Output => {
    H.sameLength(beatDurations, inWindow);
    H.sameLength(beatDurations, validSignal);
    H.domain(beatDurations.every((x) => x >= 0));
    return (() => {
      const windowDuration = beatDurations.reduce(
          (s, x, i) => s + (inWindow[i] ? x : 0),
          0,
        ),
        validBeatDuration = beatDurations.reduce(
          (s, x, i) => s + (inWindow[i] && validSignal[i] ? x : 0),
          0,
        );
      return {
        windowDuration,
        validBeatDuration,
        share: windowDuration > 0 ? validBeatDuration / windowDuration : 0,
        defined: windowDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    beatDurations: [2, 3, 5],
    inWindow: [true, true, false],
    validSignal: [true, false, true],
  },
  output: {
    windowDuration: 5,
    validBeatDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const beatWindowSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/beat-window-support-share",
    title: "Beat Window Support Share Tool",
    description:
      "Calculate beat window support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beatDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        inWindow: { type: "array", maxItems: 256, items: { type: "boolean" } },
        validSignal: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["beatDurations", "inWindow", "validSignal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowDuration: { type: "number" },
        validBeatDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["windowDuration", "validBeatDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "beatDurations",
          label: "Beat Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "inWindow",
          label: "In Window",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "validSignal",
          label: "Valid Signal",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "windowDuration",
          label: "Window Duration",
          valueType: { type: "number" },
        },
        {
          id: "validBeatDuration",
          label: "Valid Beat Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = beatWindowSupportShareTool.execute;
export default beatWindowSupportShareTool;
