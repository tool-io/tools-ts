import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstInformant: string;
  readonly secondInformant: string;
  readonly firstMode: string;
  readonly secondMode: string;
};
export type Output = {
  readonly sameInformant: boolean;
  readonly sameMode: boolean;
  readonly directlyMatched: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstInformant: { type: "string", maxLength: 8192 },
    secondInformant: { type: "string", maxLength: 8192 },
    firstMode: { type: "string", maxLength: 8192 },
    secondMode: { type: "string", maxLength: 8192 },
  },
  required: ["firstInformant", "secondInformant", "firstMode", "secondMode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameInformant: { type: "boolean" },
    sameMode: { type: "boolean" },
    directlyMatched: { type: "boolean" },
  },
  required: ["sameInformant", "sameMode", "directlyMatched"],
} as const;
/** Compare supplied informant and collection-mode metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstInformant, secondInformant, firstMode, secondMode } = request;
  const compute = (): Output => {
    return {
      sameInformant: firstInformant === secondInformant,
      sameMode: firstMode === secondMode,
      directlyMatched:
        firstInformant === secondInformant && firstMode === secondMode,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstInformant: "self",
    secondInformant: "self",
    firstMode: "online",
    secondMode: "phone",
  },
  output: { sameInformant: true, sameMode: false, directlyMatched: false },
} satisfies ToolExample<Input, Output>;
export const osteopathyStudyInformantModePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/osteopathy-study-informant-mode-pair",
    title: "Osteopathy Study Informant Mode Pair Tool",
    description: "Compare supplied informant and collection-mode metadata.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstInformant: { type: "string", maxLength: 8192 },
        secondInformant: { type: "string", maxLength: 8192 },
        firstMode: { type: "string", maxLength: 8192 },
        secondMode: { type: "string", maxLength: 8192 },
      },
      required: [
        "firstInformant",
        "secondInformant",
        "firstMode",
        "secondMode",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameInformant: { type: "boolean" },
        sameMode: { type: "boolean" },
        directlyMatched: { type: "boolean" },
      },
      required: ["sameInformant", "sameMode", "directlyMatched"],
    },
    ports: {
      inputs: [
        {
          id: "firstInformant",
          label: "First Informant",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondInformant",
          label: "Second Informant",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstMode",
          label: "First Mode",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondMode",
          label: "Second Mode",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sameInformant",
          label: "Same Informant",
          valueType: { type: "boolean" },
        },
        { id: "sameMode", label: "Same Mode", valueType: { type: "boolean" } },
        {
          id: "directlyMatched",
          label: "Directly Matched",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = osteopathyStudyInformantModePairTool.execute;
export default osteopathyStudyInformantModePairTool;
