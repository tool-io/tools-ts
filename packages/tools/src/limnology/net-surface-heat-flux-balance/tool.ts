import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly downwardShortwaveWm2: number;
  readonly downwardLongwaveWm2: number;
  readonly upwardLongwaveWm2: number;
  readonly upwardSensibleWm2: number;
  readonly upwardLatentWm2: number;
  readonly independentStorageFluxWm2: number;
}>;
export type Output = Readonly<{
  readonly signedNetDownwardSurfaceHeatFluxWm2: number;
  readonly observedStorageMinusSurfaceResidualWm2: number;
}>;
const inputFields = [
  {
    id: "downwardShortwaveWm2",
    label: "Downward shortwave wm2",
    kind: "number",
  },
  { id: "downwardLongwaveWm2", label: "Downward longwave wm2", kind: "number" },
  { id: "upwardLongwaveWm2", label: "Upward longwave wm2", kind: "number" },
  { id: "upwardSensibleWm2", label: "Upward sensible wm2", kind: "number" },
  { id: "upwardLatentWm2", label: "Upward latent wm2", kind: "number" },
  {
    id: "independentStorageFluxWm2",
    label: "Independent storage flux wm2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const net =
    input.downwardShortwaveWm2 +
    input.downwardLongwaveWm2 -
    input.upwardLongwaveWm2 -
    input.upwardSensibleWm2 -
    input.upwardLatentWm2;
  return {
    signedNetDownwardSurfaceHeatFluxWm2: net,
    observedStorageMinusSurfaceResidualWm2:
      input.independentStorageFluxWm2 - net,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  downwardShortwaveWm2: 100,
  downwardLongwaveWm2: 30,
  upwardLongwaveWm2: 50,
  upwardSensibleWm2: 10,
  upwardLatentWm2: 20,
  independentStorageFluxWm2: 40,
} satisfies Input;
export const exampleOutput = {
  signedNetDownwardSurfaceHeatFluxWm2: 50,
  observedStorageMinusSurfaceResidualWm2: -10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/net-surface-heat-flux-balance",
  title: "Net Surface Heat Flux Balance Calculator",
  description:
    "Reconcile separately measured surface fluxes and storage residual under downward-positive radiation/upward-positive turbulent convention; signed turbulent condensation retained, unmodeled advection may contribute residual.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedNetDownwardSurfaceHeatFluxWm2",
      label: "Signed net downward surface heat flux wm2",
      kind: "number",
    },
    {
      id: "observedStorageMinusSurfaceResidualWm2",
      label: "Observed storage minus surface residual wm2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      downwardShortwaveWm2: value.downwardShortwaveWm2 as number,
      downwardLongwaveWm2: value.downwardLongwaveWm2 as number,
      upwardLongwaveWm2: value.upwardLongwaveWm2 as number,
      upwardSensibleWm2: value.upwardSensibleWm2 as number,
      upwardLatentWm2: value.upwardLatentWm2 as number,
      independentStorageFluxWm2: value.independentStorageFluxWm2 as number,
    }),
});
export const run = tool.execute;
export default tool;
