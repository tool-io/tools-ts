import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstBaseline: number;
  readonly secondBaseline: number;
  readonly scaleUnitsPerPixel: number;
};
export type Output = {
  readonly signedSpacing: number;
  readonly absoluteSpacing: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstBaseline: { type: "number" },
    secondBaseline: { type: "number" },
    scaleUnitsPerPixel: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstBaseline", "secondBaseline", "scaleUnitsPerPixel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedSpacing: { type: "number" },
    absoluteSpacing: { type: "number" },
  },
  required: ["signedSpacing", "absoluteSpacing"],
} as const;
/** Convert two supplied baseline positions into signed and absolute line spacing without attributing authorship. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstBaseline, secondBaseline, scaleUnitsPerPixel } = request;
  const compute = (): Output => {
    (H.domain(scaleUnitsPerPixel > 0, "scaleUnitsPerPixel"),
      scaleUnitsPerPixel);
    return {
      signedSpacing: (secondBaseline - firstBaseline) * scaleUnitsPerPixel,
      absoluteSpacing:
        Math.abs(secondBaseline - firstBaseline) * scaleUnitsPerPixel,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstBaseline: 120, secondBaseline: 150, scaleUnitsPerPixel: 0.1 },
  output: { signedSpacing: 3, absoluteSpacing: 3 },
} satisfies ToolExample<Input, Output>;
export const questionedDocumentLineSpacingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "forensic-science",
        "forensic science",
        "research and quality management",
      ],
      keywords: ["forensic science", "research and quality management"],
    },
    id: "forensic-science/questioned-document-line-spacing",
    title: "Questioned Document Line Spacing",
    description:
      "Convert two supplied baseline positions into signed and absolute line spacing without attributing authorship.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstBaseline: { type: "number" },
        secondBaseline: { type: "number" },
        scaleUnitsPerPixel: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstBaseline", "secondBaseline", "scaleUnitsPerPixel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedSpacing: { type: "number" },
        absoluteSpacing: { type: "number" },
      },
      required: ["signedSpacing", "absoluteSpacing"],
    },
    ports: {
      inputs: [
        {
          id: "firstBaseline",
          label: "First Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondBaseline",
          label: "Second Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleUnitsPerPixel",
          label: "Scale Units Per Pixel",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedSpacing",
          label: "Signed Spacing",
          valueType: { type: "number" },
        },
        {
          id: "absoluteSpacing",
          label: "Absolute Spacing",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = questionedDocumentLineSpacingTool.execute;
export default questionedDocumentLineSpacingTool;
