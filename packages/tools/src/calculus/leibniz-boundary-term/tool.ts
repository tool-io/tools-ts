import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  endpointValue: number;
  endpointSpeed: number;
  endpoint: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "endpointValue", label: "Endpoint value", kind: "number" },
  { id: "endpointSpeed", label: "Endpoint speed", kind: "number" },
  {
    id: "endpoint",
    label: "Endpoint",
    kind: "string",
    enum: ["upper", "lower"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.endpoint, ["upper", "lower"]);
  return H.finish({
    boundaryTerm:
      (i.endpoint === "upper" ? 1 : -1) * i.endpointValue * i.endpointSpeed,
  });
};
export const example = {
  input: { endpointValue: 3, endpointSpeed: 2, endpoint: "lower" },
  output: { result: { boundaryTerm: -6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "calculus/leibniz-boundary-term",
  title: "Calculus: Leibniz Boundary Term Tool",
  description:
    "Compute only the signed upper/lower moving-boundary term in Leibniz differentiation from supplied endpoint value and speed.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { boundaryTerm: { type: "number" } },
        required: ["boundaryTerm"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
