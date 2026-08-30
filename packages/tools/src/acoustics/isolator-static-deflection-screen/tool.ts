import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly maximumNaturalFrequencyHertz: number;
  readonly staticDeflectionMillimeters: number;
}>;
export type Output = Readonly<{
  readonly estimatedNaturalFrequencyHertz: number;
  readonly meetsCallerMaximum: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.staticDeflectionMillimeters) ||
    input.staticDeflectionMillimeters <= 0
  )
    simpleError(
      "staticDeflectionMillimeters",
      "Static deflection must be finite and positive.",
      "invalid_deflection",
    );
  if (
    !Number.isFinite(input.maximumNaturalFrequencyHertz) ||
    input.maximumNaturalFrequencyHertz <= 0
  )
    simpleError(
      "maximumNaturalFrequencyHertz",
      "Maximum frequency must be finite and positive.",
      "invalid_frequency",
    );
  const estimatedNaturalFrequencyHertz =
    Math.sqrt(9.80665 / (input.staticDeflectionMillimeters / 1000)) /
    (2 * Math.PI);
  if (
    !Number.isFinite(estimatedNaturalFrequencyHertz) ||
    estimatedNaturalFrequencyHertz <= 0
  )
    simpleError(
      "staticDeflectionMillimeters",
      "Deflection produces an out-of-range natural frequency.",
      "numeric_overflow",
    );
  return {
    estimatedNaturalFrequencyHertz,
    meetsCallerMaximum:
      estimatedNaturalFrequencyHertz <= input.maximumNaturalFrequencyHertz,
  };
};

export const example = {
  input: { maximumNaturalFrequencyHertz: 4, staticDeflectionMillimeters: 25 },
  output: {
    estimatedNaturalFrequencyHertz: 3.152176050867292,
    meetsCallerMaximum: true,
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: { maximumNaturalFrequencyHertz: 4, staticDeflectionMillimeters: 1 },
  output: {
    estimatedNaturalFrequencyHertz: 15.760880254336461,
    meetsCallerMaximum: false,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      maximumNaturalFrequencyHertz:
        input.maximumNaturalFrequencyHertz as number,
      staticDeflectionMillimeters: input.staticDeflectionMillimeters as number,
    }),
  description:
    "Calculate the idealized vertical natural frequency from static deflection and compare it with an explicit caller maximum; real isolator selection still requires load and manufacturer data.",
  id: "acoustics/isolator-static-deflection-screen",
  inputs: [
    {
      id: "maximumNaturalFrequencyHertz",
      kind: "number",
      label: "Maximum natural frequency",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "staticDeflectionMillimeters",
      kind: "number",
      label: "Static deflection",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "estimatedNaturalFrequencyHertz",
      kind: "number",
      label: "Estimated natural frequency",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "meetsCallerMaximum",
      kind: "boolean",
      label: "Meets caller maximum",
    },
  ],
  title: "Isolator Static-Deflection Screen",
});

export const run = tool.execute;
export default tool;
