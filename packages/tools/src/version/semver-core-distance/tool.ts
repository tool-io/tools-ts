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
    delta: {
      major: b.major - a.major,
      minor: b.minor - a.minor,
      patch: b.patch - a.patch,
    },
  });
};
export const example = {
  input: { left: "1.2.3", right: "2.0.0" },
  output: { result: { delta: { major: 1, minor: -2, patch: -3 } } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SemVer Core Component Distance",
      "Semantic Version Core Component Distance",
      "version/semantic-version-core-distance",
      "version semantic version core distance",
      "SemVer",
      "semantic versioning",
    ],
    collections: ["encode-decode"],
    fields: ["version", "SemVer", "semantic versioning"],
    keywords: ["SemVer", "semantic versioning"],
  },
  id: "version/semver-core-distance",
  title: "SemVer Core Component Distance",
  description:
    "Return signed componentwise SemVer core deltas as arithmetic evidence, not a scalar version distance or compatibility metric.",
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
          delta: {
            type: "object",
            additionalProperties: false,
            properties: {
              major: { type: "number" },
              minor: { type: "number" },
              patch: { type: "number" },
            },
            required: ["major", "minor", "patch"],
          },
        },
        required: ["delta"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
