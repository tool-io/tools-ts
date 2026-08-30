import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, count } from "../shared.js";

export type Input = Readonly<{
  readonly transconjugants: number;
  readonly assessedRecipients: number;
  readonly donorCells: number;
  readonly incubationHours: number;
}>;
export type Output = Readonly<{
  readonly recipientConversionFraction: number;
  readonly transferEventsPerDonorHour: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.transconjugants, "transconjugants");
  count(input.assessedRecipients, "assessedRecipients", 1);
  count(input.donorCells, "donorCells", 1);
  positive(input.incubationHours, "incubationHours");
  if (input.transconjugants > input.assessedRecipients)
    simpleError(
      "transconjugants",
      "Converted recipients cannot exceed assessed recipients.",
    );
  return {
    recipientConversionFraction:
      input.transconjugants / input.assessedRecipients,
    transferEventsPerDonorHour:
      input.transconjugants / (input.donorCells * input.incubationHours),
  };
};
export const exampleInput = {
  transconjugants: 20,
  assessedRecipients: 1000,
  donorCells: 500,
  incubationHours: 2,
} satisfies Input;
export const exampleOutput = {
  recipientConversionFraction: 0.02,
  transferEventsPerDonorHour: 0.02,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/conjugation-transfer-density",
  title: "Conjugation Transfer Density",
  description:
    "Compare observed recipient conversion and donor-time-normalized conjugation events; growth and secondary transfer are not corrected.",
  inputs: [
    {
      id: "transconjugants",
      label: "Transconjugants",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "assessedRecipients",
      label: "Assessed recipients",
      kind: "integer",
      minimum: 1,
    },
    { id: "donorCells", label: "Donor cells", kind: "integer", minimum: 1 },
    { id: "incubationHours", label: "Incubation hours", kind: "number" },
  ],
  outputs: [
    {
      id: "recipientConversionFraction",
      label: "Recipient conversion fraction",
      kind: "number",
    },
    {
      id: "transferEventsPerDonorHour",
      label: "Transfer events per donor hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      transconjugants: value.transconjugants as number,
      assessedRecipients: value.assessedRecipients as number,
      donorCells: value.donorCells as number,
      incubationHours: value.incubationHours as number,
    }),
});
export const run = tool.execute;
export default tool;
