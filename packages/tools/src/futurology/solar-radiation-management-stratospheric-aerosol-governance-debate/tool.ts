import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Stratospheric aerosol solar-radiation modification raises governance, termination, distributional, environmental and security questions distinct from reducing greenhouse gases.",
        reference:
          "IPCC and National Academies solar-geoengineering assessment discussions.",
        limitations:
          "Overview only, no deployment instructions, endorsement or proof of net safety.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Stratospheric aerosol solar-radiation modification raises governance, termination, distributional, environmental and security questions distinct from reducing greenhouse gases.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/solar-radiation-management-stratospheric-aerosol-governance-debate",
  title: "Solar Radiation Management Stratospheric Aerosol Governance Debate",
  description:
    "Bounded offline reference: Stratospheric aerosol solar-radiation modification raises governance, termination, distributional, environmental and security questions distinct from reducing greenhouse gases. Source: IPCC and National Academies solar-geoengineering assessment discussions. Overview only, no deployment instructions, endorsement or proof of net safety. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
