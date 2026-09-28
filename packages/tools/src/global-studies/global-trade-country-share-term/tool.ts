import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly countryExports: number;
  readonly worldExports: number;
  readonly countryImports: number;
  readonly worldImports: number;
};
export type Output = {
  readonly exportShare: number;
  readonly importShare: number;
  readonly shareGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countryExports: { type: "number", minimum: 0 },
    worldExports: { type: "number", exclusiveMinimum: 0 },
    countryImports: { type: "number", minimum: 0 },
    worldImports: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "countryExports",
    "worldExports",
    "countryImports",
    "worldImports",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exportShare: { type: "number" },
    importShare: { type: "number" },
    shareGap: { type: "number" },
  },
  required: ["exportShare", "importShare", "shareGap"],
} as const;
/** Calculate global trade country share term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { countryExports, worldExports, countryImports, worldImports } =
    request;
  const compute = (): Output => {
    H.positive(worldExports);
    H.positive(worldImports);
    H.domain(
      countryExports >= 0 &&
        countryExports <= worldExports &&
        countryImports >= 0 &&
        countryImports <= worldImports,
    );
    return {
      exportShare: countryExports / worldExports,
      importShare: countryImports / worldImports,
      shareGap: countryExports / worldExports - countryImports / worldImports,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    countryExports: 200,
    worldExports: 1000,
    countryImports: 150,
    worldImports: 1000,
  },
  output: {
    exportShare: 0.2,
    importShare: 0.15,
    shareGap: 0.05000000000000002,
  },
} satisfies ToolExample<Input, Output>;
export const globalTradeCountryShareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/global-trade-country-share-term",
    title: "Global Trade Country Share Term Tool",
    description:
      "Calculate global trade country share term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countryExports: { type: "number", minimum: 0 },
        worldExports: { type: "number", exclusiveMinimum: 0 },
        countryImports: { type: "number", minimum: 0 },
        worldImports: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "countryExports",
        "worldExports",
        "countryImports",
        "worldImports",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exportShare: { type: "number" },
        importShare: { type: "number" },
        shareGap: { type: "number" },
      },
      required: ["exportShare", "importShare", "shareGap"],
    },
    ports: {
      inputs: [
        {
          id: "countryExports",
          label: "Country Exports",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "worldExports",
          label: "World Exports",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "countryImports",
          label: "Country Imports",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "worldImports",
          label: "World Imports",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "exportShare",
          label: "Export Share",
          valueType: { type: "number" },
        },
        {
          id: "importShare",
          label: "Import Share",
          valueType: { type: "number" },
        },
        { id: "shareGap", label: "Share Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = globalTradeCountryShareTermTool.execute;
export default globalTradeCountryShareTermTool;
