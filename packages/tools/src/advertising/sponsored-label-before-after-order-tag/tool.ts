import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labelStartIndex: number;
  readonly contentStartIndex: number;
};
export type Output = {
  readonly labelBeforeContent: boolean;
  readonly sameStart: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelStartIndex: { type: "integer", minimum: 0 },
    contentStartIndex: { type: "integer", minimum: 0 },
  },
  required: ["labelStartIndex", "contentStartIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelBeforeContent: { type: "boolean" },
    sameStart: { type: "boolean" },
  },
  required: ["labelBeforeContent", "sameStart"],
} as const;
/** Compare explicitly recorded sponsored-label and content start indices without judging disclosure prominence or legal compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labelStartIndex, contentStartIndex } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(labelStartIndex) &&
        labelStartIndex >= 0 &&
        labelStartIndex <= Number.MAX_SAFE_INTEGER,
      "labelStartIndex",
    ),
      labelStartIndex);
    (H.domain(
      Number.isSafeInteger(contentStartIndex) &&
        contentStartIndex >= 0 &&
        contentStartIndex <= Number.MAX_SAFE_INTEGER,
      "contentStartIndex",
    ),
      contentStartIndex);
    return {
      labelBeforeContent: labelStartIndex < contentStartIndex,
      sameStart: labelStartIndex === contentStartIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labelStartIndex: 0, contentStartIndex: 10 },
  output: { labelBeforeContent: true, sameStart: false },
} satisfies ToolExample<Input, Output>;
export const sponsoredLabelBeforeAfterOrderTagTool = H.defineSchemaCalculation<
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
    id: "advertising/sponsored-label-before-after-order-tag",
    title: "Sponsored Label Before After Order Tag",
    description:
      "Compare explicitly recorded sponsored-label and content start indices without judging disclosure prominence or legal compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelStartIndex: { type: "integer", minimum: 0 },
        contentStartIndex: { type: "integer", minimum: 0 },
      },
      required: ["labelStartIndex", "contentStartIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelBeforeContent: { type: "boolean" },
        sameStart: { type: "boolean" },
      },
      required: ["labelBeforeContent", "sameStart"],
    },
    ports: {
      inputs: [
        {
          id: "labelStartIndex",
          label: "Label Start Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "contentStartIndex",
          label: "Content Start Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "labelBeforeContent",
          label: "Label Before Content",
          valueType: { type: "boolean" },
        },
        {
          id: "sameStart",
          label: "Same Start",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = sponsoredLabelBeforeAfterOrderTagTool.execute;
export default sponsoredLabelBeforeAfterOrderTagTool;
