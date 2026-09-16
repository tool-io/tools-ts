import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, exactLookup } from "../batch53-shared.js";

export type Input = Readonly<{ key: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    reference: exactLookup(i.key, {
      architecture:
        "Interband cascade lasers combine interband emission with cascade carrier reuse in the mid-infrared; actual room-temperature power and efficiency depend on device and operating mode.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "architecture" },
  output: {
    result: {
      reference:
        "Interband cascade lasers combine interband emission with cascade carrier reuse in the mid-infrared; actual room-temperature power and efficiency depend on device and operating mode.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "laser/interband-cascade-laser-icl-room-temp-low-power-mid-infrared-advantage",
  title:
    "Interband cascade laser ICL room temp low power mid infrared advantage",
  description:
    "Explain the ICL architecture without universal performance claims. Bounded exact-key educational reference only; observations and applicability must be established independently.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
