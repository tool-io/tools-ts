import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  shiftDate,
} from "../batch53-shared.js";

export type Input = Readonly<{
  hijriYear: number;
  hijriMonth: number;
  hijriDay: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "hijriYear", label: "Hijri year", kind: "number" },
  { id: "hijriMonth", label: "Hijri month", kind: "number" },
  { id: "hijriDay", label: "Hijri day", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.hijriYear, "year", 1, 5000);
  bounded(i.hijriMonth, "month", 1, 12);
  const leap = (11 * i.hijriYear + 14) % 30 < 11,
    max = i.hijriMonth === 12 ? (leap ? 30 : 29) : i.hijriMonth % 2 ? 30 : 29;
  bounded(i.hijriDay, "day", 1, max);
  const days =
    i.hijriDay -
    1 +
    Math.ceil(29.5 * (i.hijriMonth - 1)) +
    354 * (i.hijriYear - 1) +
    Math.floor((3 + 11 * i.hijriYear) / 30);
  return {
    prolepticGregorianDate: shiftDate("0622-07-19", days),
    calendar: "arithmetic-civil-tabular-Islamic",
    historicalMintDateConfirmed: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { hijriYear: 1, hijriMonth: 1, hijriDay: 1 },
  output: {
    result: {
      prolepticGregorianDate: "0622-07-19",
      calendar: "arithmetic-civil-tabular-Islamic",
      historicalMintDateConfirmed: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/islamic-dirham-hijri-mint-date-conversion-calculator",
  title: "Islamic Dirham Hijri Mint Date Conversion Calculator",
  description:
    "Convert a full caller Hijri date under the civil tabular Islamic calendar epoch (16 July 622 Julian); coin year alone and historical lunar observation do not establish an exact mint date.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
