import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly correctedFieldDiameterArcminutes: number;
  readonly scienceFieldDiameterArcminutes: number;
}>;
export type Output = Readonly<{
  readonly correctedAreaSquareArcminutes: number;
  readonly scienceAreaCoveragePercent: number;
  readonly diameterMarginArcminutes: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.scienceFieldDiameterArcminutes <= 0)
    simpleError(
      "scienceFieldDiameterArcminutes",
      "Science field diameter must be positive.",
      "invalid_field",
    );
  const correctedAreaSquareArcminutes =
    Math.PI * (input.correctedFieldDiameterArcminutes / 2) ** 2;
  const ratio =
    input.correctedFieldDiameterArcminutes /
    input.scienceFieldDiameterArcminutes;
  return {
    correctedAreaSquareArcminutes,
    scienceAreaCoveragePercent: Math.min(1, ratio * ratio) * 100,
    diameterMarginArcminutes:
      input.correctedFieldDiameterArcminutes -
      input.scienceFieldDiameterArcminutes,
  };
};

export const exampleInput = {
  correctedFieldDiameterArcminutes: 2,
  scienceFieldDiameterArcminutes: 4,
} satisfies Input;
export const exampleOutput = {
  correctedAreaSquareArcminutes: 3.141592653589793,
  scienceAreaCoveragePercent: 25,
  diameterMarginArcminutes: -2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      correctedFieldDiameterArcminutes:
        input.correctedFieldDiameterArcminutes as number,
      scienceFieldDiameterArcminutes:
        input.scienceFieldDiameterArcminutes as number,
    }),
  description: "Estimate MCAO corrected area and science-field coverage.",
  id: "laser/mcao-field-coverage",
  inputs: [
    {
      id: "correctedFieldDiameterArcminutes",
      label: "Corrected field diameter",
      kind: "number",
      minimum: 0,
      unit: "arcmin",
    },
    {
      id: "scienceFieldDiameterArcminutes",
      label: "Science field diameter",
      kind: "number",
      minimum: 0,
      unit: "arcmin",
    },
  ],
  outputs: [
    {
      id: "correctedAreaSquareArcminutes",
      label: "Corrected field area",
      kind: "number",
      minimum: 0,
      unit: "arcmin²",
    },
    {
      id: "scienceAreaCoveragePercent",
      label: "Science-field area covered",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "diameterMarginArcminutes",
      label: "Diameter margin",
      kind: "number",
      unit: "arcmin",
    },
  ],
  title: "MCAO Field Coverage",
});

export const run = tool.execute;
export default tool;
