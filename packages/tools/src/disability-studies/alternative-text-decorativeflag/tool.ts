import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly decorative: boolean;
  readonly suppliedAlt: string;
};
export type Output = {
  readonly recommendedAltAttribute: string;
  readonly nonemptyAltOnDecorative: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    decorative: { type: "boolean" },
    suppliedAlt: { type: "string", maxLength: 8192 },
  },
  required: ["decorative", "suppliedAlt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recommendedAltAttribute: { type: "string", maxLength: 8192 },
    nonemptyAltOnDecorative: { type: "boolean" },
  },
  required: ["recommendedAltAttribute", "nonemptyAltOnDecorative"],
} as const;
/** Resolve the alt attribute for an explicitly decorative image to the empty string; meaningful-image text remains caller-supplied and is not judged. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { decorative, suppliedAlt } = request;
  const compute = (): Output => {
    return {
      recommendedAltAttribute: decorative ? "" : suppliedAlt,
      nonemptyAltOnDecorative: decorative && suppliedAlt.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { decorative: true, suppliedAlt: "flourish" },
  output: { recommendedAltAttribute: "", nonemptyAltOnDecorative: true },
} satisfies ToolExample<Input, Output>;
export const alternativeTextDecorativeflagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/alternative-text-decorativeflag",
    title: "Alternative Text Decorativeflag Tool",
    description:
      "Resolve the alt attribute for an explicitly decorative image to the empty string; meaningful-image text remains caller-supplied and is not judged.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        decorative: { type: "boolean" },
        suppliedAlt: { type: "string", maxLength: 8192 },
      },
      required: ["decorative", "suppliedAlt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recommendedAltAttribute: { type: "string", maxLength: 8192 },
        nonemptyAltOnDecorative: { type: "boolean" },
      },
      required: ["recommendedAltAttribute", "nonemptyAltOnDecorative"],
    },
    ports: {
      inputs: [
        {
          id: "decorative",
          label: "Decorative",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedAlt",
          label: "Supplied Alt",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "recommendedAltAttribute",
          label: "Recommended Alt Attribute",
          valueType: { type: "string" },
        },
        {
          id: "nonemptyAltOnDecorative",
          label: "Nonempty Alt On Decorative",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = alternativeTextDecorativeflagTool.execute;
export default alternativeTextDecorativeflagTool;
