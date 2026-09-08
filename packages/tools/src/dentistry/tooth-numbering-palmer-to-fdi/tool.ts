import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, pick } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerIdentifiedPalmerQuadrant: string;
  readonly callerIdentifiedDentition: string;
  readonly palmerToothPosition: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIdentifiedPalmerQuadrant",
    label: "Caller identified palmer quadrant",
    kind: "string",
  },
  {
    id: "callerIdentifiedDentition",
    label: "Caller identified dentition",
    kind: "string",
  },
  { id: "palmerToothPosition", label: "Palmer tooth position", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const quadrant = Number(
    pick(
      input.callerIdentifiedPalmerQuadrant,
      {
        "upper-right": "1",
        "upper-left": "2",
        "lower-left": "3",
        "lower-right": "4",
      },
      "quadrant",
    ),
  );
  if (!["permanent", "primary"].includes(input.callerIdentifiedDentition))
    simpleError("dentition", "Explicitpermanent/primary.");
  const position =
    input.callerIdentifiedDentition === "primary"
      ? "ABCDE".indexOf(input.palmerToothPosition) + 1
      : Number(input.palmerToothPosition);
  if (
    !Number.isInteger(position) ||
    position < 1 ||
    position > (input.callerIdentifiedDentition === "primary" ? 5 : 8) ||
    input.palmerToothPosition.length !== 1
  )
    simpleError("position", "Actual valid Palmerposition.");
  return {
    fdiTooth:
      String(
        quadrant + (input.callerIdentifiedDentition === "primary" ? 4 : 0),
      ) + String(position),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIdentifiedPalmerQuadrant: "upper-right",
    callerIdentifiedDentition: "permanent",
    palmerToothPosition: "1",
  },
  output: { result: { fdiTooth: "11" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/tooth-numbering-palmer-to-fdi",
  title: "Palmer to FDI Numbering Converter",
  description:
    "Palmerquadrant/position to FDI using explicit patient-side quadrant, permanent1\u20138or primaryA\u2013E. No ambiguous glyph parsing, actual tooth detection or intervention.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
