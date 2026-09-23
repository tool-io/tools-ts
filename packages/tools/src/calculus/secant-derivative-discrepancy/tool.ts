import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x0: number;
  readonly x1: number;
  readonly y0: number;
  readonly y1: number;
  readonly suppliedDerivative: number;
};
export type Output = { readonly secant: number; readonly discrepancy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x0: { type: "number" },
    x1: { type: "number" },
    y0: { type: "number" },
    y1: { type: "number" },
    suppliedDerivative: { type: "number" },
  },
  required: ["x0", "x1", "y0", "y1", "suppliedDerivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { secant: { type: "number" }, discrepancy: { type: "number" } },
  required: ["secant", "discrepancy"],
} as const;
/** Calculate secant derivative discrepancy from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x0, x1, y0, y1, suppliedDerivative } = request;
  const compute = (): Output => {
    H.domain(x0 !== x1);
    return {
      secant: (y1 - y0) / (x1 - x0),
      discrepancy: (y1 - y0) / (x1 - x0) - suppliedDerivative,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x0: 1, x1: 3, y0: 1, y1: 9, suppliedDerivative: 2 },
  output: { secant: 4, discrepancy: 2 },
} satisfies ToolExample<Input, Output>;
export const secantDerivativeDiscrepancyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/secant-derivative-discrepancy",
    title: "Secant Derivative Discrepancy Tool",
    description:
      "Calculate secant derivative discrepancy from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x0: { type: "number" },
        x1: { type: "number" },
        y0: { type: "number" },
        y1: { type: "number" },
        suppliedDerivative: { type: "number" },
      },
      required: ["x0", "x1", "y0", "y1", "suppliedDerivative"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        secant: { type: "number" },
        discrepancy: { type: "number" },
      },
      required: ["secant", "discrepancy"],
    },
    ports: {
      inputs: [
        {
          id: "x0",
          label: "X0",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "x1",
          label: "X1",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "y0",
          label: "Y0",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "y1",
          label: "Y1",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDerivative",
          label: "Supplied Derivative",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "secant", label: "Secant", valueType: { type: "number" } },
        {
          id: "discrepancy",
          label: "Discrepancy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = secantDerivativeDiscrepancyTool.execute;
export default secantDerivativeDiscrepancyTool;
