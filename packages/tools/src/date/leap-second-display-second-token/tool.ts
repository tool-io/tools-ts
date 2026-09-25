import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  secondToken: string;
  leapContextVerified: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "secondToken", label: "Second token", kind: "string" },
  {
    id: "leapContextVerified",
    label: "Leap context verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^[0-5]\d(?![\s\S])/.test(i.secondToken) || i.secondToken === "60");
  return H.finish({
    second: Number(i.secondToken),
    leapSecond: Number(i.secondToken) === 60,
    accepted: Number(i.secondToken) < 60 || i.leapContextVerified,
  });
};
export const example = {
  input: { secondToken: "60", leapContextVerified: false },
  output: { result: { second: 60, leapSecond: true, accepted: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/leap-second-display-second-token",
  title: "Date: Leap Second Display Second Token Tool",
  description:
    "Inspect a two-digit seconds token with leap-second60 accepted only when the caller explicitly verifies date/time-scale context; no fabricated leap history.",
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
          accepted: { type: "boolean" },
          leapSecond: { type: "boolean" },
          second: { type: "number" },
        },
        required: ["accepted", "leapSecond", "second"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
