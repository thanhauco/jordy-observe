from typing import List, Dict, Any, Optional
import jinja2

class PromptTemplateService:
    """
    Advanced prompt templating using Jinja2.
    Supports variable validation and safe rendering.
    """
    
    def __init__(self):
        self.env = jinja2.Environment(undefined=jinja2.StrictUndefined)

    def render(self, template_str: str, variables: Dict[str, Any]) -> str:
        """
        Render a prompt with provided variables.
        Throws error if variables are missing.
        """
        try:
            template = self.env.from_string(template_str)
            return template.render(**variables)
        except jinja2.exceptions.UndefinedError as e:
            raise ValueError(f"Missing template variable: {e.message}")
        except Exception as e:
            raise ValueError(f"Prompt rendering failed: {str(e)}")

    def extract_variables(self, template_str: str) -> List[str]:
        """
        Extract all variable names from a Jinja2 template string.
        """
        from jinja2 import meta
        parsed_content = self.env.parse(template_str)
        return list(meta.find_undeclared_variables(parsed_content))
