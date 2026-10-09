import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOriginCode: string;
  readonly secondOriginCode: string;
  readonly firstKnown: boolean;
  readonly secondKnown: boolean;
};
export type Output = {
  readonly comparable: boolean;
  readonly commonOrigin: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOriginCode: { type: "string", maxLength: 8192 },
    secondOriginCode: { type: "string", maxLength: 8192 },
    firstKnown: { type: "boolean" },
    secondKnown: { type: "boolean" },
  },
  required: [
    "firstOriginCode",
    "secondOriginCode",
    "firstKnown",
    "secondKnown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    comparable: { type: "boolean" },
    commonOrigin: { type: "boolean" },
  },
  required: ["comparable", "commonOrigin"],
} as const;
/** Compare explicit testimony-origin identifiers only when both origins are recorded as known. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOriginCode, secondOriginCode, firstKnown, secondKnown } =
    request;
  const compute = (): Output => {
    H.domain(!firstKnown || firstOriginCode.length > 0, "firstOriginCode");
    H.domain(!secondKnown || secondOriginCode.length > 0, "secondOriginCode");
    return {
      comparable: firstKnown && secondKnown,
      commonOrigin:
        firstKnown && secondKnown && firstOriginCode === secondOriginCode,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstOriginCode: "SRC17",
    secondOriginCode: "SRC17",
    firstKnown: true,
    secondKnown: true,
  },
  output: { comparable: true, commonOrigin: true },
} satisfies ToolExample<Input, Output>;
export const testimonyCommonOriginPairFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["epistemology", "philosophy"],
      keywords: ["epistemology", "philosophy"],
    },
    id: "epistemology/testimony-common-origin-pair-flag",
    title: "Testimony Common Origin Pair Flag",
    description:
      "Compare explicit testimony-origin identifiers only when both origins are recorded as known.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOriginCode: { type: "string", maxLength: 8192 },
        secondOriginCode: { type: "string", maxLength: 8192 },
        firstKnown: { type: "boolean" },
        secondKnown: { type: "boolean" },
      },
      required: [
        "firstOriginCode",
        "secondOriginCode",
        "firstKnown",
        "secondKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        comparable: { type: "boolean" },
        commonOrigin: { type: "boolean" },
      },
      required: ["comparable", "commonOrigin"],
    },
    ports: {
      inputs: [
        {
          id: "firstOriginCode",
          label: "First Origin Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondOriginCode",
          label: "Second Origin Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstKnown",
          label: "First Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "secondKnown",
          label: "Second Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "comparable",
          label: "Comparable",
          valueType: { type: "boolean" },
        },
        {
          id: "commonOrigin",
          label: "Common Origin",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = testimonyCommonOriginPairFlagTool.execute;
export default testimonyCommonOriginPairFlagTool;
