import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly knotCount: number;
  readonly knotsPerHour: number;
  readonly preparationHours: number;
  readonly contingencyPercent: number;
}>;
export type Output = Readonly<{
  readonly ventilationHours: number;
  readonly baseHours: number;
  readonly plannedHours: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.knotsPerHour <= 0)
    simpleError(
      "knotsPerHour",
      "Ventilation speed must be positive.",
      "invalid_speed",
    );
  const ventilationHours = input.knotCount / input.knotsPerHour,
    baseHours = ventilationHours + input.preparationHours;
  return {
    ventilationHours,
    baseHours,
    plannedHours: baseHours * (1 + input.contingencyPercent / 100),
  };
};

export const exampleInput = {
  knotCount: 1000,
  knotsPerHour: 100,
  preparationHours: 2,
  contingencyPercent: 25,
} satisfies Input;
export const exampleOutput = {
  ventilationHours: 10,
  baseHours: 12,
  plannedHours: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      knotCount: input.knotCount as number,
      knotsPerHour: input.knotsPerHour as number,
      preparationHours: input.preparationHours as number,
      contingencyPercent: input.contingencyPercent as number,
    }),
  description:
    "Estimate custom wig ventilation hours with preparation and contingency.",
  id: "theatre/wig-ventilation-hours",
  inputs: [
    {
      id: "knotCount",
      label: "Estimated ventilation knots",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "knotsPerHour",
      label: "Ventilation speed",
      kind: "number",
      minimum: 0,
      unit: "knots/h",
    },
    {
      id: "preparationHours",
      label: "Preparation time",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "contingencyPercent",
      label: "Contingency",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "ventilationHours",
      label: "Ventilation hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "baseHours",
      label: "Base work hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "plannedHours",
      label: "Planned hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
  ],
  title: "Wig Ventilation Hours",
});

export const run = tool.execute;
export default tool;
