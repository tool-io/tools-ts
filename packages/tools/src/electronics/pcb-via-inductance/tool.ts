import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualViaLengthMeters: number;
  readonly actualBarrelDiameterMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualViaLengthMeters",
    label: "Actual via length meters",
    kind: "number",
  },
  {
    id: "actualBarrelDiameterMeters",
    label: "Actual barrel diameter meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualViaLengthMeters, "actualViaLengthMeters");
  positive(input.actualBarrelDiameterMeters, "actualBarrelDiameterMeters");
  if (input.actualViaLengthMeters < input.actualBarrelDiameterMeters)
    simpleError("geometry", "Declared h≥d branch.");
  return {
    value:
      2e-7 *
      input.actualViaLengthMeters *
      (Math.log(
        (4 * input.actualViaLengthMeters) / input.actualBarrelDiameterMeters,
      ) +
        1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualViaLengthMeters: 1, actualBarrelDiameterMeters: 0.1 },
  output: { result: { value: 9.377758908227871e-7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/pcb-via-inductance",
  title: "Pcb Via Inductance Calculator",
  description:
    "Restricted isolated straight via partial inductance estimate2e\u22127h[ln(4h/d)+1]SI, H, return path mutual inductance excluded, h\u2265d. Actual matched units/topology and independently established parameters; not a safe device/electrical design or verified manufacturer rating.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
