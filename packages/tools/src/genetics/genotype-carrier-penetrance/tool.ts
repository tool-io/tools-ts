import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly genotypeCarriers: number;
  readonly expressiveCarriers: number;
}>;
export type Output = Readonly<{
  readonly penetrancePercent: number;
  readonly nonexpressiveCarriers: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.genotypeCarriers, "genotypeCarriers", 1);
  count(input.expressiveCarriers, "expressiveCarriers");
  if (input.expressiveCarriers > input.genotypeCarriers)
    simpleError(
      "expressiveCarriers",
      "Expressive carriers cannot exceed assessed genotype carriers.",
    );
  return {
    penetrancePercent:
      (100 * input.expressiveCarriers) / input.genotypeCarriers,
    nonexpressiveCarriers: input.genotypeCarriers - input.expressiveCarriers,
  };
};
export const exampleInput = {
  genotypeCarriers: 100,
  expressiveCarriers: 80,
} satisfies Input;
export const exampleOutput = {
  penetrancePercent: 80,
  nonexpressiveCarriers: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/genotype-carrier-penetrance",
  title: "Genotype Carrier Penetrance",
  description:
    "Estimate observed penetrance among assessed carriers of a defined genotype.",
  inputs: [
    { id: "genotypeCarriers", label: "Genotype carriers", kind: "integer" },
    { id: "expressiveCarriers", label: "Expressive carriers", kind: "integer" },
  ],
  outputs: [
    { id: "penetrancePercent", label: "Penetrance percent", kind: "number" },
    {
      id: "nonexpressiveCarriers",
      label: "Nonexpressive carriers",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      genotypeCarriers: value.genotypeCarriers as number,
      expressiveCarriers: value.expressiveCarriers as number,
    }),
});
export const run = tool.execute;
export default tool;
