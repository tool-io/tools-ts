import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly chainLength: number; readonly depth: number };
export type Output = {
  readonly scope: number;
  readonly straightAngleRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chainLength: { type: "number" },
    depth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["chainLength", "depth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scope: { type: "number" },
    straightAngleRadians: { type: "number" },
  },
  required: ["scope", "straightAngleRadians"],
} as const;
/** Calculate chain scope depth angle term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chainLength, depth } = request;
  const compute = (): Output => {
    H.positive(depth);
    H.domain(chainLength >= depth);
    return {
      scope: chainLength / depth,
      straightAngleRadians: Math.asin(depth / chainLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chainLength: 20, depth: 10 },
  output: { scope: 2, straightAngleRadians: 0.5235987755982989 },
} satisfies ToolExample<Input, Output>;
export const chainScopeDepthAngleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/chain-scope-depth-angle-term",
    title: "Chain Scope Depth Angle Term Tool",
    description:
      "Calculate chain scope depth angle term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chainLength: { type: "number" },
        depth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["chainLength", "depth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scope: { type: "number" },
        straightAngleRadians: { type: "number" },
      },
      required: ["scope", "straightAngleRadians"],
    },
    ports: {
      inputs: [
        {
          id: "chainLength",
          label: "Chain Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "scope", label: "Scope", valueType: { type: "number" } },
        {
          id: "straightAngleRadians",
          label: "Straight Angle Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chainScopeDepthAngleTermTool.execute;
export default chainScopeDepthAngleTermTool;
