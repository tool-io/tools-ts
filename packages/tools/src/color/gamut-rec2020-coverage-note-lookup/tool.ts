import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly coverageQuestion: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "coverageQuestion", label: "Coverage question", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.coverageQuestion,
      {
        "rec 2020-versus-srgb":
          "Rec.2020 specifies different RGB primaries; gamut inclusion is not a content coverage percentage",
        "coverage-percent":
          "A percentage requires a declared color volume/area metric, white point and sampled gamut boundary",
        hdr: "Rec.2020 primaries do not by themselves establish an HDR transfer function or luminance range",
      },
      "coverageQuestion",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  coverageQuestion: "coverage-percent",
} satisfies Input;
export const exampleOutput = {
  meaning:
    "A percentage requires a declared color volume/area metric, white point and sampled gamut boundary",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/gamut-rec2020-coverage-note-lookup",
  title: "Rec.2020 Coverage Note Lookup",
  description:
    "Rec.2020 coverage semantics, no fabricated universal gamut-coverage fraction. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ coverageQuestion: value.coverageQuestion as string }),
});
export const run = tool.execute;
export default tool;
