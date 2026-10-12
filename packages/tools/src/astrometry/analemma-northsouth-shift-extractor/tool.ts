import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, angle } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly observedSolarDeclinationDegrees: number;
  readonly referenceDeclinationDegrees: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "observedSolarDeclinationDegrees",
    label: "Observed solar declination degrees",
    kind: "number",
  },
  {
    id: "referenceDeclinationDegrees",
    label: "Reference declination degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  angle(i.observedSolarDeclinationDegrees, "declination", -90, 90);
  angle(i.referenceDeclinationDegrees, "reference", -90, 90);
  return {
    signedNorthSouthDegrees:
      i.observedSolarDeclinationDegrees - i.referenceDeclinationDegrees,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    observedSolarDeclinationDegrees: 10,
    referenceDeclinationDegrees: -5,
  },
  output: { result: { signedNorthSouthDegrees: 15 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/analemma-northsouth-shift-extractor",
  title: "Analemma North-South Shift Degree Component Extractor",
  description:
    "Signed declination component displacement from caller solar positions; not full local apparent analemma coordinates.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { signedNorthSouthDegrees: { type: "number" } },
        required: ["signedNorthSouthDegrees"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
