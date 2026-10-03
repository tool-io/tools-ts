import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly epochDurations: readonly number[];
  readonly signalValid: readonly boolean[];
  readonly phaseKnown: readonly boolean[];
  readonly sensorConnected: readonly boolean[];
};
export type Output = {
  readonly recordedDuration: number;
  readonly supportedDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    epochDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    signalValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    phaseKnown: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sensorConnected: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["epochDurations", "signalValid", "phaseKnown", "sensorConnected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDuration: { type: "number" },
    supportedDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["recordedDuration", "supportedDuration", "share", "defined"],
} as const;
/** Calculate respiratory epoch support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { epochDurations, signalValid, phaseKnown, sensorConnected } = request;
  const compute = (): Output => {
    H.sameLength(epochDurations, signalValid);
    H.sameLength(epochDurations, phaseKnown);
    H.sameLength(epochDurations, sensorConnected);
    H.domain(epochDurations.every((x) => x >= 0));
    return (() => {
      const recordedDuration = epochDurations.reduce((a, b) => a + b, 0),
        supportedDuration = epochDurations.reduce(
          (s, x, i) =>
            s + (signalValid[i] && phaseKnown[i] && sensorConnected[i] ? x : 0),
          0,
        );
      return {
        recordedDuration,
        supportedDuration,
        share: recordedDuration > 0 ? supportedDuration / recordedDuration : 0,
        defined: recordedDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    epochDurations: [2, 3, 5],
    signalValid: [true, true, true],
    phaseKnown: [true, false, true],
    sensorConnected: [true, true, false],
  },
  output: {
    recordedDuration: 10,
    supportedDuration: 2,
    share: 0.2,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const respiratoryEpochSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/respiratory-epoch-support-share",
    title: "Respiratory Epoch Support Share Tool",
    description:
      "Calculate respiratory epoch support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        epochDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        signalValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        phaseKnown: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sensorConnected: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "epochDurations",
        "signalValid",
        "phaseKnown",
        "sensorConnected",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDuration: { type: "number" },
        supportedDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["recordedDuration", "supportedDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "epochDurations",
          label: "Epoch Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "signalValid",
          label: "Signal Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "phaseKnown",
          label: "Phase Known",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sensorConnected",
          label: "Sensor Connected",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "recordedDuration",
          label: "Recorded Duration",
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
export const run = respiratoryEpochSupportShareTool.execute;
export default respiratoryEpochSupportShareTool;
