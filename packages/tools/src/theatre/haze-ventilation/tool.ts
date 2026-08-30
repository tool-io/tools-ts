import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly hazeGenerationMilligramsPerMinute: number;
  readonly ventilationCubicMetersPerMinute: number;
  readonly maximumConcentrationMgPerM3: number;
}>;
export type Output = Readonly<{
  readonly steadyConcentrationMgPerM3: number;
  readonly concentrationMarginMgPerM3: number;
  readonly withinLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.ventilationCubicMetersPerMinute <= 0)
    simpleError(
      "ventilationCubicMetersPerMinute",
      "Ventilation flow must be positive.",
      "invalid_ventilation",
    );
  const steadyConcentrationMgPerM3 =
    input.hazeGenerationMilligramsPerMinute /
    input.ventilationCubicMetersPerMinute;
  return {
    steadyConcentrationMgPerM3,
    concentrationMarginMgPerM3:
      input.maximumConcentrationMgPerM3 - steadyConcentrationMgPerM3,
    withinLimit:
      steadyConcentrationMgPerM3 <= input.maximumConcentrationMgPerM3,
  };
};

export const exampleInput = {
  hazeGenerationMilligramsPerMinute: 100,
  ventilationCubicMetersPerMinute: 50,
  maximumConcentrationMgPerM3: 3,
} satisfies Input;
export const exampleOutput = {
  steadyConcentrationMgPerM3: 2,
  concentrationMarginMgPerM3: 1,
  withinLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      hazeGenerationMilligramsPerMinute:
        input.hazeGenerationMilligramsPerMinute as number,
      ventilationCubicMetersPerMinute:
        input.ventilationCubicMetersPerMinute as number,
      maximumConcentrationMgPerM3: input.maximumConcentrationMgPerM3 as number,
    }),
  description:
    "Estimate steady haze concentration from generation and ventilation rates.",
  id: "theatre/haze-ventilation",
  inputs: [
    {
      id: "hazeGenerationMilligramsPerMinute",
      label: "Haze generation",
      kind: "number",
      minimum: 0,
      unit: "mg/min",
    },
    {
      id: "ventilationCubicMetersPerMinute",
      label: "Ventilation flow",
      kind: "number",
      minimum: 0,
      unit: "m³/min",
    },
    {
      id: "maximumConcentrationMgPerM3",
      label: "Maximum steady concentration",
      kind: "number",
      minimum: 0,
      unit: "mg/m³",
    },
  ],
  outputs: [
    {
      id: "steadyConcentrationMgPerM3",
      label: "Estimated steady concentration",
      kind: "number",
      minimum: 0,
      unit: "mg/m³",
    },
    {
      id: "concentrationMarginMgPerM3",
      label: "Concentration margin",
      kind: "number",
      unit: "mg/m³",
    },
    { id: "withinLimit", label: "Within supplied limit", kind: "boolean" },
  ],
  title: "Haze Ventilation",
});

export const run = tool.execute;
export default tool;
