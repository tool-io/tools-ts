import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  maxAgePresent: boolean;
  maxAgeSeconds: number;
  expiresPresent: boolean;
  expiresEpochSeconds: number;
  nowEpochSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "maxAgePresent", label: "Max age present", kind: "boolean" },
  { id: "maxAgeSeconds", label: "Max age seconds", kind: "integer", unit: "s" },
  { id: "expiresPresent", label: "Expires present", kind: "boolean" },
  {
    id: "expiresEpochSeconds",
    label: "Expires epoch seconds",
    kind: "number",
    unit: "s",
  },
  {
    id: "nowEpochSeconds",
    label: "Now epoch seconds",
    kind: "number",
    unit: "s",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.maxAgeSeconds, -1000000000, 1000000000);
  const expiry = i.maxAgePresent
    ? i.nowEpochSeconds + Math.max(0, i.maxAgeSeconds)
    : i.expiresPresent
      ? i.expiresEpochSeconds
      : 0;
  return H.finish({
    source: i.maxAgePresent
      ? "max-age"
      : i.expiresPresent
        ? "expires"
        : "session",
    persistent: i.maxAgePresent || i.expiresPresent,
    expiryEpochSeconds: expiry,
    expired:
      (i.maxAgePresent || i.expiresPresent) && expiry <= i.nowEpochSeconds,
  });
};
export const example = {
  input: {
    maxAgePresent: true,
    maxAgeSeconds: 10,
    expiresPresent: true,
    expiresEpochSeconds: 0,
    nowEpochSeconds: 100,
  },
  output: {
    result: {
      source: "max-age",
      persistent: true,
      expiryEpochSeconds: 110,
      expired: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/cookie-maxage-vs-expiry-precedence",
  title: "Web: Cookie Maxage Vs Expiry Precedence Tool",
  description:
    "Resolve parsed cookie Max-Age precedence over Expires using supplied receipt time; absent session expiry uses unused zero and no full Set-Cookie parsing.",
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
          expired: { type: "boolean" },
          expiryEpochSeconds: { type: "number" },
          persistent: { type: "boolean" },
          source: { type: "string" },
        },
        required: ["expired", "expiryEpochSeconds", "persistent", "source"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
