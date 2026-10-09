import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly users: number;
  readonly suppliedCostPerUser: number;
};
export type Output = { readonly aggregateCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    users: { type: "integer", minimum: 0 },
    suppliedCostPerUser: { type: "number" },
  },
  required: ["users", "suppliedCostPerUser"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { aggregateCost: { type: "number" } },
  required: ["aggregateCost"],
} as const;
/** Multiply an explicit resource user count by an externally supplied per-user congestion cost. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { users, suppliedCostPerUser } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(users) &&
        users >= 0 &&
        users <= Number.MAX_SAFE_INTEGER,
      "users",
    ),
      users);
    return { aggregateCost: users * suppliedCostPerUser };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { users: 12, suppliedCostPerUser: 3.5 },
  output: { aggregateCost: 42 },
} satisfies ToolExample<Input, Output>;
export const congestionResourceCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["game-theory", "game theory", "economics"],
      keywords: ["game theory", "economics"],
    },
    id: "game-theory/congestion-resource-cost-term",
    title: "Congestion Resource Cost Term",
    description:
      "Multiply an explicit resource user count by an externally supplied per-user congestion cost.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        users: { type: "integer", minimum: 0 },
        suppliedCostPerUser: { type: "number" },
      },
      required: ["users", "suppliedCostPerUser"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { aggregateCost: { type: "number" } },
      required: ["aggregateCost"],
    },
    ports: {
      inputs: [
        {
          id: "users",
          label: "Users",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedCostPerUser",
          label: "Supplied Cost Per User",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "aggregateCost",
          label: "Aggregate Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = congestionResourceCostTermTool.execute;
export default congestionResourceCostTermTool;
