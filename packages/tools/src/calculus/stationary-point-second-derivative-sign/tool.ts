import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  secondDerivative: number;
  stationaryEstablished: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "secondDerivative", label: "Second derivative", kind: "number" },
  {
    id: "stationaryEstablished",
    label: "Stationary established",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.stationaryEstablished,
    "Stationarity must be independently established",
  );
  return H.finish({
    classification:
      i.secondDerivative > 0
        ? "strict-local-minimum"
        : i.secondDerivative < 0
          ? "strict-local-maximum"
          : "inconclusive",
  });
};
export const example = {
  input: { secondDerivative: 0, stationaryEstablished: true },
  output: { result: { classification: "inconclusive" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "calculus/stationary-point-second-derivative-sign",
  title: "Calculus: Stationary Point Second Derivative Sign Tool",
  description:
    "Apply the local second-derivative test only after the caller explicitly establishes stationarity; zero remains inconclusive.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { classification: { type: "string" } },
        required: ["classification"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
