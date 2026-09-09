import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedDiametralFailureForceNewtons: number;
  readonly actualDiskDiameterMeters: number;
  readonly actualDiskThicknessMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedDiametralFailureForceNewtons",
    label: "Actual qualified diametral failure force newtons",
    kind: "number",
  },
  {
    id: "actualDiskDiameterMeters",
    label: "Actual disk diameter meters",
    kind: "number",
  },
  {
    id: "actualDiskThicknessMeters",
    label: "Actual disk thickness meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualQualifiedDiametralFailureForceNewtons, "load");
  positive(input.actualDiskDiameterMeters, "diameter");
  positive(input.actualDiskThicknessMeters, "thickness");
  return {
    conditionalBrazilianTensileStressPascals:
      (2 * input.actualQualifiedDiametralFailureForceNewtons) /
      (Math.PI *
        input.actualDiskDiameterMeters *
        input.actualDiskThicknessMeters),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedDiametralFailureForceNewtons: 3,
    actualDiskDiameterMeters: 2,
    actualDiskThicknessMeters: 1,
  },
  output: {
    result: { conditionalBrazilianTensileStressPascals: 0.954929658551372 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/geomechanics-brazilian-tensile-strength",
  title: "Geology Geomechanics Brazilian Tensile Strength Calculator",
  description:
    "Ideal Brazilianrockdisk diametral tensile stress2P/(\u03c0Dt), actual valid test/specimen and crack mode independently qualified. Not direct tensile strength, compressive stress or generalized anisotropic solution.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
