import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentLength: number;
  readonly minimumLength: number;
};
export type Output = {
  readonly requiredPadding: number;
  readonly resultingLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentLength: { type: "integer", minimum: 0 },
    minimumLength: { type: "integer", minimum: 0 },
  },
  required: ["currentLength", "minimumLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredPadding: { type: "integer" },
    resultingLength: { type: "integer" },
  },
  required: ["requiredPadding", "resultingLength"],
} as const;
/** Calculate the padding count needed to meet an explicit minimum length without truncating a longer list. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentLength, minimumLength } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(currentLength) &&
        currentLength >= 0 &&
        currentLength <= Number.MAX_SAFE_INTEGER,
      "currentLength",
    ),
      currentLength);
    (H.domain(
      Number.isSafeInteger(minimumLength) &&
        minimumLength >= 0 &&
        minimumLength <= Number.MAX_SAFE_INTEGER,
      "minimumLength",
    ),
      minimumLength);
    return {
      requiredPadding: Math.max(0, minimumLength - currentLength),
      resultingLength: Math.max(currentLength, minimumLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentLength: 3, minimumLength: 8 },
  output: { requiredPadding: 5, resultingLength: 8 },
} satisfies ToolExample<Input, Output>;
export const listPaddingShortfallCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["list", "computer science"],
      keywords: ["list", "computer science"],
    },
    id: "list/list-padding-shortfall-count",
    title: "List Padding Shortfall Count",
    description:
      "Calculate the padding count needed to meet an explicit minimum length without truncating a longer list.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentLength: { type: "integer", minimum: 0 },
        minimumLength: { type: "integer", minimum: 0 },
      },
      required: ["currentLength", "minimumLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredPadding: { type: "integer" },
        resultingLength: { type: "integer" },
      },
      required: ["requiredPadding", "resultingLength"],
    },
    ports: {
      inputs: [
        {
          id: "currentLength",
          label: "Current Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minimumLength",
          label: "Minimum Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "requiredPadding",
          label: "Required Padding",
          valueType: { type: "integer" },
        },
        {
          id: "resultingLength",
          label: "Resulting Length",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = listPaddingShortfallCountTool.execute;
export default listPaddingShortfallCountTool;
