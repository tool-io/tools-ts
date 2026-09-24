import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly creditedQuantities: readonly number[];
  readonly reversedQuantities: readonly number[];
  readonly unitValues: readonly number[];
};
export type Output = {
  readonly creditedValue: number;
  readonly reversalValue: number;
  readonly netValue: number;
  readonly reversalShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedQuantities: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    reversedQuantities: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    unitValues: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["creditedQuantities", "reversedQuantities", "unitValues"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedValue: { type: "number" },
    reversalValue: { type: "number" },
    netValue: { type: "number" },
    reversalShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "creditedValue",
    "reversalValue",
    "netValue",
    "reversalShare",
    "defined",
  ],
} as const;
/** Calculate quantity credit reversal share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { creditedQuantities, reversedQuantities, unitValues } = request;
  const compute = (): Output => {
    H.sameLength(creditedQuantities, reversedQuantities);
    H.sameLength(creditedQuantities, unitValues);
    H.domain(
      [...creditedQuantities, ...reversedQuantities, ...unitValues].every(
        (x) => x >= 0,
      ),
    );
    return (() => {
      const creditedValue = creditedQuantities.reduce(
          (s, x, i) => s + x * unitValues[i],
          0,
        ),
        reversalValue = reversedQuantities.reduce(
          (s, x, i) => s + x * unitValues[i],
          0,
        );
      return {
        creditedValue,
        reversalValue,
        netValue: creditedValue - reversalValue,
        reversalShare: creditedValue > 0 ? reversalValue / creditedValue : 0,
        defined: creditedValue > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    creditedQuantities: [10, 5],
    reversedQuantities: [2, 1],
    unitValues: [3, 4],
  },
  output: {
    creditedValue: 50,
    reversalValue: 10,
    netValue: 40,
    reversalShare: 0.2,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const quantityCreditReversalShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "construction-management/quantity-credit-reversal-share",
    title: "Quantity Credit Reversal Share Tool",
    description:
      "Calculate quantity credit reversal share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedQuantities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        reversedQuantities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        unitValues: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["creditedQuantities", "reversedQuantities", "unitValues"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedValue: { type: "number" },
        reversalValue: { type: "number" },
        netValue: { type: "number" },
        reversalShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "creditedValue",
        "reversalValue",
        "netValue",
        "reversalShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "creditedQuantities",
          label: "Credited Quantities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "reversedQuantities",
          label: "Reversed Quantities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "unitValues",
          label: "Unit Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "creditedValue",
          label: "Credited Value",
          valueType: { type: "number" },
        },
        {
          id: "reversalValue",
          label: "Reversal Value",
          valueType: { type: "number" },
        },
        { id: "netValue", label: "Net Value", valueType: { type: "number" } },
        {
          id: "reversalShare",
          label: "Reversal Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = quantityCreditReversalShareTool.execute;
export default quantityCreditReversalShareTool;
