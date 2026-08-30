import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly spacecraftKg: number;
  readonly dragCoefficient: number;
  readonly referenceAreaSquareMeters: number;
}>;
export type Output = Readonly<{
  readonly ballisticKgPerSquareMeter: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.spacecraftKg, "spacecraftKg");
  positive(input.dragCoefficient, "dragCoefficient");
  positive(input.referenceAreaSquareMeters, "referenceAreaSquareMeters");
  return {
    ballisticKgPerSquareMeter:
      input.spacecraftKg /
      (input.dragCoefficient * input.referenceAreaSquareMeters),
  };
};
export const exampleInput = {
  spacecraftKg: 100,
  dragCoefficient: 2,
  referenceAreaSquareMeters: 5,
} satisfies Input;
export const exampleOutput = { ballisticKgPerSquareMeter: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/entry-ballistic-coefficient",
  title: "Entry Ballistic Coefficient",
  description:
    "Compute the mass-to-drag-area ballistic coefficient from supplied aerodynamic reference quantities.",
  inputs: [
    { id: "spacecraftKg", label: "Spacecraft kg", kind: "number" },
    { id: "dragCoefficient", label: "Drag coefficient", kind: "number" },
    {
      id: "referenceAreaSquareMeters",
      label: "Reference area square meters",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "ballisticKgPerSquareMeter",
      label: "Ballistic kg per square meter",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      spacecraftKg: value.spacecraftKg as number,
      dragCoefficient: value.dragCoefficient as number,
      referenceAreaSquareMeters: value.referenceAreaSquareMeters as number,
    }),
});
export const run = tool.execute;
export default tool;
