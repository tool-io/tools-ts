import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrossoriginAttributeParserInput = Readonly<{
  readonly present: boolean;
  readonly value: string;
}>;
export type CrossoriginAttributeParserOutput = Readonly<{
  readonly state: string;
}>;

export const calculateCrossoriginAttributeParser = (
  x: CrossoriginAttributeParserInput,
): CrossoriginAttributeParserOutput => {
  if (typeof x.present !== "boolean")
    simpleError("present", "Provide a boolean.");
  if (typeof x.value !== "string") simpleError("value", "Provide a string.");
  return {
    state: !x.present
      ? "no-cors"
      : x.value.trim().toLowerCase() === "use-credentials"
        ? "use-credentials"
        : "anonymous",
  };
};

export const example = {
  input: { present: true, value: "use-credentials" },
  output: { state: "use-credentials" },
} satisfies ToolExample<
  CrossoriginAttributeParserInput,
  CrossoriginAttributeParserOutput
>;

export const tool = createSimpleTool({
  id: "web/crossorigin-attribute-parser",
  title: "Cross-Origin Attribute Parser",
  description:
    "Resolve an HTML crossorigin attribute to no-CORS, anonymous, or use-credentials state; an invalid present value defaults to anonymous.",
  inputs: [
    { id: "present", kind: "boolean", label: "Attribute present" },
    { id: "value", kind: "string", label: "Attribute value" },
  ],
  outputs: [{ id: "state", kind: "string", label: "Cross-origin state" }],
  calculate: (input) =>
    calculateCrossoriginAttributeParser({
      present: input.present as boolean,
      value: input.value as string,
    }),
});
export const crossoriginAttributeParserTool = tool;
export const runCrossoriginAttributeParser = tool.execute;
export default tool;
