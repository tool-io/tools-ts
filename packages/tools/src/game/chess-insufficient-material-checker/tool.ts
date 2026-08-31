import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fen, materialDead } from "../shared.js";
export type Input = Readonly<{ readonly positionFen: string }>;
export type Output = Readonly<{
  readonly deadByListedMaterialCondition: boolean;
  readonly notClassifiedByMaterialScreen: boolean;
}>;
const inputFields = [
  { id: "positionFen", label: "Position fen", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const dead = materialDead(fen(input.positionFen));
  return {
    deadByListedMaterialCondition: dead,
    notClassifiedByMaterialScreen: !dead,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  positionFen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
} satisfies Input;
export const exampleOutput = {
  deadByListedMaterialCondition: true,
  notClassifiedByMaterialScreen: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/chess-insufficient-material-checker",
  title: "Insufficient Material Draw Check",
  description:
    "Conservative dead-material screen: kings only, one total bishop/knight, or bishops only all on the same color complex. Other positions remain unclassified, not guaranteed mating-capable; two knights are not automatically declared dead.",
  inputs: inputFields,
  outputs: [
    {
      id: "deadByListedMaterialCondition",
      label: "Dead by listed material condition",
      kind: "boolean",
    },
    {
      id: "notClassifiedByMaterialScreen",
      label: "Not classified by material screen",
      kind: "boolean",
    },
  ],
  calculate: (value) => calculate({ positionFen: value.positionFen as string }),
});
export const run = tool.execute;
export default tool;
