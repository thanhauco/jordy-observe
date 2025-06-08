from typing import Dict, Any, List
import re

class LLMRouterService:
    """
    Intelligently routes queries to different models based on complexity and requirements.
    Aims to optimize for cost without sacrificing quality on hard tasks.
    """
    
    MODELS = {
        "fast": "gpt-4o-mini",
        "standard": "gpt-4o",
        "powerful": "o1-preview",
        "reasoning": "claude-3-5-sonnet"
    }

    def route_query(self, query: str, context_length: int = 0) -> str:
        """
        Determines the best model for a given query.
        """
        # 1. Check for complex reasoning indicators
        reasoning_keywords = ["analyze", "evaluate", "optimize", "debug", "architect", "complex"]
        needs_reasoning = any(word in query.lower() for word in reasoning_keywords)
        
        # 2. Check for code or technical blocks
        has_code = "```" in query or bool(re.search(r'[;{}[\]]', query))
        
        # 3. Check length
        is_long = len(query.split()) > 300 or context_length > 2000

        # Routing Logic
        if needs_reasoning or (has_code and is_long):
            return self.MODELS["reasoning"]
        
        if (is_long or has_code):
            return self.MODELS["standard"]
            
        # Default to fast/cheap for simple queries
        return self.MODELS["fast"]

    def estimate_cost_saving(self, model_used: str, base_model: str = "gpt-4") -> float:
        """
        Hypothetical cost saving calculation.
        """
        costs = {
            "gpt-4o-mini": 0.15, # per 1M tokens
            "gpt-4o": 5.00,
            "claude-3-5-sonnet": 3.00,
            "gpt-4": 30.00
        }
        return max(0.0, costs.get(base_model, 30.0) - costs.get(model_used, 30.0))
