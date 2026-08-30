import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly plannedOreTonnes: number;
  readonly extractedOreTonnes: number;
  readonly extractedDiluentTonnes: number;
}>;
export type Output = Readonly<{
  readonly oreRecoveryPercent: number;
  readonly oreLossTonnes: number;
  readonly minedTotalTonnes: number;
}>;
const inputFields = [
  { id: "plannedOreTonnes", label: "Planned ore tonnes", kind: "number" },
  { id: "extractedOreTonnes", label: "Extracted ore tonnes", kind: "number" },
  {
    id: "extractedDiluentTonnes",
    label: "Extracted diluent tonnes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.plannedOreTonnes, "plannedOreTonnes");
  nonnegative(input.extractedOreTonnes, "extractedOreTonnes");
  nonnegative(input.extractedDiluentTonnes, "extractedDiluentTonnes");
  if (input.extractedOreTonnes > input.plannedOreTonnes)
    simpleError(
      "extractedOreTonnes",
      "Recovered ore cannot exceed matched inventory.",
    );
  return {
    oreRecoveryPercent:
      (100 * input.extractedOreTonnes) / input.plannedOreTonnes,
    oreLossTonnes: input.plannedOreTonnes - input.extractedOreTonnes,
    minedTotalTonnes: input.extractedOreTonnes + input.extractedDiluentTonnes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  plannedOreTonnes: 1000,
  extractedOreTonnes: 900,
  extractedDiluentTonnes: 100,
} satisfies Input;
export const exampleOutput = {
  oreRecoveryPercent: 90,
  oreLossTonnes: 100,
  minedTotalTonnes: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/mining-recovery-percentage",
  title: "Mining Recovery Percentage",
  description:
    "Reconcile matched ore inventory, recovered ore and separate diluent; excludes processing recovery and requires comparable dry-tonnage definitions.",
  inputs: inputFields,
  outputs: [
    { id: "oreRecoveryPercent", label: "Ore recovery percent", kind: "number" },
    { id: "oreLossTonnes", label: "Ore loss tonnes", kind: "number" },
    { id: "minedTotalTonnes", label: "Mined total tonnes", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      plannedOreTonnes: value.plannedOreTonnes as number,
      extractedOreTonnes: value.extractedOreTonnes as number,
      extractedDiluentTonnes: value.extractedDiluentTonnes as number,
    }),
});
export const run = tool.execute;
export default tool;
