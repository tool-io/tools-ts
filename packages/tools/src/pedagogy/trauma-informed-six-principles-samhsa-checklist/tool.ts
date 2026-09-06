import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly samhsaPrinciple: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "samhsaPrinciple", label: "Samhsa principle", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.samhsaPrinciple,
      {
        safety: "physical and psychological safety",
        "trust-transparency": "trustworthiness and transparency",
        "peer-support": "peer support",
        collaboration: "collaboration and mutuality",
        empowerment: "empowerment, voice and choice",
        "cultural-context": "cultural, historical and gender issues",
      },
      "samhsaPrinciple",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { samhsaPrinciple: "empowerment" } satisfies Input;
export const exampleOutput = {
  meaning: "empowerment, voice and choice",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/trauma-informed-six-principles-samhsa-checklist",
  title: "Trauma Informed Six Principles Samhsa Checklist",
  description:
    "Named SAMHSA trauma-informed approach six principle descriptors, not clinical trauma diagnosis or training certification. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ samhsaPrinciple: value.samhsaPrinciple as string }),
});
export const run = tool.execute;
export default tool;
