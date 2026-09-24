import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tp: number;
  readonly tn: number;
  readonly fp: number;
  readonly fn: number;
};
export type Output = {
  readonly tp: number;
  readonly tn: number;
  readonly fp: number;
  readonly fn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tp: { type: "integer" },
    tn: { type: "integer" },
    fp: { type: "integer" },
    fn: { type: "integer" },
  },
  required: ["tp", "tn", "fp", "fn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tp: { type: "integer" },
    tn: { type: "integer" },
    fp: { type: "integer" },
    fn: { type: "integer" },
  },
  required: ["tp", "tn", "fp", "fn"],
} as const;
/** Calculate binary confusion transpose role change from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tp, tn, fp, fn } = request;
  const compute = (): Output => {
    for (const x of [tp, tn, fp, fn]) H.integer(x, 0);
    return { tp, tn, fp: fn, fn: fp };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tp: 30, tn: 50, fp: 8, fn: 12 },
  output: { tp: 30, tn: 50, fp: 12, fn: 8 },
} satisfies ToolExample<Input, Output>;
export const binaryConfusionTransposeRoleChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/binary-confusion-transpose-role-change",
    title: "Binary Confusion Transpose Role Change Tool",
    description:
      "Calculate binary confusion transpose role change from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tp: { type: "integer" },
        tn: { type: "integer" },
        fp: { type: "integer" },
        fn: { type: "integer" },
      },
      required: ["tp", "tn", "fp", "fn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tp: { type: "integer" },
        tn: { type: "integer" },
        fp: { type: "integer" },
        fn: { type: "integer" },
      },
      required: ["tp", "tn", "fp", "fn"],
    },
    ports: {
      inputs: [
        {
          id: "tp",
          label: "Tp",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tn",
          label: "Tn",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fp",
          label: "Fp",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fn",
          label: "Fn",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "tp", label: "Tp", valueType: { type: "integer" } },
        { id: "tn", label: "Tn", valueType: { type: "integer" } },
        { id: "fp", label: "Fp", valueType: { type: "integer" } },
        { id: "fn", label: "Fn", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = binaryConfusionTransposeRoleChangeTool.execute;
export default binaryConfusionTransposeRoleChangeTool;
