import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly territoryIds: readonly string[];
  readonly durations: readonly number[];
  readonly sourceValid: readonly boolean[];
  readonly selectedTerritory: string;
};
export type Output = {
  readonly territoryDuration: number;
  readonly supportedDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    territoryIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    sourceValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedTerritory: { type: "string", maxLength: 8192 },
  },
  required: ["territoryIds", "durations", "sourceValid", "selectedTerritory"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    territoryDuration: { type: "number" },
    supportedDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["territoryDuration", "supportedDuration", "share", "defined"],
} as const;
/** Aggregate supplied public territory-period support without inferring boundaries or sovereignty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { territoryIds, durations, sourceValid, selectedTerritory } = request;
  const compute = (): Output => {
    H.sameLength(territoryIds, durations);
    H.sameLength(territoryIds, sourceValid);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const territoryDuration = durations.reduce(
          (s, x, i) => s + (territoryIds[i] === selectedTerritory ? x : 0),
          0,
        ),
        supportedDuration = durations.reduce(
          (s, x, i) =>
            s +
            (territoryIds[i] === selectedTerritory && sourceValid[i] ? x : 0),
          0,
        );
      return {
        territoryDuration,
        supportedDuration,
        share:
          territoryDuration > 0 ? supportedDuration / territoryDuration : 0,
        defined: territoryDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    territoryIds: ["A", "A", "B"],
    durations: [2, 3, 5],
    sourceValid: [true, false, true],
    selectedTerritory: "A",
  },
  output: {
    territoryDuration: 5,
    supportedDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const publicTerritoryPeriodShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/public-territory-period-share",
    title: "Public Territory Period Share Tool",
    description:
      "Aggregate supplied public territory-period support without inferring boundaries or sovereignty.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        territoryIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        sourceValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        selectedTerritory: { type: "string", maxLength: 8192 },
      },
      required: [
        "territoryIds",
        "durations",
        "sourceValid",
        "selectedTerritory",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        territoryDuration: { type: "number" },
        supportedDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["territoryDuration", "supportedDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "territoryIds",
          label: "Territory Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sourceValid",
          label: "Source Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedTerritory",
          label: "Selected Territory",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "territoryDuration",
          label: "Territory Duration",
          valueType: { type: "number" },
        },
        {
          id: "supportedDuration",
          label: "Supported Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = publicTerritoryPeriodShareTool.execute;
export default publicTerritoryPeriodShareTool;
