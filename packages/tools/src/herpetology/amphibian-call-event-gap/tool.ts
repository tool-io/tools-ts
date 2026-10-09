import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCallEnd: number;
  readonly nextCallStart: number;
};
export type Output = {
  readonly signedGap: number;
  readonly overlapping: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCallEnd: { type: "number" },
    nextCallStart: { type: "number" },
  },
  required: ["firstCallEnd", "nextCallStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGap: { type: "number" },
    overlapping: { type: "boolean" },
  },
  required: ["signedGap", "overlapping"],
} as const;
/** Measure the signed gap between explicitly marked amphibian call events on one time axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCallEnd, nextCallStart } = request;
  const compute = (): Output => {
    return {
      signedGap: nextCallStart - firstCallEnd,
      overlapping: nextCallStart < firstCallEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCallEnd: 5, nextCallStart: 7.5 },
  output: { signedGap: 2.5, overlapping: false },
} satisfies ToolExample<Input, Output>;
export const amphibianCallEventGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["herpetology", "biology"],
      keywords: ["herpetology", "biology"],
    },
    id: "herpetology/amphibian-call-event-gap",
    title: "Amphibian Call Event Gap",
    description:
      "Measure the signed gap between explicitly marked amphibian call events on one time axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCallEnd: { type: "number" },
        nextCallStart: { type: "number" },
      },
      required: ["firstCallEnd", "nextCallStart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGap: { type: "number" },
        overlapping: { type: "boolean" },
      },
      required: ["signedGap", "overlapping"],
    },
    ports: {
      inputs: [
        {
          id: "firstCallEnd",
          label: "First Call End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextCallStart",
          label: "Next Call Start",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
        {
          id: "overlapping",
          label: "Overlapping",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = amphibianCallEventGapTool.execute;
export default amphibianCallEventGapTool;
