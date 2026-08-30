import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly unprotectedExposure: number;
  readonly permissibleExposure: number;
}>;
export type Output = Readonly<{
  readonly requiredOpticalDensity: number;
  readonly attenuationFactor: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.permissibleExposure <= 0)
    simpleError(
      "permissibleExposure",
      "Permissible exposure must be positive.",
      "invalid_denominator",
    );
  const attenuationFactor = Math.max(
    1,
    input.unprotectedExposure / input.permissibleExposure,
  );
  return {
    requiredOpticalDensity: Math.log10(attenuationFactor),
    attenuationFactor,
  };
};

export const exampleInput = {
  unprotectedExposure: 1000,
  permissibleExposure: 1,
} satisfies Input;
export const exampleOutput = {
  requiredOpticalDensity: 3,
  attenuationFactor: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      unprotectedExposure: input.unprotectedExposure as number,
      permissibleExposure: input.permissibleExposure as number,
    }),
  description:
    "Calculate required optical density from unprotected and permissible exposure values in matching units.",
  id: "laser/required-optical-density",
  inputs: [
    {
      id: "unprotectedExposure",
      label: "Unprotected exposure",
      kind: "number",
      minimum: 0,
    },
    {
      id: "permissibleExposure",
      label: "Permissible exposure",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "requiredOpticalDensity",
      label: "Required optical density",
      kind: "number",
      minimum: 0,
    },
    {
      id: "attenuationFactor",
      label: "Required attenuation factor",
      kind: "number",
      minimum: 1,
    },
  ],
  title: "Required Optical Density",
});

export const run = tool.execute;
export default tool;
