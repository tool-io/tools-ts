import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ dop: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "dop", label: "Dop", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.dop > 0 && i.dop <= 1e6);
  return H.finish({
    band:
      i.dop <= 1
        ? "ideal"
        : i.dop <= 2
          ? "excellent"
          : i.dop <= 5
            ? "good"
            : i.dop <= 10
              ? "moderate"
              : i.dop <= 20
                ? "fair"
                : "poor",
    policy: "illustrative historical DOP bands, not accuracy certification",
  });
};
export const example = {
  input: { dop: 3 },
  output: {
    result: {
      band: "good",
      policy: "illustrative historical DOP bands, not accuracy certification",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Dilution of Precision DOP Geometric Factor Classifier",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/dop-geometric-factor-classifier",
  title: "Dilution of Precision DOP Geometric Factor Classifier",
  description:
    "Classify a positive supplied DOP under explicit heuristic cutoffs 1,2,5,10,20; labels are educational, not receiver accuracy, integrity or survey acceptance standards.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { band: { type: "string" }, policy: { type: "string" } },
        required: ["band", "policy"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
