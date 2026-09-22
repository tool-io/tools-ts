import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headIndices: readonly number[];
  readonly masked: readonly boolean[];
  readonly selectedHead: number;
};
export type Output = {
  readonly headEntries: number;
  readonly maskedEntries: number;
  readonly maskedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    masked: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedHead: { type: "integer", minimum: 0 },
  },
  required: ["headIndices", "masked", "selectedHead"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headEntries: { type: "integer" },
    maskedEntries: { type: "integer" },
    maskedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["headEntries", "maskedEntries", "maskedShare", "defined"],
} as const;
/** Calculate attention head masked share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headIndices, masked, selectedHead } = request;
  const compute = (): Output => {
    H.sameLength(headIndices, masked);
    H.integer(selectedHead, 0);
    H.domain(headIndices.every((x) => x >= 0));
    return (() => {
      const headEntries = headIndices.filter((x) => x === selectedHead).length,
        maskedEntries = headIndices.filter(
          (x, i) => x === selectedHead && masked[i],
        ).length;
      return {
        headEntries,
        maskedEntries,
        maskedShare: headEntries > 0 ? maskedEntries / headEntries : 0,
        defined: headEntries > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    headIndices: [0, 0, 1],
    masked: [true, false, true],
    selectedHead: 0,
  },
  output: { headEntries: 2, maskedEntries: 1, maskedShare: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const attentionHeadMaskedShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/attention-head-masked-share",
    title: "Attention Head Masked Share Tool",
    description:
      "Calculate attention head masked share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        masked: { type: "array", maxItems: 256, items: { type: "boolean" } },
        selectedHead: { type: "integer", minimum: 0 },
      },
      required: ["headIndices", "masked", "selectedHead"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headEntries: { type: "integer" },
        maskedEntries: { type: "integer" },
        maskedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["headEntries", "maskedEntries", "maskedShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "headIndices",
          label: "Head Indices",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "masked",
          label: "Masked",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedHead",
          label: "Selected Head",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "headEntries",
          label: "Head Entries",
          valueType: { type: "integer" },
        },
        {
          id: "maskedEntries",
          label: "Masked Entries",
          valueType: { type: "integer" },
        },
        {
          id: "maskedShare",
          label: "Masked Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = attentionHeadMaskedShareTool.execute;
export default attentionHeadMaskedShareTool;
