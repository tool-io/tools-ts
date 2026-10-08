import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resourceId: string;
  readonly suppliedPrintUnit: string;
  readonly suppliedAudioUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resourceId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPrintUnit: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAudioUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resourceId", "suppliedPrintUnit", "suppliedAudioUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit alternative-format print and audio unit labels without inferring equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resourceId, suppliedPrintUnit, suppliedAudioUnit } = request;
  const compute = (): Output => {
    H.domain(resourceId.length > 0, "resourceId");
    H.domain(suppliedPrintUnit.length > 0, "suppliedPrintUnit");
    H.domain(suppliedAudioUnit.length > 0, "suppliedAudioUnit");
    return {
      token: JSON.stringify([resourceId, suppliedPrintUnit, suppliedAudioUnit]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resourceId: "RES17",
    suppliedPrintUnit: "pages",
    suppliedAudioUnit: "minutes",
  },
  output: { token: '["RES17","pages","minutes"]' },
} satisfies ToolExample<Input, Output>;
export const alternativeFormatPrintAudioUnitPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["disability-studies", "disability studies", "social sciences"],
        keywords: ["disability studies", "social sciences"],
      },
      id: "disability-studies/alternative-format-print-audio-unit-pair",
      title: "Alternative Format Print Audio Unit Pair",
      description:
        "Preserve explicit alternative-format print and audio unit labels without inferring equivalence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resourceId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedPrintUnit: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedAudioUnit: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["resourceId", "suppliedPrintUnit", "suppliedAudioUnit"],
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
            id: "resourceId",
            label: "Resource Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedPrintUnit",
            label: "Supplied Print Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedAudioUnit",
            label: "Supplied Audio Unit",
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
export const run = alternativeFormatPrintAudioUnitPairTool.execute;
export default alternativeFormatPrintAudioUnitPairTool;
