import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, aligned, eccentricity } from "../shared.js";

export type Input = Readonly<{
  readonly elementNames: readonly string[];
  readonly elementValues: readonly number[];
}>;
export type Output = Readonly<{
  readonly complete: boolean;
  readonly missingElements: readonly string[];
  readonly singularAngleElements: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.elementNames, input.elementValues, "elementNames");
  const required = ["a", "e", "i", "raan", "argp", "meanAnomaly"],
    lookup = new Map(
      input.elementNames.map((v, i) => [v, input.elementValues[i]]),
    );
  if (
    lookup.size !== input.elementNames.length ||
    input.elementNames.some((v) => !required.includes(v))
  )
    simpleError(
      "elementNames",
      "Distinct canonical a/e/i/raan/argp/meanAnomaly names required.",
    );
  const missingElements = required.filter((v) => !lookup.has(v));
  if (lookup.has("a")) positive(lookup.get("a")!, "elementValues");
  if (lookup.has("e")) eccentricity(lookup.get("e")!);
  if (lookup.has("i") && (lookup.get("i")! < 0 || lookup.get("i")! > 180))
    simpleError("elementValues", "Inclination must lie within [0,180].");
  const singularAngleElements: string[] = [];
  if (lookup.get("e") === 0) singularAngleElements.push("argp");
  if (lookup.get("i") === 0 || lookup.get("i") === 180)
    singularAngleElements.push("raan");
  return {
    complete: missingElements.length === 0,
    missingElements,
    singularAngleElements,
  };
};
export const exampleInput = {
  elementNames: ["a", "e", "i", "raan", "argp", "meanAnomaly"],
  elementValues: [10, 0.2, 30, 0, 45, 90],
} satisfies Input;
export const exampleOutput = {
  complete: true,
  missingElements: [],
  singularAngleElements: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/orbital-element-set-audit",
  title: "Orbital Element Set Audit",
  description:
    "Audit named elliptic elements and flag undefined periapsis/node angles in circular/equatorial cases; completeness is not dynamical validity.",
  inputs: [
    { id: "elementNames", label: "Element names", kind: "stringList" },
    { id: "elementValues", label: "Element values", kind: "numberList" },
  ],
  outputs: [
    { id: "complete", label: "Complete", kind: "boolean" },
    { id: "missingElements", label: "Missing elements", kind: "stringList" },
    {
      id: "singularAngleElements",
      label: "Singular angle elements",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      elementNames: value.elementNames as readonly string[],
      elementValues: value.elementValues as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
