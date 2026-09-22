import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mask: readonly boolean[];
  readonly trueMeansVisible: boolean;
};
export type Output = {
  readonly visibleKeys: number;
  readonly hiddenKeys: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mask: { type: "array", maxItems: 256, items: { type: "boolean" } },
    trueMeansVisible: { type: "boolean" },
  },
  required: ["mask", "trueMeansVisible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleKeys: { type: "integer" },
    hiddenKeys: { type: "integer" },
  },
  required: ["visibleKeys", "hiddenKeys"],
} as const;
/** Count one supplied boolean attention-mask row under an explicit visibility convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mask, trueMeansVisible } = request;
  const compute = (): Output => {
    const visibleKeys = mask.filter((x) => x === trueMeansVisible).length;
    return { visibleKeys, hiddenKeys: mask.length - visibleKeys };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mask: [true, false, true], trueMeansVisible: true },
  output: { visibleKeys: 2, hiddenKeys: 1 },
} satisfies ToolExample<Input, Output>;
export const attentionMaskVisibleKeyCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/attention-mask-visible-key-count",
    title: "Attention Mask Visible Key Count Tool",
    description:
      "Count one supplied boolean attention-mask row under an explicit visibility convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mask: { type: "array", maxItems: 256, items: { type: "boolean" } },
        trueMeansVisible: { type: "boolean" },
      },
      required: ["mask", "trueMeansVisible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleKeys: { type: "integer" },
        hiddenKeys: { type: "integer" },
      },
      required: ["visibleKeys", "hiddenKeys"],
    },
    ports: {
      inputs: [
        {
          id: "mask",
          label: "Mask",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "trueMeansVisible",
          label: "True Means Visible",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "visibleKeys",
          label: "Visible Keys",
          valueType: { type: "integer" },
        },
        {
          id: "hiddenKeys",
          label: "Hidden Keys",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = attentionMaskVisibleKeyCountTool.execute;
export default attentionMaskVisibleKeyCountTool;
