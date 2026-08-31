import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, frequencies } from "../shared.js";
export type Input = Readonly<{ readonly faceletString: string }>;
export type Output = Readonly<{
  readonly observedFaceletCount: number;
  readonly basicNinePerColorInventoryValid: boolean;
  readonly sixCenterColorsDistinct: boolean;
}>;
const inputFields = [
  { id: "faceletString", label: "Facelet string", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.faceletString.length !== 54 ||
    !/^[URFDLB]+$(?![\s\S])/.test(input.faceletString)
  )
    simpleError(
      "facelets",
      "Exactly 54 URFDLB face labels in six nine-cell face blocks required.",
    );
  const f = frequencies([...input.faceletString]);
  return {
    observedFaceletCount: 54,
    basicNinePerColorInventoryValid: [..."URFDLB"].every((c) => f.get(c) === 9),
    sixCenterColorsDistinct:
      new Set([4, 13, 22, 31, 40, 49].map((i) => input.faceletString[i]))
        .size === 6,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  faceletString: "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB",
} satisfies Input;
export const exampleOutput = {
  observedFaceletCount: 54,
  basicNinePerColorInventoryValid: true,
  sixCenterColorsDistinct: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/rubiks-cube-facelet-count-54-checker",
  title: "Rubik Cube 54 Facelets Check",
  description:
    "Audit 54 face labels, nine of each color and distinct six block-center colors; basic inventory only, not cubie orientation/permutation or physically reachable Rubik state.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedFaceletCount",
      label: "Observed facelet count",
      kind: "number",
    },
    {
      id: "basicNinePerColorInventoryValid",
      label: "Basic nine per color inventory valid",
      kind: "boolean",
    },
    {
      id: "sixCenterColorsDistinct",
      label: "Six center colors distinct",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({ faceletString: value.faceletString as string }),
});
export const run = tool.execute;
export default tool;
