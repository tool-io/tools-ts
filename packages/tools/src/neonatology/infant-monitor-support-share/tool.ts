import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly connected: readonly boolean[];
  readonly artifactFree: readonly boolean[];
  readonly channelMatched: readonly boolean[];
};
export type Output = {
  readonly connectedDuration: number;
  readonly supportedDuration: number;
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
    connected: { type: "array", maxItems: 256, items: { type: "boolean" } },
    artifactFree: { type: "array", maxItems: 256, items: { type: "boolean" } },
    channelMatched: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["durations", "connected", "artifactFree", "channelMatched"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    connectedDuration: { type: "number" },
    supportedDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["connectedDuration", "supportedDuration", "share", "defined"],
} as const;
/** Calculate infant monitor support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, connected, artifactFree, channelMatched } = request;
  const compute = (): Output => {
    H.sameLength(durations, connected);
    H.sameLength(durations, artifactFree);
    H.sameLength(durations, channelMatched);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const connectedDuration = durations.reduce(
          (s, x, i) => s + (connected[i] ? x : 0),
          0,
        ),
        supportedDuration = durations.reduce(
          (s, x, i) =>
            s + (connected[i] && artifactFree[i] && channelMatched[i] ? x : 0),
          0,
        );
      return {
        connectedDuration,
        supportedDuration,
        share:
          connectedDuration > 0 ? supportedDuration / connectedDuration : 0,
        defined: connectedDuration > 0,
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
    connected: [true, true, false],
    artifactFree: [true, true, true],
    channelMatched: [true, false, true],
  },
  output: {
    connectedDuration: 5,
    supportedDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const infantMonitorSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/infant-monitor-support-share",
    title: "Infant Monitor Support Share Tool",
    description:
      "Calculate infant monitor support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        connected: { type: "array", maxItems: 256, items: { type: "boolean" } },
        artifactFree: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        channelMatched: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["durations", "connected", "artifactFree", "channelMatched"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        connectedDuration: { type: "number" },
        supportedDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["connectedDuration", "supportedDuration", "share", "defined"],
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
          id: "connected",
          label: "Connected",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "artifactFree",
          label: "Artifact Free",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "channelMatched",
          label: "Channel Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "connectedDuration",
          label: "Connected Duration",
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
export const run = infantMonitorSupportShareTool.execute;
export default infantMonitorSupportShareTool;
