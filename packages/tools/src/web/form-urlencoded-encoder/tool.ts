import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FormUrlencodedEncoderInput = Readonly<{
  readonly names: readonly string[];
  readonly values: readonly string[];
}>;
export type FormUrlencodedEncoderOutput = Readonly<{
  readonly encoded: string;
}>;

export const calculateFormUrlencodedEncoder = (
  x: FormUrlencodedEncoderInput,
): FormUrlencodedEncoderOutput => {
  if (!Array.isArray(x.names) || !x.names.every((v) => typeof v === "string"))
    simpleError("names", "Provide a string list.");
  if (!Array.isArray(x.values) || !x.values.every((v) => typeof v === "string"))
    simpleError("values", "Provide a string list.");
  if (x.names.length !== x.values.length)
    simpleError("names", "Name and value lists must have equal length.");
  const enc = (s: string) =>
    encodeURIComponent(s)
      .replace(
        /[!'()~]/g,
        (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase(),
      )
      .replace(/%20/g, "+");
  try {
    return {
      encoded: x.names
        .map((name, i) => enc(name) + "=" + enc(x.values[i]))
        .join("&"),
    };
  } catch {
    return simpleError("names", "Form fields must contain valid Unicode text.");
  }
};

export const example = {
  input: { names: ["q", "page"], values: ["red apples", "2"] },
  output: { encoded: "q=red+apples&page=2" },
} satisfies ToolExample<
  FormUrlencodedEncoderInput,
  FormUrlencodedEncoderOutput
>;

export const tool = createSimpleTool({
  id: "web/form-urlencoded-encoder",
  title: "Form URL-Encoded Encoder",
  description:
    "Serialize ordered UTF-8 name/value string pairs in application/x-www-form-urlencoded form, using plus signs for spaces.",
  inputs: [
    { id: "names", kind: "stringList", label: "Field names" },
    { id: "values", kind: "stringList", label: "Field values" },
  ],
  outputs: [{ id: "encoded", kind: "string", label: "Form-encoded text" }],
  calculate: (input) =>
    calculateFormUrlencodedEncoder({
      names: input.names as readonly string[],
      values: input.values as readonly string[],
    }),
});
export const formUrlencodedEncoderTool = tool;
export const runFormUrlencodedEncoder = tool.execute;
export default tool;
