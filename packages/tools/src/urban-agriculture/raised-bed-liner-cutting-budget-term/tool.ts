import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly width: number;
  readonly depth: number;
  readonly rimAllowance: number;
};
export type Output = {
  readonly cutLength: number;
  readonly cutWidth: number;
  readonly area: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    width: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    rimAllowance: { type: "number", minimum: 0 },
  },
  required: ["length", "width", "depth", "rimAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cutLength: { type: "number" },
    cutWidth: { type: "number" },
    area: { type: "number" },
  },
  required: ["cutLength", "cutWidth", "area"],
} as const;
/** Calculate raised bed liner cutting budget term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, width, depth, rimAllowance } = request;
  const compute = (): Output => {
    H.domain(length >= 0 && width >= 0 && depth >= 0 && rimAllowance >= 0);
    return {
      cutLength: length + 2 * (depth + rimAllowance),
      cutWidth: width + 2 * (depth + rimAllowance),
      area:
        (length + 2 * (depth + rimAllowance)) *
        (width + 2 * (depth + rimAllowance)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 2, width: 1, depth: 0.3, rimAllowance: 0.1 },
  output: { cutLength: 2.8, cutWidth: 1.8, area: 5.04 },
} satisfies ToolExample<Input, Output>;
export const raisedBedLinerCuttingBudgetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/raised-bed-liner-cutting-budget-term",
    title: "Raised BED Liner Cutting Budget Term Tool",
    description:
      "Calculate raised bed liner cutting budget term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        width: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
        rimAllowance: { type: "number", minimum: 0 },
      },
      required: ["length", "width", "depth", "rimAllowance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cutLength: { type: "number" },
        cutWidth: { type: "number" },
        area: { type: "number" },
      },
      required: ["cutLength", "cutWidth", "area"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rimAllowance",
          label: "Rim Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "cutLength", label: "Cut Length", valueType: { type: "number" } },
        { id: "cutWidth", label: "Cut Width", valueType: { type: "number" } },
        { id: "area", label: "Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = raisedBedLinerCuttingBudgetTermTool.execute;
export default raisedBedLinerCuttingBudgetTermTool;
