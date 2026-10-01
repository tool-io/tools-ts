import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cycleLoads: readonly number[];
  readonly cycleDurations: readonly number[];
  readonly visible: readonly boolean[];
};
export type Output = {
  readonly absoluteLoadTime: number;
  readonly visibleLoadTime: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleLoads: { type: "array", maxItems: 256, items: { type: "number" } },
    cycleDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    visible: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["cycleLoads", "cycleDurations", "visible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteLoadTime: { type: "number" },
    visibleLoadTime: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["absoluteLoadTime", "visibleLoadTime", "share", "defined"],
} as const;
/** Calculate load cycle visible share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cycleLoads, cycleDurations, visible } = request;
  const compute = (): Output => {
    H.sameLength(cycleLoads, cycleDurations);
    H.sameLength(cycleLoads, visible);
    H.domain(cycleDurations.every((x) => x >= 0));
    return (() => {
      const absoluteLoadTime = cycleLoads.reduce(
          (s, x, i) => s + Math.abs(x) * cycleDurations[i],
          0,
        ),
        visibleLoadTime = cycleLoads.reduce(
          (s, x, i) => s + (visible[i] ? Math.abs(x) * cycleDurations[i] : 0),
          0,
        );
      return {
        absoluteLoadTime,
        visibleLoadTime,
        share: absoluteLoadTime > 0 ? visibleLoadTime / absoluteLoadTime : 0,
        defined: absoluteLoadTime > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cycleLoads: [2, -3],
    cycleDurations: [5, 10],
    visible: [true, false],
  },
  output: {
    absoluteLoadTime: 40,
    visibleLoadTime: 10,
    share: 0.25,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const loadCycleVisibleShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/load-cycle-visible-share",
    title: "Load Cycle Visible Share Tool",
    description:
      "Calculate load cycle visible share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleLoads: { type: "array", maxItems: 256, items: { type: "number" } },
        cycleDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        visible: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["cycleLoads", "cycleDurations", "visible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absoluteLoadTime: { type: "number" },
        visibleLoadTime: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["absoluteLoadTime", "visibleLoadTime", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "cycleLoads",
          label: "Cycle Loads",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "cycleDurations",
          label: "Cycle Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "visible",
          label: "Visible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "absoluteLoadTime",
          label: "Absolute Load Time",
          valueType: { type: "number" },
        },
        {
          id: "visibleLoadTime",
          label: "Visible Load Time",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = loadCycleVisibleShareTool.execute;
export default loadCycleVisibleShareTool;
