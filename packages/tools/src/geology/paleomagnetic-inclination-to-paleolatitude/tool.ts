import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyCorrectedInclinationDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyCorrectedInclinationDegrees",
    label: "Actual independently corrected inclination degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (Math.abs(input.actualIndependentlyCorrectedInclinationDegrees) > 90)
    simpleError("inclination", "Signed inclination−90…90 degrees.");
  return {
    conditionalGeocentricAxialDipolePaleolatitudeDegrees:
      (Math.atan(
        0.5 *
          Math.tan(
            (input.actualIndependentlyCorrectedInclinationDegrees * Math.PI) /
              180,
          ),
      ) *
        180) /
      Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIndependentlyCorrectedInclinationDegrees: 45 },
  output: {
    result: {
      conditionalGeocentricAxialDipolePaleolatitudeDegrees: 26.56505117707799,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/paleomagnetic-inclination-to-paleolatitude",
  title: "Geology Paleomagnetic Inclination To Paleolatitude Calculator",
  description:
    "Ideal GADtanI=2tan\u03bbpaleolatitude signed branch, actual independently corrected inclination. Hemisphere/reversal convention, flattening, tectonic rotation and nondipole field external; not full pole position.",
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
