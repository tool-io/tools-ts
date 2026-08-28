import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const JouleThomsonInversionTool = createSimpleTool({
  id: "chemistry/joule-thomson-inversion",
  title: "Joule-Thomson Inversion Calculator",
  description: "Estimate Joule-Thomson inversion temperature Ti = 2a/(Rb).",
  inputs: [
    {
      id: "aAtmL2PerMol2",
      label: "a constant",
      kind: "number",
      minimum: 0,
      unit: "atm*L2/mol2",
    },
    {
      id: "bLPerMol",
      label: "b constant",
      kind: "number",
      minimum: 0,
      unit: "L/mol",
    },
  ],
  outputs: [
    {
      id: "inversionTemperatureK",
      label: "Inversion temperature",
      kind: "number",
      unit: "K",
    },
  ],
  calculate: (input) => {
    const b = input.bLPerMol as number;
    if (b === 0) simpleError("bLPerMol", "Cannot be zero.", "invalid_b");
    return {
      inversionTemperatureK:
        (2 * (input.aAtmL2PerMol2 as number)) / (0.08206 * b),
    };
  },
});
export default JouleThomsonInversionTool;
export const runJouleThomsonInversion = JouleThomsonInversionTool.execute;

export type JouleThomsonInversionInput = {
  readonly aAtmL2PerMol2: number;
  readonly bLPerMol: number;
};

export type JouleThomsonInversionOutput = {
  readonly inversionTemperatureK: number;
};

export const jouleThomsonInversionExample = {
  input: {
    aAtmL2PerMol2: 1,
    bLPerMol: 1,
  },
  output: {
    inversionTemperatureK: 24.372410431391668,
  },
} satisfies ToolExample<
  JouleThomsonInversionInput,
  JouleThomsonInversionOutput
>;
