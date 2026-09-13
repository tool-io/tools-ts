import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sourceFor,
  draw,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly moveCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "moveCount", label: "Move count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  bounded(input.moveCount, "moves", 1, 64);
  const faces = ["U", "R", "F", "D", "L", "B"],
    a: string[] = [];
  let previous = "";
  for (let i = 0; i < input.moveCount; i++) {
    const eligible = faces.filter((v) => v !== previous),
      f = eligible[draw(0, eligible.length - 1, random)];
    a.push(f + ["", "'", "2"][draw(0, 2, random)]);
    previous = f;
  }
  return { scrambleMoves: a };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51", moveCount: 3 },
  output: {
    result: {
      scrambleMoves: ["F'", "D", "R"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/cube-scramble",
  title: "Rubik's Cube Scramble Generator",
  description:
    "Syntacticallyvalid3\u00d73cubeface moves,noadjacentsameface,not WCAuniformrandomstateor solve-distancecertification. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
