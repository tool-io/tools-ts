import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bits", kind: "string", label: "bits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bits(i.bits);
  const n = i.bits.length,
    runs: { start: number; length: number }[] = [];
  if (n && /^1+$/.test(i.bits)) runs.push({ start: 0, length: n });
  else
    for (let j = 0; j < n; j++)
      if (i.bits[j] === "1" && i.bits[H.mod(j - 1, n)] === "0") {
        let length = 0;
        while (i.bits[(j + length) % n] === "1") length++;
        runs.push({ start: j, length });
      }
  return H.finish({ runs });
};
export const example = {
  input: { bits: "110001" },
  output: { result: { runs: [{ start: 5, length: 3 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-circular-one-runs",
  title: "Bit String Circular One Runs",
  description:
    "Inventory circular one-bit runs with modular starting positions and lengths; all-ones has one full-cycle run and empty/all-zero strings have none.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
