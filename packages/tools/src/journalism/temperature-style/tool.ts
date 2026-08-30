import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly temperatureValue: number;
  readonly unit: string;
  readonly renderedTemperature: string;
  readonly requireDegreeSymbol: boolean;
}>;
export type Output = Readonly<{
  readonly expectedTemperature: string;
  readonly matchesExpected: boolean;
}>;

export const calculate = (input: Input): Output => {
  const expectedTemperature = input.requireDegreeSymbol
    ? `${input.temperatureValue}°${input.unit}`
    : `${input.temperatureValue} ${input.unit}`;
  return {
    expectedTemperature,
    matchesExpected: input.renderedTemperature.trim() === expectedTemperature,
  };
};

export const exampleInput = {
  temperatureValue: 72,
  unit: "F",
  renderedTemperature: "72°F",
  requireDegreeSymbol: true,
} satisfies Input;
export const exampleOutput = {
  expectedTemperature: "72°F",
  matchesExpected: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      temperatureValue: input.temperatureValue as number,
      unit: input.unit as string,
      renderedTemperature: input.renderedTemperature as string,
      requireDegreeSymbol: input.requireDegreeSymbol as boolean,
    }),
  description:
    "Validate a rendered temperature against supplied unit and degree-symbol policy.",
  id: "journalism/temperature-style",
  inputs: [
    { id: "temperatureValue", label: "Temperature value", kind: "number" },
    { id: "unit", label: "Temperature unit", kind: "string", enum: ["C", "F"] },
    {
      id: "renderedTemperature",
      label: "Rendered temperature",
      kind: "string",
    },
    {
      id: "requireDegreeSymbol",
      label: "Require degree symbol",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "expectedTemperature",
      label: "Expected temperature",
      kind: "string",
    },
    {
      id: "matchesExpected",
      label: "Matches expected temperature",
      kind: "boolean",
    },
  ],
  title: "Temperature Style",
});

export const run = tool.execute;
export default tool;
