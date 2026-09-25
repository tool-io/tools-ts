import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly excerptStart: number;
  readonly excerptTime: number;
  readonly sourceOrigin: number;
};
export type Output = {
  readonly sourceTime: number;
  readonly relativeTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excerptStart: { type: "number" },
    excerptTime: { type: "number" },
    sourceOrigin: { type: "number" },
  },
  required: ["excerptStart", "excerptTime", "sourceOrigin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTime: { type: "number" },
    relativeTime: { type: "number" },
  },
  required: ["sourceTime", "relativeTime"],
} as const;
/** Translate an explicitly supplied excerpt timestamp into source coordinates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { excerptStart, excerptTime, sourceOrigin } = request;
  const compute = (): Output => {
    return {
      sourceTime: sourceOrigin + excerptStart + excerptTime,
      relativeTime: excerptStart + excerptTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { excerptStart: 30, excerptTime: 5, sourceOrigin: 100 },
  output: { sourceTime: 135, relativeTime: 35 },
} satisfies ToolExample<Input, Output>;
export const mediaExcerptCitationOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/media-excerpt-citation-offset",
    title: "Media Excerpt Citation Offset Tool",
    description:
      "Translate an explicitly supplied excerpt timestamp into source coordinates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excerptStart: { type: "number" },
        excerptTime: { type: "number" },
        sourceOrigin: { type: "number" },
      },
      required: ["excerptStart", "excerptTime", "sourceOrigin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceTime: { type: "number" },
        relativeTime: { type: "number" },
      },
      required: ["sourceTime", "relativeTime"],
    },
    ports: {
      inputs: [
        {
          id: "excerptStart",
          label: "Excerpt Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excerptTime",
          label: "Excerpt Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceOrigin",
          label: "Source Origin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sourceTime",
          label: "Source Time",
          valueType: { type: "number" },
        },
        {
          id: "relativeTime",
          label: "Relative Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mediaExcerptCitationOffsetTool.execute;
export default mediaExcerptCitationOffsetTool;
