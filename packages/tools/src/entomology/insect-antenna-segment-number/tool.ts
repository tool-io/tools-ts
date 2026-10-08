import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly side: string;
  readonly oneBasedSegment: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    side: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "unspecified"],
    },
    oneBasedSegment: { type: "integer", minimum: 1 },
  },
  required: ["specimenId", "side", "oneBasedSegment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly numbered antenna segment without inferring anatomy or a taxonomic identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, side, oneBasedSegment } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(["left", "right", "unspecified"].includes(side), "side");
    (H.domain(
      Number.isSafeInteger(oneBasedSegment) &&
        oneBasedSegment >= 1 &&
        oneBasedSegment <= Number.MAX_SAFE_INTEGER,
      "oneBasedSegment",
    ),
      oneBasedSegment);
    return {
      label: specimenId + "; " + side + " antenna segment " + oneBasedSegment,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "INS17", side: "left", oneBasedSegment: 3 },
  output: { label: "INS17; left antenna segment 3" },
} satisfies ToolExample<Input, Output>;
export const insectAntennaSegmentNumberTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["entomology", "biology"],
      keywords: ["entomology", "biology"],
    },
    id: "entomology/insect-antenna-segment-number",
    title: "Insect Antenna Segment Number",
    description:
      "Label an explicitly numbered antenna segment without inferring anatomy or a taxonomic identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        side: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "unspecified"],
        },
        oneBasedSegment: { type: "integer", minimum: 1 },
      },
      required: ["specimenId", "side", "oneBasedSegment"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "oneBasedSegment",
          label: "One Based Segment",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = insectAntennaSegmentNumberTool.execute;
export default insectAntennaSegmentNumberTool;
