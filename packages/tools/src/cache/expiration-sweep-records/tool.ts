import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ recordsJson: string; now: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "recordsJson", kind: "string" },
  { id: "now", label: "now", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.recordsJson).map((v) => {
    const id = H.str(v.id),
      initialAge = H.num(v.initialAge),
      storedAt = H.num(v.storedAt),
      lifetime = H.num(v.lifetime);
    H.check(initialAge >= 0 && lifetime >= 0 && i.now >= storedAt);
    return { id, initialAge, storedAt, lifetime };
  });
  return H.finish({
    records: r.map((v) => ({
      ...v,
      age: v.initialAge + i.now - v.storedAt,
      fresh: v.initialAge + i.now - v.storedAt < v.lifetime,
    })),
  });
};
export const example = {
  input: {
    recordsJson: '[{"id":"a","initialAge":2,"storedAt":10,"lifetime":5}]',
    now: 13,
  },
  output: {
    result: {
      records: [
        {
          id: "a",
          initialAge: 2,
          storedAt: 10,
          lifetime: 5,
          age: 5,
          fresh: false,
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cache/expiration-sweep-records",
  title: "Cache Expiration Sweep Records",
  description:
    "Sweep explicit stored-response age components at a supplied clock instant, classifying equality with lifetime as stale; no eviction, revalidation or stale-serving authorization.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
