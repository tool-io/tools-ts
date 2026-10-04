import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  dateEpochSeconds: number;
  requestEpochSeconds: number;
  responseEpochSeconds: number;
  ageSeconds: number;
  nowEpochSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "dateEpochSeconds",
    label: "Date epoch seconds",
    kind: "number",
    unit: "s",
  },
  {
    id: "requestEpochSeconds",
    label: "Request epoch seconds",
    kind: "number",
    unit: "s",
  },
  {
    id: "responseEpochSeconds",
    label: "Response epoch seconds",
    kind: "number",
    unit: "s",
  },
  { id: "ageSeconds", label: "Age seconds", kind: "number", unit: "s" },
  {
    id: "nowEpochSeconds",
    label: "Now epoch seconds",
    kind: "number",
    unit: "s",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.ageSeconds >= 0 &&
      i.requestEpochSeconds <= i.responseEpochSeconds &&
      i.nowEpochSeconds >= i.responseEpochSeconds,
  );
  const initial = Math.max(
    0,
    i.responseEpochSeconds - i.dateEpochSeconds,
    i.ageSeconds + i.responseEpochSeconds - i.requestEpochSeconds,
  );
  return H.finish({
    correctedInitialAge: initial,
    currentAge: initial + i.nowEpochSeconds - i.responseEpochSeconds,
  });
};
export const example = {
  input: {
    dateEpochSeconds: 90,
    requestEpochSeconds: 95,
    responseEpochSeconds: 100,
    ageSeconds: 20,
    nowEpochSeconds: 110,
  },
  output: { result: { correctedInitialAge: 25, currentAge: 35 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/http-age-date-response-adjustment",
  title: "Web: HTTP Age Date Response Adjustment Tool",
  description:
    "Apply RFC9111 apparent-age/response-delay adjustment and resident time from explicit parsed timestamps and Age; not a cache freshness or header parser.",
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
          correctedInitialAge: { type: "number" },
          currentAge: { type: "number" },
        },
        required: ["correctedInitialAge", "currentAge"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
