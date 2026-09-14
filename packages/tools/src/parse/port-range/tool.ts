import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualPortRangeText: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPortRangeText",
    label: "Actual port range text",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const m = /^(\d{1,5})(?:-(\d{1,5}))?$/.exec(input.actualPortRangeText);
  if (!m) simpleError("range", "Exactintegerorascendinghyphenrange.");
  const a = Number(m[1]),
    b = Number(m[2] ?? m[1]);
  bounded(a, "start", 0, 65535);
  bounded(b, "end", a, 65535);
  return { inclusiveStartPort: a, inclusiveEndPort: b, portCount: b - a + 1 };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualPortRangeText: "80-82" },
  output: {
    result: { inclusiveStartPort: 80, inclusiveEndPort: 82, portCount: 3 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/port-range",
  title: "Port Range Parser",
  description:
    "Exactsingleportrangeparser0\u202665535inclusive,port0permittedliteral,no service/availabilityclaim. Explicitboundedofflineconvention,not authoritative external identity,eligibility,clinical or safe-use determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
