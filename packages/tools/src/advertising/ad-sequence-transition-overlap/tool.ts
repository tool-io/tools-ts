import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDuration: number;
  readonly secondDuration: number;
  readonly overlapDuration: number;
};
export type Output = { readonly combinedDuration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDuration: { type: "number", minimum: 0 },
    secondDuration: { type: "number", minimum: 0 },
    overlapDuration: { type: "number", minimum: 0 },
  },
  required: ["firstDuration", "secondDuration", "overlapDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { combinedDuration: { type: "number" } },
  required: ["combinedDuration"],
} as const;
/** Calculate explicit two-item sequence duration after a supplied transition overlap without editing media. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDuration, secondDuration, overlapDuration } = request;
  const compute = (): Output => {
    H.domain(
      firstDuration >= 0 &&
        secondDuration >= 0 &&
        overlapDuration >= 0 &&
        overlapDuration <= Math.min(firstDuration, secondDuration),
      "firstDuration",
    );
    return {
      combinedDuration: firstDuration + secondDuration - overlapDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDuration: 30, secondDuration: 20, overlapDuration: 5 },
  output: { combinedDuration: 45 },
} satisfies ToolExample<Input, Output>;
export const adSequenceTransitionOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["advertising", "business and finance"],
      keywords: ["advertising", "business and finance"],
    },
    id: "advertising/ad-sequence-transition-overlap",
    title: "Ad Sequence Transition Overlap",
    description:
      "Calculate explicit two-item sequence duration after a supplied transition overlap without editing media.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDuration: { type: "number", minimum: 0 },
        secondDuration: { type: "number", minimum: 0 },
        overlapDuration: { type: "number", minimum: 0 },
      },
      required: ["firstDuration", "secondDuration", "overlapDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { combinedDuration: { type: "number" } },
      required: ["combinedDuration"],
    },
    ports: {
      inputs: [
        {
          id: "firstDuration",
          label: "First Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDuration",
          label: "Second Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapDuration",
          label: "Overlap Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "combinedDuration",
          label: "Combined Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = adSequenceTransitionOverlapTool.execute;
export default adSequenceTransitionOverlapTool;
