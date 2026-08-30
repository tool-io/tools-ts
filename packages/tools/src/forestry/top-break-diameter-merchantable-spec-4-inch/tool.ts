import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  crossing,
} from "../shared.js";
export type Input = Readonly<{
  readonly profileHeightsM: readonly number[];
  readonly measuredDiametersCm: readonly number[];
  readonly callerTopSpecificationInches: number;
}>;
export type Output = Readonly<{
  readonly specificationDiameterCm: number;
  readonly uniqueMerchantableTopHeightM: number;
}>;
const inputFields = [
  { id: "profileHeightsM", label: "Profile heights m", kind: "numberList" },
  {
    id: "measuredDiametersCm",
    label: "Measured diameters cm",
    kind: "numberList",
  },
  {
    id: "callerTopSpecificationInches",
    label: "Caller top specification inches",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerTopSpecificationInches, "callerTopSpecificationInches");
  input.profileHeightsM.forEach((v) => nonnegative(v, "profileHeightsM"));
  input.measuredDiametersCm.forEach((v) =>
    nonnegative(v, "measuredDiametersCm"),
  );
  const specificationDiameterCm = input.callerTopSpecificationInches * 2.54;
  return {
    specificationDiameterCm,
    uniqueMerchantableTopHeightM: crossing(
      input.profileHeightsM,
      input.measuredDiametersCm,
      specificationDiameterCm,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  profileHeightsM: [0, 10, 20],
  measuredDiametersCm: [30, 20, 10],
  callerTopSpecificationInches: 4,
} satisfies Input;
export const exampleOutput = {
  specificationDiameterCm: 10.16,
  uniqueMerchantableTopHeightM: 19.84,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/top-break-diameter-merchantable-spec-4-inch",
  title: "Merchantable Top Break 4-Inch Spec",
  description:
    "Locate a unique measured stem-profile crossing of caller top diameter in inches (four-inch example), converting exactly 2.54 cm/in; no extrapolated taper, invented plateau height or automatic merchantability.",
  inputs: inputFields,
  outputs: [
    {
      id: "specificationDiameterCm",
      label: "Specification diameter cm",
      kind: "number",
    },
    {
      id: "uniqueMerchantableTopHeightM",
      label: "Unique merchantable top height m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      profileHeightsM: value.profileHeightsM as readonly number[],
      measuredDiametersCm: value.measuredDiametersCm as readonly number[],
      callerTopSpecificationInches:
        value.callerTopSpecificationInches as number,
    }),
});
export const run = tool.execute;
export default tool;
