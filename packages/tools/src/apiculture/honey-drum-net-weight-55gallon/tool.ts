import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedDrumGrossLb: number;
  readonly observedDrumTareLb: number;
  readonly observedFilledCallerGallons: number;
  readonly callerNominalCapacityGallons: number;
}>;
export type Output = Readonly<{
  readonly observedNetHoneyLb: number;
  readonly observedFillCapacityFraction: number;
}>;
const inputFields = [
  {
    id: "observedDrumGrossLb",
    label: "Observed drum gross lb",
    kind: "number",
  },
  { id: "observedDrumTareLb", label: "Observed drum tare lb", kind: "number" },
  {
    id: "observedFilledCallerGallons",
    label: "Observed filled caller gallons",
    kind: "number",
  },
  {
    id: "callerNominalCapacityGallons",
    label: "Caller nominal capacity gallons",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerNominalCapacityGallons, "callerNominalCapacityGallons");
  nonnegative(input.observedDrumGrossLb, "observedDrumGrossLb");
  nonnegative(input.observedDrumTareLb, "observedDrumTareLb");
  nonnegative(input.observedFilledCallerGallons, "observedFilledCallerGallons");
  if (input.observedFilledCallerGallons > input.callerNominalCapacityGallons)
    simpleError("fill", "Filled≤verified nominal capacity.");
  return {
    observedNetHoneyLb: nonnegative(
      input.observedDrumGrossLb - input.observedDrumTareLb,
      "net honey",
    ),
    observedFillCapacityFraction:
      input.observedFilledCallerGallons / input.callerNominalCapacityGallons,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDrumGrossLb: 500,
  observedDrumTareLb: 50,
  observedFilledCallerGallons: 45,
  callerNominalCapacityGallons: 55,
} satisfies Input;
export const exampleOutput = {
  observedNetHoneyLb: 450,
  observedFillCapacityFraction: 0.8181818181818182,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/honey-drum-net-weight-55gallon",
  title: "Honey Drum Net Weight 55Gallon Calculator",
  description:
    "Actual drum tare-corrected net honey and measured fill/caller nominal capacity (55-gallon title not universal), not fixed density×nominal full drum. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedNetHoneyLb",
      label: "Observed net honey lb",
      kind: "number",
    },
    {
      id: "observedFillCapacityFraction",
      label: "Observed fill capacity fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDrumGrossLb: value.observedDrumGrossLb as number,
      observedDrumTareLb: value.observedDrumTareLb as number,
      observedFilledCallerGallons: value.observedFilledCallerGallons as number,
      callerNominalCapacityGallons:
        value.callerNominalCapacityGallons as number,
    }),
});
export const run = tool.execute;
export default tool;
