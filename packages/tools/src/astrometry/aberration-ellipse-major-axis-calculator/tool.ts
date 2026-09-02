import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, rad } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerAnnualAberrationConstantArcsec: number;
  readonly eclipticLatitudeDegrees: number;
}>;
export type Output = Readonly<{
  readonly ellipseMajorSemiaxisArcsec: number;
  readonly ellipseMinorSemiaxisArcsec: number;
}>;
const inputFields = [
  {
    id: "callerAnnualAberrationConstantArcsec",
    label: "Caller annual aberration constant arcsec",
    kind: "number",
  },
  {
    id: "eclipticLatitudeDegrees",
    label: "Ecliptic latitude degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerAnnualAberrationConstantArcsec,
    "callerAnnualAberrationConstantArcsec",
  );
  if (Math.abs(input.eclipticLatitudeDegrees) > 90)
    simpleError("latitude", "Celestial latitude−90..90°.");
  return {
    ellipseMajorSemiaxisArcsec: input.callerAnnualAberrationConstantArcsec,
    ellipseMinorSemiaxisArcsec:
      input.callerAnnualAberrationConstantArcsec *
      Math.abs(Math.sin(rad(input.eclipticLatitudeDegrees))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAnnualAberrationConstantArcsec: 20.49552,
  eclipticLatitudeDegrees: 30,
} satisfies Input;
export const exampleOutput = {
  ellipseMajorSemiaxisArcsec: 20.49552,
  ellipseMinorSemiaxisArcsec: 10.24776,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/aberration-ellipse-major-axis-calculator",
  title: "Aberration Displacement Ellipse Major Axis Arcsec Calculator",
  description:
    "First-order circular-orbit annual aberration ellipse semiaxes κandκ|sinβ|, major semi axis not full diameter. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "ellipseMajorSemiaxisArcsec",
      label: "Ellipse major semiaxis arcsec",
      kind: "number",
    },
    {
      id: "ellipseMinorSemiaxisArcsec",
      label: "Ellipse minor semiaxis arcsec",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAnnualAberrationConstantArcsec:
        value.callerAnnualAberrationConstantArcsec as number,
      eclipticLatitudeDegrees: value.eclipticLatitudeDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
