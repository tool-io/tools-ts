import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly valid: readonly boolean[];
  readonly included: readonly boolean[];
};
export type Output = {
  readonly validIncluded: number;
  readonly includedCount: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    included: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["valid", "included"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validIncluded: { type: "integer" },
    includedCount: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["validIncluded", "includedCount", "share", "defined"],
} as const;
/** Calculate syllable window valid share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { valid, included } = request;
  const compute = (): Output => {
    H.sameLength(valid, included);
    return {
      validIncluded: valid.filter((x, i) => x && included[i]).length,
      includedCount: included.filter(Boolean).length,
      share: included.some(Boolean)
        ? valid.filter((x, i) => x && included[i]).length /
          included.filter(Boolean).length
        : 0,
      defined: included.some(Boolean),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { valid: [true, false], included: [true, true] },
  output: { validIncluded: 1, includedCount: 2, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const syllableWindowValidShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/syllable-window-valid-share",
    title: "Syllable Window Valid Share Tool",
    description:
      "Calculate syllable window valid share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
        included: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["valid", "included"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validIncluded: { type: "integer" },
        includedCount: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["validIncluded", "includedCount", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "valid",
          label: "Valid",
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
          id: "validIncluded",
          label: "Valid Included",
          valueType: { type: "integer" },
        },
        {
          id: "includedCount",
          label: "Included Count",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = syllableWindowValidShareTool.execute;
export default syllableWindowValidShareTool;
