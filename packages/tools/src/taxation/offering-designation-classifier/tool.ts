import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly donorSpecifiedRecipient: boolean;
  readonly organizationRetainedControl: boolean;
  readonly paymentLinkedToServices: boolean;
}>;
export type Output = Readonly<{
  readonly classification: string;
}>;

export const calculate = (input: Input): Output => {
  const classification = input.paymentLinkedToServices
    ? "service-linked"
    : input.donorSpecifiedRecipient && !input.organizationRetainedControl
      ? "designated-controlled"
      : !input.donorSpecifiedRecipient && input.organizationRetainedControl
        ? "undesignated"
        : "needs-review";
  return { classification };
};

export const exampleInput = {
  donorSpecifiedRecipient: false,
  organizationRetainedControl: true,
  paymentLinkedToServices: false,
} satisfies Input;
export const exampleOutput = {
  classification: "undesignated",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      donorSpecifiedRecipient: input.donorSpecifiedRecipient as boolean,
      organizationRetainedControl: input.organizationRetainedControl as boolean,
      paymentLinkedToServices: input.paymentLinkedToServices as boolean,
    }),
  description:
    "Classify supplied offering-control indicators for review without deciding taxability.",
  id: "taxation/offering-designation-classifier",
  inputs: [
    {
      id: "donorSpecifiedRecipient",
      label: "Donor specified a recipient",
      kind: "boolean",
    },
    {
      id: "organizationRetainedControl",
      label: "Organization retained discretion and control",
      kind: "boolean",
    },
    {
      id: "paymentLinkedToServices",
      label: "Payment linked to services",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "classification",
      label: "Offering classification",
      kind: "string",
      enum: [
        "designated-controlled",
        "undesignated",
        "service-linked",
        "needs-review",
      ],
    },
  ],
  title: "Offering Designation Classifier",
});

export const run = tool.execute;
export default tool;
