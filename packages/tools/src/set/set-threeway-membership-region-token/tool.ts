import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly inA: boolean;
  readonly inB: boolean;
  readonly inC: boolean;
};
export type Output = { readonly region: number; readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inA: { type: "boolean" },
    inB: { type: "boolean" },
    inC: { type: "boolean" },
  },
  required: ["inA", "inB", "inC"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    region: { type: "integer" },
    token: { type: "string", maxLength: 8192 },
  },
  required: ["region", "token"],
} as const;
/** Compute set threeway membership region token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { inA, inB, inC } = input;
  const compute = (): Output => {
    return {
      region: (inA ? 4 : 0) + (inB ? 2 : 0) + (inC ? 1 : 0),
      token: (inA ? "1" : "0") + (inB ? "1" : "0") + (inC ? "1" : "0"),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { inA: true, inB: false, inC: true },
  output: { region: 5, token: "101" },
} satisfies ToolExample<Input, Output>;
export const setThreewayMembershipRegionTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/set-threeway-membership-region-token",
  title: "Set Threeway Membership Region Token Tool",
  description:
    "Compute set threeway membership region token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "inA",
        label: "In A",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "inB",
        label: "In B",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "inC",
        label: "In C",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "region", label: "Region", valueType: { type: "integer" } },
      { id: "token", label: "Token", valueType: { type: "string" } },
    ],
  },
});
export const run = setThreewayMembershipRegionTokenTool.execute;
export default setThreewayMembershipRegionTokenTool;
