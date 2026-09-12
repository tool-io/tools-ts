import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly netArea: number;
  readonly callerAdjustedCompressionStress: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "netArea", label: "Net area", kind: "number" },
  {
    id: "callerAdjustedCompressionStress",
    label: "Caller adjusted compression stress",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.netArea, "netArea");
  positive(
    input.callerAdjustedCompressionStress,
    "callerAdjustedCompressionStress",
  );
  return { value: input.netArea * input.callerAdjustedCompressionStress };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { netArea: 2, callerAdjustedCompressionStress: 10 },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/timber-column-capacity",
  title: "Timber Column Capacity Calculator",
  description:
    "Timber column nominal axial compression material limit area\u00d7independently adjusted design stress; stability, eccentricity and code factors external. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
