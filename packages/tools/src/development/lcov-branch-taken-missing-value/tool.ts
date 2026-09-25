import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly known: boolean; readonly taken: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { known: { type: "boolean" }, taken: { type: "integer" } },
  required: ["known", "taken"],
} as const;
/** Calculate lcov branch taken missing value from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    H.domain(token === "-" || /^(?:0|[1-9]\d*)(?![\s\S])/.test(token));
    const known = token !== "-",
      taken = known ? Number(token) : 0;
    H.integer(taken, 0);
    return { known, taken };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "-" },
  output: { known: false, taken: 0 },
} satisfies ToolExample<Input, Output>;
export const lcovBranchTakenMissingValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/lcov-branch-taken-missing-value",
    title: "LCOV Branch Taken Missing Value Tool",
    description:
      "Calculate lcov branch taken missing value from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { known: { type: "boolean" }, taken: { type: "integer" } },
      required: ["known", "taken"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "known", label: "Known", valueType: { type: "boolean" } },
        { id: "taken", label: "Taken", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = lcovBranchTakenMissingValueTool.execute;
export default lcovBranchTakenMissingValueTool;
