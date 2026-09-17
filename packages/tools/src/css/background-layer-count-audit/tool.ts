import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  imageLayers: number;
  counts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "imageLayers", label: "imageLayers", kind: "integer" },
  { id: "counts", label: "counts", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.imageLayers, 0, 128);
  i.counts.forEach((x) => H.int(x, 1, 128));
  return H.finish({
    effective: i.counts.map((n) => ({
      sourceCount: n,
      used: i.imageLayers,
      cycles: Math.floor(i.imageLayers / n),
      tail: i.imageLayers % n,
    })),
    extra: i.counts.map((n) => Math.max(0, n - i.imageLayers)),
  });
};
export const example = {
  input: { imageLayers: 3, counts: [1, 2, 4] },
  output: {
    result: {
      effective: [
        { sourceCount: 1, used: 3, cycles: 3, tail: 0 },
        { sourceCount: 2, used: 3, cycles: 1, tail: 1 },
        { sourceCount: 4, used: 3, cycles: 0, tail: 3 },
      ],
      extra: [0, 0, 1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/background-layer-count-audit",
  title: "CSS Background Layer Count Audit",
  description:
    "Audit background longhand list cycling/truncation against explicit image-layer count; resolved list counts only, no CSS token parsing.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
