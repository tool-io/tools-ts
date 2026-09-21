import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lostQuantities: readonly number[];
  readonly unitPrices: readonly number[];
  readonly recoveredValues: readonly number[];
};
export type Output = {
  readonly grossLossValue: number;
  readonly recoveredValue: number;
  readonly netLossValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lostQuantities: { type: "array", maxItems: 256, items: { type: "number" } },
    unitPrices: { type: "array", maxItems: 256, items: { type: "number" } },
    recoveredValues: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["lostQuantities", "unitPrices", "recoveredValues"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossLossValue: { type: "number" },
    recoveredValue: { type: "number" },
    netLossValue: { type: "number" },
  },
  required: ["grossLossValue", "recoveredValue", "netLossValue"],
} as const;
/** Calculate storage loss price weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lostQuantities, unitPrices, recoveredValues } = request;
  const compute = (): Output => {
    H.sameLength(lostQuantities, unitPrices);
    H.sameLength(unitPrices, recoveredValues);
    H.domain(
      [...lostQuantities, ...unitPrices, ...recoveredValues].every(
        (x) => x >= 0,
      ),
    );
    return (() => {
      const grossLossValue = lostQuantities.reduce(
          (s, x, i) => s + x * unitPrices[i],
          0,
        ),
        recoveredValue = recoveredValues.reduce((a, b) => a + b, 0);
      return {
        grossLossValue,
        recoveredValue,
        netLossValue: grossLossValue - recoveredValue,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lostQuantities: [2, 3],
    unitPrices: [5, 4],
    recoveredValues: [1, 2],
  },
  output: { grossLossValue: 22, recoveredValue: 3, netLossValue: 19 },
} satisfies ToolExample<Input, Output>;
export const storageLossPriceWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/storage-loss-price-weight",
    title: "Storage Loss Price Weight Tool",
    description:
      "Calculate storage loss price weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lostQuantities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        unitPrices: { type: "array", maxItems: 256, items: { type: "number" } },
        recoveredValues: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["lostQuantities", "unitPrices", "recoveredValues"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossLossValue: { type: "number" },
        recoveredValue: { type: "number" },
        netLossValue: { type: "number" },
      },
      required: ["grossLossValue", "recoveredValue", "netLossValue"],
    },
    ports: {
      inputs: [
        {
          id: "lostQuantities",
          label: "Lost Quantities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "unitPrices",
          label: "Unit Prices",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "recoveredValues",
          label: "Recovered Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "grossLossValue",
          label: "Gross Loss Value",
          valueType: { type: "number" },
        },
        {
          id: "recoveredValue",
          label: "Recovered Value",
          valueType: { type: "number" },
        },
        {
          id: "netLossValue",
          label: "Net Loss Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = storageLossPriceWeightTool.execute;
export default storageLossPriceWeightTool;
