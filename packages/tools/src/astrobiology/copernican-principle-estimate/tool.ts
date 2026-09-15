import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly eligibleSystems: number;
  readonly emergenceWindowYears: number;
  readonly activeLifetimeYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "eligibleSystems", label: "Eligible systems", kind: "number" },
  {
    id: "emergenceWindowYears",
    label: "Emergence window years",
    kind: "number",
  },
  { id: "activeLifetimeYears", label: "Active lifetime years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.eligibleSystems, "systems");
  positive(i.emergenceWindowYears, "window");
  nonnegative(i.activeLifetimeYears, "lifetime");
  return {
    toyExpectedActiveSystems:
      i.eligibleSystems *
      Math.min(1, i.activeLifetimeYears / i.emergenceWindowYears),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    eligibleSystems: 1000,
    emergenceWindowYears: 1000000,
    activeLifetimeYears: 1000,
  },
  output: { result: { toyExpectedActiveSystems: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/copernican-principle-estimate",
  title: "Copernican Principle Active-Civilization Estimate Calculator",
  description:
    "Explicit uniform-emergence toy Copernican model for expected active systems, capped lifetime/window probability; not an empirical civilization estimate.",
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
