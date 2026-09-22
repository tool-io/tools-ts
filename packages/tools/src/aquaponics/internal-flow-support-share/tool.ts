import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly internalFlows: readonly number[];
  readonly durations: readonly number[];
  readonly measured: readonly boolean[];
  readonly sourceVerified: readonly boolean[];
};
export type Output = {
  readonly totalInternalVolume: number;
  readonly supportedVolume: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    internalFlows: { type: "array", maxItems: 256, items: { type: "number" } },
    durations: { type: "array", maxItems: 256, items: { type: "number" } },
    measured: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sourceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["internalFlows", "durations", "measured", "sourceVerified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalInternalVolume: { type: "number" },
    supportedVolume: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalInternalVolume", "supportedVolume", "share", "defined"],
} as const;
/** Calculate internal flow support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { internalFlows, durations, measured, sourceVerified } = request;
  const compute = (): Output => {
    H.sameLength(internalFlows, durations);
    H.sameLength(internalFlows, measured);
    H.sameLength(internalFlows, sourceVerified);
    H.domain([...internalFlows, ...durations].every((x) => x >= 0));
    return (() => {
      const totalInternalVolume = internalFlows.reduce(
          (s, x, i) => s + x * durations[i],
          0,
        ),
        supportedVolume = internalFlows.reduce(
          (s, x, i) =>
            s + (measured[i] && sourceVerified[i] ? x * durations[i] : 0),
          0,
        );
      return {
        totalInternalVolume,
        supportedVolume,
        share:
          totalInternalVolume > 0 ? supportedVolume / totalInternalVolume : 0,
        defined: totalInternalVolume > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    internalFlows: [2, 3],
    durations: [1, 2],
    measured: [true, true],
    sourceVerified: [true, false],
  },
  output: {
    totalInternalVolume: 8,
    supportedVolume: 2,
    share: 0.25,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const internalFlowSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/internal-flow-support-share",
    title: "Internal Flow Support Share Tool",
    description:
      "Calculate internal flow support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        internalFlows: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        durations: { type: "array", maxItems: 256, items: { type: "number" } },
        measured: { type: "array", maxItems: 256, items: { type: "boolean" } },
        sourceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["internalFlows", "durations", "measured", "sourceVerified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalInternalVolume: { type: "number" },
        supportedVolume: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["totalInternalVolume", "supportedVolume", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "internalFlows",
          label: "Internal Flows",
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
          id: "measured",
          label: "Measured",
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
          id: "totalInternalVolume",
          label: "Total Internal Volume",
          valueType: { type: "number" },
        },
        {
          id: "supportedVolume",
          label: "Supported Volume",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = internalFlowSupportShareTool.execute;
export default internalFlowSupportShareTool;
