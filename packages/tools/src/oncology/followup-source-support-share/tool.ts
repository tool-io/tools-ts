import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly supported: readonly boolean[];
  readonly required: readonly boolean[];
};
export type Output = {
  readonly supportedRequired: number;
  readonly requiredCount: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supported: { type: "array", maxItems: 256, items: { type: "boolean" } },
    required: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["supported", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportedRequired: { type: "integer" },
    requiredCount: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["supportedRequired", "requiredCount", "share", "defined"],
} as const;
/** Audit explicit research follow-up source support without imputing clinical endpoints. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { supported, required } = request;
  const compute = (): Output => {
    H.sameLength(supported, required);
    return {
      supportedRequired: supported.filter((x, i) => x && required[i]).length,
      requiredCount: required.filter(Boolean).length,
      share: required.some(Boolean)
        ? supported.filter((x, i) => x && required[i]).length /
          required.filter(Boolean).length
        : 0,
      defined: required.some(Boolean),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { supported: [true, false, true], required: [true, true, false] },
  output: { supportedRequired: 1, requiredCount: 2, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const followupSourceSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/followup-source-support-share",
    title: "Followup Source Support Share Tool",
    description:
      "Audit explicit research follow-up source support without imputing clinical endpoints.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supported: { type: "array", maxItems: 256, items: { type: "boolean" } },
        required: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["supported", "required"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportedRequired: { type: "integer" },
        requiredCount: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["supportedRequired", "requiredCount", "share", "defined"],
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
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "supportedRequired",
          label: "Supported Required",
          valueType: { type: "integer" },
        },
        {
          id: "requiredCount",
          label: "Required Count",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = followupSourceSupportShareTool.execute;
export default followupSourceSupportShareTool;
