import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tp: number;
  readonly fp: number;
  readonly fn: number;
  readonly beta: number;
  readonly cell: string;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tp: { type: "number", minimum: 0 },
    fp: { type: "number", minimum: 0 },
    fn: { type: "number", minimum: 0 },
    beta: { type: "number", exclusiveMinimum: 0 },
    cell: { type: "string", maxLength: 8192, enum: ["tp", "fp", "fn"] },
  },
  required: ["tp", "fp", "fn", "beta", "cell"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate fbeta one cell sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tp, fp, fn, beta, cell } = request;
  const compute = (): Output => {
    H.domain(tp >= 0 && fp >= 0 && fn >= 0);
    H.positive(beta);
    H.domain(["tp", "fp", "fn"].includes(cell));
    const b = beta * beta,
      d = (1 + b) * tp + b * fn + fp;
    H.positive(d);
    return {
      derivative:
        cell === "tp"
          ? ((1 + b) * (b * fn + fp)) / (d * d)
          : (-(1 + b) * tp * (cell === "fn" ? b : 1)) / (d * d),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tp: 2, fp: 1, fn: 1, beta: 1, cell: "fp" },
  output: { derivative: -0.1111111111111111 },
} satisfies ToolExample<Input, Output>;
export const fbetaOneCellSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/fbeta-one-cell-sensitivity",
    title: "Fbeta One Cell Sensitivity Tool",
    description:
      "Calculate fbeta one cell sensitivity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tp: { type: "number", minimum: 0 },
        fp: { type: "number", minimum: 0 },
        fn: { type: "number", minimum: 0 },
        beta: { type: "number", exclusiveMinimum: 0 },
        cell: { type: "string", maxLength: 8192, enum: ["tp", "fp", "fn"] },
      },
      required: ["tp", "fp", "fn", "beta", "cell"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { derivative: { type: "number" } },
      required: ["derivative"],
    },
    ports: {
      inputs: [
        {
          id: "tp",
          label: "Tp",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fp",
          label: "Fp",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fn",
          label: "Fn",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beta",
          label: "Beta",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cell",
          label: "Cell",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fbetaOneCellSensitivityTool.execute;
export default fbetaOneCellSensitivityTool;
