import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLabel: string;
  readonly lastLabel: string;
  readonly suppliedSuffix: string;
};
export type Output = {
  readonly firstStep: number;
  readonly lastStep: number;
  readonly signedStepCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLabel: { type: "string", maxLength: 8192 },
    lastLabel: { type: "string", maxLength: 8192 },
    suppliedSuffix: { type: "string", maxLength: 8192 },
  },
  required: ["firstLabel", "lastLabel", "suppliedSuffix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStep: { type: "integer" },
    lastStep: { type: "integer" },
    signedStepCount: { type: "integer" },
  },
  required: ["firstStep", "lastStep", "signedStepCount"],
} as const;
/** Count serial indices in literal caller-specified historical label notation; not a preparation, concentration, dose or efficacy calculation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLabel, lastLabel, suppliedSuffix } = request;
  const compute = (): Output => {
    H.domain(suppliedSuffix.length > 0);
    const read = (s: string) => {
      H.domain(s.endsWith(suppliedSuffix));
      const prefix = s.slice(0, -suppliedSuffix.length);
      H.domain(/^\d+(?![\s\S])/.test(prefix));
      return H.integer(Number(prefix), 0);
    };
    const firstStep = read(firstLabel),
      lastStep = read(lastLabel);
    return { firstStep, lastStep, signedStepCount: lastStep - firstStep };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLabel: "6C", lastLabel: "12C", suppliedSuffix: "C" },
  output: { firstStep: 6, lastStep: 12, signedStepCount: 6 },
} satisfies ToolExample<Input, Output>;
export const dilutionLabelSerialStepCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "homeopathy/dilution-label-serial-step-count",
    title: "Dilution Label Serial Step Count Tool",
    description:
      "Count serial indices in literal caller-specified historical label notation; not a preparation, concentration, dose or efficacy calculation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLabel: { type: "string", maxLength: 8192 },
        lastLabel: { type: "string", maxLength: 8192 },
        suppliedSuffix: { type: "string", maxLength: 8192 },
      },
      required: ["firstLabel", "lastLabel", "suppliedSuffix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStep: { type: "integer" },
        lastStep: { type: "integer" },
        signedStepCount: { type: "integer" },
      },
      required: ["firstStep", "lastStep", "signedStepCount"],
    },
    ports: {
      inputs: [
        {
          id: "firstLabel",
          label: "First Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lastLabel",
          label: "Last Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSuffix",
          label: "Supplied Suffix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "firstStep",
          label: "First Step",
          valueType: { type: "integer" },
        },
        { id: "lastStep", label: "Last Step", valueType: { type: "integer" } },
        {
          id: "signedStepCount",
          label: "Signed Step Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = dilutionLabelSerialStepCountTool.execute;
export default dilutionLabelSerialStepCountTool;
