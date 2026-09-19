import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  perimeterMeters: number;
  misclosureMeters: number;
  significantDigits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "perimeterMeters",
    label: "Perimeter meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "misclosureMeters",
    label: "Misclosure meters",
    kind: "number",
    unit: "m",
  },
  { id: "significantDigits", label: "Significant digits", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.perimeterMeters > 0 &&
      i.perimeterMeters <= 1e9 &&
      i.misclosureMeters >= 0 &&
      i.misclosureMeters <= 1e9,
  );
  H.int(i.significantDigits, 1, 12);
  const ratio =
    i.misclosureMeters === 0 ? null : i.perimeterMeters / i.misclosureMeters;
  return H.finish({
    oneIn: ratio,
    formatted:
      ratio === null
        ? "exact closure"
        : "1:" + ratio.toPrecision(i.significantDigits),
  });
};
export const example = {
  input: { perimeterMeters: 1000, misclosureMeters: 0.1, significantDigits: 4 },
  output: { result: { oneIn: 10000, formatted: "1:1.000e+4" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/traverse-precision-ratio-formatter",
  title: "Traverse Precision Ratio 1-in-N Formatter",
  description:
    "Format measured traverse perimeter-to-misclosure precision ratio with explicit significant digits; zero misclosure is exact closure, not infinite certified survey accuracy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
