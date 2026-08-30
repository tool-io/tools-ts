import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly observedSurfaceTemperatureK: number;
  readonly observedOutgoingLongwaveWPerM2: number;
  readonly stefanBoltzmannWPerM2K4: number;
}>;
export type Output = Readonly<{
  readonly blackbodyEquivalentEmissionTemperatureK: number;
  readonly observedSurfaceEmissionTemperatureDifferenceK: number;
}>;
const inputFields = [
  {
    id: "observedSurfaceTemperatureK",
    label: "Observed surface temperature k",
    kind: "number",
  },
  {
    id: "observedOutgoingLongwaveWPerM2",
    label: "Observed outgoing longwave w per m2",
    kind: "number",
  },
  {
    id: "stefanBoltzmannWPerM2K4",
    label: "Stefan boltzmann w per m2 k4",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedSurfaceTemperatureK, "observedSurfaceTemperatureK");
  positive(input.stefanBoltzmannWPerM2K4, "stefanBoltzmannWPerM2K4");
  nonnegative(
    input.observedOutgoingLongwaveWPerM2,
    "observedOutgoingLongwaveWPerM2",
  );
  const blackbodyEquivalentEmissionTemperatureK =
    (input.observedOutgoingLongwaveWPerM2 / input.stefanBoltzmannWPerM2K4) **
    0.25;
  return {
    blackbodyEquivalentEmissionTemperatureK,
    observedSurfaceEmissionTemperatureDifferenceK:
      input.observedSurfaceTemperatureK -
      blackbodyEquivalentEmissionTemperatureK,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSurfaceTemperatureK: 300,
  observedOutgoingLongwaveWPerM2: 221.4990007421875,
  stefanBoltzmannWPerM2K4: 5.670374419e-8,
} satisfies Input;
export const exampleOutput = {
  blackbodyEquivalentEmissionTemperatureK: 250,
  observedSurfaceEmissionTemperatureDifferenceK: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/greenhouse-enhancement-delta",
  title: "Greenhouse Effect Enhancement Delta",
  description:
    "Compare actual supplied surface temperature against measured outgoing-longwave blackbody-equivalent emission temperature; unlike solar equilibrium temperature, no absorbed/OLR equality or causal greenhouse attribution is assumed.",
  inputs: inputFields,
  outputs: [
    {
      id: "blackbodyEquivalentEmissionTemperatureK",
      label: "Blackbody equivalent emission temperature k",
      kind: "number",
    },
    {
      id: "observedSurfaceEmissionTemperatureDifferenceK",
      label: "Observed surface emission temperature difference k",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSurfaceTemperatureK: value.observedSurfaceTemperatureK as number,
      observedOutgoingLongwaveWPerM2:
        value.observedOutgoingLongwaveWPerM2 as number,
      stefanBoltzmannWPerM2K4: value.stefanBoltzmannWPerM2K4 as number,
    }),
});
export const run = tool.execute;
export default tool;
