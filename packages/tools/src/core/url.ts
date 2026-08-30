export type PortableUrlSearchParams = {
  readonly size: number;
  set(name: string, value: string): void;
};

export type PortableUrl = {
  readonly hash: string;
  readonly host: string;
  readonly hostname: string;
  readonly href: string;
  readonly origin: string;
  readonly password: string;
  readonly pathname: string;
  readonly port: string;
  readonly protocol: string;
  readonly search: string;
  readonly searchParams: PortableUrlSearchParams;
  readonly username: string;
};

type PortableUrlConstructor = new (
  input: string,
  base?: string,
) => PortableUrl;

const urlConstructor = (): PortableUrlConstructor => {
  const constructor = (
    globalThis as unknown as { readonly URL?: PortableUrlConstructor }
  ).URL;
  if (constructor === undefined)
    throw new TypeError("This runtime does not provide the WHATWG URL API.");
  return constructor;
};

/** Parse a URL through the WHATWG URL API shared by supported browsers and Node. */
export const parseUrl = (input: string, base?: string): PortableUrl =>
  new (urlConstructor())(input, base);
