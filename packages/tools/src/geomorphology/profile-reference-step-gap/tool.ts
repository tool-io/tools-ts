import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly profileHeights: readonly number[];
  readonly referenceHeights: readonly number[];
  readonly selectedStep: number;
};
export type Output = {
  readonly measuredStep: number;
  readonly referenceStep: number;
  readonly stepGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    profileHeights: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceHeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    selectedStep: { type: "integer", minimum: 0 },
  },
  required: ["profileHeights", "referenceHeights", "selectedStep"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredStep: { type: "number" },
    referenceStep: { type: "number" },
    stepGap: { type: "number" },
  },
  required: ["measuredStep", "referenceStep", "stepGap"],
} as const;
/** Calculate profile reference step gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { profileHeights, referenceHeights, selectedStep } = request;
  const compute = (): Output => {
    H.sameLength(profileHeights, referenceHeights);
    H.integer(selectedStep, 0, profileHeights.length - 2);
    return (() => {
      const measuredStep =
          profileHeights[selectedStep + 1] - profileHeights[selectedStep],
        referenceStep =
          referenceHeights[selectedStep + 1] - referenceHeights[selectedStep];
      return {
        measuredStep,
        referenceStep,
        stepGap: measuredStep - referenceStep,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    profileHeights: [1, 4, 5],
    referenceHeights: [1, 3, 5],
    selectedStep: 0,
  },
  output: { measuredStep: 3, referenceStep: 2, stepGap: 1 },
} satisfies ToolExample<Input, Output>;
export const profileReferenceStepGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/profile-reference-step-gap",
    title: "Profile Reference Step Gap Tool",
    description:
      "Calculate profile reference step gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        profileHeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        referenceHeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        selectedStep: { type: "integer", minimum: 0 },
      },
      required: ["profileHeights", "referenceHeights", "selectedStep"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredStep: { type: "number" },
        referenceStep: { type: "number" },
        stepGap: { type: "number" },
      },
      required: ["measuredStep", "referenceStep", "stepGap"],
    },
    ports: {
      inputs: [
        {
          id: "profileHeights",
          label: "Profile Heights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceHeights",
          label: "Reference Heights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "selectedStep",
          label: "Selected Step",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "measuredStep",
          label: "Measured Step",
          valueType: { type: "number" },
        },
        {
          id: "referenceStep",
          label: "Reference Step",
          valueType: { type: "number" },
        },
        { id: "stepGap", label: "Step Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = profileReferenceStepGapTool.execute;
export default profileReferenceStepGapTool;
