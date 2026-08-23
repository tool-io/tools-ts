import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ExtractHashtagsInput = {
  readonly text: string;
};

export type ExtractHashtagsOutput = {
  readonly hashtags: string[];
};

export const extractHashtagsExample = {
  input: { text: "Loving #typescript and #node_js today!" },
  output: { hashtags: ["typescript", "node_js"] },
} satisfies ToolExample<ExtractHashtagsInput, ExtractHashtagsOutput>;

export const extractHashtagsTool = createSimpleTool({
  id: "text/extract-hashtags",
  title: "Hashtag Extractor",
  description:
    "Extract all hashtag tokens without the # symbol, in order of appearance.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "hashtags", label: "Hashtags", kind: "stringList" }],
  calculate: (input) => ({
    hashtags: [...(input.text as string).matchAll(/#[A-Za-z0-9_]+/g)].map(
      (match) => match[0].slice(1),
    ),
  }),
});
export const runExtractHashtags = extractHashtagsTool.execute;
export default extractHashtagsTool;
