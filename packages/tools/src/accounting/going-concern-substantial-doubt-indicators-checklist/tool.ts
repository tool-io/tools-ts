import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  binary,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly indicatorIds: readonly string[];
  readonly knownFlags: readonly number[];
  readonly presentFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "indicatorIds", label: "Indicator ids", kind: "stringList" },
  { id: "knownFlags", label: "Known flags", kind: "numberList" },
  { id: "presentFlags", label: "Present flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  aligned(i.indicatorIds, i.knownFlags, "indicators");
  aligned(i.indicatorIds, i.presentFlags, "indicators");
  unique(i.indicatorIds, "ids");
  binary(i.knownFlags, "known");
  binary(i.presentFlags, "present");
  return {
    observedPresentIndicators: i.indicatorIds.filter(
      (_, j) => i.knownFlags[j] && i.presentFlags[j],
    ),
    unknownIndicators: i.indicatorIds.filter((_, j) => !i.knownFlags[j]),
    substantialDoubtDetermined: false,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    indicatorIds: ["liquidity", "losses"],
    knownFlags: [1, 0],
    presentFlags: [1, 0],
  },
  output: {
    result: {
      observedPresentIndicators: ["liquidity"],
      unknownIndicators: ["losses"],
      substantialDoubtDetermined: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/going-concern-substantial-doubt-indicators-checklist",
  title: "Going Concern Substantial Doubt Indicators Checklist",
  description:
    "Inventory explicitly known/present going-concern indicators, unknowns preserved; no substantial-doubt assessment or audit opinion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
