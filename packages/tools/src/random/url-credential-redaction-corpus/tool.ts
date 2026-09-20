import { budget as fixtureBudget } from "../m500b-web-json-json.js";
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
import { object, array, text, bounded } from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { httpUrl, coreOutput, encode } from "../m500b-web-json-protocol.js";
import { calculateUrlUsername } from "../../web/url-username/tool.js";
import { calculateUrlPassword } from "../../web/url-password/tool.js";
export type UrlCredentialRedactionCorpusInput = {
  readonly baseUrl: string;
  readonly usernames: readonly string[];
  readonly passwords: readonly string[];
  readonly count: number;
  readonly seed?: number;
};
export type UrlCredentialRedactionCorpusOutput = {
  readonly cases: readonly {
    readonly url: string;
    readonly username: string;
    readonly password: string;
    readonly redacted: string;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    baseUrl: text,
    usernames: array(text, 16, 1),
    passwords: array(text, 16, 1),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["baseUrl", "usernames", "passwords", "count"],
);
export const outputSchema = object({
  cases: array(
    object({ url: text, username: text, password: text, redacted: text }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is UrlCredentialRedactionCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateUrlCredentialRedactionCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<UrlCredentialRedactionCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    const base = httpUrl(input.baseUrl, "baseUrl"),
      random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.count }, () => {
      const user = encode(pick(input.usernames, random), "usernames"),
        pass = encode(pick(input.passwords, random), "passwords");
      const url =
        base.protocol +
        "//" +
        user +
        ":" +
        pass +
        "@" +
        base.host +
        base.pathname +
        base.search +
        base.hash;
      return {
        url,
        username: coreOutput(calculateUrlUsername({ url })).username,
        password: coreOutput(calculateUrlPassword({ url })).password,
        redacted: base.href,
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
export const urlCredentialRedactionCorpusExample = {
  input: {
    baseUrl: "https://example.com/account",
    usernames: ["reader", "guest"],
    passwords: ["p:a"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        url: "https://guest:p%3Aa@example.com/account",
        username: "guest",
        password: "p%3Aa",
        redacted: "https://example.com/account",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  UrlCredentialRedactionCorpusInput,
  UrlCredentialRedactionCorpusOutput
>;
export const urlCredentialRedactionCorpusTool = createModelDefinition<
  UrlCredentialRedactionCorpusInput,
  UrlCredentialRedactionCorpusOutput
>({
  id: "random/url-credential-redaction-corpus",
  title: "Random URL Credential Redaction Corpus Generator",
  description:
    "Construct synthetic credential URLs, extract encoded members and strip complete userinfo from normalized HTTP(S) URLs.",
  inputSchema,
  outputSchema,
  execute: calculateUrlCredentialRedactionCorpus,
});
export const runUrlCredentialRedactionCorpus =
  urlCredentialRedactionCorpusTool.execute;
export default urlCredentialRedactionCorpusTool;
