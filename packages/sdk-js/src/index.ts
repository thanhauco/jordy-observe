import axios from 'axios';

interface SpanData {
    id: string;
    name: string;
    spanType: string;
    parentSpanId?: string;
    input?: Record<string, any>;
    output?: Record<string, any>;
}

export class Span {
    id: string;
    name: string;
    spanType: string;
    parentSpanId?: string;
    input?: Record<string, any>;
    output?: Record<string, any>;
    
    constructor(name: string, spanType: string = 'generic', parentSpanId?: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.spanType = spanType;
        this.parentSpanId = parentSpanId;
    }
    
    logInput(data: Record<string, any>) {
        this.input = data;
    }
    
    logOutput(data: Record<string, any>) {
        this.output = data;
    }
    
    end(data?: { output?: Record<string, any> }) {
        if (data?.output) this.output = data.output;
    }
    
    toJSON(): SpanData {
        return {
            id: this.id,
            name: this.name,
            spanType: this.spanType,
            parentSpanId: this.parentSpanId,
            input: this.input,
            output: this.output,
        };
    }
}

export class JordyClient {
    private apiKey: string;
    private baseUrl: string;
    
    constructor(config: { apiKey: string; baseUrl?: string }) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || 'http://localhost:8000';
    }
    
    startTrace(name: string): Trace {
        return new Trace(this, name);
    }
    
    async sendTrace(traceData: any) {
        const response = await axios.post(
            `${this.baseUrl}/api/v1/traces/`,
            traceData,
            { headers: { 'X-API-KEY': this.apiKey } }
        );
        return response.data;
    }
}

export class Trace {
    private client: JordyClient;
    private name: string;
    private spans: Span[] = [];
    
    constructor(client: JordyClient, name: string) {
        this.client = client;
        this.name = name;
    }
    
    startSpan(name: string, options?: { type?: string; parentId?: string }): Span {
        const span = new Span(name, options?.type, options?.parentId);
        this.spans.push(span);
        return span;
    }
    
    async end() {
        await this.client.sendTrace({
            input: { trace_name: this.name },
            output: {},
            spans: this.spans.map(s => s.toJSON()),
        });
    }
}
