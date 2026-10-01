import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stimulusAt: number;
  readonly windowStart: number;
  readonly windowEnd: number;
  readonly suppliedAnchor: number;
};
export type Output = {
  readonly relativeStart: number;
  readonly relativeEnd: number;
  readonly anchorGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stimulusAt: { type: "number" },
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
    suppliedAnchor: { type: "number" },
  },
  required: ["stimulusAt", "windowStart", "windowEnd", "suppliedAnchor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeStart: { type: "number" },
    relativeEnd: { type: "number" },
    anchorGap: { type: "number" },
  },
  required: ["relativeStart", "relativeEnd", "anchorGap"],
} as const;
/** Calculate evoked window anchor gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stimulusAt, windowStart, windowEnd, suppliedAnchor } = request;
  const compute = (): Output => {
    H.domain(windowEnd >= windowStart);
    return {
      relativeStart: windowStart - stimulusAt,
      relativeEnd: windowEnd - stimulusAt,
      anchorGap: suppliedAnchor - stimulusAt,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stimulusAt: 10,
    windowStart: 9,
    windowEnd: 13,
    suppliedAnchor: 10.5,
  },
  output: { relativeStart: -1, relativeEnd: 3, anchorGap: 0.5 },
} satisfies ToolExample<Input, Output>;
export const evokedWindowAnchorGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/evoked-window-anchor-gap",
    title: "Evoked Window Anchor Gap Tool",
    description:
      "Calculate evoked window anchor gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stimulusAt: { type: "number" },
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
        suppliedAnchor: { type: "number" },
      },
      required: ["stimulusAt", "windowStart", "windowEnd", "suppliedAnchor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeStart: { type: "number" },
        relativeEnd: { type: "number" },
        anchorGap: { type: "number" },
      },
      required: ["relativeStart", "relativeEnd", "anchorGap"],
    },
    ports: {
      inputs: [
        {
          id: "stimulusAt",
          label: "Stimulus At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowStart",
          label: "Window Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowEnd",
          label: "Window End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAnchor",
          label: "Supplied Anchor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeStart",
          label: "Relative Start",
          valueType: { type: "number" },
        },
        {
          id: "relativeEnd",
          label: "Relative End",
          valueType: { type: "number" },
        },
        { id: "anchorGap", label: "Anchor Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = evokedWindowAnchorGapTool.execute;
export default evokedWindowAnchorGapTool;
