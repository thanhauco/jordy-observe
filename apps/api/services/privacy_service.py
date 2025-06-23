import re
from typing import Any, Dict, List, Union

class PrivacyService:
    """
    Automatically detects and masks PII (Personally Identifiable Information) in trace payloads.
    Protects privacy while maintaining observability.
    """
    
    PII_PATTERNS = {
        "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        "phone": r'\b(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b',
        "credit_card": r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b',
        "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
        "api_key": r'(?i)(api[_-]?key|secret|password|token)["\s:]+([A-Za-z0-9_\-]{16,})'
    }

    def redact(self, data: Union[Dict[str, Any], List[Any], str]) -> Any:
        """
        Recursively redact sensitive information from data.
        """
        if isinstance(data, str):
            return self._redact_string(data)
        elif isinstance(data, dict):
            return {k: self.redact(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [self.redact(item) for item in data]
        return data

    def _redact_string(self, text: str) -> str:
        redacted_text = text
        for label, pattern in self.PII_PATTERNS.items():
            if label == "api_key":
                # Special handling to keep the key name but mask the value
                redacted_text = re.sub(pattern, r'\1: [REDACTED]', redacted_text)
            else:
                redacted_text = re.sub(pattern, f"[{label.upper()}_REDACTED]", redacted_text)
        return redacted_text
