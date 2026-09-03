import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly snapAlign: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "snapAlign", label: "Snap align", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.snapAlign,
      {
        none: "no snap position from this box on the axis",
        start: "align snap area start with snapport start",
        center: "align snap area center with snapport center",
        end: "align snap area end with snapport end",
      },
      "snapAlign",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { snapAlign: "center" } satisfies Input;
export const exampleOutput = {
  meaning: "align snap area center with snapport center",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/scroll-snap-align-types-lookup",
  title: "scroll-snap-align Types Lookup",
  description:
    "Supported one-axis scroll-snap-align keyword, not actual snapped scroll offset or mandatory feasibility. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ snapAlign: value.snapAlign as string }),
});
export const run = tool.execute;
export default tool;
