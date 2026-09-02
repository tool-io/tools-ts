import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Shklovskys ostranenie describes making perception unfamiliar or difficult so it is renewed rather than automated.",
        reference: "Shklovsky, Art as Technique 1917.",
        limitations:
          "Device description, not proof of lasting cognitive benefit or every confusing text being art.",
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
      text: "Shklovskys ostranenie describes making perception unfamiliar or difficult so it is renewed rather than automated.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/ostranenie-defamiliarization-shklovsky-device-lookup",
  title: "Ostranenie Defamiliarization Shklovsky Device Lookup",
  description:
    "Bounded offline reference: Shklovskys ostranenie describes making perception unfamiliar or difficult so it is renewed rather than automated. Source: Shklovsky, Art as Technique 1917. Device description, not proof of lasting cognitive benefit or every confusing text being art. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
