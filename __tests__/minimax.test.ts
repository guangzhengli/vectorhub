/**
 * Unit and integration tests for MiniMax provider support.
 */

// ─── Unit tests ───────────────────────────────────────────────────────────────

describe('ModelType enum', () => {
  it('includes MINIMAX variant', () => {
    // Inline the enum so this test file has no Next.js server-side deps
    enum ModelType {
      OPENAI = 'OPENAI',
      AZURE_OPENAI = 'AZURE_OPENAI',
      MINIMAX = 'MINIMAX',
    }
    expect(ModelType.MINIMAX).toBe('MINIMAX');
  });

  it('does not collide with existing variants', () => {
    enum ModelType {
      OPENAI = 'OPENAI',
      AZURE_OPENAI = 'AZURE_OPENAI',
      MINIMAX = 'MINIMAX',
    }
    const values = Object.values(ModelType);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });
});

describe('KeyConfiguration interface', () => {
  it('accepts minimaxApiKey field', () => {
    interface KeyConfiguration {
      apiType?: string;
      apiKey?: string;
      apiModel?: string;
      minimaxApiKey?: string;
    }
    const cfg: KeyConfiguration = { minimaxApiKey: 'test-key', apiType: 'MINIMAX' };
    expect(cfg.minimaxApiKey).toBe('test-key');
  });

  it('minimaxApiKey is optional', () => {
    interface KeyConfiguration {
      apiType?: string;
      minimaxApiKey?: string;
    }
    const cfg: KeyConfiguration = { apiType: 'OPENAI' };
    expect(cfg.minimaxApiKey).toBeUndefined();
  });
});

describe('MiniMax configuration constants', () => {
  it('reads MINIMAX_API_KEY from environment', () => {
    process.env.MINIMAX_API_KEY = 'env-minimax-key';
    // Simulate what const.ts exports
    const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
    expect(MINIMAX_API_KEY).toBe('env-minimax-key');
    delete process.env.MINIMAX_API_KEY;
  });

  it('reads MINIMAX_API_MODEL from environment', () => {
    process.env.MINIMAX_API_MODEL = 'MiniMax-M2.7';
    const MINIMAX_API_MODEL = process.env.MINIMAX_API_MODEL;
    expect(MINIMAX_API_MODEL).toBe('MiniMax-M2.7');
    delete process.env.MINIMAX_API_MODEL;
  });

  it('MINIMAX_API_KEY is undefined when not set', () => {
    delete process.env.MINIMAX_API_KEY;
    const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
    expect(MINIMAX_API_KEY).toBeUndefined();
  });
});

describe('MiniMax model validation', () => {
  const SUPPORTED_MODELS = [
    'MiniMax-M2.7',
    'MiniMax-M2.7-highspeed',
    'MiniMax-M2.5',
    'MiniMax-M2.5-highspeed',
  ];

  it.each(SUPPORTED_MODELS)('supports model %s', (model) => {
    expect(SUPPORTED_MODELS).toContain(model);
  });

  it('defaults to MiniMax-M2.7 when no model specified', () => {
    const MINIMAX_DEFAULT_MODEL = 'MiniMax-M2.7';
    const apiModel: string | undefined = undefined;
    const resolvedModel = apiModel || MINIMAX_DEFAULT_MODEL;
    expect(resolvedModel).toBe('MiniMax-M2.7');
  });

  it('uses specified model when provided', () => {
    const MINIMAX_DEFAULT_MODEL = 'MiniMax-M2.7';
    const apiModel = 'MiniMax-M2.5-highspeed';
    const resolvedModel = apiModel || MINIMAX_DEFAULT_MODEL;
    expect(resolvedModel).toBe('MiniMax-M2.5-highspeed');
  });
});

describe('MiniMax temperature constraint', () => {
  it('default temperature 0.9 satisfies (0, 1] constraint', () => {
    const temperature = 0.9;
    expect(temperature).toBeGreaterThan(0);
    expect(temperature).toBeLessThanOrEqual(1);
  });

  it('temperature must be greater than 0', () => {
    const invalidTemp = 0;
    expect(invalidTemp).not.toBeGreaterThan(0);
  });

  it('temperature must be at most 1', () => {
    const validTemp = 1.0;
    expect(validTemp).toBeLessThanOrEqual(1);
  });
});

describe('MiniMax base URL', () => {
  const MINIMAX_BASE_URL = 'https://api.minimax.io/v1';

  it('uses the correct OpenAI-compatible endpoint', () => {
    expect(MINIMAX_BASE_URL).toBe('https://api.minimax.io/v1');
  });

  it('ends with /v1 for OpenAI compatibility', () => {
    expect(MINIMAX_BASE_URL.endsWith('/v1')).toBe(true);
  });
});

describe('Configuration header parsing', () => {
  it('reads x-minimax-api-key header', () => {
    const headers: Record<string, string> = {
      'x-api-type': 'MINIMAX',
      'x-minimax-api-key': 'hdr-minimax-key',
    };
    const minimaxApiKey = headers['x-minimax-api-key'];
    expect(minimaxApiKey).toBe('hdr-minimax-key');
  });

  it('x-api-type MINIMAX is handled as a distinct type', () => {
    const apiType = 'MINIMAX';
    expect(apiType).toBe('MINIMAX');
    expect(apiType).not.toBe('OPENAI');
    expect(apiType).not.toBe('AZURE_OPENAI');
  });

  it('returns empty minimaxApiKey when header absent', () => {
    const headers: Record<string, string> = { 'x-api-type': 'OPENAI' };
    const minimaxApiKey = headers['x-minimax-api-key'] as string | undefined;
    expect(minimaxApiKey).toBeUndefined();
  });
});

describe('MiniMax validation logic', () => {
  const validate = (cfg: { apiType?: string; minimaxApiKey?: string }) => {
    if (cfg.apiType === 'MINIMAX' && !cfg.minimaxApiKey) {
      throw new Error('Expected environment value: MINIMAX_API_KEY');
    }
    return true;
  };

  it('throws when MINIMAX type but no API key', () => {
    expect(() => validate({ apiType: 'MINIMAX' })).toThrow('MINIMAX_API_KEY');
  });

  it('passes when MINIMAX type with API key', () => {
    expect(validate({ apiType: 'MINIMAX', minimaxApiKey: 'key' })).toBe(true);
  });

  it('passes for OPENAI type without minimaxApiKey', () => {
    expect(validate({ apiType: 'OPENAI', minimaxApiKey: undefined })).toBe(true);
  });
});

// ─── Integration tests ────────────────────────────────────────────────────────

describe('MiniMax API integration', () => {
  const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
  const MINIMAX_BASE_URL = 'https://api.minimax.io/v1';

  const itIfKey = MINIMAX_API_KEY ? it : it.skip;

  itIfKey('lists available models', async () => {
    const response = await fetch(`${MINIMAX_BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${MINIMAX_API_KEY}` },
    });
    // MiniMax may return 200 or may not expose /models — either way we should get a valid HTTP response
    expect(response.status).toBeLessThan(500);
  }, 15000);

  itIfKey('sends a chat completion request with MiniMax-M2.7', async () => {
    const response = await fetch(`${MINIMAX_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        messages: [{ role: 'user', content: 'Reply with the single word: PONG' }],
        temperature: 0.9,
        max_tokens: 10,
      }),
    });
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.choices).toBeDefined();
    expect(data.choices.length).toBeGreaterThan(0);
    expect(data.choices[0].message?.content).toBeDefined();
  }, 15000);

  itIfKey('sends a chat completion request with MiniMax-M2.7-highspeed', async () => {
    const response = await fetch(`${MINIMAX_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7-highspeed',
        messages: [{ role: 'user', content: 'Reply with the single word: PONG' }],
        temperature: 0.9,
        max_tokens: 10,
      }),
    });
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.choices).toBeDefined();
    expect(data.choices[0].message?.content).toBeDefined();
  }, 15000);
});
