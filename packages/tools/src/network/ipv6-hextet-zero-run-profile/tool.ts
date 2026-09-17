import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ address: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "address", kind: "string", label: "address" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const v = H.ip(i.address, 128),
    groups = Array.from({ length: 8 }, (_, j) =>
      Number((v >> BigInt(16 * (7 - j))) & 65535n),
    ),
    runs: { start: number; end: number }[] = [];
  for (let j = 0; j < 8;) {
    if (groups[j]) {
      j++;
      continue;
    }
    const start = j;
    while (j < 8 && groups[j] === 0) j++;
    runs.push({ start, end: j });
  }
  const longest = runs.length
    ? Math.max(...runs.map((r) => r.end - r.start))
    : 0;
  return H.finish({
    runs,
    longestIndexes: runs.flatMap((r, j) =>
      r.end - r.start === longest ? [j] : [],
    ),
  });
};
export const example = {
  input: { address: "::1" },
  output: { result: { runs: [{ start: 0, end: 7 }], longestIndexes: [0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-hextet-zero-run-profile",
  title: "IPv6 Hextet Zero Run Profile",
  description:
    "Profile exact zero-hextet runs of a parsed IPv6 address and retain every longest tie; does not itself choose a compression spelling.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
