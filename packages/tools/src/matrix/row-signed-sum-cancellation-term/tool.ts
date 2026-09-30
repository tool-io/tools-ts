import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly row: readonly number[] };
export type Output = {
  readonly signedSum: number;
  readonly absoluteSum: number;
  readonly cancellation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["row"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedSum: { type: "number" },
    absoluteSum: { type: "number" },
    cancellation: { type: "number" },
  },
  required: ["signedSum", "absoluteSum", "cancellation"],
} as const;
/** Calculate row signed sum cancellation term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row } = request;
  const compute = (): Output => {
    const sum = (values: readonly number[]): number => {
      let value = 0,
        correction = 0;
      for (const x of values) {
        const next = value + x;
        correction +=
          Math.abs(value) >= Math.abs(x) ? value - next + x : x - next + value;
        value = next;
      }
      return value + correction;
    };
    const signedSum = sum(row),
      absoluteSum = sum(row.map(Math.abs));
    return {
      signedSum,
      absoluteSum,
      cancellation: Math.max(0, absoluteSum - Math.abs(signedSum)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { row: [3, -2] },
  output: { signedSum: 1, absoluteSum: 5, cancellation: 4 },
} satisfies ToolExample<Input, Output>;
export const rowSignedSumCancellationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/row-signed-sum-cancellation-term",
    title: "Row Signed Sum Cancellation Term Tool",
    description:
      "Calculate row signed sum cancellation term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["row"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedSum: { type: "number" },
        absoluteSum: { type: "number" },
        cancellation: { type: "number" },
      },
      required: ["signedSum", "absoluteSum", "cancellation"],
    },
    ports: {
      inputs: [
        {
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "signedSum", label: "Signed Sum", valueType: { type: "number" } },
        {
          id: "absoluteSum",
          label: "Absolute Sum",
          valueType: { type: "number" },
        },
        {
          id: "cancellation",
          label: "Cancellation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rowSignedSumCancellationTermTool.execute;
export default rowSignedSumCancellationTermTool;
