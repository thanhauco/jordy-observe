import time
from jordy_observe import JordyClient

# Initialize the client with your API key
# The client automatically handles timing and ingestion via context managers
client = JordyClient(api_key="demo_key_123", base_url="http://localhost:8000")

def run_agent_workflow(user_query: str):
    print(f"Starting workflow for: {user_query}")
    
    # Start a top-level trace
    with client.span("Financial Research Agent") as trace:
        trace.log_input({"query": user_query})
        
        # Step 1: Retrieval
        with trace.span("knowledge_retrieval", span_type="retrieval") as span:
            span.log_input({"search_term": "AAPL stock price history"})
            time.sleep(0.5) # Simulate network latency
            docs = [
                {"content": "Apple stock was at $180 last year.", "source": "finance_db"},
                {"content": "Current AAPL price is $215.", "score": 0.98}
            ]
            span.log_output({"retrieved_docs": docs})
            span.set_attribute("doc_count", len(docs))
            
        # Step 2: Reasoning & Chain of Thought
        with trace.span("reasoning", span_type="chain") as span:
            span.log_input({"task": "Analyze retrieved data"})
            time.sleep(0.3)
            reasoning = "The stock has grown significantly from $180 to $215."
            span.log_output({"thought": reasoning})

        # Step 3: Final LLM Generation
        with trace.span("llm_response", span_type="llm") as span:
            prompt = f"Based on {reasoning}, answer: {user_query}"
            span.log_input({"prompt": prompt})
            
            # Simulate LLM call
            time.sleep(1.2)
            answer = "Apple stock has increased by approximately 19% recently."
            
            # Setting LLM metadata for token and cost tracking
            span.set_llm_metadata(
                model="gpt-4-turbo",
                prompt_tokens=150,
                completion_tokens=45
            )
            span.log_output({"answer": answer})
        
        trace.log_output({"final_response": answer})
        print("Workflow finished. Trace sent.")

if __name__ == "__main__":
    run_agent_workflow("How is Apple stock performing?")
