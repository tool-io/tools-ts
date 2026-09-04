import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly aarrrStage: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "aarrrStage", label: "Aarrr stage", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.aarrrStage,
      {
        acquisition: "new audience or prospects entering measured funnel",
        activation: "users experiencing independently defined initial value",
        retention: "users returning under defined cohort/window",
        referral: "users causing independently attributable new arrivals",
        revenue: "monetization under independently defined accounting measure",
      },
      "aarrrStage",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { aarrrStage: "retention" } satisfies Input;
export const exampleOutput = {
  meaning: "users returning under defined cohort/window",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/aarrr-pirate-metrics-funnel-stage-mapper",
  title: "Aarrr Pirate Metrics Funnel Stage Mapper",
  description:
    "NamedAARRRstage semantic lookup; caller measurement event mapping and denominators must be established separately. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ aarrrStage: value.aarrrStage as string }),
});
export const run = tool.execute;
export default tool;
