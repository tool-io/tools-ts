import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly reproductionNumber: number;
  readonly initialSusceptibleFraction: number;
  readonly initialInfectiousFraction: number;
}>;
export type Output = Readonly<{
  readonly finalSusceptibleFraction: number;
  readonly newInfectionFraction: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.reproductionNumber, "reproductionNumber");
  fraction(input.initialSusceptibleFraction, "initialSusceptibleFraction");
  fraction(input.initialInfectiousFraction, "initialInfectiousFraction");
  positive(input.initialInfectiousFraction, "initialInfectiousFraction");
  if (
    input.initialSusceptibleFraction + input.initialInfectiousFraction >
    1 + 1e-12
  )
    simpleError(
      "initialInfectiousFraction",
      "Initial compartments cannot exceed population fraction one.",
    );
  const s = input.initialSusceptibleFraction,
    i = input.initialInfectiousFraction;
  let low = 0,
    high = s;
  for (let step = 0; step < 150; step++) {
    const mid = (low + high) / 2,
      value = mid - s * Math.exp(-input.reproductionNumber * (s + i - mid));
    if (value > 0) high = mid;
    else low = mid;
  }
  const finalSusceptibleFraction = (low + high) / 2;
  return {
    finalSusceptibleFraction,
    newInfectionFraction: s - finalSusceptibleFraction,
  };
};
export const exampleInput = {
  reproductionNumber: 1.1552453009332422,
  initialSusceptibleFraction: 0.8,
  initialInfectiousFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  finalSusceptibleFraction: 0.4,
  newInfectionFraction: 0.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/sir-final-size-root",
  title: "SIR Final Size Root",
  description:
    "Solve the closed homogeneous SIR final-size equation with explicitly nonzero initial infectious fraction.",
  inputs: [
    { id: "reproductionNumber", label: "Reproduction number", kind: "number" },
    {
      id: "initialSusceptibleFraction",
      label: "Initial susceptible fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "initialInfectiousFraction",
      label: "Initial infectious fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "finalSusceptibleFraction",
      label: "Final susceptible fraction",
      kind: "number",
    },
    {
      id: "newInfectionFraction",
      label: "New infection fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      reproductionNumber: value.reproductionNumber as number,
      initialSusceptibleFraction: value.initialSusceptibleFraction as number,
      initialInfectiousFraction: value.initialInfectiousFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
