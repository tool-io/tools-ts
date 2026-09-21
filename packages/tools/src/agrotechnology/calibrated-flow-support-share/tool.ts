import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flows: readonly number[];
  readonly durations: readonly number[];
  readonly calibrationCurrent: readonly boolean[];
  readonly sectionEnabled: readonly boolean[];
};
export type Output = {
  readonly enabledVolume: number;
  readonly calibratedVolume: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flows: { type: "array", maxItems: 256, items: { type: "number" } },
    durations: { type: "array", maxItems: 256, items: { type: "number" } },
    calibrationCurrent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    sectionEnabled: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["flows", "durations", "calibrationCurrent", "sectionEnabled"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enabledVolume: { type: "number" },
    calibratedVolume: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["enabledVolume", "calibratedVolume", "share", "defined"],
} as const;
/** Calculate calibrated flow support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flows, durations, calibrationCurrent, sectionEnabled } = request;
  const compute = (): Output => {
    H.sameLength(flows, durations);
    H.sameLength(flows, calibrationCurrent);
    H.sameLength(flows, sectionEnabled);
    H.domain([...flows, ...durations].every((x) => x >= 0));
    return (() => {
      const enabledVolume = flows.reduce(
          (s, x, i) => s + (sectionEnabled[i] ? x * durations[i] : 0),
          0,
        ),
        calibratedVolume = flows.reduce(
          (s, x, i) =>
            s +
            (sectionEnabled[i] && calibrationCurrent[i] ? x * durations[i] : 0),
          0,
        );
      return {
        enabledVolume,
        calibratedVolume,
        share: enabledVolume > 0 ? calibratedVolume / enabledVolume : 0,
        defined: enabledVolume > 0,
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
    calibrationCurrent: [true, false, true],
    sectionEnabled: [true, true, false],
  },
  output: { enabledVolume: 8, calibratedVolume: 2, share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const calibratedFlowSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/calibrated-flow-support-share",
    title: "Calibrated Flow Support Share Tool",
    description:
      "Calculate calibrated flow support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flows: { type: "array", maxItems: 256, items: { type: "number" } },
        durations: { type: "array", maxItems: 256, items: { type: "number" } },
        calibrationCurrent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sectionEnabled: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["flows", "durations", "calibrationCurrent", "sectionEnabled"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enabledVolume: { type: "number" },
        calibratedVolume: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["enabledVolume", "calibratedVolume", "share", "defined"],
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
          id: "calibrationCurrent",
          label: "Calibration Current",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sectionEnabled",
          label: "Section Enabled",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "enabledVolume",
          label: "Enabled Volume",
          valueType: { type: "number" },
        },
        {
          id: "calibratedVolume",
          label: "Calibrated Volume",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = calibratedFlowSupportShareTool.execute;
export default calibratedFlowSupportShareTool;
