import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NlxPersonYearsLivedInput = {
  readonly age?: number;
  readonly n: number;
  readonly lx: number;
  readonly lxNext?: number;
  readonly nmx?: number;
};

export type NlxPersonYearsLivedOutput = {
  readonly personYearsLived: number;
  readonly intervalType: "midpoint" | "open";
};

export const calculateNlxPersonYearsLived = (
  input: NlxPersonYearsLivedInput,
): NlxPersonYearsLivedOutput => {
  if (!(input.n > 0))
    return simpleError(
      "n",
      "Age interval width must be greater than zero.",
      "invalid_interval",
    );
  if (!(
    typeof input.lx === "number" &&
    Number.isFinite(input.lx) &&
    input.lx > 0
  ))
    return simpleError(
      "lx",
      "Life-table survivors at the start of the interval must be finite and greater than zero.",
      "invalid_lx",
    );
  if (input.nmx !== undefined) {
    if (!(input.nmx > 0))
      return simpleError(
        "nmx",
        "The terminal death rate must be greater than zero.",
        "invalid_nmx",
      );
    return { personYearsLived: input.lx / input.nmx, intervalType: "open" };
  }
  if (typeof input.lxNext !== "number")
    return simpleError(
      "lxNext",
      "lxNext is required unless the open-interval death rate nmx is provided.",
      "missing_lx_next",
    );
  if (!(
    Number.isFinite(input.lxNext) &&
    input.lxNext >= 0 &&
    input.lxNext <= input.lx
  ))
    return simpleError(
      "lxNext",
      "Survivors at the end of a closed interval must be finite, non-negative, and no greater than survivors at its start.",
      "invalid_lx",
    );
  return {
    personYearsLived: (input.n * (input.lx + input.lxNext)) / 2,
    intervalType: "midpoint",
  };
};

export const nlxPersonYearsLivedExample = {
  input: { age: 65, n: 5, lx: 10000, lxNext: 9000 },
  output: { personYearsLived: 47500, intervalType: "midpoint" },
} satisfies ToolExample<NlxPersonYearsLivedInput, NlxPersonYearsLivedOutput>;

export const nlxPersonYearsLivedTool = createSimpleTool({
  id: "demography/nlx-person-years-lived",
  title: "NLX Person Years Lived Calculator",
  description:
    "Compute the life-table person-years lived Lx as n times the average of lx and lx-next for an ordinary abridged interval, or as lx divided by nmx when the open terminal interval death rate is supplied.",
  inputs: [
    {
      description: "Starting age of the interval in years.",
      id: "age",
      kind: "number",
      label: "Age",
      minimum: 0,
    },
    {
      description: "Interval width n in years.",
      id: "n",
      kind: "number",
      label: "Interval width",
      minimum: 0,
    },
    {
      description: "Life-table survivors at the start of the interval.",
      id: "lx",
      kind: "number",
      label: "lx",
      minimum: 0,
    },
    {
      description:
        "Survivors at the end of the interval; omitted for the open terminal interval.",
      id: "lxNext",
      kind: "number",
      label: "lx next",
      minimum: 0,
      required: false,
    },
    {
      description:
        "Open terminal interval death rate m-omega; supplying it selects L-omega = l-omega / m-omega.",
      id: "nmx",
      kind: "number",
      label: "Terminal m",
      minimum: 0,
      required: false,
    },
  ],
  outputs: [
    {
      description: "Person-years lived in the interval.",
      id: "personYearsLived",
      kind: "number",
      label: "Lx",
    },
    {
      description:
        "Formula used: midpoint averaging or open-terminal rate division.",
      enum: ["midpoint", "open"],
      id: "intervalType",
      kind: "string",
      label: "Interval type",
    },
  ],
  calculate: (input) =>
    calculateNlxPersonYearsLived(input as unknown as NlxPersonYearsLivedInput),
});

export const runNlxPersonYearsLived = nlxPersonYearsLivedTool.execute;
export default nlxPersonYearsLivedTool;
