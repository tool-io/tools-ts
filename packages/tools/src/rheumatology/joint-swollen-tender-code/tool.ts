import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly jointId: string;
  readonly assessed: boolean;
  readonly swollenRecorded: boolean;
  readonly tenderRecorded: boolean;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointId: { type: "string", maxLength: 8192, minLength: 1 },
    assessed: { type: "boolean" },
    swollenRecorded: { type: "boolean" },
    tenderRecorded: { type: "boolean" },
  },
  required: ["jointId", "assessed", "swollenRecorded", "tenderRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Encode explicit joint assessment, swelling, and tenderness flags without examining or diagnosing a joint. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jointId, assessed, swollenRecorded, tenderRecorded } = request;
  const compute = (): Output => {
    H.domain(jointId.length > 0, "jointId");
    H.domain(assessed || (!swollenRecorded && !tenderRecorded), "assessed");
    return {
      status: !assessed
        ? "not-assessed"
        : swollenRecorded
          ? tenderRecorded
            ? "swollen-and-tender"
            : "swollen-only"
          : tenderRecorded
            ? "tender-only"
            : "neither",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    jointId: "J17",
    assessed: true,
    swollenRecorded: true,
    tenderRecorded: false,
  },
  output: { status: "swollen-only" },
} satisfies ToolExample<Input, Output>;
export const jointSwollenTenderCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["rheumatology", "health and medicine"],
      keywords: ["rheumatology", "health and medicine"],
    },
    id: "rheumatology/joint-swollen-tender-code",
    title: "Joint Swollen Tender Code",
    description:
      "Encode explicit joint assessment, swelling, and tenderness flags without examining or diagnosing a joint.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        jointId: { type: "string", maxLength: 8192, minLength: 1 },
        assessed: { type: "boolean" },
        swollenRecorded: { type: "boolean" },
        tenderRecorded: { type: "boolean" },
      },
      required: ["jointId", "assessed", "swollenRecorded", "tenderRecorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "jointId",
          label: "Joint Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assessed",
          label: "Assessed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "swollenRecorded",
          label: "Swollen Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "tenderRecorded",
          label: "Tender Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = jointSwollenTenderCodeTool.execute;
export default jointSwollenTenderCodeTool;
