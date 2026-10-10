import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly blockId: string;
  readonly sectionNumber: number;
  readonly slideNumber: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blockId: { type: "string", maxLength: 8192, minLength: 1 },
    sectionNumber: { type: "integer", minimum: 1 },
    slideNumber: { type: "integer", minimum: 1 },
  },
  required: ["blockId", "sectionNumber", "slideNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format explicit one-based histologic section and slide ordinals within a supplied block. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { blockId, sectionNumber, slideNumber } = request;
  const compute = (): Output => {
    H.domain(blockId.length > 0, "blockId");
    (H.domain(
      Number.isSafeInteger(sectionNumber) &&
        sectionNumber >= 1 &&
        sectionNumber <= Number.MAX_SAFE_INTEGER,
      "sectionNumber",
    ),
      sectionNumber);
    (H.domain(
      Number.isSafeInteger(slideNumber) &&
        slideNumber >= 1 &&
        slideNumber <= Number.MAX_SAFE_INTEGER,
      "slideNumber",
    ),
      slideNumber);
    return {
      label: blockId + "; section " + sectionNumber + ", slide " + slideNumber,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { blockId: "B17", sectionNumber: 3, slideNumber: 2 },
  output: { label: "B17; section 3, slide 2" },
} satisfies ToolExample<Input, Output>;
export const slideBlockSubSectionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pathology", "health and medicine"],
      keywords: ["pathology", "health and medicine"],
    },
    id: "pathology/slide-block-sub-section-label",
    title: "Slide Block Sub Section Label",
    description:
      "Format explicit one-based histologic section and slide ordinals within a supplied block.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blockId: { type: "string", maxLength: 8192, minLength: 1 },
        sectionNumber: { type: "integer", minimum: 1 },
        slideNumber: { type: "integer", minimum: 1 },
      },
      required: ["blockId", "sectionNumber", "slideNumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "blockId",
          label: "Block Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sectionNumber",
          label: "Section Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "slideNumber",
          label: "Slide Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = slideBlockSubSectionLabelTool.execute;
export default slideBlockSubSectionLabelTool;
