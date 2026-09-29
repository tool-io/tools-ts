import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flows: readonly number[];
  readonly durations: readonly number[];
  readonly scheduled: readonly boolean[];
  readonly sourceVerified: readonly boolean[];
};
export type Output = {
  readonly scheduledVolume: number;
  readonly verifiedVolume: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flows: { type: "array", maxItems: 256, items: { type: "number" } },
    durations: { type: "array", maxItems: 256, items: { type: "number" } },
    scheduled: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sourceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["flows", "durations", "scheduled", "sourceVerified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledVolume: { type: "number" },
    verifiedVolume: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["scheduledVolume", "verifiedVolume", "share", "defined"],
} as const;
/** Calculate irrigation window support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flows, durations, scheduled, sourceVerified } = request;
  const compute = (): Output => {
    H.sameLength(flows, durations);
    H.sameLength(flows, scheduled);
    H.sameLength(flows, sourceVerified);
    H.domain([...flows, ...durations].every((x) => x >= 0));
    return (() => {
      const scheduledVolume = flows.reduce(
          (s, x, i) => s + (scheduled[i] ? x * durations[i] : 0),
          0,
        ),
        verifiedVolume = flows.reduce(
          (s, x, i) =>
            s + (scheduled[i] && sourceVerified[i] ? x * durations[i] : 0),
          0,
        );
      return {
        scheduledVolume,
        verifiedVolume,
        share: scheduledVolume > 0 ? verifiedVolume / scheduledVolume : 0,
        defined: scheduledVolume > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    flows: [2, 3, 5],
    durations: [1, 2, 1],
    scheduled: [true, true, false],
    sourceVerified: [true, false, true],
  },
  output: { scheduledVolume: 8, verifiedVolume: 2, share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const irrigationWindowSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/irrigation-window-support-share",
    title: "Irrigation Window Support Share Tool",
    description:
      "Calculate irrigation window support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flows: { type: "array", maxItems: 256, items: { type: "number" } },
        durations: { type: "array", maxItems: 256, items: { type: "number" } },
        scheduled: { type: "array", maxItems: 256, items: { type: "boolean" } },
        sourceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["flows", "durations", "scheduled", "sourceVerified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledVolume: { type: "number" },
        verifiedVolume: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["scheduledVolume", "verifiedVolume", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "flows",
          label: "Flows",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "scheduled",
          label: "Scheduled",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceVerified",
          label: "Source Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "scheduledVolume",
          label: "Scheduled Volume",
          valueType: { type: "number" },
        },
        {
          id: "verifiedVolume",
          label: "Verified Volume",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = irrigationWindowSupportShareTool.execute;
export default irrigationWindowSupportShareTool;
