import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceTurnEndSeconds: number;
  readonly interpretationStartSeconds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTurnEndSeconds: { type: "number" },
    interpretationStartSeconds: { type: "number" },
  },
  required: ["sourceTurnEndSeconds", "interpretationStartSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit public-dialogue turn and interpretation markers without inferring language ability or mediation effectiveness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceTurnEndSeconds, interpretationStartSeconds } = request;
  const compute = (): Output => {
    return { signedGap: interpretationStartSeconds - sourceTurnEndSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceTurnEndSeconds: 12, interpretationStartSeconds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const dialogueTurnLanguageInterpretationGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["peace-studies", "peace studies", "social sciences"],
        keywords: ["peace studies", "social sciences"],
      },
      id: "peace-studies/dialogue-turn-language-interpretation-gap",
      title: "Dialogue Turn Language Interpretation Gap",
      description:
        "Subtract explicit public-dialogue turn and interpretation markers without inferring language ability or mediation effectiveness.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceTurnEndSeconds: { type: "number" },
          interpretationStartSeconds: { type: "number" },
        },
        required: ["sourceTurnEndSeconds", "interpretationStartSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "sourceTurnEndSeconds",
            label: "Source Turn End Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interpretationStartSeconds",
            label: "Interpretation Start Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dialogueTurnLanguageInterpretationGapTool.execute;
export default dialogueTurnLanguageInterpretationGapTool;
