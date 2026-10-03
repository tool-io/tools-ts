import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  parseJson,
  list,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly candidateJson: string;
  readonly setJson: string;
};
export type Output = { readonly element: boolean; readonly subset: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    candidateJson: { type: "string", maxLength: 8192 },
    setJson: { type: "string", maxLength: 8192 },
  },
  required: ["candidateJson", "setJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { element: { type: "boolean" }, subset: { type: "boolean" } },
  required: ["element", "subset"],
} as const;
/** Compute nested set element versus subset label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { candidateJson, setJson } = input;
  const compute = (): Output => {
    const candidate = parseJson(candidateJson),
      members = list(parseJson(setJson));
    const key = (x: unknown, depth = 0): string => {
      domain(
        depth <= 32,
        "setJson",
        "Nested sets must have at most 32 levels.",
      );
      if (Array.isArray(x))
        return (
          "set:" +
          JSON.stringify(
            [...new Set(list(x).map((v) => key(v, depth + 1)))].sort(),
          )
        );
      domain(
        x === null || ["string", "number", "boolean"].includes(typeof x),
        "setJson",
        "Use scalar atoms and nested arrays representing finite sets.",
      );
      return (x === null ? "null" : typeof x) + ":" + JSON.stringify(x);
    };
    const candidateKey = key(candidate),
      memberKeys = new Set(members.map((x) => key(x)));
    return {
      element: memberKeys.has(candidateKey),
      subset:
        Array.isArray(candidate) &&
        candidate.every((x) => memberKeys.has(key(x))),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { candidateJson: "[1]", setJson: "[1,2]" },
  output: { element: false, subset: true },
} satisfies ToolExample<Input, Output>;
export const nestedSetElementVersusSubsetLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/nested-set-element-versus-subset-label",
  title: "Nested Set Element Versus Subset Label Tool",
  description:
    "Distinguish finite-set membership from subset inclusion using JSON scalar atoms and nested arrays, ignoring set order and duplicate elements.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "candidateJson",
        label: "Candidate Json",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "setJson",
        label: "Set Json",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "element", label: "Element", valueType: { type: "boolean" } },
      { id: "subset", label: "Subset", valueType: { type: "boolean" } },
    ],
  },
});
export const run = nestedSetElementVersusSubsetLabelTool.execute;
export default nestedSetElementVersusSubsetLabelTool;
