import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly excerptStart: number;
  readonly excerptEnd: number;
  readonly contextBefore: number;
  readonly contextAfter: number;
  readonly textLength: number;
};
export type Output = {
  readonly contextStart: number;
  readonly contextEnd: number;
  readonly excerptOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excerptStart: { type: "integer", minimum: 0 },
    excerptEnd: { type: "integer" },
    contextBefore: { type: "integer", minimum: 0 },
    contextAfter: { type: "integer", minimum: 0 },
    textLength: { type: "integer", minimum: 0 },
  },
  required: [
    "excerptStart",
    "excerptEnd",
    "contextBefore",
    "contextAfter",
    "textLength",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contextStart: { type: "integer" },
    contextEnd: { type: "integer" },
    excerptOffset: { type: "integer" },
  },
  required: ["contextStart", "contextEnd", "excerptOffset"],
} as const;
/** Expand supplied half-open character offsets within an explicit text extent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { excerptStart, excerptEnd, contextBefore, contextAfter, textLength } =
    request;
  const compute = (): Output => {
    H.integer(textLength, 0);
    H.integer(excerptStart, 0, textLength);
    H.integer(excerptEnd, excerptStart, textLength);
    H.integer(contextBefore, 0);
    H.integer(contextAfter, 0);
    return {
      contextStart: Math.max(0, excerptStart - contextBefore),
      contextEnd: Math.min(textLength, excerptEnd + contextAfter),
      excerptOffset: excerptStart - Math.max(0, excerptStart - contextBefore),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    excerptStart: 5,
    excerptEnd: 10,
    contextBefore: 3,
    contextAfter: 4,
    textLength: 12,
  },
  output: { contextStart: 2, contextEnd: 12, excerptOffset: 3 },
} satisfies ToolExample<Input, Output>;
export const excerptContextWindowOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/excerpt-context-window-offset",
    title: "Excerpt Context Window Offset Tool",
    description:
      "Expand supplied half-open character offsets within an explicit text extent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excerptStart: { type: "integer", minimum: 0 },
        excerptEnd: { type: "integer" },
        contextBefore: { type: "integer", minimum: 0 },
        contextAfter: { type: "integer", minimum: 0 },
        textLength: { type: "integer", minimum: 0 },
      },
      required: [
        "excerptStart",
        "excerptEnd",
        "contextBefore",
        "contextAfter",
        "textLength",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contextStart: { type: "integer" },
        contextEnd: { type: "integer" },
        excerptOffset: { type: "integer" },
      },
      required: ["contextStart", "contextEnd", "excerptOffset"],
    },
    ports: {
      inputs: [
        {
          id: "excerptStart",
          label: "Excerpt Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excerptEnd",
          label: "Excerpt End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "contextBefore",
          label: "Context Before",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "contextAfter",
          label: "Context After",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "textLength",
          label: "Text Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "contextStart",
          label: "Context Start",
          valueType: { type: "integer" },
        },
        {
          id: "contextEnd",
          label: "Context End",
          valueType: { type: "integer" },
        },
        {
          id: "excerptOffset",
          label: "Excerpt Offset",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = excerptContextWindowOffsetTool.execute;
export default excerptContextWindowOffsetTool;
