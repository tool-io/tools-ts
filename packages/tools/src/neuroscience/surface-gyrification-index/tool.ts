import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly pialPatchAreasMm2: readonly number[];
  readonly hullPatchAreasMm2: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalPialAreaMm2: number;
  readonly totalHullAreaMm2: number;
  readonly gyrificationIndex: number;
}>;
const inputFields = [
  {
    id: "pialPatchAreasMm2",
    label: "Pial patch areas mm2",
    kind: "numberList",
  },
  {
    id: "hullPatchAreasMm2",
    label: "Hull patch areas mm2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.pialPatchAreasMm2.length || !input.hullPatchAreasMm2.length)
    simpleError(
      "pialPatchAreasMm2",
      "Nonempty matched-region surface patches required; tessellations may differ.",
    );
  input.pialPatchAreasMm2.forEach((v) => nonnegative(v, "pialPatchAreasMm2"));
  input.hullPatchAreasMm2.forEach((v) => nonnegative(v, "hullPatchAreasMm2"));
  const totalPialAreaMm2 = input.pialPatchAreasMm2.reduce((a, b) => a + b, 0),
    totalHullAreaMm2 = positive(
      input.hullPatchAreasMm2.reduce((a, b) => a + b, 0),
      "hullPatchAreasMm2",
    );
  if (totalPialAreaMm2 < totalHullAreaMm2)
    simpleError(
      "pialPatchAreasMm2",
      "Pial area must be at least the enclosing hull area for the same region.",
    );
  return {
    totalPialAreaMm2,
    totalHullAreaMm2,
    gyrificationIndex: totalPialAreaMm2 / totalHullAreaMm2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pialPatchAreasMm2: [3, 5],
  hullPatchAreasMm2: [2, 2],
} satisfies Input;
export const exampleOutput = {
  totalPialAreaMm2: 8,
  totalHullAreaMm2: 4,
  gyrificationIndex: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/surface-gyrification-index",
  title: "Gyrification Index",
  description:
    "Aggregate independently tessellated pial and enclosing-hull areas for the same region and compute a surface gyrification ratio.",
  inputs: inputFields,
  outputs: [
    { id: "totalPialAreaMm2", label: "Total pial area mm2", kind: "number" },
    { id: "totalHullAreaMm2", label: "Total hull area mm2", kind: "number" },
    { id: "gyrificationIndex", label: "Gyrification index", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      pialPatchAreasMm2: value.pialPatchAreasMm2 as readonly number[],
      hullPatchAreasMm2: value.hullPatchAreasMm2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
