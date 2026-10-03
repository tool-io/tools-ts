import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly members: readonly string[];
  readonly familyLabels: readonly string[];
};
export type Output = {
  readonly unionCount: number;
  readonly familyCount: number;
  readonly repeatedMemberships: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    members: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    familyLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["members", "familyLabels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unionCount: { type: "integer" },
    familyCount: { type: "integer" },
    repeatedMemberships: { type: "integer" },
  },
  required: ["unionCount", "familyCount", "repeatedMemberships"],
} as const;
/** Count union membership from explicit member/family incidences, ignoring duplicate incidences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { members, familyLabels } = request;
  const compute = (): Output => {
    H.sameLength(members, familyLabels);
    const distinctPairs = new Map<string, Set<string>>();
    for (let i = 0; i < members.length; i++) {
      const s = distinctPairs.get(members[i]) ?? new Set<string>();
      s.add(familyLabels[i]);
      distinctPairs.set(members[i], s);
    }
    return {
      unionCount: distinctPairs.size,
      familyCount: new Set(familyLabels).size,
      repeatedMemberships: [...distinctPairs.values()].reduce(
        (s, x) => s + Math.max(0, x.size - 1),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { members: ["a", "a", "b"], familyLabels: ["X", "Y", "Y"] },
  output: { unionCount: 2, familyCount: 2, repeatedMemberships: 1 },
} satisfies ToolExample<Input, Output>;
export const familyUnionSupportCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/family-union-support-count",
    title: "Family Union Support Count Tool",
    description:
      "Count union membership from explicit member/family incidences, ignoring duplicate incidences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        members: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        familyLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["members", "familyLabels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unionCount: { type: "integer" },
        familyCount: { type: "integer" },
        repeatedMemberships: { type: "integer" },
      },
      required: ["unionCount", "familyCount", "repeatedMemberships"],
    },
    ports: {
      inputs: [
        {
          id: "members",
          label: "Members",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "familyLabels",
          label: "Family Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "unionCount",
          label: "Union Count",
          valueType: { type: "integer" },
        },
        {
          id: "familyCount",
          label: "Family Count",
          valueType: { type: "integer" },
        },
        {
          id: "repeatedMemberships",
          label: "Repeated Memberships",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = familyUnionSupportCountTool.execute;
export default familyUnionSupportCountTool;
