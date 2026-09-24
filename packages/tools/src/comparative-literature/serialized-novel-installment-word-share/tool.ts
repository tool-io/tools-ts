import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly installmentWords: number;
  readonly previousWords: number;
  readonly totalWords: number;
};
export type Output = {
  readonly share: number;
  readonly cumulativeShare: number;
  readonly remainingWords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    installmentWords: { type: "integer", minimum: 0 },
    previousWords: { type: "integer", minimum: 0 },
    totalWords: { type: "integer", minimum: 1 },
  },
  required: ["installmentWords", "previousWords", "totalWords"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    share: { type: "number" },
    cumulativeShare: { type: "number" },
    remainingWords: { type: "integer" },
  },
  required: ["share", "cumulativeShare", "remainingWords"],
} as const;
/** Calculate serialized novel installment word share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { installmentWords, previousWords, totalWords } = request;
  const compute = (): Output => {
    H.integer(totalWords, 1);
    H.integer(previousWords, 0, totalWords);
    H.integer(installmentWords, 0, totalWords - previousWords);
    return {
      share: installmentWords / totalWords,
      cumulativeShare: (previousWords + installmentWords) / totalWords,
      remainingWords: totalWords - previousWords - installmentWords,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { installmentWords: 10000, previousWords: 20000, totalWords: 100000 },
  output: { share: 0.1, cumulativeShare: 0.3, remainingWords: 70000 },
} satisfies ToolExample<Input, Output>;
export const serializedNovelInstallmentWordShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "comparative-literature/serialized-novel-installment-word-share",
      title: "Serialized Novel Installment Word Share Tool",
      description:
        "Calculate serialized novel installment word share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          installmentWords: { type: "integer", minimum: 0 },
          previousWords: { type: "integer", minimum: 0 },
          totalWords: { type: "integer", minimum: 1 },
        },
        required: ["installmentWords", "previousWords", "totalWords"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          share: { type: "number" },
          cumulativeShare: { type: "number" },
          remainingWords: { type: "integer" },
        },
        required: ["share", "cumulativeShare", "remainingWords"],
      },
      ports: {
        inputs: [
          {
            id: "installmentWords",
            label: "Installment Words",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "previousWords",
            label: "Previous Words",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "totalWords",
            label: "Total Words",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "share", label: "Share", valueType: { type: "number" } },
          {
            id: "cumulativeShare",
            label: "Cumulative Share",
            valueType: { type: "number" },
          },
          {
            id: "remainingWords",
            label: "Remaining Words",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = serializedNovelInstallmentWordShareTool.execute;
export default serializedNovelInstallmentWordShareTool;
