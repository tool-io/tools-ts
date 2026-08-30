import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction, count, endpoints } from "../shared.js";

export type Input = Readonly<{
  readonly concentrations: readonly number[];
  readonly survivingCfu: readonly number[];
  readonly initialCfu: number;
  readonly minimumKillFraction: number;
}>;
export type Output = Readonly<{
  readonly killFractions: readonly number[];
  readonly mbcConcentration: number;
  readonly endpointFound: boolean;
  readonly rightCensored: boolean;
}>;
export const calculate = (input: Input): Output => {
  endpoints(input.concentrations, input.survivingCfu, "concentrations");
  count(input.initialCfu, "initialCfu", 1);
  fraction(input.minimumKillFraction, "minimumKillFraction");
  input.survivingCfu.forEach((v, i) => {
    count(v, "survivingCfu");
    if (v > input.initialCfu || (i > 0 && v > input.survivingCfu[i - 1]))
      simpleError(
        "survivingCfu",
        "Nonincreasing survivor counts within initial CFU required.",
      );
  });
  const killFractions = input.survivingCfu.map((v) => 1 - v / input.initialCfu),
    index = killFractions.findIndex((v) => v >= input.minimumKillFraction);
  return {
    killFractions,
    mbcConcentration: index < 0 ? 0 : input.concentrations[index],
    endpointFound: index >= 0,
    rightCensored: index < 0,
  };
};
export const exampleInput = {
  concentrations: [1, 2, 4],
  survivingCfu: [1000, 100, 10],
  initialCfu: 100000,
  minimumKillFraction: 0.999,
} satisfies Input;
export const exampleOutput = {
  killFractions: [0.99, 0.999, 0.9999],
  mbcConcentration: 2,
  endpointFound: true,
  rightCensored: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/bactericidal-survival-endpoint",
  title: "Bactericidal Survival Endpoint",
  description:
    "Find the first dilution meeting a caller-defined bactericidal kill fraction based on survivor counts, rather than merely recording MBC.",
  inputs: [
    { id: "concentrations", label: "Concentrations", kind: "numberList" },
    { id: "survivingCfu", label: "Surviving cfu", kind: "numberList" },
    { id: "initialCfu", label: "Initial cfu", kind: "integer", minimum: 1 },
    {
      id: "minimumKillFraction",
      label: "Minimum kill fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    { id: "killFractions", label: "Kill fractions", kind: "numberList" },
    { id: "mbcConcentration", label: "Mbc concentration", kind: "number" },
    { id: "endpointFound", label: "Endpoint found", kind: "boolean" },
    { id: "rightCensored", label: "Right censored", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      concentrations: value.concentrations as readonly number[],
      survivingCfu: value.survivingCfu as readonly number[],
      initialCfu: value.initialCfu as number,
      minimumKillFraction: value.minimumKillFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
