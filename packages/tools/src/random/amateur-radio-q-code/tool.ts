// Repertoire source: https://www.itu.int/rec/R-REC-M.1172/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAmateurRadioQCodeInput = Readonly<Record<string, never>>;
export type RandomAmateurRadioQCodeOutput = { readonly value: string };

const source = { values: ["QRA", "QRG", "QRH", "QRI", "QRK", "QRL", "QRM", "QRN", "QRO", "QRP", "QRQ", "QRS", "QRT", "QRU", "QRV", "QRX", "QRZ", "QSB", "QSL", "QSO", "QSP", "QSY", "QTH"] } as const;

export const randomAmateurRadioQCodeValueCount = 23;

export const calculateRandomAmateurRadioQCode = (
  random: RandomSource = Math.random,
): RandomAmateurRadioQCodeOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAmateurRadioQCodeExample = { input: {} } satisfies ToolExample<
  RandomAmateurRadioQCodeInput,
  RandomAmateurRadioQCodeOutput
>;

export const randomAmateurRadioQCodeTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAmateurRadioQCode(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one commonly used amateur-radio Q-code identifier from an explicitly enumerated operating repertoire using injected randomness; the result does not infer its statement or question meaning.",
  id: "random/amateur-radio-q-code",
  inputs: [],
  outputs: [
    {
      format: "random/amateur-radio-q-code",
      id: "value",
      kind: "string",
      label: "Random Amateur Radio Q Code",
    },
  ],
  title: "Random Amateur Radio Q Code Generator",
});

export const runRandomAmateurRadioQCode = randomAmateurRadioQCodeTool.execute;
export default randomAmateurRadioQCodeTool;
