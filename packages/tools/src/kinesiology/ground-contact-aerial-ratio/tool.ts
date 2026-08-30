import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly groundContactSeconds: number;
  readonly aerialSeconds: number;
}>;
export type Output = Readonly<{
  readonly contactToAerialRatio: number;
  readonly contactFraction: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.groundContactSeconds <= 0 || input.aerialSeconds <= 0)
    simpleError(
      "aerialSeconds",
      "Positive ground contact and aerial durations required.",
    );
  return {
    contactToAerialRatio: input.groundContactSeconds / input.aerialSeconds,
    contactFraction:
      input.groundContactSeconds /
      (input.groundContactSeconds + input.aerialSeconds),
  };
};
export const exampleInput = {
  groundContactSeconds: 0.2,
  aerialSeconds: 0.1,
} satisfies Input;
export const exampleOutput = {
  contactToAerialRatio: 2,
  contactFraction: 0.6666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/ground-contact-aerial-ratio",
  title: "Ground Contact Aerial Ratio",
  description: "Compare running ground-contact and aerial times.",
  inputs: [
    {
      id: "groundContactSeconds",
      label: "Ground contact seconds",
      kind: "number",
    },
    { id: "aerialSeconds", label: "Aerial seconds", kind: "number" },
  ],
  outputs: [
    {
      id: "contactToAerialRatio",
      label: "Contact to aerial ratio",
      kind: "number",
    },
    { id: "contactFraction", label: "Contact fraction", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      groundContactSeconds: value.groundContactSeconds as number,
      aerialSeconds: value.aerialSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
