import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bearingDegrees: number;
  readonly northReference: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bearingDegrees: { type: "number", minimum: 0, exclusiveMaximum: 360 },
    northReference: {
      type: "string",
      maxLength: 8192,
      enum: ["true", "magnetic", "grid"],
    },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["bearingDegrees", "northReference", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied qibla bearing and north convention without calculating direction or magnetic declination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bearingDegrees, northReference, source } = request;
  const compute = (): Output => {
    H.domain(bearingDegrees >= 0 && bearingDegrees < 360, "bearingDegrees");
    H.domain(
      ["true", "magnetic", "grid"].includes(northReference),
      "northReference",
    );
    H.domain(source.length > 0, "source");
    return {
      label:
        bearingDegrees +
        "° clockwise from " +
        northReference +
        " north [" +
        source +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bearingDegrees: 120, northReference: "true", source: "Map A" },
  output: { label: "120° clockwise from true north [Map A]" },
} satisfies ToolExample<Input, Output>;
export const qiblaBearingConventionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["islamic-studies", "islamic studies", "humanities"],
      keywords: ["islamic studies", "humanities"],
    },
    id: "islamic-studies/qibla-bearing-convention-label",
    title: "Qibla Bearing Convention Label",
    description:
      "Label an explicitly supplied qibla bearing and north convention without calculating direction or magnetic declination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bearingDegrees: { type: "number", minimum: 0, exclusiveMaximum: 360 },
        northReference: {
          type: "string",
          maxLength: 8192,
          enum: ["true", "magnetic", "grid"],
        },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["bearingDegrees", "northReference", "source"],
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
          id: "bearingDegrees",
          label: "Bearing Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "northReference",
          label: "North Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = qiblaBearingConventionLabelTool.execute;
export default qiblaBearingConventionLabelTool;
