import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly secondEnd: number;
  readonly excludedOverlap: number;
};
export type Output = {
  readonly rawOverlap: number;
  readonly validOverlap: number;
  readonly shareOfFirst: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "number" },
    firstEnd: { type: "number" },
    secondStart: { type: "number" },
    secondEnd: { type: "number" },
    excludedOverlap: { type: "number", minimum: 0 },
  },
  required: [
    "firstStart",
    "firstEnd",
    "secondStart",
    "secondEnd",
    "excludedOverlap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawOverlap: { type: "number" },
    validOverlap: { type: "number" },
    shareOfFirst: { type: "number" },
  },
  required: ["rawOverlap", "validOverlap", "shareOfFirst"],
} as const;
/** Calculate cue overlap valid time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd, excludedOverlap } =
    request;
  const compute = (): Output => {
    H.domain(
      firstEnd > firstStart && secondEnd >= secondStart && excludedOverlap >= 0,
    );
    return (() => {
      const rawOverlap = Math.max(
        0,
        Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
      );
      H.domain(excludedOverlap <= rawOverlap);
      const validOverlap = rawOverlap - excludedOverlap;
      return {
        rawOverlap,
        validOverlap,
        shareOfFirst: validOverlap / (firstEnd - firstStart),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstStart: 0,
    firstEnd: 10,
    secondStart: 5,
    secondEnd: 12,
    excludedOverlap: 1,
  },
  output: { rawOverlap: 5, validOverlap: 4, shareOfFirst: 0.4 },
} satisfies ToolExample<Input, Output>;
export const cueOverlapValidTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/cue-overlap-valid-time-share",
    title: "Cue Overlap Valid Time Share Tool",
    description:
      "Calculate cue overlap valid time share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStart: { type: "number" },
        firstEnd: { type: "number" },
        secondStart: { type: "number" },
        secondEnd: { type: "number" },
        excludedOverlap: { type: "number", minimum: 0 },
      },
      required: [
        "firstStart",
        "firstEnd",
        "secondStart",
        "secondEnd",
        "excludedOverlap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawOverlap: { type: "number" },
        validOverlap: { type: "number" },
        shareOfFirst: { type: "number" },
      },
      required: ["rawOverlap", "validOverlap", "shareOfFirst"],
    },
    ports: {
      inputs: [
        {
          id: "firstStart",
          label: "First Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstEnd",
          label: "First End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondEnd",
          label: "Second End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedOverlap",
          label: "Excluded Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rawOverlap",
          label: "Raw Overlap",
          valueType: { type: "number" },
        },
        {
          id: "validOverlap",
          label: "Valid Overlap",
          valueType: { type: "number" },
        },
        {
          id: "shareOfFirst",
          label: "Share Of First",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cueOverlapValidTimeShareTool.execute;
export default cueOverlapValidTimeShareTool;
