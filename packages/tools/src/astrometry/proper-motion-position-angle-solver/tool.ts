import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, deg, wrap } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly eastRaStarMasPerYear: number;
  readonly northDecMasPerYear: number;
}>;
export type Output = Readonly<{
  readonly positionAngleEastOfNorthDegrees: number;
}>;
const inputFields = [
  {
    id: "eastRaStarMasPerYear",
    label: "East ra star mas per year",
    kind: "number",
  },
  { id: "northDecMasPerYear", label: "North dec mas per year", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (Math.hypot(input.eastRaStarMasPerYear, input.northDecMasPerYear) === 0)
    simpleError("motion", "Nonzero proper-motion direction.");
  return {
    positionAngleEastOfNorthDegrees: wrap(
      deg(Math.atan2(input.eastRaStarMasPerYear, input.northDecMasPerYear)),
      360,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eastRaStarMasPerYear: 1,
  northDecMasPerYear: 0,
} satisfies Input;
export const exampleOutput = {
  positionAngleEastOfNorthDegrees: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/proper-motion-position-angle-solver",
  title: "Proper Motion Position Angle Solver from Components",
  description:
    "Proper-motion position angle north-through-east, reject zero-vector undefined direction. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "positionAngleEastOfNorthDegrees",
      label: "Position angle east of north degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eastRaStarMasPerYear: value.eastRaStarMasPerYear as number,
      northDecMasPerYear: value.northDecMasPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
