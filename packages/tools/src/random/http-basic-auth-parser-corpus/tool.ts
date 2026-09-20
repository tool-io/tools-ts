import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { budget as fixtureBudget } from "../m500b-web-json-json.js";
import {
  object,
  array,
  text,
  bounded,
  choice,
  boolean,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import {
  calculateBasicAuthParser,
  encodeBase64Bytes,
} from "../../http/basic-auth-parser/tool.js";
export type HttpBasicAuthParserCorpusInput = {
  readonly usernames: readonly string[];
  readonly passwords: readonly string[];
  readonly modes: readonly ("valid" | "missing-colon" | "bad-base64")[];
  readonly count: number;
  readonly seed?: number;
};
export type HttpBasicAuthParserCorpusOutput = {
  readonly cases: readonly {
    readonly header: string;
    readonly mode: string;
    readonly accepted: boolean;
    readonly usernameBytes: readonly number[];
    readonly passwordBytes: readonly number[];
    readonly errorCode: string;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    usernames: array(text, 16, 1),
    passwords: array(text, 16, 1),
    modes: array(choice(["valid", "missing-colon", "bad-base64"]), 3, 1),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["usernames", "passwords", "modes", "count"],
);
export const outputSchema = object({
  cases: array(
    object({
      header: text,
      mode: text,
      accepted: boolean,
      usernameBytes: array(bounded(0, 255), 2048),
      passwordBytes: array(bounded(0, 255), 2048),
      errorCode: text,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is HttpBasicAuthParserCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateHttpBasicAuthParserCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HttpBasicAuthParserCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    if (
      input.usernames.some((s) => /[^\x20-\x7e]|:/u.test(s)) ||
      input.passwords.some((s) => /[^\x20-\x7e]/u.test(s))
    )
      simpleError(
        "usernames",
        "Use printable synthetic ASCII, without username colons.",
        "invalid_credentials",
      );
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const username = pick(input.usernames, random),
          password = pick(input.passwords, random),
          mode = pick(input.modes, random);
        const credentials =
            mode === "missing-colon"
              ? (username + password).replace(/:/g, "")
              : username + ":" + password,
          header =
            "Basic " +
            (mode === "bad-base64"
              ? "A"
              : encodeBase64Bytes(
                  [...credentials].map((c) => c.charCodeAt(0)),
                ));
        const r = calculateBasicAuthParser({ header });
        return r.ok
          ? { header, mode, accepted: true, ...r.output, errorCode: "" }
          : {
              header,
              mode,
              accepted: false,
              usernameBytes: [],
              passwordBytes: [],
              errorCode: r.error.issues[0]?.code ?? "invalid_input",
            };
      });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const httpBasicAuthParserCorpusExample = {
  input: {
    usernames: ["a"],
    passwords: ["b:c"],
    modes: ["valid"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        header: "Basic YTpiOmM=",
        mode: "valid",
        accepted: true,
        usernameBytes: [97],
        passwordBytes: [98, 58, 99],
        errorCode: "",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  HttpBasicAuthParserCorpusInput,
  HttpBasicAuthParserCorpusOutput
>;
export const httpBasicAuthParserCorpusTool = createModelDefinition<
  HttpBasicAuthParserCorpusInput,
  HttpBasicAuthParserCorpusOutput
>({
  id: "random/http-basic-auth-parser-corpus",
  title: "Random HTTP Basic Auth Parser Corpus Generator",
  description:
    "Construct synthetic ASCII Basic credential bytes and malformed controls, preserving delegated split and error outcomes without real credentials.",
  inputSchema,
  outputSchema,
  execute: calculateHttpBasicAuthParserCorpus,
});
export const runHttpBasicAuthParserCorpus =
  httpBasicAuthParserCorpusTool.execute;
export default httpBasicAuthParserCorpusTool;
