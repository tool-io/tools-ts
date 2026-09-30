import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly segmentFrames: readonly number[];
  readonly programFrames: number;
  readonly excludedFrames: number;
};
export type Output = {
  readonly segmentSumDecimal: string;
  readonly eligibleFrames: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentFrames: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    programFrames: { type: "integer", minimum: 1 },
    excludedFrames: { type: "integer", minimum: 0 },
  },
  required: ["segmentFrames", "programFrames", "excludedFrames"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentSumDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    eligibleFrames: { type: "integer" },
    share: { type: "number" },
  },
  required: ["segmentSumDecimal", "eligibleFrames", "share"],
} as const;
/** Calculate broadcast segment frame share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segmentFrames, programFrames, excludedFrames } = request;
  const compute = (): Output => {
    H.domain(segmentFrames.every((x) => x >= 0));
    H.integer(programFrames, 1);
    H.integer(excludedFrames, 0, programFrames - 1);
    return (() => {
      const sum = segmentFrames.reduce((s, x) => s + BigInt(x), 0n),
        eligibleFrames = programFrames - excludedFrames;
      H.domain(sum <= BigInt(eligibleFrames));
      return {
        segmentSumDecimal: sum.toString(),
        eligibleFrames,
        share: Number(sum) / eligibleFrames,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { segmentFrames: [10, 20], programFrames: 100, excludedFrames: 25 },
  output: { segmentSumDecimal: "30", eligibleFrames: 75, share: 0.4 },
} satisfies ToolExample<Input, Output>;
export const broadcastSegmentFrameShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/broadcast-segment-frame-share",
    title: "Broadcast Segment Frame Share Tool",
    description:
      "Calculate broadcast segment frame share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segmentFrames: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        programFrames: { type: "integer", minimum: 1 },
        excludedFrames: { type: "integer", minimum: 0 },
      },
      required: ["segmentFrames", "programFrames", "excludedFrames"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segmentSumDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        eligibleFrames: { type: "integer" },
        share: { type: "number" },
      },
      required: ["segmentSumDecimal", "eligibleFrames", "share"],
    },
    ports: {
      inputs: [
        {
          id: "segmentFrames",
          label: "Segment Frames",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "programFrames",
          label: "Program Frames",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedFrames",
          label: "Excluded Frames",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "segmentSumDecimal",
          label: "Segment Sum Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "eligibleFrames",
          label: "Eligible Frames",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = broadcastSegmentFrameShareTool.execute;
export default broadcastSegmentFrameShareTool;
