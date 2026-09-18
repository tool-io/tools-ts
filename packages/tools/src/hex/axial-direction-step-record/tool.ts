import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  q: number;
  r: number;
  direction: number;
  steps: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "q", label: "q", kind: "integer" },
  { id: "r", label: "r", kind: "integer" },
  { id: "direction", label: "direction", kind: "integer" },
  { id: "steps", label: "steps", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.q, -1e9, 1e9);
  H.int(i.r, -1e9, 1e9);
  H.int(i.direction, 0, 5);
  H.int(i.steps, -1e9, 1e9);
  return H.finish({
    q: i.q + H.hexDirs[i.direction][0] * i.steps,
    r: i.r + H.hexDirs[i.direction][1] * i.steps,
  });
};
export const example = {
  input: { q: 0, r: 0, direction: 1, steps: 2 },
  output: { result: { q: 2, r: -2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "hex/axial-direction-step-record",
  title: "Hex Axial Direction Step Record",
  description:
    "Advance axial hex coordinates by an explicit signed count along one of six documented direction vectors; no board-boundary or path legality model.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
