import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { fraction } from "../shared.js";

export type Input = Readonly<{
  readonly hostToVectorFraction: number;
  readonly vectorSurvivalFraction: number;
  readonly vectorToNewHostFraction: number;
}>;
export type Output = Readonly<{
  readonly transmissionChainFraction: number;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.hostToVectorFraction, "hostToVectorFraction");
  fraction(input.vectorSurvivalFraction, "vectorSurvivalFraction");
  fraction(input.vectorToNewHostFraction, "vectorToNewHostFraction");
  return {
    transmissionChainFraction:
      input.hostToVectorFraction *
      input.vectorSurvivalFraction *
      input.vectorToNewHostFraction,
  };
};
export const exampleInput = {
  hostToVectorFraction: 0.5,
  vectorSurvivalFraction: 0.8,
  vectorToNewHostFraction: 0.25,
} satisfies Input;
export const exampleOutput = {
  transmissionChainFraction: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/reservoir-transmission-index",
  title: "Reservoir Transmission Index",
  description:
    "Combine explicitly supplied conditional host-vector-host transmission and vector-survival fractions.",
  inputs: [
    {
      id: "hostToVectorFraction",
      label: "Host to vector fraction",
      kind: "number",
    },
    {
      id: "vectorSurvivalFraction",
      label: "Vector survival fraction",
      kind: "number",
    },
    {
      id: "vectorToNewHostFraction",
      label: "Vector to new host fraction",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "transmissionChainFraction",
      label: "Transmission chain fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      hostToVectorFraction: value.hostToVectorFraction as number,
      vectorSurvivalFraction: value.vectorSurvivalFraction as number,
      vectorToNewHostFraction: value.vectorToNewHostFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
