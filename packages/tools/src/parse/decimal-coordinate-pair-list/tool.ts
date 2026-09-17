import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", kind: "string", label: "text" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const tokens = i.text === "" ? [] : i.text.split(";");
  H.check(tokens.length <= 128);
  return H.finish({
    points: tokens.map((t) => {
      const p = t.split(",");
      H.check(p.length === 2);
      return p.map(H.numericToken);
    }),
  });
};
export const example = {
  input: { text: "1,2;-3,4.5" },
  output: {
    result: {
      points: [
        [1, 2],
        [-3, 4.5],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/decimal-coordinate-pair-list",
  title: "Decimal Coordinate Pair List Parser",
  description:
    "Parse a semicolon-separated list of strict comma numeric coordinate pairs; no whitespace, CRS, geodesy or dimensional inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
