import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPixels: number;
  readonly rulerPixels: number;
  readonly suppliedRulerLength: number;
  readonly suppliedOriginOffset: number;
};
export type Output = {
  readonly measuredLength: number;
  readonly referencedLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPixels: { type: "number", minimum: 0 },
    rulerPixels: { type: "number", exclusiveMinimum: 0 },
    suppliedRulerLength: { type: "number", exclusiveMinimum: 0 },
    suppliedOriginOffset: { type: "number" },
  },
  required: [
    "measuredPixels",
    "rulerPixels",
    "suppliedRulerLength",
    "suppliedOriginOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredLength: { type: "number" },
    referencedLength: { type: "number" },
  },
  required: ["measuredLength", "referencedLength"],
} as const;
/** Map supplied canal-phantom image dimensions to a reference offset without working-length or treatment guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    measuredPixels,
    rulerPixels,
    suppliedRulerLength,
    suppliedOriginOffset,
  } = request;
  const compute = (): Output => {
    H.domain(measuredPixels >= 0);
    H.positive(rulerPixels);
    H.positive(suppliedRulerLength);
    return {
      measuredLength: (measuredPixels * suppliedRulerLength) / rulerPixels,
      referencedLength:
        (measuredPixels * suppliedRulerLength) / rulerPixels +
        suppliedOriginOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredPixels: 40,
    rulerPixels: 20,
    suppliedRulerLength: 5,
    suppliedOriginOffset: 1,
  },
  output: { measuredLength: 10, referencedLength: 11 },
} satisfies ToolExample<Input, Output>;
export const canalImageReferenceLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/canal-image-reference-length",
    title: "Canal Image Reference Length Tool",
    description:
      "Map supplied canal-phantom image dimensions to a reference offset without working-length or treatment guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPixels: { type: "number", minimum: 0 },
        rulerPixels: { type: "number", exclusiveMinimum: 0 },
        suppliedRulerLength: { type: "number", exclusiveMinimum: 0 },
        suppliedOriginOffset: { type: "number" },
      },
      required: [
        "measuredPixels",
        "rulerPixels",
        "suppliedRulerLength",
        "suppliedOriginOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredLength: { type: "number" },
        referencedLength: { type: "number" },
      },
      required: ["measuredLength", "referencedLength"],
    },
    ports: {
      inputs: [
        {
          id: "measuredPixels",
          label: "Measured Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rulerPixels",
          label: "Ruler Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRulerLength",
          label: "Supplied Ruler Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOriginOffset",
          label: "Supplied Origin Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "measuredLength",
          label: "Measured Length",
          valueType: { type: "number" },
        },
        {
          id: "referencedLength",
          label: "Referenced Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = canalImageReferenceLengthTool.execute;
export default canalImageReferenceLengthTool;
