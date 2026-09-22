import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ token: string; detectionLimit: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "Token", kind: "string" },
  { id: "detectionLimit", label: "Detection limit", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.detectionLimit);
  H.check(
    i.token === "T" || /^(?:0|[1-9]\d*)(?:\.\d+)?(?![\s\S])/.test(i.token),
  );
  const value = i.token === "T" ? 0 : Number(i.token);
  H.check(Number.isFinite(value));
  return H.finish({
    censored: i.token === "T",
    lower: i.token === "T" ? 0 : value,
    upper: i.token === "T" ? i.detectionLimit : value,
    upperInclusive: i.token !== "T",
  });
};
export const example = {
  input: { token: "T", detectionLimit: 0.1 },
  output: {
    result: { censored: true, lower: 0, upper: 0.1, upperInclusive: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "atmospheric-science/rainfall-trace-token-to-censored-value",
  title: "Atmospheric Science: Rainfall Trace Token To Censored Value Tool",
  description:
    "Represent a caller-established rainfall trace T as the open-upper interval [0,detectionLimit), preserving censoring rather than replacing it with zero or half a limit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          censored: { type: "boolean" },
          lower: { type: "number" },
          upper: { type: "number" },
          upperInclusive: { type: "boolean" },
        },
        required: ["censored", "lower", "upper", "upperInclusive"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
