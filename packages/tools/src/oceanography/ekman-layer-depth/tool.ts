import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly verticalEddyViscosityM2PerSecond: number;
  readonly signedCoriolisPerSecond: number;
}>;
export type Output = Readonly<{
  readonly eFoldingDepthM: number;
  readonly conventionalPiEkmanDepthM: number;
}>;
const inputFields = [
  {
    id: "verticalEddyViscosityM2PerSecond",
    label: "Vertical eddy viscosity m2 per second",
    kind: "number",
  },
  {
    id: "signedCoriolisPerSecond",
    label: "Signed coriolis per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.verticalEddyViscosityM2PerSecond,
    "verticalEddyViscosityM2PerSecond",
  );
  const f = positive(
      Math.abs(input.signedCoriolisPerSecond),
      "signedCoriolisPerSecond",
    ),
    eFoldingDepthM = Math.sqrt(
      (2 * input.verticalEddyViscosityM2PerSecond) / f,
    );
  return {
    eFoldingDepthM,
    conventionalPiEkmanDepthM: Math.PI * eFoldingDepthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  verticalEddyViscosityM2PerSecond: 0.01,
  signedCoriolisPerSecond: 0.0001,
} satisfies Input;
export const exampleOutput = {
  eFoldingDepthM: 14.142135623730951,
  conventionalPiEkmanDepthM: 44.42882938158366,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/ekman-layer-depth",
  title: "Ekman Layer Depth",
  description:
    "Distinguish constant-viscosity Ekman e-folding and conventional pi depth using supplied signed Coriolis, without latitude conversion; equatorial approximation is unsupported.",
  inputs: inputFields,
  outputs: [
    { id: "eFoldingDepthM", label: "E folding depth m", kind: "number" },
    {
      id: "conventionalPiEkmanDepthM",
      label: "Conventional pi ekman depth m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      verticalEddyViscosityM2PerSecond:
        value.verticalEddyViscosityM2PerSecond as number,
      signedCoriolisPerSecond: value.signedCoriolisPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
