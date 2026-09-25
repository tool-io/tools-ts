import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly supported: readonly boolean[];
  readonly included: readonly boolean[];
};
export type Output = {
  readonly supportedCount: number;
  readonly unsupportedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supported: { type: "array", maxItems: 256, items: { type: "boolean" } },
    included: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["supported", "included"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportedCount: { type: "integer" },
    unsupportedCount: { type: "integer" },
  },
  required: ["supportedCount", "unsupportedCount"],
} as const;
/** Calculate community total support count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { supported, included } = request;
  const compute = (): Output => {
    H.sameLength(supported, included);
    return {
      supportedCount: supported.filter((x, i) => x && included[i]).length,
      unsupportedCount: supported.filter((x, i) => !x && included[i]).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { supported: [true, false, true], included: [true, true, false] },
  output: { supportedCount: 1, unsupportedCount: 1 },
} satisfies ToolExample<Input, Output>;
export const communityTotalSupportCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/community-total-support-count",
    title: "Community Total Support Count Tool",
    description:
      "Calculate community total support count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supported: { type: "array", maxItems: 256, items: { type: "boolean" } },
        included: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["supported", "included"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportedCount: { type: "integer" },
        unsupportedCount: { type: "integer" },
      },
      required: ["supportedCount", "unsupportedCount"],
    },
    ports: {
      inputs: [
        {
          id: "supported",
          label: "Supported",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "supportedCount",
          label: "Supported Count",
          valueType: { type: "integer" },
        },
        {
          id: "unsupportedCount",
          label: "Unsupported Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = communityTotalSupportCountTool.execute;
export default communityTotalSupportCountTool;
