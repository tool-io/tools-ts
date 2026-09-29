import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly residentCount: number;
  readonly daytimeCount: number;
  readonly useDaytime: boolean;
  readonly excluded: number;
};
export type Output = { readonly denominator: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residentCount: { type: "integer", minimum: 0 },
    daytimeCount: { type: "integer", minimum: 0 },
    useDaytime: { type: "boolean" },
    excluded: { type: "integer", minimum: 0 },
  },
  required: ["residentCount", "daytimeCount", "useDaytime", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "integer" } },
  required: ["denominator"],
} as const;
/** Calculate service area population base token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { residentCount, daytimeCount, useDaytime, excluded } = request;
  const compute = (): Output => {
    H.integer(residentCount, 0);
    H.integer(daytimeCount, 0);
    H.integer(excluded, 0, useDaytime ? daytimeCount : residentCount);
    return {
      denominator: (useDaytime ? daytimeCount : residentCount) - excluded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    residentCount: 100,
    daytimeCount: 150,
    useDaytime: true,
    excluded: 10,
  },
  output: { denominator: 140 },
} satisfies ToolExample<Input, Output>;
export const serviceAreaPopulationBaseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/service-area-population-base-token",
    title: "Service Area Population Base Token Tool",
    description:
      "Calculate service area population base token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residentCount: { type: "integer", minimum: 0 },
        daytimeCount: { type: "integer", minimum: 0 },
        useDaytime: { type: "boolean" },
        excluded: { type: "integer", minimum: 0 },
      },
      required: ["residentCount", "daytimeCount", "useDaytime", "excluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { denominator: { type: "integer" } },
      required: ["denominator"],
    },
    ports: {
      inputs: [
        {
          id: "residentCount",
          label: "Resident Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "daytimeCount",
          label: "Daytime Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "useDaytime",
          label: "Use Daytime",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = serviceAreaPopulationBaseTokenTool.execute;
export default serviceAreaPopulationBaseTokenTool;
