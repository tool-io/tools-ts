import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualRespondedInvitations: number;
  readonly actualSentInvitations: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRespondedInvitations",
    label: "Actual responded invitations",
    kind: "number",
  },
  {
    id: "actualSentInvitations",
    label: "Actual sent invitations",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualSentInvitations, "total", 1, 1000000);
  bounded(
    input.actualRespondedInvitations,
    "part",
    0,
    input.actualSentInvitations,
  );
  nonnegative(input.actualRespondedInvitations, "numerator");
  positive(input.actualSentInvitations, "denominator");
  return {
    observedRatio:
      (100 * input.actualRespondedInvitations) / input.actualSentInvitations,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualRespondedInvitations: 2, actualSentInvitations: 4 },
  output: { result: { observedRatio: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/wedding-rsvp-rate",
  title: "Wedding RSVP Rate Calculator",
  description:
    "Actual responded/sent invitation RSVPpercentage, not accepted guest count or attendance forecast. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
