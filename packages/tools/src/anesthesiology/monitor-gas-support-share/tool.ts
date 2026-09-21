import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly gasChannelPresent: readonly boolean[];
  readonly calibrationCurrent: readonly boolean[];
  readonly referenceKnown: readonly boolean[];
};
export type Output = {
  readonly gasDuration: number;
  readonly supportedGasDuration: number;
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
    gasChannelPresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    calibrationCurrent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    referenceKnown: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "durations",
    "gasChannelPresent",
    "calibrationCurrent",
    "referenceKnown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gasDuration: { type: "number" },
    supportedGasDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["gasDuration", "supportedGasDuration", "share", "defined"],
} as const;
/** Account for explicit nonclinical gas-monitor metadata without dosing, gas settings or care recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, gasChannelPresent, calibrationCurrent, referenceKnown } =
    request;
  const compute = (): Output => {
    H.sameLength(durations, gasChannelPresent);
    H.sameLength(durations, calibrationCurrent);
    H.sameLength(durations, referenceKnown);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const gasDuration = durations.reduce(
          (s, x, i) => s + (gasChannelPresent[i] ? x : 0),
          0,
        ),
        supportedGasDuration = durations.reduce(
          (s, x, i) =>
            s +
            (gasChannelPresent[i] && calibrationCurrent[i] && referenceKnown[i]
              ? x
              : 0),
          0,
        );
      return {
        gasDuration,
        supportedGasDuration,
        share: gasDuration > 0 ? supportedGasDuration / gasDuration : 0,
        defined: gasDuration > 0,
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
    gasChannelPresent: [true, true, false],
    calibrationCurrent: [true, true, true],
    referenceKnown: [true, false, true],
  },
  output: {
    gasDuration: 5,
    supportedGasDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const monitorGasSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/monitor-gas-support-share",
    title: "Monitor Gas Support Share Tool",
    description:
      "Account for explicit nonclinical gas-monitor metadata without dosing, gas settings or care recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        gasChannelPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        calibrationCurrent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        referenceKnown: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "durations",
        "gasChannelPresent",
        "calibrationCurrent",
        "referenceKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gasDuration: { type: "number" },
        supportedGasDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["gasDuration", "supportedGasDuration", "share", "defined"],
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
          id: "gasChannelPresent",
          label: "Gas Channel Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "calibrationCurrent",
          label: "Calibration Current",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "referenceKnown",
          label: "Reference Known",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "gasDuration",
          label: "Gas Duration",
          valueType: { type: "number" },
        },
        {
          id: "supportedGasDuration",
          label: "Supported Gas Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = monitorGasSupportShareTool.execute;
export default monitorGasSupportShareTool;
