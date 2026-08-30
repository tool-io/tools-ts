import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { count, positive } from "../shared.js";

export type Input = Readonly<{
  readonly mitesCounted: number;
  readonly scrapedAreaCm2: number;
}>;
export type Output = Readonly<{
  readonly mitesPerCm2: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.mitesCounted, "mitesCounted");
  positive(input.scrapedAreaCm2, "scrapedAreaCm2");
  return { mitesPerCm2: input.mitesCounted / input.scrapedAreaCm2 };
};
export const exampleInput = {
  mitesCounted: 20,
  scrapedAreaCm2: 2,
} satisfies Input;
export const exampleOutput = { mitesPerCm2: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/skin-scraping-mite-density",
  title: "Skin Scraping Mite Density",
  description: "Normalize observed mites by measured skin-scraping area.",
  inputs: [
    { id: "mitesCounted", label: "Mites counted", kind: "integer" },
    { id: "scrapedAreaCm2", label: "Scraped area cm 2", kind: "number" },
  ],
  outputs: [{ id: "mitesPerCm2", label: "Mites per cm 2", kind: "number" }],
  calculate: (value) =>
    calculate({
      mitesCounted: value.mitesCounted as number,
      scrapedAreaCm2: value.scrapedAreaCm2 as number,
    }),
});
export const run = tool.execute;
export default tool;
