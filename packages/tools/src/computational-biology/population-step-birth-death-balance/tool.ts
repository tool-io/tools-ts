import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingCount: number;
  readonly births: number;
  readonly deaths: number;
};
export type Output = {
  readonly closingCount: number;
  readonly netChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingCount: { type: "integer", minimum: 0 },
    births: { type: "integer", minimum: 0 },
    deaths: { type: "integer", minimum: 0 },
  },
  required: ["openingCount", "births", "deaths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closingCount: { type: "integer" },
    netChange: { type: "integer" },
  },
  required: ["closingCount", "netChange"],
} as const;
/** Balance explicitly supplied population events over one step without projecting growth or selecting an organism model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingCount, births, deaths } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingCount) &&
        openingCount >= 0 &&
        openingCount <= Number.MAX_SAFE_INTEGER,
      "openingCount",
    ),
      openingCount);
    (H.domain(
      Number.isSafeInteger(births) &&
        births >= 0 &&
        births <= Number.MAX_SAFE_INTEGER,
      "births",
    ),
      births);
    (H.domain(
      Number.isSafeInteger(deaths) &&
        deaths >= 0 &&
        deaths <= openingCount + births,
      "deaths",
    ),
      deaths);
    return {
      closingCount: openingCount + births - deaths,
      netChange: births - deaths,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingCount: 100, births: 12, deaths: 7 },
  output: { closingCount: 105, netChange: 5 },
} satisfies ToolExample<Input, Output>;
export const populationStepBirthDeathBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-biology", "computational biology", "biology"],
      keywords: ["computational biology", "biology"],
    },
    id: "computational-biology/population-step-birth-death-balance",
    title: "Population Step Birth Death Balance",
    description:
      "Balance explicitly supplied population events over one step without projecting growth or selecting an organism model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingCount: { type: "integer", minimum: 0 },
        births: { type: "integer", minimum: 0 },
        deaths: { type: "integer", minimum: 0 },
      },
      required: ["openingCount", "births", "deaths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        closingCount: { type: "integer" },
        netChange: { type: "integer" },
      },
      required: ["closingCount", "netChange"],
    },
    ports: {
      inputs: [
        {
          id: "openingCount",
          label: "Opening Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "births",
          label: "Births",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "deaths",
          label: "Deaths",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "closingCount",
          label: "Closing Count",
          valueType: { type: "integer" },
        },
        {
          id: "netChange",
          label: "Net Change",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = populationStepBirthDeathBalanceTool.execute;
export default populationStepBirthDeathBalanceTool;
