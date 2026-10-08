import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCharacterId: string;
  readonly firstAlias: string;
  readonly secondCharacterId: string;
  readonly secondAlias: string;
  readonly caseSensitive: boolean;
};
export type Output = {
  readonly collision: boolean;
  readonly sameCharacter: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCharacterId: { type: "string", maxLength: 8192, minLength: 1 },
    firstAlias: { type: "string", maxLength: 8192 },
    secondCharacterId: { type: "string", maxLength: 8192, minLength: 1 },
    secondAlias: { type: "string", maxLength: 8192 },
    caseSensitive: { type: "boolean" },
  },
  required: [
    "firstCharacterId",
    "firstAlias",
    "secondCharacterId",
    "secondAlias",
    "caseSensitive",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collision: { type: "boolean" },
    sameCharacter: { type: "boolean" },
  },
  required: ["collision", "sameCharacter"],
} as const;
/** Detect identical alias spellings assigned to different explicit fictional character identifiers, under a supplied casing policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstCharacterId,
    firstAlias,
    secondCharacterId,
    secondAlias,
    caseSensitive,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstCharacterId.length > 0 && secondCharacterId.length > 0,
      "firstCharacterId",
    );
    const a = caseSensitive ? firstAlias : firstAlias.toLowerCase(),
      b = caseSensitive ? secondAlias : secondAlias.toLowerCase();
    return {
      collision: firstCharacterId !== secondCharacterId && a === b,
      sameCharacter: firstCharacterId === secondCharacterId,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCharacterId: "C1",
    firstAlias: "River",
    secondCharacterId: "C2",
    secondAlias: "river",
    caseSensitive: false,
  },
  output: { collision: true, sameCharacter: false },
} satisfies ToolExample<Input, Output>;
export const characterAliasCollisionPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/character-alias-collision-pair",
    title: "Character Alias Collision Pair",
    description:
      "Detect identical alias spellings assigned to different explicit fictional character identifiers, under a supplied casing policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCharacterId: { type: "string", maxLength: 8192, minLength: 1 },
        firstAlias: { type: "string", maxLength: 8192 },
        secondCharacterId: { type: "string", maxLength: 8192, minLength: 1 },
        secondAlias: { type: "string", maxLength: 8192 },
        caseSensitive: { type: "boolean" },
      },
      required: [
        "firstCharacterId",
        "firstAlias",
        "secondCharacterId",
        "secondAlias",
        "caseSensitive",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collision: { type: "boolean" },
        sameCharacter: { type: "boolean" },
      },
      required: ["collision", "sameCharacter"],
    },
    ports: {
      inputs: [
        {
          id: "firstCharacterId",
          label: "First Character Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstAlias",
          label: "First Alias",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondCharacterId",
          label: "Second Character Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondAlias",
          label: "Second Alias",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "collision", label: "Collision", valueType: { type: "boolean" } },
        {
          id: "sameCharacter",
          label: "Same Character",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = characterAliasCollisionPairTool.execute;
export default characterAliasCollisionPairTool;
