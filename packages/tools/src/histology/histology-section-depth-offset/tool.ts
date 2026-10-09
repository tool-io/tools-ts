import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSectionDepthMicrometers: number;
  readonly sectionIndex: number;
  readonly sectionPitchMicrometers: number;
};
export type Output = { readonly sectionDepthMicrometers: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSectionDepthMicrometers: { type: "number", minimum: 0 },
    sectionIndex: { type: "integer", minimum: 0 },
    sectionPitchMicrometers: { type: "number", minimum: 0 },
  },
  required: [
    "firstSectionDepthMicrometers",
    "sectionIndex",
    "sectionPitchMicrometers",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sectionDepthMicrometers: { type: "number" } },
  required: ["sectionDepthMicrometers"],
} as const;
/** Reference a zero-based section index to an explicit depth origin and section pitch without assuming thickness equals pitch. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstSectionDepthMicrometers,
    sectionIndex,
    sectionPitchMicrometers,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstSectionDepthMicrometers >= 0 && sectionPitchMicrometers >= 0,
      "firstSectionDepthMicrometers",
    );
    (H.domain(
      Number.isSafeInteger(sectionIndex) &&
        sectionIndex >= 0 &&
        sectionIndex <= Number.MAX_SAFE_INTEGER,
      "sectionIndex",
    ),
      sectionIndex);
    return {
      sectionDepthMicrometers:
        firstSectionDepthMicrometers + sectionIndex * sectionPitchMicrometers,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstSectionDepthMicrometers: 10,
    sectionIndex: 4,
    sectionPitchMicrometers: 5,
  },
  output: { sectionDepthMicrometers: 30 },
} satisfies ToolExample<Input, Output>;
export const histologySectionDepthOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["histology", "biology"],
      keywords: ["histology", "biology"],
    },
    id: "histology/histology-section-depth-offset",
    title: "Histology Section Depth Offset",
    description:
      "Reference a zero-based section index to an explicit depth origin and section pitch without assuming thickness equals pitch.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSectionDepthMicrometers: { type: "number", minimum: 0 },
        sectionIndex: { type: "integer", minimum: 0 },
        sectionPitchMicrometers: { type: "number", minimum: 0 },
      },
      required: [
        "firstSectionDepthMicrometers",
        "sectionIndex",
        "sectionPitchMicrometers",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sectionDepthMicrometers: { type: "number" } },
      required: ["sectionDepthMicrometers"],
    },
    ports: {
      inputs: [
        {
          id: "firstSectionDepthMicrometers",
          label: "First Section Depth Micrometers",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sectionIndex",
          label: "Section Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sectionPitchMicrometers",
          label: "Section Pitch Micrometers",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sectionDepthMicrometers",
          label: "Section Depth Micrometers",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = histologySectionDepthOffsetTool.execute;
export default histologySectionDepthOffsetTool;
