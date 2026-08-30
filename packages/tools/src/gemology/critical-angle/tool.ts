import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly internalRefractiveIndex: number;
  readonly externalRefractiveIndex: number;
}>;
export type Output = Readonly<{
  readonly criticalInternalAngleDegrees: number;
}>;
const inputFields = [
  {
    id: "internalRefractiveIndex",
    label: "Internal refractive index",
    kind: "number",
  },
  {
    id: "externalRefractiveIndex",
    label: "External refractive index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.internalRefractiveIndex, "internalRefractiveIndex");
  positive(input.externalRefractiveIndex, "externalRefractiveIndex");
  if (input.internalRefractiveIndex <= input.externalRefractiveIndex)
    simpleError(
      "indices",
      "Higher internal optical index required for total internal reflection.",
    );
  return {
    criticalInternalAngleDegrees:
      (Math.asin(
        input.externalRefractiveIndex / input.internalRefractiveIndex,
      ) *
        180) /
      Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  internalRefractiveIndex: 2,
  externalRefractiveIndex: 1,
} satisfies Input;
export const exampleOutput = {
  criticalInternalAngleDegrees: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/critical-angle",
  title: "Critical Angle",
  description:
    "Resolve optical total-internal-reflection critical angle for a caller higher-to-lower-index interface; not seismic critical-angle appearance, prism/rainbow geometry or actual stone light return.",
  inputs: inputFields,
  outputs: [
    {
      id: "criticalInternalAngleDegrees",
      label: "Critical internal angle degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      internalRefractiveIndex: value.internalRefractiveIndex as number,
      externalRefractiveIndex: value.externalRefractiveIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
