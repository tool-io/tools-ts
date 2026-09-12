import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  daysBetween,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualTheatricalReleaseDate: string;
  readonly actualSubsequentWindowStartDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTheatricalReleaseDate",
    label: "Actual theatrical release date",
    kind: "string",
  },
  {
    id: "actualSubsequentWindowStartDate",
    label: "Actual subsequent window start date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualTheatricalReleaseDate.trim())
    simpleError("actualTheatricalReleaseDate", "Explicit non blank context.");
  if (!input.actualSubsequentWindowStartDate.trim())
    simpleError(
      "actualSubsequentWindowStartDate",
      "Explicit non blank context.",
    );
  if (
    daysBetween(
      input.actualTheatricalReleaseDate,
      input.actualSubsequentWindowStartDate,
    ) < 0
  )
    simpleError("dates", "Actualorderedrelease/windowdates.");
  return {
    value: daysBetween(
      input.actualTheatricalReleaseDate,
      input.actualSubsequentWindowStartDate,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTheatricalReleaseDate: "2026-01-01",
    actualSubsequentWindowStartDate: "2026-01-11",
  },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/theatrical-window-days",
  title: "Theatrical Window Days Calculator",
  description:
    "Actual dated theatrical distribution window elapsed civil days, not legally required minimum/contract rights or actual availability.",
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
