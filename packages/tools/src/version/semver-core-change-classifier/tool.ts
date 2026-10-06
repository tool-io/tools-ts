import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ left: string; right: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "left", label: "left", kind: "string" },
  { id: "right", label: "right", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const a = H.version(i.left),
    b = H.version(i.right);
  return H.finish({
    component:
      a.major !== b.major
        ? "major"
        : a.minor !== b.minor
          ? "minor"
          : a.patch !== b.patch
            ? "patch"
            : "none",
    direction: H.versionCompare(a, b),
  });
};
export const example = {
  input: { left: "1.2.3", right: "1.3.0" },
  output: { result: { component: "minor", direction: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SemVer Core Change Classifier",
      "Semantic Version Core Change Classifier",
      "version/semantic-version-core-change-classifier",
      "version semantic version core change classifier",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-core-change-classifier",
  title: "SemVer Core Change Classifier",
  description:
    "Classify the highest differing SemVer core component and separately report full precedence comparison; component names do not prove semantic compatibility.",
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
          component: { type: "string" },
          direction: { type: "number" },
        },
        required: ["component", "direction"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
