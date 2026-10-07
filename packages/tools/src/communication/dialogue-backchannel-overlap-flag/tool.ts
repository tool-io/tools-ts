import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mainStart: number;
  readonly mainEnd: number;
  readonly backchannelStart: number;
  readonly backchannelEnd: number;
};
export type Output = {
  readonly positiveDurationOverlap: boolean;
  readonly overlapDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mainStart: { type: "number" },
    mainEnd: { type: "number" },
    backchannelStart: { type: "number" },
    backchannelEnd: { type: "number" },
  },
  required: ["mainStart", "mainEnd", "backchannelStart", "backchannelEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveDurationOverlap: { type: "boolean" },
    overlapDuration: { type: "number" },
  },
  required: ["positiveDurationOverlap", "overlapDuration"],
} as const;
/** Intersect explicit half-open dialogue and backchannel intervals without detecting speech or assigning communicative intent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mainStart, mainEnd, backchannelStart, backchannelEnd } = request;
  const compute = (): Output => {
    H.domain(mainEnd >= mainStart, "mainEnd");
    H.domain(backchannelEnd >= backchannelStart, "backchannelEnd");
    return (() => {
      const overlapDuration = Math.max(
        0,
        Math.min(mainEnd, backchannelEnd) -
          Math.max(mainStart, backchannelStart),
      );
      return { positiveDurationOverlap: overlapDuration > 0, overlapDuration };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    mainStart: 10,
    mainEnd: 20,
    backchannelStart: 18,
    backchannelEnd: 22,
  },
  output: { positiveDurationOverlap: true, overlapDuration: 2 },
} satisfies ToolExample<Input, Output>;
export const dialogueBackchannelOverlapFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["communication", "social sciences"],
      keywords: ["communication", "social sciences"],
    },
    id: "communication/dialogue-backchannel-overlap-flag",
    title: "Dialogue Backchannel Overlap Flag",
    description:
      "Intersect explicit half-open dialogue and backchannel intervals without detecting speech or assigning communicative intent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mainStart: { type: "number" },
        mainEnd: { type: "number" },
        backchannelStart: { type: "number" },
        backchannelEnd: { type: "number" },
      },
      required: ["mainStart", "mainEnd", "backchannelStart", "backchannelEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveDurationOverlap: { type: "boolean" },
        overlapDuration: { type: "number" },
      },
      required: ["positiveDurationOverlap", "overlapDuration"],
    },
    ports: {
      inputs: [
        {
          id: "mainStart",
          label: "Main Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "mainEnd",
          label: "Main End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "backchannelStart",
          label: "Backchannel Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "backchannelEnd",
          label: "Backchannel End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "positiveDurationOverlap",
          label: "Positive Duration Overlap",
          valueType: { type: "boolean" },
        },
        {
          id: "overlapDuration",
          label: "Overlap Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dialogueBackchannelOverlapFlagTool.execute;
export default dialogueBackchannelOverlapFlagTool;
