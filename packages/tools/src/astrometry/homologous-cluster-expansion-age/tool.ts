import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly clusterRadiusParsecs: number;
  readonly expansionKmPerSecond: number;
}>;
export type Output = Readonly<{
  readonly expansionAgeMillionYears: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.clusterRadiusParsecs, "clusterRadiusParsecs");
  positive(input.expansionKmPerSecond, "expansionKmPerSecond");
  return {
    expansionAgeMillionYears:
      (input.clusterRadiusParsecs * 3.0856775814913673e13) /
      input.expansionKmPerSecond /
      31557600 /
      1e6,
  };
};
export const exampleInput = {
  clusterRadiusParsecs: 1,
  expansionKmPerSecond: 1,
} satisfies Input;
export const exampleOutput = {
  expansionAgeMillionYears: 0.9777922216807892,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/homologous-cluster-expansion-age",
  title: "Homologous Cluster Expansion Age",
  description:
    "Estimate a homologous ballistic expansion age from radius and outward speed; gravity, acceleration, projection and initial size are excluded.",
  inputs: [
    {
      id: "clusterRadiusParsecs",
      label: "Cluster radius parsecs",
      kind: "number",
    },
    {
      id: "expansionKmPerSecond",
      label: "Expansion km per second",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "expansionAgeMillionYears",
      label: "Expansion age million years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      clusterRadiusParsecs: value.clusterRadiusParsecs as number,
      expansionKmPerSecond: value.expansionKmPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
