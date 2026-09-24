import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rhymeClasses: readonly string[];
  readonly rhymeClass: string;
};
export type Output = {
  readonly symbol: string;
  readonly index: number;
  readonly newClass: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rhymeClasses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    rhymeClass: { type: "string", maxLength: 8192 },
  },
  required: ["rhymeClasses", "rhymeClass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbol: { type: "string", maxLength: 8192 },
    index: { type: "integer" },
    newClass: { type: "boolean" },
  },
  required: ["symbol", "index", "newClass"],
} as const;
/** Assign the first-occurrence rhyme-class symbol using A..Z, AA..AZ and so on; phonetic rhyme classes are supplied by the caller. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rhymeClasses, rhymeClass } = request;
  const compute = (): Output => {
    H.domain(
      new Set(rhymeClasses).size === rhymeClasses.length &&
        rhymeClasses.every((x) => x.length > 0) &&
        rhymeClass.length > 0,
    );
    let index = rhymeClasses.indexOf(rhymeClass);
    const newClass = index < 0;
    if (newClass) index = rhymeClasses.length;
    let n = index + 1,
      symbol = "";
    while (n > 0) {
      n--;
      symbol = String.fromCharCode(65 + (n % 26)) + symbol;
      n = Math.floor(n / 26);
    }
    return { symbol, index, newClass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rhymeClasses: ["rose", "blue"], rhymeClass: "rose" },
  output: { symbol: "A", index: 0, newClass: false },
} satisfies ToolExample<Input, Output>;
export const rhymeSchemeNextSymbolAssignmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/rhyme-scheme-next-symbol-assignment",
    title: "Rhyme Scheme Next Symbol Assignment Tool",
    description:
      "Assign the first-occurrence rhyme-class symbol using A..Z, AA..AZ and so on; phonetic rhyme classes are supplied by the caller.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rhymeClasses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        rhymeClass: { type: "string", maxLength: 8192 },
      },
      required: ["rhymeClasses", "rhymeClass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        symbol: { type: "string", maxLength: 8192 },
        index: { type: "integer" },
        newClass: { type: "boolean" },
      },
      required: ["symbol", "index", "newClass"],
    },
    ports: {
      inputs: [
        {
          id: "rhymeClasses",
          label: "Rhyme Classes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "rhymeClass",
          label: "Rhyme Class",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "symbol", label: "Symbol", valueType: { type: "string" } },
        { id: "index", label: "Index", valueType: { type: "integer" } },
        { id: "newClass", label: "New Class", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = rhymeSchemeNextSymbolAssignmentTool.execute;
export default rhymeSchemeNextSymbolAssignmentTool;
