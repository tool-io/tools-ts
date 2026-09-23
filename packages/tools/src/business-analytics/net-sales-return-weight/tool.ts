import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly salesValues: readonly number[];
  readonly returnedFractions: readonly number[];
  readonly weights: readonly number[];
};
export type Output = {
  readonly grossWeighted: number;
  readonly returnsWeighted: number;
  readonly netWeighted: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    salesValues: { type: "array", maxItems: 256, items: { type: "number" } },
    returnedFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["salesValues", "returnedFractions", "weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossWeighted: { type: "number" },
    returnsWeighted: { type: "number" },
    netWeighted: { type: "number" },
  },
  required: ["grossWeighted", "returnsWeighted", "netWeighted"],
} as const;
/** Calculate net sales return weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { salesValues, returnedFractions, weights } = request;
  const compute = (): Output => {
    H.sameLength(salesValues, returnedFractions);
    H.sameLength(salesValues, weights);
    H.domain(
      [...salesValues, ...weights].every((x) => x >= 0) &&
        returnedFractions.every((x) => x >= 0 && x <= 1),
    );
    return (() => {
      const grossWeighted = salesValues.reduce(
          (s, x, i) => s + x * weights[i],
          0,
        ),
        returnsWeighted = salesValues.reduce(
          (s, x, i) => s + x * returnedFractions[i] * weights[i],
          0,
        );
      return {
        grossWeighted,
        returnsWeighted,
        netWeighted: grossWeighted - returnsWeighted,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    salesValues: [100, 50],
    returnedFractions: [0.1, 0.2],
    weights: [1, 2],
  },
  output: { grossWeighted: 200, returnsWeighted: 30, netWeighted: 170 },
} satisfies ToolExample<Input, Output>;
export const netSalesReturnWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/net-sales-return-weight",
    title: "Net Sales Return Weight Tool",
    description:
      "Calculate net sales return weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        salesValues: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        returnedFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["salesValues", "returnedFractions", "weights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossWeighted: { type: "number" },
        returnsWeighted: { type: "number" },
        netWeighted: { type: "number" },
      },
      required: ["grossWeighted", "returnsWeighted", "netWeighted"],
    },
    ports: {
      inputs: [
        {
          id: "salesValues",
          label: "Sales Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "returnedFractions",
          label: "Returned Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "grossWeighted",
          label: "Gross Weighted",
          valueType: { type: "number" },
        },
        {
          id: "returnsWeighted",
          label: "Returns Weighted",
          valueType: { type: "number" },
        },
        {
          id: "netWeighted",
          label: "Net Weighted",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = netSalesReturnWeightTool.execute;
export default netSalesReturnWeightTool;
