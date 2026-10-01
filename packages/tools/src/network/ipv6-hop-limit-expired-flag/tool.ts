import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ hopLimit: number; action: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "hopLimit", label: "Hop limit", kind: "integer" },
  {
    id: "action",
    label: "Action",
    kind: "string",
    enum: ["receive", "forward"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.hopLimit, 0, 255);
  H.choice(i.action, ["receive", "forward"]);
  return H.finish({
    forwardable: i.hopLimit > 1,
    nextHopLimit:
      i.action === "forward" ? Math.max(0, i.hopLimit - 1) : i.hopLimit,
    expiredForForwarding: i.action === "forward" && i.hopLimit <= 1,
  });
};
export const example = {
  input: { hopLimit: 1, action: "forward" },
  output: {
    result: { forwardable: false, nextHopLimit: 0, expiredForForwarding: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-hop-limit-expired-flag",
  title: "Network: IPv6 Hop Limit Expired Flag Tool",
  description:
    "Inspect the IPv6 Hop Limit forwarding decrement rule, separating local receipt from attempted forwarding; not a routing or firewall policy evaluator.",
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
          expiredForForwarding: { type: "boolean" },
          forwardable: { type: "boolean" },
          nextHopLimit: { type: "number" },
        },
        required: ["expiredForForwarding", "forwardable", "nextHopLimit"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
