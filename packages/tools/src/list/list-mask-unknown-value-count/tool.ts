import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly mask: readonly string[] };
export type Output = {
  readonly known: number;
  readonly unknown: number;
  readonly trueCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mask: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["mask"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    known: { type: "integer" },
    unknown: { type: "integer" },
    trueCount: { type: "integer" },
  },
  required: ["known", "unknown", "trueCount"],
} as const;
/** Calculate list mask unknown value count from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { mask } = input;
  const compute = (): Output => {
    H.domain(mask.every((x) => ["true", "false", "unknown"].includes(x)));
    const unknown = mask.filter((x) => x === "unknown").length;
    return {
      known: mask.length - unknown,
      unknown,
      trueCount: mask.filter((x) => x === "true").length,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mask: ["true", "unknown", "false", "true"] },
  output: { known: 3, unknown: 1, trueCount: 2 },
} satisfies ToolExample<Input, Output>;
export const listMaskUnknownValueCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-mask-unknown-value-count",
    title: "List Mask Unknown Value Count Tool",
    description:
      "Calculate list mask unknown value count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mask: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["mask"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        known: { type: "integer" },
        unknown: { type: "integer" },
        trueCount: { type: "integer" },
      },
      required: ["known", "unknown", "trueCount"],
    },
    ports: {
      inputs: [
        {
          id: "mask",
          label: "Mask",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "known", label: "Known", valueType: { type: "integer" } },
        { id: "unknown", label: "Unknown", valueType: { type: "integer" } },
        {
          id: "trueCount",
          label: "True Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = listMaskUnknownValueCountTool.execute;
export default listMaskUnknownValueCountTool;
