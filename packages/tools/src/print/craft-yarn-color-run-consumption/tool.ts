import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ runsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "runsJson", kind: "string", label: "runsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.runsJson).map((v) => ({
    color: H.str(v.color),
    stitches: H.int(H.num(v.stitches)),
    lengthPerStitch: H.positive(H.num(v.lengthPerStitch)),
  }));
  return H.finish({
    colors: H.groups(r, (v) => v.color).map((g) => ({
      color: g.key,
      length: g.indexes.reduce(
        (s, j) => s + r[j].stitches * r[j].lengthPerStitch,
        0,
      ),
    })),
  });
};
export const example = {
  input: {
    runsJson:
      '[{"color":"red","stitches":3,"lengthPerStitch":2},{"color":"red","stitches":1,"lengthPerStitch":4}]',
  },
  output: { result: { colors: [{ color: "red", length: 10 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/craft-yarn-color-run-consumption",
  title: "Craft Yarn Color Run Consumption",
  description:
    "Aggregate yarn consumption per explicit color run and supplied stitch allowance; no inferred pattern, tension or authoritative yarn requirement.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
