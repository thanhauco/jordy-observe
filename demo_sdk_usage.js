const { JordyClient } = require('./packages/sdk-js'); // Assuming JS SDK is also set up

/**
 * Example usage of the Jordy Observe JavaScript SDK.
 * Demonstrates how to instrument a typical Node.js AI application.
 */

const client = new JordyClient({
    apiKey: 'demo_key_456',
    baseUrl: 'http://localhost:8000'
});

async function main() {
    console.log('Starting JS Tracing Demo...');

    const trace = client.startTrace('Customer Support Bot');
    trace.setMetadata({ customerId: 'cust_99' });

    try {
        // Hierarchical span for span aggregation
        const span = trace.startSpan('intent_classification', { type: 'llm' });
        span.logInput({ text: 'I need to reset my password' });

        // Simulate async operation
        await new Promise(r => setTimeout(r, 400));

        span.logOutput({ intent: 'auth_reset' });
        span.end();

        const responseSpan = trace.startSpan('generate_response', { type: 'llm' });
        responseSpan.logInput({ template: 'reset_flow', data: { user: 'John' } });

        await new Promise(r => setTimeout(r, 800));

        responseSpan.logOutput({
            text: 'I can help you with that reset, John.'
        });
        responseSpan.end();

    } catch (err) {
        console.error('Trace error:', err);
    } finally {
        // Completes the trace and sends data to the API
        await trace.end();
        console.log('Trace uploaded to Jordy Observe dashboard.');
    }
}

main();
