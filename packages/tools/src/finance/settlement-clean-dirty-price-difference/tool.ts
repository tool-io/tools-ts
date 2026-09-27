import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  quotedPrice: number;
  accruedInterest: number;
  quotedKind: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "quotedPrice", label: "Quoted price", kind: "number" },
  { id: "accruedInterest", label: "Accrued interest", kind: "number" },
  {
    id: "quotedKind",
    label: "Quoted kind",
    kind: "string",
    enum: ["clean", "dirty"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.quotedKind, ["clean", "dirty"]);
  H.check(
    i.quotedPrice >= 0 &&
      i.accruedInterest >= 0 &&
      (i.quotedKind !== "dirty" || i.quotedPrice >= i.accruedInterest),
  );
  return H.finish({
    cleanPrice:
      i.quotedKind === "clean"
        ? i.quotedPrice
        : i.quotedPrice - i.accruedInterest,
    dirtyPrice:
      i.quotedKind === "dirty"
        ? i.quotedPrice
        : i.quotedPrice + i.accruedInterest,
  });
};
export const example = {
  input: { quotedPrice: 101, accruedInterest: 2, quotedKind: "dirty" },
  output: { result: { cleanPrice: 99, dirtyPrice: 101 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "finance/settlement-clean-dirty-price-difference",
  title: "Finance: Settlement Clean Dirty Price Difference Tool",
  description:
    "Crosswalk clean and dirty settlement prices using explicitly supplied accrued interest in the same price units; no market convention or interest computation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cleanPrice: { type: "number" },
          dirtyPrice: { type: "number" },
        },
        required: ["cleanPrice", "dirtyPrice"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
