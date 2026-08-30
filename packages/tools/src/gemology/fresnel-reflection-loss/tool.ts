import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly incidentIndex: number;
  readonly transmittedIndex: number;
  readonly incidenceDegrees: number;
}>;
export type Output = Readonly<{
  readonly sPolarizedReflectance: number;
  readonly pPolarizedReflectance: number;
  readonly unpolarizedReflectance: number;
  readonly idealTransmittedEnergyFraction: number;
  readonly totalInternalReflection: boolean;
}>;
const inputFields = [
  { id: "incidentIndex", label: "Incident index", kind: "number" },
  { id: "transmittedIndex", label: "Transmitted index", kind: "number" },
  { id: "incidenceDegrees", label: "Incidence degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.incidentIndex, "incidentIndex");
  positive(input.transmittedIndex, "transmittedIndex");
  nonnegative(input.incidenceDegrees, "incidenceDegrees");
  if (input.incidenceDegrees >= 90)
    simpleError("incidence", "Incidence from normal in [0,90) required.");
  const i = (input.incidenceDegrees * Math.PI) / 180,
    s = (input.incidentIndex / input.transmittedIndex) * Math.sin(i);
  if (s >= 1)
    return {
      sPolarizedReflectance: 1,
      pPolarizedReflectance: 1,
      unpolarizedReflectance: 1,
      idealTransmittedEnergyFraction: 0,
      totalInternalReflection: true,
    };
  const ci = Math.cos(i),
    ct = Math.sqrt(1 - s * s),
    a = input.incidentIndex,
    b = input.transmittedIndex,
    rs = ((a * ci - b * ct) / (a * ci + b * ct)) ** 2,
    rp = ((b * ci - a * ct) / (b * ci + a * ct)) ** 2,
    r = (rs + rp) / 2;
  return {
    sPolarizedReflectance: rs,
    pPolarizedReflectance: rp,
    unpolarizedReflectance: r,
    idealTransmittedEnergyFraction: 1 - r,
    totalInternalReflection: false,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  incidentIndex: 1,
  transmittedIndex: 1.5,
  incidenceDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  sPolarizedReflectance: 0.04,
  pPolarizedReflectance: 0.04,
  unpolarizedReflectance: 0.04,
  idealTransmittedEnergyFraction: 0.96,
  totalInternalReflection: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/fresnel-reflection-loss",
  title: "Fresnel Reflection Loss",
  description:
    "Compute lossless real-index oblique Fresnel s/p energy reflection and transmission with explicit TIR; not normal-only lustre proxy, absorbing media or integrated gemstone light return.",
  inputs: inputFields,
  outputs: [
    {
      id: "sPolarizedReflectance",
      label: "S polarized reflectance",
      kind: "number",
    },
    {
      id: "pPolarizedReflectance",
      label: "P polarized reflectance",
      kind: "number",
    },
    {
      id: "unpolarizedReflectance",
      label: "Unpolarized reflectance",
      kind: "number",
    },
    {
      id: "idealTransmittedEnergyFraction",
      label: "Ideal transmitted energy fraction",
      kind: "number",
    },
    {
      id: "totalInternalReflection",
      label: "Total internal reflection",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      incidentIndex: value.incidentIndex as number,
      transmittedIndex: value.transmittedIndex as number,
      incidenceDegrees: value.incidenceDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
