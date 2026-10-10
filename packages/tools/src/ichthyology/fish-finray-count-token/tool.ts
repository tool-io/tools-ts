import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly finWording: string;
  readonly observedRayCount: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    finWording: { type: "string", maxLength: 8192, minLength: 1 },
    observedRayCount: { type: "integer", minimum: 0 },
  },
  required: ["specimenId", "finWording", "observedRayCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record an explicit observed fin-ray count and fin wording without checking taxonomic meristics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, finWording, observedRayCount } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0 && finWording.length > 0, "specimenId");
    (H.domain(
      Number.isSafeInteger(observedRayCount) &&
        observedRayCount >= 0 &&
        observedRayCount <= Number.MAX_SAFE_INTEGER,
      "observedRayCount",
    ),
      observedRayCount);
    return {
      label: specimenId + "; " + finWording + " rays=" + observedRayCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "F17", finWording: "dorsal", observedRayCount: 12 },
  output: { label: "F17; dorsal rays=12" },
} satisfies ToolExample<Input, Output>;
export const fishFinrayCountTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["ichthyology", "biology"],
      keywords: ["ichthyology", "biology"],
    },
    id: "ichthyology/fish-finray-count-token",
    title: "Fish Finray Count Token",
    description:
      "Record an explicit observed fin-ray count and fin wording without checking taxonomic meristics.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        finWording: { type: "string", maxLength: 8192, minLength: 1 },
        observedRayCount: { type: "integer", minimum: 0 },
      },
      required: ["specimenId", "finWording", "observedRayCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "finWording",
          label: "Fin Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "observedRayCount",
          label: "Observed Ray Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fishFinrayCountTokenTool.execute;
export default fishFinrayCountTokenTool;
