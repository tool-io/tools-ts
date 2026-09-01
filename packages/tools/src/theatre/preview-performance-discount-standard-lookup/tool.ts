import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  weightedMinor,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly performanceClassificationPreviewRegularUnknownCodes: readonly number[];
  readonly baseTicketPricesMinor: readonly number[];
  readonly callerPreviewDiscountBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly callerKnownApplicablePricesMinor: readonly number[];
  readonly unknownPerformancePriceIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "performanceClassificationPreviewRegularUnknownCodes",
    label: "Performance classification preview regular unknown codes",
    kind: "numberList",
  },
  {
    id: "baseTicketPricesMinor",
    label: "Base ticket prices minor",
    kind: "numberList",
  },
  {
    id: "callerPreviewDiscountBasisPoints",
    label: "Caller preview discount basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.performanceClassificationPreviewRegularUnknownCodes,
    input.baseTicketPricesMinor,
    "performances",
  );
  input.performanceClassificationPreviewRegularUnknownCodes.forEach((v) =>
    bounded(v, "classification", 0, 2),
  );
  input.baseTicketPricesMinor.forEach((v) =>
    bounded(v, "price", 0, 1000000000),
  );
  bounded(input.callerPreviewDiscountBasisPoints, "discount", 0, 10000);
  return {
    callerKnownApplicablePricesMinor:
      input.performanceClassificationPreviewRegularUnknownCodes.map((v, i) =>
        v === 2
          ? -1
          : v === 1
            ? input.baseTicketPricesMinor[i]
            : weightedMinor(
                input.baseTicketPricesMinor[i],
                10000 - input.callerPreviewDiscountBasisPoints,
                10000,
              ),
      ),
    unknownPerformancePriceIndices:
      input.performanceClassificationPreviewRegularUnknownCodes.flatMap(
        (v, i) => (v === 2 ? [i] : []),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  performanceClassificationPreviewRegularUnknownCodes: [0, 1, 2],
  baseTicketPricesMinor: [1000, 1000, 1000],
  callerPreviewDiscountBasisPoints: 2000,
} satisfies Input;
export const exampleOutput = {
  callerKnownApplicablePricesMinor: [800, 1000, -1],
  unknownPerformancePriceIndices: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/preview-performance-discount-standard-lookup",
  title: "Preview Performance Discount Standard Lookup",
  description:
    "Apply actual caller preview/regular performance classifications and discount with unknown price −1; not universally discounted previews or inferred performance phase.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerKnownApplicablePricesMinor",
      label: "Caller known applicable prices minor",
      kind: "numberList",
    },
    {
      id: "unknownPerformancePriceIndices",
      label: "Unknown performance price indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      performanceClassificationPreviewRegularUnknownCodes:
        value.performanceClassificationPreviewRegularUnknownCodes as readonly number[],
      baseTicketPricesMinor: value.baseTicketPricesMinor as readonly number[],
      callerPreviewDiscountBasisPoints:
        value.callerPreviewDiscountBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
