import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly occupantLoad: number;
  readonly exitWidthsMeters: readonly number[];
  readonly capacityPerMeter: number;
  readonly requiredSafetyFactor: number;
}>;
export type Output = Readonly<{
  readonly totalExitWidthMeters: number;
  readonly exitCapacity: number;
  readonly requiredCapacity: number;
  readonly capacityMargin: number;
  readonly adequate: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.exitWidthsMeters.some((value) => value < 0) ||
    input.capacityPerMeter <= 0
  )
    simpleError(
      "exitWidthsMeters",
      "Exit widths must be nonnegative and capacity rate positive.",
      "invalid_capacity",
    );
  const totalExitWidthMeters = input.exitWidthsMeters.reduce(
      (a, b) => a + b,
      0,
    ),
    exitCapacity = Math.floor(totalExitWidthMeters * input.capacityPerMeter),
    requiredCapacity = input.occupantLoad * input.requiredSafetyFactor;
  return {
    totalExitWidthMeters,
    exitCapacity,
    requiredCapacity,
    capacityMargin: Math.floor(exitCapacity - requiredCapacity),
    adequate: exitCapacity >= requiredCapacity,
  };
};

export const exampleInput = {
  occupantLoad: 200,
  exitWidthsMeters: [1, 1.5],
  capacityPerMeter: 100,
  requiredSafetyFactor: 1,
} satisfies Input;
export const exampleOutput = {
  totalExitWidthMeters: 2.5,
  exitCapacity: 250,
  requiredCapacity: 200,
  capacityMargin: 50,
  adequate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      occupantLoad: input.occupantLoad as number,
      exitWidthsMeters: input.exitWidthsMeters as readonly number[],
      capacityPerMeter: input.capacityPerMeter as number,
      requiredSafetyFactor: input.requiredSafetyFactor as number,
    }),
  description:
    "Calculate exit capacity from supplied clear widths and capacity rate.",
  id: "theatre/exit-capacity",
  inputs: [
    { id: "occupantLoad", label: "Occupant load", kind: "integer", minimum: 0 },
    {
      id: "exitWidthsMeters",
      label: "Exit clear widths",
      kind: "numberList",
      unit: "m",
    },
    {
      id: "capacityPerMeter",
      label: "Exit capacity per meter",
      kind: "number",
      minimum: 0,
    },
    {
      id: "requiredSafetyFactor",
      label: "Required capacity factor",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalExitWidthMeters",
      label: "Total exit width",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "exitCapacity",
      label: "Calculated exit capacity",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "requiredCapacity",
      label: "Required factored capacity",
      kind: "number",
      minimum: 0,
    },
    { id: "capacityMargin", label: "Exit capacity margin", kind: "integer" },
    { id: "adequate", label: "Capacity is adequate", kind: "boolean" },
  ],
  title: "Exit Capacity",
});

export const run = tool.execute;
export default tool;
