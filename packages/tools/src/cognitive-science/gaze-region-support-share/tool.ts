import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly validTracking: readonly boolean[];
  readonly inRegion: readonly boolean[];
  readonly regionVisible: readonly boolean[];
};
export type Output = {
  readonly validVisibleDuration: number;
  readonly supportedRegionDuration: number;
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
    validTracking: { type: "array", maxItems: 256, items: { type: "boolean" } },
    inRegion: { type: "array", maxItems: 256, items: { type: "boolean" } },
    regionVisible: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["durations", "validTracking", "inRegion", "regionVisible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validVisibleDuration: { type: "number" },
    supportedRegionDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "validVisibleDuration",
    "supportedRegionDuration",
    "share",
    "defined",
  ],
} as const;
/** Calculate gaze region support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, validTracking, inRegion, regionVisible } = request;
  const compute = (): Output => {
    H.sameLength(durations, validTracking);
    H.sameLength(durations, inRegion);
    H.sameLength(durations, regionVisible);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const validVisibleDuration = durations.reduce(
          (s, x, i) => s + (validTracking[i] && regionVisible[i] ? x : 0),
          0,
        ),
        supportedRegionDuration = durations.reduce(
          (s, x, i) =>
            s + (validTracking[i] && regionVisible[i] && inRegion[i] ? x : 0),
          0,
        );
      return {
        validVisibleDuration,
        supportedRegionDuration,
        share:
          validVisibleDuration > 0
            ? supportedRegionDuration / validVisibleDuration
            : 0,
        defined: validVisibleDuration > 0,
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
    validTracking: [true, true, true],
    inRegion: [true, false, true],
    regionVisible: [true, true, false],
  },
  output: {
    validVisibleDuration: 5,
    supportedRegionDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const gazeRegionSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cognitive-science/gaze-region-support-share",
    title: "Gaze Region Support Share Tool",
    description:
      "Calculate gaze region support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        validTracking: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        inRegion: { type: "array", maxItems: 256, items: { type: "boolean" } },
        regionVisible: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["durations", "validTracking", "inRegion", "regionVisible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validVisibleDuration: { type: "number" },
        supportedRegionDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "validVisibleDuration",
        "supportedRegionDuration",
        "share",
        "defined",
      ],
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
          id: "validTracking",
          label: "Valid Tracking",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "inRegion",
          label: "In Region",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "regionVisible",
          label: "Region Visible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "validVisibleDuration",
          label: "Valid Visible Duration",
          valueType: { type: "number" },
        },
        {
          id: "supportedRegionDuration",
          label: "Supported Region Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = gazeRegionSupportShareTool.execute;
export default gazeRegionSupportShareTool;
