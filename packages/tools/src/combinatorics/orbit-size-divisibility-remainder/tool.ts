import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groupOrder: number;
  readonly proposedOrbitSize: number;
};
export type Output = {
  readonly remainder: number;
  readonly dividesGroupOrder: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupOrder: { type: "integer", minimum: 1 },
    proposedOrbitSize: { type: "integer", minimum: 1 },
  },
  required: ["groupOrder", "proposedOrbitSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainder: { type: "integer" },
    dividesGroupOrder: { type: "boolean" },
  },
  required: ["remainder", "dividesGroupOrder"],
} as const;
/** Test explicit orbit-size divisibility of a finite group order without establishing that a group action or orbit exists. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { groupOrder, proposedOrbitSize } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(groupOrder) &&
        groupOrder >= 1 &&
        groupOrder <= Number.MAX_SAFE_INTEGER,
      "groupOrder",
    ),
      groupOrder);
    (H.domain(
      Number.isSafeInteger(proposedOrbitSize) &&
        proposedOrbitSize >= 1 &&
        proposedOrbitSize <= Number.MAX_SAFE_INTEGER,
      "proposedOrbitSize",
    ),
      proposedOrbitSize);
    return {
      remainder: groupOrder % proposedOrbitSize,
      dividesGroupOrder: groupOrder % proposedOrbitSize === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { groupOrder: 12, proposedOrbitSize: 4 },
  output: { remainder: 0, dividesGroupOrder: true },
} satisfies ToolExample<Input, Output>;
export const orbitSizeDivisibilityRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["combinatorics", "mathematics"],
      keywords: ["combinatorics", "mathematics"],
    },
    id: "combinatorics/orbit-size-divisibility-remainder",
    title: "Orbit Size Divisibility Remainder",
    description:
      "Test explicit orbit-size divisibility of a finite group order without establishing that a group action or orbit exists.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupOrder: { type: "integer", minimum: 1 },
        proposedOrbitSize: { type: "integer", minimum: 1 },
      },
      required: ["groupOrder", "proposedOrbitSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainder: { type: "integer" },
        dividesGroupOrder: { type: "boolean" },
      },
      required: ["remainder", "dividesGroupOrder"],
    },
    ports: {
      inputs: [
        {
          id: "groupOrder",
          label: "Group Order",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "proposedOrbitSize",
          label: "Proposed Orbit Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
        {
          id: "dividesGroupOrder",
          label: "Divides Group Order",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = orbitSizeDivisibilityRemainderTool.execute;
export default orbitSizeDivisibilityRemainderTool;
