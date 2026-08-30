import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly flightSeconds: number;
  readonly contactSeconds: number;
  readonly gravityMps2: number;
}>;
export type Output = Readonly<{
  readonly jumpHeightM: number;
  readonly reactiveStrengthIndexMps: number;
  readonly flightContactRatio: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.flightSeconds <= 0 ||
    input.contactSeconds <= 0 ||
    input.gravityMps2 <= 0
  )
    simpleError(
      "contactSeconds",
      "Positive flight/contact times and gravity required.",
    );
  const jumpHeightM = (input.gravityMps2 * input.flightSeconds ** 2) / 8;
  return {
    jumpHeightM,
    reactiveStrengthIndexMps: jumpHeightM / input.contactSeconds,
    flightContactRatio: input.flightSeconds / input.contactSeconds,
  };
};
export const exampleInput = {
  flightSeconds: 0.4,
  contactSeconds: 0.2,
  gravityMps2: 10,
} satisfies Input;
export const exampleOutput = {
  jumpHeightM: 0.20000000000000004,
  reactiveStrengthIndexMps: 1.0000000000000002,
  flightContactRatio: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/reactive-strength-index",
  title: "Reactive Strength Index",
  description:
    "Compute reactive strength index from inferred jump height and ground contact time.",
  inputs: [
    { id: "flightSeconds", label: "Flight seconds", kind: "number" },
    { id: "contactSeconds", label: "Contact seconds", kind: "number" },
    { id: "gravityMps2", label: "Gravity mps 2", kind: "number" },
  ],
  outputs: [
    { id: "jumpHeightM", label: "Jump height m", kind: "number" },
    {
      id: "reactiveStrengthIndexMps",
      label: "Reactive strength index mps",
      kind: "number",
    },
    { id: "flightContactRatio", label: "Flight contact ratio", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      flightSeconds: value.flightSeconds as number,
      contactSeconds: value.contactSeconds as number,
      gravityMps2: value.gravityMps2 as number,
    }),
});
export const run = tool.execute;
export default tool;
