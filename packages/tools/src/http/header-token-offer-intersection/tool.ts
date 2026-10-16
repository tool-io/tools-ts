import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  requested: readonly string[];
  offers: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "requested", label: "requested", kind: "stringList" },
  { id: "offers", label: "offers", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  [...i.requested, ...i.offers].forEach((s) =>
    H.check(H.token(s) || s === "*"),
  );
  return H.finish({
    matches: i.offers.flatMap((offer, index) =>
      i.requested.some(
        (x) => x === "*" || x.toLowerCase() === offer.toLowerCase(),
      )
        ? [{ index, offer }]
        : [],
    ),
  });
};
export const example = {
  input: { requested: ["A"], offers: ["a", "b", "A"] },
  output: {
    result: {
      matches: [
        { index: 0, offer: "a" },
        { index: 2, offer: "A" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["HTTP Token Offer Intersection", "HTTP", "web development"],
    collections: ["encode-decode"],
    fields: ["HTTP", "web development"],
    keywords: ["HTTP", "web development"],
  },
  id: "http/header-token-offer-intersection",
  title: "HTTP Token Offer Intersection",
  description:
    "Intersect explicit HTTP token offers against a case-insensitive token bank or wildcard, preserving offer order and duplicates; no language/media subtype matching.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          matches: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                offer: { type: "string" },
              },
              required: ["index", "offer"],
            },
          },
        },
        required: ["matches"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
