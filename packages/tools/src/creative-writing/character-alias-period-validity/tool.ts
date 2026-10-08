import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sceneIndex: number;
  readonly aliasStartInclusive: number;
  readonly aliasEndInclusive: number;
};
export type Output = { readonly validInScene: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sceneIndex: { type: "integer", minimum: 0 },
    aliasStartInclusive: { type: "integer", minimum: 0 },
    aliasEndInclusive: { type: "integer" },
  },
  required: ["sceneIndex", "aliasStartInclusive", "aliasEndInclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { validInScene: { type: "boolean" } },
  required: ["validInScene"],
} as const;
/** Check whether a supplied scene index falls within an alias period with inclusive index endpoints. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sceneIndex, aliasStartInclusive, aliasEndInclusive } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sceneIndex) &&
        sceneIndex >= 0 &&
        sceneIndex <= Number.MAX_SAFE_INTEGER,
      "sceneIndex",
    ),
      sceneIndex);
    (H.domain(
      Number.isSafeInteger(aliasStartInclusive) &&
        aliasStartInclusive >= 0 &&
        aliasStartInclusive <= Number.MAX_SAFE_INTEGER,
      "aliasStartInclusive",
    ),
      aliasStartInclusive);
    (H.domain(
      Number.isSafeInteger(aliasEndInclusive) &&
        aliasEndInclusive >= aliasStartInclusive &&
        aliasEndInclusive <= Number.MAX_SAFE_INTEGER,
      "aliasEndInclusive",
    ),
      aliasEndInclusive);
    return {
      validInScene:
        sceneIndex >= aliasStartInclusive && sceneIndex <= aliasEndInclusive,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sceneIndex: 8, aliasStartInclusive: 3, aliasEndInclusive: 10 },
  output: { validInScene: true },
} satisfies ToolExample<Input, Output>;
export const characterAliasPeriodValidityTool = H.defineSchemaCalculation<
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
    id: "creative-writing/character-alias-period-validity",
    title: "Character Alias Period Validity",
    description:
      "Check whether a supplied scene index falls within an alias period with inclusive index endpoints.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sceneIndex: { type: "integer", minimum: 0 },
        aliasStartInclusive: { type: "integer", minimum: 0 },
        aliasEndInclusive: { type: "integer" },
      },
      required: ["sceneIndex", "aliasStartInclusive", "aliasEndInclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { validInScene: { type: "boolean" } },
      required: ["validInScene"],
    },
    ports: {
      inputs: [
        {
          id: "sceneIndex",
          label: "Scene Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "aliasStartInclusive",
          label: "Alias Start Inclusive",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "aliasEndInclusive",
          label: "Alias End Inclusive",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "validInScene",
          label: "Valid In Scene",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = characterAliasPeriodValidityTool.execute;
export default characterAliasPeriodValidityTool;
