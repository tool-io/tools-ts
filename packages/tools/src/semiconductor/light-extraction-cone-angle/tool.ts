import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly verifiedEmissionMediumRefractiveIndex: number;
  readonly verifiedEscapeMediumRefractiveIndex: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "verifiedEmissionMediumRefractiveIndex",
    label: "Verified emission medium refractive index",
    kind: "number",
  },
  {
    id: "verifiedEscapeMediumRefractiveIndex",
    label: "Verified escape medium refractive index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.verifiedEmissionMediumRefractiveIndex, "inside-index");
  positive(input.verifiedEscapeMediumRefractiveIndex, "outside-index");
  if (
    input.verifiedEscapeMediumRefractiveIndex >
    input.verifiedEmissionMediumRefractiveIndex
  )
    simpleError("interface", "Declared TIRbranch requires nout≤nin.");
  return {
    conditionalCriticalConeHalfAngleDegrees:
      (180 / Math.PI) *
      Math.asin(
        input.verifiedEscapeMediumRefractiveIndex /
          input.verifiedEmissionMediumRefractiveIndex,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    verifiedEmissionMediumRefractiveIndex: 2,
    verifiedEscapeMediumRefractiveIndex: 1,
  },
  output: { result: { conditionalCriticalConeHalfAngleDegrees: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/light-extraction-cone-angle",
  title: "Semiconductor Light Extraction Cone Angle Calculator",
  description:
    "Ideal planar-interface total-internal-reflection escape-cone HALFangle arcsin(nout/nin); actual isotropic positive indices independently verified. Not Fresnel transmission, total LEDextraction efficiency or nanostructure scattering.",
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
