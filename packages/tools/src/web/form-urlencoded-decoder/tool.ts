import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FormUrlencodedDecoderInput = Readonly<{
  readonly encoded: string;
}>;
export type FormUrlencodedDecoderOutput = Readonly<{
  readonly names: readonly string[];
  readonly values: readonly string[];
}>;

export const calculateFormUrlencodedDecoder = (
  x: FormUrlencodedDecoderInput,
): FormUrlencodedDecoderOutput => {
  if (typeof x.encoded !== "string")
    simpleError("encoded", "Provide a string.");
  if (x.encoded === "") return { names: [], values: [] };
  const names: string[] = [],
    values: string[] = [];
  for (const part of x.encoded.split("&")) {
    const eq = part.indexOf("=");
    const rawName = eq < 0 ? part : part.slice(0, eq),
      rawValue = eq < 0 ? "" : part.slice(eq + 1);
    try {
      names.push(decodeURIComponent(rawName.replace(/\+/g, " ")));
      values.push(decodeURIComponent(rawValue.replace(/\+/g, " ")));
    } catch {
      simpleError("encoded", "Malformed UTF-8 percent escape.");
    }
  }
  return { names, values };
};

export const example = {
  input: { encoded: "q=red+apples&page=2" },
  output: { names: ["q", "page"], values: ["red apples", "2"] },
} satisfies ToolExample<
  FormUrlencodedDecoderInput,
  FormUrlencodedDecoderOutput
>;

export const tool = createSimpleTool({
  id: "web/form-urlencoded-decoder",
  title: "Form URL-Encoded Decoder",
  description:
    "Decode ordered UTF-8 application/x-www-form-urlencoded pairs, preserving duplicate names and treating plus signs as spaces.",
  inputs: [{ id: "encoded", kind: "string", label: "Form-encoded text" }],
  outputs: [
    { id: "names", kind: "stringList", label: "Field names" },
    { id: "values", kind: "stringList", label: "Field values" },
  ],
  calculate: (input) =>
    calculateFormUrlencodedDecoder({
      encoded: input.encoded as string,
    }),
});
export const formUrlencodedDecoderTool = tool;
export const runFormUrlencodedDecoder = tool.execute;
export default tool;
