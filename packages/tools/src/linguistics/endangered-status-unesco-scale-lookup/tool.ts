import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly unescoTransmissionCategory: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  {
    id: "unescoTransmissionCategory",
    label: "Unesco transmission category",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.unescoTransmissionCategory,
      {
        safe: "intergenerational transmission not interrupted",
        vulnerable:
          "most children speak it, use may be restricted to certain domains",
        "definitely-endangered":
          "children no longer learn it as mother tongue at home",
        "severely-endangered":
          "spoken by grandparents; parents may understand but do not transmit",
        "critically-endangered":
          "youngest speakers are grandparents and older, use partial or infrequent",
        extinct: "no speakers left under the specified assessment",
      },
      "unescoTransmissionCategory",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  unescoTransmissionCategory: "definitely-endangered",
} satisfies Input;
export const exampleOutput = {
  meaning: "children no longer learn it as mother tongue at home",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/endangered-status-unesco-scale-lookup",
  title: "UNESCO Endangerment Scale Lookup",
  description:
    "UNESCO transmission-category descriptor for independently assigned assessment, not diagnose endangerment from speaker count. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({
      unescoTransmissionCategory: value.unescoTransmissionCategory as string,
    }),
});
export const run = tool.execute;
export default tool;
