const mockCreateClient = jest.fn((..._args: unknown[]) => ({ mocked: true }));

jest.mock("@supabase/supabase-js", () => ({
  createClient: (url: string, key: string, options: unknown) =>
    mockCreateClient(url, key, options),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: { mocked: "async-storage" },
}));

jest.mock("react-native-url-polyfill/auto", () => ({}));

const ORIGINAL_ENV = process.env;

describe("lib/supabase", () => {
  beforeEach(() => {
    jest.resetModules();
    mockCreateClient.mockClear();
    process.env = {
      ...ORIGINAL_ENV,
      EXPO_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      EXPO_PUBLIC_SUPABASE_ANON_KEY: "anon-key-123",
    };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("creates the client with the URL and anon key from env vars", () => {
    require("../supabase");

    expect(mockCreateClient).toHaveBeenCalledTimes(1);
    expect(mockCreateClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "anon-key-123",
      expect.objectContaining({
        auth: expect.objectContaining({
          storage: { mocked: "async-storage" },
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        }),
      })
    );
  });

  it("throws a clear error when env vars are missing", () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = "";

    expect(() => require("../supabase")).toThrow(/EXPO_PUBLIC_SUPABASE_URL/);
  });
});
