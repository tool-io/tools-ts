import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BearerExtractorInput = Readonly<{
  readonly authorization: string;
}>;
export type BearerExtractorOutput = Readonly<{
  readonly token: string;
}>;

export const calculateBearerExtractor = (
  x: BearerExtractorInput,
): BearerExtractorOutput => {
  if (typeof x.authorization !== "string")
    simpleError("authorization", "Provide a string.");
  const match = /^[ \t]*Bearer[ \t]+([A-Za-z0-9\-._~+/]+={0,})[ \t]*$/i.exec(
    x.authorization,
  );
  if (!match)
    return simpleError("authorization", "Expected one Bearer credential.");
  return { token: match[1] };
};

export const example = {
  input: { authorization: "Bearer abc-123._~" },
  output: { token: "abc-123._~" },
} satisfies ToolExample<BearerExtractorInput, BearerExtractorOutput>;

export const tool = createSimpleTool({
  id: "http/bearer-extractor",
  title: "HTTP Bearer Extractor",
  description:
    "Extract one Bearer credential from an Authorization field, rejecting line breaks and malformed token characters.",
  inputs: [
    { id: "authorization", kind: "string", label: "Authorization field" },
  ],
  outputs: [{ id: "token", kind: "string", label: "Bearer token" }],
  calculate: (input) =>
    calculateBearerExtractor({
      authorization: input.authorization as string,
    }),
});
export const bearerExtractorTool = tool;
export const runBearerExtractor = tool.execute;
export default tool;
