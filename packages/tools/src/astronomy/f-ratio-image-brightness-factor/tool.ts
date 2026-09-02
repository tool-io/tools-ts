import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly firstFNumber: number;
  readonly secondFNumber: number;
}>;
export type Output = Readonly<{
  readonly firstOverSecondExtendedSourceIrradiance: number;
}>;
const inputFields = [
  { id: "firstFNumber", label: "First f number", kind: "number" },
  { id: "secondFNumber", label: "Second f number", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.firstFNumber, "firstFNumber");
  positive(input.secondFNumber, "secondFNumber");
  return {
    firstOverSecondExtendedSourceIrradiance:
      (input.secondFNumber / input.firstFNumber) ** 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstFNumber: 2,
  secondFNumber: 4,
} satisfies Input;
export const exampleOutput = {
  firstOverSecondExtendedSourceIrradiance: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/f-ratio-image-brightness-factor",
  title: "F-Ratio Image Brightness Factor",
  description:
    "Same extended-source radiance/detector/throughput irradiance ratio under f-number²model, not point-source aperture photon ratio. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstOverSecondExtendedSourceIrradiance",
      label: "First over second extended source irradiance",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstFNumber: value.firstFNumber as number,
      secondFNumber: value.secondFNumber as number,
    }),
});
export const run = tool.execute;
export default tool;
