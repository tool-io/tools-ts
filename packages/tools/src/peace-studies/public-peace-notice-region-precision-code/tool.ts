import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noticeId: string;
  readonly suppliedRegionPrecisionCode: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noticeId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRegionPrecisionCode: {
      type: "string",
      maxLength: 8192,
      minLength: 1,
    },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["noticeId", "suppliedRegionPrecisionCode", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit public-notice region precision code without deriving or exposing a location. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noticeId, suppliedRegionPrecisionCode, source } = request;
  const compute = (): Output => {
    H.domain(noticeId.length > 0, "noticeId");
    H.domain(
      suppliedRegionPrecisionCode.length > 0,
      "suppliedRegionPrecisionCode",
    );
    H.domain(source.length > 0, "source");
    return {
      token: JSON.stringify([noticeId, suppliedRegionPrecisionCode, source]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    noticeId: "N17",
    suppliedRegionPrecisionCode: "REGION-ONLY",
    source: "Source A",
  },
  output: { token: '["N17","REGION-ONLY","Source A"]' },
} satisfies ToolExample<Input, Output>;
export const publicPeaceNoticeRegionPrecisionCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["peace-studies", "peace studies", "social sciences"],
        keywords: ["peace studies", "social sciences"],
      },
      id: "peace-studies/public-peace-notice-region-precision-code",
      title: "Public Peace Notice Region Precision Code",
      description:
        "Preserve an explicit public-notice region precision code without deriving or exposing a location.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          noticeId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedRegionPrecisionCode: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["noticeId", "suppliedRegionPrecisionCode", "source"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "noticeId",
            label: "Notice Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedRegionPrecisionCode",
            label: "Supplied Region Precision Code",
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
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = publicPeaceNoticeRegionPrecisionCodeTool.execute;
export default publicPeaceNoticeRegionPrecisionCodeTool;
