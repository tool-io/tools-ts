import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NineFinalTokenResolverInput = {
  readonly stemLetters: string;
  readonly finalSense?: "us" | "is";
};

export type NineFinalTokenResolverOutput = {
  readonly resolvedToken: string;
  readonly appliedFinal: "us" | "is";
};

const LETTERS_ONLY = /^[A-Za-z]+$/;

export const calculateNineFinalTokenResolver = (
  input: NineFinalTokenResolverInput,
): NineFinalTokenResolverOutput => {
  if (!LETTERS_ONLY.test(input.stemLetters))
    return simpleError(
      "stemLetters",
      "Provide a non-empty alphabetic stem preceding the 9-shaped mark.",
      "invalid_stem",
    );
  const finalSense = input.finalSense ?? "us";
  if (finalSense !== "us" && finalSense !== "is")
    return simpleError(
      "finalSense",
      "Final sense must be either 'us' or 'is'.",
      "invalid_sense",
    );
  return {
    resolvedToken: input.stemLetters + finalSense,
    appliedFinal: finalSense,
  };
};

export const nineFinalTokenResolverExample = {
  input: { stemLetters: "seru", finalSense: "us" },
  output: { resolvedToken: "seruus", appliedFinal: "us" },
} satisfies ToolExample<
  NineFinalTokenResolverInput,
  NineFinalTokenResolverOutput
>;

export const nineFinalTokenResolverTool = createSimpleTool({
  id: "paleography/nine-final-token-resolver",
  title: "Nine-Final Token Resolver",
  description:
    "Resolve the 9-shaped word-final brevigraph by appending your chosen attested reading of the mark, '-us' (broad) or '-is', to the letters of the stem.",
  inputs: [
    {
      description: "Alphabetic stem written before the 9-shaped mark.",
      id: "stemLetters",
      kind: "string",
      label: "Stem",
    },
    {
      default: "us",
      description: "Your chosen attested reading of the final mark.",
      enum: ["us", "is"],
      id: "finalSense",
      kind: "string",
      label: "Final sense",
    },
  ],
  outputs: [
    {
      description: "Resolved full token.",
      id: "resolvedToken",
      kind: "string",
      label: "Resolved token",
    },
    {
      description: "Final reading actually applied.",
      id: "appliedFinal",
      enum: ["us", "is"],
      kind: "string",
      label: "Applied final",
    },
  ],
  calculate: (input) =>
    calculateNineFinalTokenResolver({
      stemLetters: input.stemLetters as string,
      finalSense: input.finalSense as NineFinalTokenResolverInput["finalSense"],
    }),
});

export const runNineFinalTokenResolver = nineFinalTokenResolverTool.execute;
export default nineFinalTokenResolverTool;
