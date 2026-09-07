import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { simpleError } from "../batch42-shared.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  indices,
  bounded,
  positive,
  aligned,
  unique,
  integer,
} from "../batch42-shared.js";
import { money } from "../../accounting/money.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly offerPricesMinor: readonly number[];
  readonly offerQuantityInCommonIntegerUnits: readonly number[];
  readonly offerIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "offerPricesMinor", label: "Offer prices minor", kind: "numberList" },
  {
    id: "offerQuantityInCommonIntegerUnits",
    label: "Offer quantity in common integer units",
    kind: "numberList",
  },
  { id: "offerIds", label: "Offer ids", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  unique(input.offerIds, "offers");
  aligned(input.offerIds, input.offerPricesMinor, "prices");
  aligned(
    input.offerIds,
    input.offerQuantityInCommonIntegerUnits,
    "quantities",
  );
  input.offerPricesMinor.forEach((v) => money(v, "price"));
  input.offerQuantityInCommonIntegerUnits.forEach((v) => {
    positive(v, "quantity");
    integer(v, "quantity");
  });
  if (input.offerIds.length < 2)
    simpleError("offers", "At least two same-currency/common-unit offers.");
  bounded(input.count, "quizzes", 1, 64);
  const quizzes = Array.from({ length: input.count }, () => {
    const pair = indices(
        input.offerIds.length,
        { seed: input.seed, count: 2, withoutReplacement: true },
        random,
      ),
      [a, b] = pair,
      difference =
        BigInt(input.offerPricesMinor[a]) *
          BigInt(input.offerQuantityInCommonIntegerUnits[b]) -
        BigInt(input.offerPricesMinor[b]) *
          BigInt(input.offerQuantityInCommonIntegerUnits[a]);
    return {
      offerIds: pair.map((i) => input.offerIds[i]),
      unitPricesMinor: pair.map(
        (i) =>
          input.offerPricesMinor[i] /
          input.offerQuantityInCommonIntegerUnits[i],
      ),
      cheaperOfferIds:
        difference === 0n
          ? pair.map((i) => input.offerIds[i])
          : [input.offerIds[difference < 0n ? a : b]],
      exactUnitPriceTie: difference === 0n,
    };
  });
  return { result: { quizzes } };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 1,
    offerPricesMinor: [100, 120, 250],
    offerQuantityInCommonIntegerUnits: [2, 3, 5],
    offerIds: ["a", "b", "c"],
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/grocery-unit-price-comparison-quiz",
  title: "Random Grocery Unit Price Comparison Quiz Generator",
  description:
    "Draw distinct offer pairs and compare exact rational minor-unit prices by BigIntcross-products, retaining ties. All quantities in one caller common integer unit, prices in one currency; display divisions only, no tax/promotion, nutrition or current grocery-price inference.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
