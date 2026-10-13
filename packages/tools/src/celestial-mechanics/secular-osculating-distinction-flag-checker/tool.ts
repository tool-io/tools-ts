import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  mean,
  pick,
  unique,
} from "../batch52-shared.js";
export type Input = Readonly<{ readonly elementType: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "elementType", label: "Element type", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.elementType,
      {
        osculating:
          "Instantaneous conic tangent to state under a declared force/central-body convention.",
        mean: "Averaged elements defined by a particular theory/model; not uniquely interchangeable with osculating.",
        secular:
          "Long-term trend contribution; not itself a unique full element set.",
      },
      "elementType",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { elementType: "osculating" },
  output: {
    result: {
      reference:
        "Instantaneous conic tangent to state under a declared force/central-body convention.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/secular-osculating-distinction-flag-checker",
  title: "Secular vs Osculating Element Distinction Flag Checker",
  description:
    "Bounded declared orbital-element convention distinction, not automatic catalog interpretation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
