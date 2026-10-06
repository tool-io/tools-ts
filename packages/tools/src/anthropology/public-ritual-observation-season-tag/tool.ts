import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly suppliedSeasonLabel: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSeasonLabel: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "suppliedSeasonLabel", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit public-observation season label by source without inferring calendars or cultural meaning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, suppliedSeasonLabel, source } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(suppliedSeasonLabel.length > 0, "suppliedSeasonLabel");
    H.domain(source.length > 0, "source");
    return {
      token: JSON.stringify([observationId, suppliedSeasonLabel, source]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationId: "O17",
    suppliedSeasonLabel: "Season A",
    source: "Community record",
  },
  output: { token: '["O17","Season A","Community record"]' },
} satisfies ToolExample<Input, Output>;
export const publicRitualObservationSeasonTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["anthropology", "social sciences"],
      keywords: ["anthropology", "social sciences"],
    },
    id: "anthropology/public-ritual-observation-season-tag",
    title: "Public Ritual Observation Season Tag",
    description:
      "Qualify an explicit public-observation season label by source without inferring calendars or cultural meaning.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSeasonLabel: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observationId", "suppliedSeasonLabel", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "observationId",
          label: "Observation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSeasonLabel",
          label: "Supplied Season Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicRitualObservationSeasonTagTool.execute;
export default publicRitualObservationSeasonTagTool;
