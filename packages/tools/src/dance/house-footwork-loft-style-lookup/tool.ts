import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly houseMovementContext: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  {
    id: "houseMovementContext",
    label: "House movement context",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.houseMovementContext,
      {
        jacking: "groove associated with house dance",
        footwork: "rhythmic stepping vocabulary in house dance",
        lofting: "flowing floor-oriented movement associated with house dance",
      },
      "houseMovementContext",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { houseMovementContext: "lofting" } satisfies Input;
export const exampleOutput = {
  meaning: "flowing floor-oriented movement associated with house dance",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/house-footwork-loft-style-lookup",
  title: "House Footwork Loft Style Lookup",
  description:
    "Bounded house dance vocabulary, not universal style family tree or safe floor work instructions. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ houseMovementContext: value.houseMovementContext as string }),
});
export const run = tool.execute;
export default tool;
